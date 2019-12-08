const BaseFragment = require('./BaseFragment.js');

class ReferenceFragment extends BaseFragment{
    constructor(baseData) {
        super(baseData);

        this.baseType = "REFERENCE";
        this.ref = undefined;
    }

    getFragmentReference(buffer, wld) {
        let val = buffer.readInt32LE();
        this.ref = wld.getFragmentByStringIndex(val);
    }
}
module.exports = ReferenceFragment;
