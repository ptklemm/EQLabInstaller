const ReferenceFragment = require('./ReferenceFragment.js');

class F11 extends ReferenceFragment {
    constructor(baseData) {
        super(baseData);
        
        this.type = "Skeleton Reference";
        this.params1 = undefined;
    }
    
    load(buffer, wld) {
        this.getName(buffer, wld);
        this.getFragmentReference(buffer, wld);
        this.params1 = buffer.readInt32LE();
    }
}

module.exports = F11;
