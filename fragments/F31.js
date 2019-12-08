const PlainFragment = require('./PlainFragment.js');

class F31 extends PlainFragment {
    constructor(baseData) {
        super(baseData);
        
        this.type = "MultiMaterial";
        this.flags = undefined;
        this.count = undefined;
        this.materials = [];
    }
    
    load(buffer, wld) {
        this.getName(buffer, wld);
        this.flags = buffer.readInt32LE();
        this.count = buffer.readInt32LE();

        for (let i = 0; i < this.count; i++) {
            let index = buffer.readInt32LE();
            let ref = wld.getFragmentByIndex(index);
            this.materials.push(ref);
        }
    }
}

module.exports = F31;
