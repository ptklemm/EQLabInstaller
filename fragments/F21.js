const PlainFragment = require('./PlainFragment.js');

class F21 extends PlainFragment {
    constructor(baseData) {
        super(baseData);
        
        this.type = "BSP Tree";
        this.size1 = undefined;
        this.entries = [];
    }
    
    load(buffer, wld) {
        const dataStart = buffer.readOffset;

        this.getName(buffer, wld);
        this.size1 = buffer.readInt32LE();

        for (let i = 0; i < this.size1; i++) {
            this.entries.push({
                normalX: buffer.readFloatLE(),
                normalY: buffer.readFloatLE(),
                normalZ: buffer.readFloatLE(),
                splitDistance: buffer.readFloatLE(),
                regionIndex: buffer.readInt32LE(),
                node1: buffer.readInt32LE(),
                node2: buffer.readInt32LE()
            })
        }
        
        buffer.readOffset = dataStart + this.sizeByte;
    }
}

module.exports = F21;
