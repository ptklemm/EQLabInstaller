const ReferenceFragment = require('./ReferenceFragment.js');

class F26 extends ReferenceFragment {
    constructor(baseData) {
        super(baseData);
        
        this.type = "Unknown26 (Particle Reference?)";
        this.flags = undefined;
        this.unknown = undefined;
    }
    
    load(buffer, wld) {
        //const dataStart = buffer.readOffset;

        this.getName(buffer, wld);
        this.flags = buffer.readInt32LE();
        this.getFragmentReference(buffer, wld);
        this.unknown = buffer.readInt32LE();

        //buffer.readOffset = dataStart + this.sizeByte;
    }
}

module.exports = F26;
