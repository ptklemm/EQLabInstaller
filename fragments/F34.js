const PlainFragment = require('./PlainFragment.js');

class F34 extends PlainFragment {
    constructor(baseData) {
        super(baseData);
        
        this.type = "Unknown 34 (Particle Info?)";
        this.param1 = undefined;
        this.param2 = undefined;
        this.param3 = undefined;
        this.param4 = undefined;
        this.param5 = undefined;
    }
    
    load(buffer, wld) {
        const dataStart = buffer.readOffset;
        this.getName(buffer, wld);
        this.param1 = buffer.readInt32LE();
        this.param2 = buffer.readInt32LE();
        this.param3 = buffer.readInt32LE();
        this.param4 = buffer.readInt32LE();
        this.param5 = buffer.readInt32LE();
        // TO DO
        buffer.readOffset = dataStart + this.sizeByte;
    }
}

module.exports = F34;
