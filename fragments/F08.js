const PlainFragment = require('./PlainFragment.js');
const CONSTANTS = require('../constants/constants.js');

class F08 extends PlainFragment {
    constructor(baseData) {
        super(baseData);
        
        this.type = "Camera";
        this.params1 = undefined;
        this.params2 = undefined;
        this.params5 = undefined;
        this.params6 = undefined;
        this.params8 = undefined;
        this.params9 = undefined;
        this.params11 = undefined;
        this.params12 = undefined;
        this.params14 = undefined;
        this.params15 = undefined;
        this.params16 = undefined;
        this.params20 = undefined;
        this.params21 = undefined;
        this.params22 = undefined;
        this.params24 = undefined;
        this.params25 = undefined;
        this.params26 = undefined;
    }
    
    load(buffer, wld) {
        //const dataStart = buffer.readOffset;

        this.getName(buffer, wld);

        // Need More Info
        this.params1 = buffer.readInt32LE();
        this.params2 = buffer.readInt32LE();
        buffer.readBuffer(CONSTANTS.DWORD);
        buffer.readBuffer(CONSTANTS.DWORD);
        this.params5 = buffer.readFloatLE();
        this.params6 = buffer.readFloatLE();
        buffer.readBuffer(CONSTANTS.DWORD);
        this.params8 = buffer.readFloatLE();
        this.params9 = buffer.readFloatLE();
        buffer.readBuffer(CONSTANTS.DWORD);
        this.params11 = buffer.readFloatLE();
        this.params12 = buffer.readFloatLE();
        buffer.readBuffer(CONSTANTS.DWORD);
        this.params14 = buffer.readFloatLE();
        this.params15 = buffer.readFloatLE();
        this.params16 = buffer.readFloatLE();
        buffer.readBuffer(CONSTANTS.DWORD);
        buffer.readBuffer(CONSTANTS.DWORD);
        buffer.readBuffer(CONSTANTS.DWORD);
        this.params20 = buffer.readInt32LE();
        this.params21 = buffer.readInt32LE();
        this.params22 = buffer.readInt32LE();
        buffer.readBuffer(CONSTANTS.DWORD);
        this.params24 = buffer.readInt32LE();
        this.params25 = buffer.readInt32LE();
        this.params26 = buffer.readInt32LE();

        //buffer.readOffset = dataStart + this.sizeByte;
    }
}

module.exports = F08;
