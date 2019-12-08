const os = require('os');
const fs = require('fs-extra');
const SmartBuffer = require('smart-buffer').SmartBuffer;
const CONSTANTS = require('../constants/constants.js');

class SoundEntry {
    constructor(data) {
        this.unkRef00 = data.unkRef00;
        this.unkRef04 = data.unkRef04;
        this.reserved = data.reserved;
        this.sequence = data.sequence;
        this.x = data.x;
        this.y = data.y;
        this.z = data.z;
        this.radius = data.radius;
        this.cooldownDay = data.cooldownDay;
        this.cooldownNight = data.cooldownNight;
        this.randomDelay = data.randomDelay;
        this.unk44 = data.unk44;
        this.soundIDDay = data.soundIDDay;
        this.soundNameDay = undefined;
        this.soundIDNight = data.soundIDNight;
        this.soundNameNight = undefined;
        this.soundType = CONSTANTS.EFF_SOUND_TYPES[data.soundType];
        this.unkPad57 = data.unkPad57;
        this.unkPad58 = data.unkPad58;
        this.unkPad59 = data.unkPad59;
        this.asDistance = data.asDistance;
        this.unkRange64 = data.unkRange64;
        this.fadeOutMS = data.fadeOutMS;
        this.unkRange72 = data.unkRange72;
        this.fullVolRange = data.fullVolRange;
        this.unkRange80 = data.unkRange80;
    }
}

class SoundBank {
    constructor(dir, zone) {
        this.zone = zone;
        this.path = `${dir}\\${zone}_sndbnk.eff`;
        this.emit = [];
        this.loop = [];
        this.rand = [];
    }

    async load() {
        const file = await fs.readFile(this.path, 'utf8');
        const lines = file.toString().toLowerCase().split(os.EOL);

        let section;
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            if (!line.length) { continue; }

            if (line === 'emit') {
                section = 'emit';
                continue;
            } else if (line === 'loop') {
                section = 'loop';
                continue;
            } else if (line === 'rand') {
                section = 'rand';
                continue;
            } else {
                switch(section) {
                    case 'emit':
                        this.emit.push(line);
                        break;
                    case 'loop':
                        this.loop.push(line);
                        break;
                    case 'rand':
                        this.rand.push(line);
                        break;
                    default:
                        break;
                }
            }
        }

        return this;
    }
}

class EFF {
    constructor(dir, zone) {
        this.dir = dir;
        this.zone = zone;
        this.path = `${dir}\\${zone}_sounds.eff`;
        this.soundBank = undefined;
        this.size = null;
        this.numEntries = null;
        this.entries = [];
    }

    async load() {
        this.soundBank = new SoundBank(this.dir, this.zone);
        await this.soundBank.load();

        const buffer = await fs.readFile(this.path);
        const eff = SmartBuffer.fromBuffer(buffer);
        
        this.size = eff.length;
        this.numEntries = Math.trunc(this.size / CONSTANTS.EFF_SOUNDENTRY_SIZE);

        for (let i = 0; i < this.numEntries; i++) {
            this.entries.push(new SoundEntry({
                unkRef00: eff.readInt32LE(),
                unkRef04: eff.readInt32LE(),
                reserved: eff.readInt32LE(),
                sequence: eff.readInt32LE(),
                x: eff.readFloatLE(),
                y: eff.readFloatLE(),
                z: eff.readFloatLE(),
                radius: eff.readFloatLE(),
                cooldownDay: eff.readInt32LE(),
                cooldownNight: eff.readInt32LE(),
                randomDelay: eff.readInt32LE(),
                unk44: eff.readInt32LE(),
                soundIDDay: eff.readInt32LE(),
                soundIDNight: eff.readInt32LE(),
                soundType: eff.readInt8(),
                unkPad57: eff.readInt8(),
                unkPad58: eff.readInt8(),
                unkPad59: eff.readInt8(),
                asDistance: eff.readInt32LE(),
                unkRange64: eff.readInt32LE(),
                fadeOutMS: eff.readInt32LE(),
                unkRange72: eff.readInt32LE(),
                fullVolRange: eff.readInt32LE(),
                unkRange80: eff.readInt32LE()
            }));
        }

        for (let i = 0; i < this.entries.length; i++) {
            const entry = this.entries[i];
            const idDay = entry.soundIDDay;
            const idNight = entry.soundIDNight;

            entry.soundNameDay = await this.getSoundNameById(idDay, i);
            entry.soundNameNight = await this.getSoundNameById(idNight, i);
        }

        eff.destroy();
        return this;
    }

    async getSoundNameById(id, entryIndex) {
        let name;

        if (id < 0) {
            name = await this.getMP3NameById(id);
        } else if (id === 0) {
            name = null;
        } else if (id >= 1 && id <= 31) {
            name = this.soundBank.emit[id - 1];
        } else if (id >= 32 && id <= 161) {
            name = this.getHardCodedSoundNameById(id);
            if (!name) { console.log(`Unknown hard coded sound name, zone: ${this.zone}, soundEntry: ${entryIndex}, soundId: ${id}`); }
        } else if (id >= 162) {
            name = this.soundBank.loop[(id - 161) - 1];
        } else {
            name = null;
        }

        return name;
    }

    async getMP3NameById(id) {
        const file = await fs.readFile(`${this.dir}\\mp3index.txt`, 'utf8');
        const lines = file.toString().toLowerCase().split(os.EOL);
        // TO DO
        return 'MP3';
    }

    getHardCodedSoundNameById(id) {
        return CONSTANTS.EFF_HARDCODED_SOUNDS[id];
    }
}

module.exports = EFF;