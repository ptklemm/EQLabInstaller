const ReferenceFragment = require('./ReferenceFragment.js');

class F07 extends ReferenceFragment {
    constructor(baseData) {
        super(baseData);
        
        this.type = "Two-dimensional Object Reference";
        this.flags = undefined;
    }
    
    load(buffer, wld) {
        const dataStart = buffer.readOffset;
        this.getName(buffer, wld);
        // TO DO
        buffer.readOffset = dataStart + this.sizeByte;
    }
}

module.exports = F07;
