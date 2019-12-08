const PlainFragment = require('./PlainFragment.js');

class F12 extends PlainFragment {
    constructor(baseData) {
        super(baseData);
        
        this.type = "Bone Animation";
        this.flags = {
            bit0: undefined,
            bit1: undefined,
            bit2: undefined,
            bit3: undefined
        }
        this.numFrames = undefined;
        this.frames = [];
        this.data2 = [];
    }
    
    load(buffer, wld) {
        const dataStart = buffer.readOffset;

        this.getName(buffer, wld);
        const flags = buffer.readInt32LE();
        this.flags.bit0 = flags & 1 ? 1 : 0;
        this.flags.bit1 = flags & 2 ? 1 : 0;
        this.flags.bit2 = flags & 4 ? 1 : 0;
        this.flags.bit3 = flags & 8 ? 1 : 0;

        this.numFrames = buffer.readInt32LE();

        for (let i = 0; i < this.numFrames; i++) {
            this.frames.push({
                rotate: buffer.readInt16LE(),
                rotateX: buffer.readInt16LE(),
                rotateY: buffer.readInt16LE(),
                rotateZ: buffer.readInt16LE(),
                shiftX: buffer.readInt16LE(),
                shiftY: buffer.readInt16LE(),
                shiftZ: buffer.readInt16LE(),
                shift: buffer.readInt16LE()
            });
        }

        // Data2, need more info, skip for now
        // if (this.flags.bit3 === 1) {
        //     for (let i = 0; i < this.numFrames; i++) {
        //         this.data2.push({
        //             param1: buffer.readInt32LE(),
        //             param2: buffer.readInt32LE(),
        //             param3: buffer.readInt32LE(),
        //             param4: buffer.readInt32LE()
        //         });
        //     }
        // }

        buffer.readOffset = dataStart + this.sizeByte;
    }
}

module.exports = F12;
