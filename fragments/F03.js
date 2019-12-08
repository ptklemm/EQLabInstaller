const PlainFragment = require('./PlainFragment.js');
const CONSTANTS = require('../constants/constants.js');

class F03 extends PlainFragment {
    constructor(baseData) {
        super(baseData);
        
        this.type = "Texture Bitmap(s)";
        this.count = null;
        this.entryLengths = [];
        this.entries = [];
    }
    
    load(buffer, wld) {
        const dataStart = buffer.readOffset;
        
        this.getName(buffer, wld);
        this.count = buffer.readInt32LE();
        if (this.count == 0) { this.count = 1 };

        for (let i = 0; i < this.count; i++) {
            let nameLength = buffer.readInt16LE();
            this.entryLengths.push(nameLength);
            let name = buffer.readBuffer(nameLength);
            name = wld.decodeString(name).replace(/\0.*$/g,'');

            // Luclin Zones+ use 8-bit texture maps to apply texture, need to find flag that defines this, 
            // check for comma and cut off the RGB values for now
            if (name.includes(',')) {
                name = name.substr(name.lastIndexOf(' ') + 1);
            }
        
            this.entries.push(name);
        }

        buffer.readOffset = dataStart + this.sizeByte;
    }
}

module.exports = F03;
