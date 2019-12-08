const ReferenceFragment = require('./ReferenceFragment.js');

class F2A extends ReferenceFragment {
    constructor(baseData) {
        super(baseData);
        
        this.type = "Ambient Light";
        this.flags = undefined;
        this.size1 = undefined;
        this.regions = [];
    }
    
    load(buffer, wld) {
        const dataStart = buffer.readOffset;

        this.getName(buffer, wld);
        this.flags = buffer.readInt32LE();
        this.size1 = buffer.readInt32LE();

        for (let i = 0; i < this.size1; i++) {
            this.regions.push(buffer.readInt32LE());
        }

        // Contains 1 entry for each BSP region, need more info, skip for now
        
        buffer.readOffset = dataStart + this.sizeByte;
    }
}

module.exports = F2A;
