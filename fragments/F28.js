const ReferenceFragment = require('./ReferenceFragment.js');

class F28 extends ReferenceFragment {
    constructor(baseData) {
        super(baseData);
        
        this.type = "Point Light";
        this.flags = null;
        this.x = null;
        this.y = null;
        this.z = null;
        this.radius = null;
    }
    
    load(buffer, wld) {
        this.getName(buffer, wld);
        this.getFragmentReference(buffer, wld);
        this.flags = buffer.readInt32LE();
        this.x = buffer.readFloatLE();
        this.y = buffer.readFloatLE();
        this.z = buffer.readFloatLE();
        this.radius = buffer.readFloatLE();
    }
}

module.exports = F28;
