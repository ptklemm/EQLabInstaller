const PlainFragment = require('./PlainFragment.js');

class F29 extends PlainFragment {
    constructor(baseData) {
        super(baseData);
        
        this.type = "Region Flag";
        this.flags = undefined;
        this.size1 = undefined;
        this.regions = [];
        this.size2 = undefined;
        this.data2 = null;
    }
    
    load(buffer, wld) {
        this.getName(buffer, wld);
        this.flags = buffer.readInt32LE();

        this.size1 = buffer.readInt32LE();
        for (let i = 0; i < this.size1; i++) {
            this.regions.push(buffer.readInt32LE());
        }

        this.size2 = buffer.readInt32LE();
        for (let i = 0; i < this.size2; i++) {
            this.regions.push(buffer.readInt8());
        }
    }
}

module.exports = F29;
