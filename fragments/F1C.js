const ReferenceFragment = require('./ReferenceFragment.js');

class F1C extends ReferenceFragment {
    constructor(baseData) {
        super(baseData);
        
        this.type = "Light Reference";
        this.flags = undefined;
    }
    
    load(buffer, wld) {
        this.getName(buffer, wld);
        this.getFragmentReference(buffer, wld);
        this.flags = buffer.readInt32LE();
    }
}

module.exports = F1C;
