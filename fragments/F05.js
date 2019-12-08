const ReferenceFragment = require('./ReferenceFragment.js');

class F05 extends ReferenceFragment {
    constructor(baseData) {
        super(baseData);
        
        this.type = "Texture Info Reference";
        this.flags = undefined;
    }
    
    load(buffer, wld) {
        this.getName(buffer, wld);
        this.getFragmentReference(buffer, wld);
        this.flags = buffer.readInt32LE();
    }
}

module.exports = F05;
