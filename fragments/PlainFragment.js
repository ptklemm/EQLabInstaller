const BaseFragment = require('./BaseFragment.js');

class PlainFragment extends BaseFragment {
    constructor(baseData) {
        super(baseData);
        
        this.baseType = "PLAIN";
    }
}
module.exports = PlainFragment;
