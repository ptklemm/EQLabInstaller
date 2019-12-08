const ReferenceFragment = require('./ReferenceFragment.js');

class F13 extends ReferenceFragment {
    constructor(baseData) {
        super(baseData);
        
        this.type = "Bone Animation Reference";
        this.flags = {
            bit0: undefined,
            bit1: undefined,
            bit2: undefined
        }
        this.params1 = undefined;
    }
    
    load(buffer, wld) {
        this.getName(buffer, wld);
        this.getFragmentReference(buffer, wld);

        const flags = buffer.readInt32LE();
        this.flags.bit0 = flags & 1 ? 1 : 0;
        this.flags.bit1 = flags & 2 ? 1 : 0;
        this.flags.bit2 = flags & 4 ? 1 : 0;

        if (this.flags.bit0 === 1) { this.params1 = buffer.readInt32LE(); }
    }
}

module.exports = F13;
