const PlainFragment = require('./PlainFragment.js');

class F16 extends PlainFragment {
    constructor(baseData) {
        super(baseData);
        
        this.type = "Zone Unknown";
        this.params1 = null;
    }
    
    load(buffer, wld) {
        this.getName(buffer, wld);
        this.params1 = buffer.readFloatLE();
    }
}

module.exports = F16;
