const ReferenceFragment = require('./ReferenceFragment.js');

class F18 extends ReferenceFragment {
    constructor(baseData) {
        super(baseData);
        
        this.type = "Polygon Animation? Reference";
        this.flags = undefined;
        this.params1 = undefined;
    }
    
    load(buffer, wld) {
        this.getName(buffer, wld);
        this.getFragmentReference(buffer, wld);
        this.flags = buffer.readInt32LE();

        if (this.flags & 1) {
            this.params1 = buffer.readFloatLE();
        }
    }
}

module.exports = F18;
