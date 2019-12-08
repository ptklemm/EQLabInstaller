const PlainFragment = require('./PlainFragment.js');
const CONSTANTS = require('../constants/constants.js');

class F04 extends PlainFragment {
    constructor(baseData) {
        super(baseData);
        
        this.type = "Texture Animation Info";
        this.flags = undefined;
        this.isAnimated = false;
        this.count = undefined;
        this.milliseconds = undefined;
        this.refs = [];
    }
    
    load(buffer, wld) {
        this.getName(buffer, wld);
        this.flags = buffer.readInt32LE();
        this.isAnimated = this.flags & 8 ? true : false;
        this.count = buffer.readInt32LE();
        if (this.flags & 8) { this.milliseconds = buffer.readInt32LE(); }

        for (let i = 0; i < this.count; i++) {
            let ref = buffer.readInt32LE();
            this.refs.push(wld.getFragmentByIndex(ref));
        }
    }
}

module.exports = F04;
