const ReferenceFragment = require('./ReferenceFragment.js');

class F2F extends ReferenceFragment {
    constructor(baseData) {
        super(baseData);
        
        this.type = "Mesh Animated Vertices Reference";
        this.flags = undefined;
    }
    
    load(buffer, wld) {
        const dataStart = buffer.readOffset;
        this.getName(buffer, wld);
        // TO DO
        buffer.readOffset = dataStart + this.sizeByte;
    }
}

module.exports = F2F;
