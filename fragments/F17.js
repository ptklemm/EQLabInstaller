const PlainFragment = require('./PlainFragment.js');

class F17 extends PlainFragment {
    constructor(baseData) {
        super(baseData);
        
        this.type = "Polygon Animation?";
        this.flags = undefined;
        this.size1 = undefined;
        this.size2 = undefined;
        this.params1 = undefined;
        this.params2 = undefined;
        this.entries1 = [];
        this.entries2 = [];
    }
    
    load(buffer, wld) {
        this.getName(buffer, wld);
        this.flags = buffer.readInt32LE();
        this.size1 = buffer.readInt32LE();
        this.size2 = buffer.readInt32LE();
        this.params1 = buffer.readFloatLE();
        this.params2 = buffer.readFloatLE();

        for (let i = 0; i < this.size1; i++) {
            this.entries1.push({
                x: buffer.readFloatLE(),
                y: buffer.readFloatLE(),
                z: buffer.readFloatLE()
            });
        }

        for (let i = 0; i < this.size2; i++) {
            const size = buffer.readInt32LE();

            const entries = [];
            for (let j = 0; j < size; j++) {
                entries.push(buffer.readInt32LE());
            }

            this.entries2.push({
                size,
                entries
            });
        }
    }
}

module.exports = F17;
