const PlainFragment = require('./PlainFragment.js');

class F14 extends PlainFragment {
    constructor(baseData) {
        super(baseData);
        
        this.type = "Static or Animated Model";
        this.flags = undefined,
        this.fragment1 = undefined;
        this.size1 = undefined;
        this.size2 = undefined;
        this.fragment2 = undefined;
        this.params1 = undefined;
        this.params2 = [];
        this.entries = [];
        this.fragment3 = [];
        this.size3 = undefined;
        this.name3 = undefined;
    }
    
    load(buffer, wld) {
        this.getName(buffer, wld);
        this.flags = buffer.readInt32LE();
        // Bit 0........If 1, Params1 exists.
        // Bit 1........If 1, Params2 exists.
        // Bit 7........If 0, Fragment2 must contain 0.

        this.fragment1 = wld.getFragmentByStringIndex(buffer.readInt32LE());
        this.size1 = buffer.readInt32LE();
        this.size2 = buffer.readInt32LE();
        this.fragment2 = buffer.readInt32LE();
        
        if (this.flags & 1) { this.params1 = buffer.readInt32LE(); }

        if (this.flags & 2) {
            for (let i = 0; i < 7; i++) {
                this.params2.push(buffer.readInt32LE());
            }
        }

        for (let i = 0; i < this.size1; i++) {
            const size = buffer.readInt32LE();
            const datapairs = [];

            for (let j = 0; j < size; j++) {
                datapairs.push({
                    1: buffer.readInt32LE(),
                    2: buffer.readInt32LE()
                });
            }

            this.entries.push({
                size,
                datapairs
            });
        }

        for (let i = 0; i < this.size2; i++) {
            this.fragment3.push(wld.getFragmentByIndex(buffer.readInt32LE()));
        }

        this.size3 = buffer.readInt32LE();
        if (this.size3 > 0) { this.name3 = buffer.readBuffer(this.size3); }
    }
}

module.exports = F14;
