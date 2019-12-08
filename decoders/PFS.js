const fs = require('fs-extra');
const SmartBuffer = require('smart-buffer').SmartBuffer;
const zlib = require('zlib');
const _ = require('lodash');
const CONSTANTS = require('../constants/constants.js');

class PFSHeader {
    constructor(data) {
        this.directoryOffset = data.directoryOffset;
        this.signature = data.signature;
        this.unknown = data.unknown;
    }
}

class PFSFooter {
    constructor(data) {
        this.Steve = data.Steve;
        this.date = data.date;
    }
}

class PFSDirEntry {
    constructor(data) {
        this.crc = data.crc,
        this.offset = data.offset;
        this.inflatedSize = data.inflatedSize;
    }
}

class PFSFileData {
    constructor() {
        this.filename = undefined;
        this.crc = undefined;
        this.offset = undefined;
        this.inflatedSize = undefined;
        this.deflatedSize = undefined;
        this.data = undefined;
    }
}

class PFS {
    constructor(path, filename) {
        this.path = path;
        this.filename = filename;
        this.size = undefined;
        this.header = undefined;
        this.numEntries = undefined;
        this.directory = [];
        this.filenames = [];
        this.files = [];
        this.footer = undefined;
    }

    async load() {
        const buffer = await fs.readFile(`${this.path}/${this.filename}`);
        const pfs = SmartBuffer.fromBuffer(buffer);

        this.size = await pfs.length;

        // Load Header
        this.header = new PFSHeader({
            directoryOffset: pfs.readInt32LE(),
            signature: pfs.readInt32LE(),
            unknown: pfs.readInt32LE()
        });

        if (this.header.signature !== CONSTANTS.PFS_SIGNATURE) {
            throw new Error(`${this.filename} is not a valid PFS file: Invalid filetype`);
        }

        // Load Directory
        pfs.readOffset = this.header.directoryOffset;

        this.numEntries = pfs.readInt32LE();

        for (let i = 0; i < this.numEntries; i++) {
            this.directory.push(new PFSDirEntry({
                crc: pfs.readInt32LE(),
                offset: pfs.readInt32LE(),
                inflatedSize: pfs.readInt32LE()
            }));
        }

        // Sort directory by ascending offset
        this.directory.sort((a, b) => { return a.offset - b.offset });

        // Read footer if it exists
        if (this.size - pfs.readOffset >= 9) {
            this.footer = new PFSFooter({
                Steve: pfs.readString(5),
                date: pfs.readInt32LE()
            });
        }

        // Load filenames from last dir entry
        const fileNameData = this.loadFileData(pfs, this.directory.length - 1, this.directory[this.directory.length - 1]);
        this.decodeFileNames(fileNameData);

        // Load Files
        for (let i = 0; i < this.directory.length - 1; i++) {
            const dirEntry = this.directory[i];
            const fileData = this.loadFileData(pfs, i, dirEntry);
            this.files.push(fileData);
        }

        pfs.destroy();
        return this;
    }

    loadFileData(pfs, index, dirEntry) {
        const fileData = new PFSFileData();

        if (!this.filenames) {
            fileData.filename = null;
        } else {
            fileData.filename = this.filenames[index];
        }

        fileData.crc = dirEntry.crc;
        fileData.offset = dirEntry.offset;
        fileData.inflatedSize = dirEntry.inflatedSize;

        const decompressedBlocks = [];

        // Read blocks
        pfs.readOffset = fileData.offset;
        let ilen = 0;
        while (ilen < fileData.inflatedSize) {

            const block = {
                deflatedSize: pfs.readInt32LE(),
                inflatedSize: pfs.readInt32LE()
            }

            // Get block compressed data
            const compressedBlockData = pfs.readBuffer(block.deflatedSize);

            // Decompress block data and add to array
            const decompressedBlockData = zlib.inflateSync(compressedBlockData);

            // if (index === 0 && ilen === 0)
            // {
            //     console.log(decompressedBlockData.slice(decompressedBlockData.length-20));
            // }

            decompressedBlocks.push(decompressedBlockData);

            ilen = ilen + block.inflatedSize;
        }

        fileData.deflatedSize = pfs.readOffset - fileData.offset - 8;
        fileData.data = Buffer.concat(decompressedBlocks);

        return fileData;
    }

    decodeFileNames(fileNameData) {
        const data = fileNameData.data;
        const numNames = data.readUInt32LE();

        let pos = 4;
        for (let i = 0; i < numNames; i++) {
            const nameLength = data.readInt32LE(pos);
            pos += 4;
            const name = data.toString('utf8', pos, pos + nameLength - 1);
            pos += nameLength;

            this.filenames.push(name);
            console.log(name);
        }
    }

    getEntryByName(name) {
        const entry = _.find(this.files, file => {
            return file.filename === name;
        })

        return entry;
    }

    getWLDs() {
        const wlds = this.files.filter(file => {
            const filename = file.filename.toLowerCase();
            return filename.endsWith('.wld');
        });

        return wlds;
    }

    getTextures() {
        const textures = this.files.filter(file => {
            const filename = file.filename.toLowerCase();
            return filename.endsWith('.bmp') || filename.endsWith('.dds');
        });

        return textures;
    }

    getSounds() {
        const sounds = this.files.filter(file => {
            const filename = file.filename.toLowerCase();
            return filename.endsWith('.wav');
        });

        return sounds;
    }

    getFilesByExtension(ext) {
        if (typeof ext !== 'string') { throw new Error(`Extension must be a string`); }

        ext = ext.toLowerCase();
        const files = this.files.filter(file => {
            const filename = file.filename.toLowerCase();
            return filename.endsWith(ext);
        });

        return files;
    }

}

module.exports = PFS;
