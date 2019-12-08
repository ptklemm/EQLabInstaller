const PlainFragment = require('./PlainFragment.js');

class F35 extends PlainFragment {
    constructor(baseData) {
        super(baseData);
        
        this.type = "First Fragment";
    }

    load(buffer, wld) {
        this.getName(buffer, wld);
    }
}

module.exports = F35;
