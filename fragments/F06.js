const PlainFragment = require('./PlainFragment.js');

class F06 extends PlainFragment {
    constructor(baseData) {
        super(baseData);
        
        this.type = "Two-dimensional Object";
        this.flags = undefined;
        this.subsize1 = undefined;
        this.size1 = undefined;
        this.params1 = [];
        this.fragment = undefined;
        this.params2 = null;
        this.params3 = [];
        this.params4 = null;
        this.params5 = undefined;
        this.params6 = undefined;
        this.dataEntries = [];
        this.params7params1 = undefined;
        this.params7flags = undefined;
        this.params7params2 = undefined;
        this.params7params3 = null;
        this.params7params4 = null;
        this.params7fragment = undefined;
        this.params7matrix = [];
        this.params7size = undefined;
        this.params7data = [];
    }
    
    load(buffer, wld) {
        const dataStart = buffer.readOffset;
        this.getName(buffer, wld);
        // TO DO
        buffer.readOffset = dataStart + this.sizeByte;
    }
}

module.exports = F06;
