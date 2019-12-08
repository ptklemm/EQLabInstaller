const ReferenceFragment = require('./ReferenceFragment.js');

class F09 extends ReferenceFragment {
    constructor(baseData) {
        super(baseData);
        
        this.type = "Camera Reference 09";
        this.flags = undefined;
    }
    
    load(buffer, wld) {
        this.getName(buffer, wld);
        this.getFragmentReference(buffer, wld);
        this.flags = buffer.readInt32LE();
    }
}

module.exports = F09;
