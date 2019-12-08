const PlainFragment = require('./PlainFragment.js');

class F22 extends PlainFragment {
    constructor(baseData) {
        super(baseData);
        
        this.type = "BSP Region";
        this.flags = undefined;
        this.fragment1 = undefined;
        this.size1 = undefined;
        this.size2 = undefined;
        this.params1 = undefined;
        this.size3 = undefined;
        this.size4 = undefined;
        this.params2 = undefined;
        this.size5 = undefined;
        this.size6 = undefined;
        this.data1 = null;
        this.data2 = null;
        this.data3entries = [];
        this.data4entries = [];
        this.data5entries = [];
        this.data6entries = [];
        this.size7 = undefined;
        this.name7 = null;
        this.fragment2 = undefined;
        this.fragment3 = undefined;
    }
    
    load(buffer, wld) {
        const dataStart = buffer.readOffset;
        this.getName(buffer, wld);
        // TO DO
        buffer.readOffset = dataStart + this.sizeByte;
    }
}

module.exports = F22;
