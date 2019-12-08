const SmartBuffer = require('smart-buffer').SmartBuffer;

class BMPHeader {
    constructor(data) {
        this.signature = data.signature;
        this.size = data.size;
        this.reserved1 = data.reserved1;
        this.reserved2 = data.reserved2;
        this.pixelArrayOffset = data.pixelArrayOffset;
    }
}

class DIBHeader {
    constructor(data) {
        this.size = data.size;
        this.width = data.width;
        this.height = data.height;
        this.colorPlanes = data.colorPlanes;
        this.colorDepth = data.colorDepth;
        this.compression = data.compression;
        this.imageSize = data.imageSize;
        this.hResolution = data.hResolution;
        this.vResolution = data.vResolution;
        this.paletteSize = data.paletteSize ? data.paletteSize : Math.pow(2, this.colorDepth);
        this.importantColorSize = data.importantColorSize;
    }
}

class RGBAColor {
    constructor(data) {
        this.b = data.b > 0 ? data.b : 255;
        this.g = data.g > 0 ? data.g : 255;
        this.r = data.r > 0 ? data.r : 255;
        this.a = data.a;
    }
}

class BMP {
    constructor(buffer) {
        const bmp = SmartBuffer.fromBuffer(buffer);

        this.header = new BMPHeader({
            signature: bmp.readString(2, 'utf8'),
            size: bmp.readInt32LE(),
            reserved1: bmp.readInt16LE(),
            reserved2: bmp.readInt16LE(),
            pixelArrayOffset: bmp.readInt32LE()
        });

        this.info = new DIBHeader({
            size: bmp.readInt32LE(),
            width: bmp.readInt32LE(),
            height: bmp.readInt32LE(),
            colorPlanes: bmp.readInt16LE(),
            colorDepth: bmp.readInt16LE(),
            compression: bmp.readInt32LE(),
            imageSize: bmp.readInt32LE(),
            hResolution: bmp.readInt32LE(),
            vResolution: bmp.readInt32LE(),
            paletteSize: bmp.readInt32LE(),
            importantColorSize: bmp.readInt32LE()
        });

        this.palette = [];
        for (let i = 0, len = this.info.paletteSize; i < len; i++) {
            this.palette.push(new RGBAColor({
                b: bmp.readInt8(),
                g: bmp.readInt8(),
                r: bmp.readInt8(),
                a: bmp.readInt8()
            }));
        }

        // Move cursor to pixel array
        bmp.readOffset += this.header.pixelArrayOffset - bmp.readOffset;

        const pixelArraySize = Math.ceil((this.info.colorDepth * this.info.width) / 32) * 4 * Math.abs(this.info.height);
        this.pixelArray = bmp.readBuffer(pixelArraySize);
    }
}

module.exports = BMP;