const PlainFragment = require('./PlainFragment.js');

class F32 extends PlainFragment {
    constructor(baseData) {
        super(baseData);
        
        this.type = "Vertex Color";
        this.data1 = undefined;
        this.size1 = undefined;
        this.data2 = undefined;
        this.data3 = undefined;
        this.data4 = undefined;
        this.vertexColors = [];
    }
    
    load(buffer, wld) {
        const dataStart = buffer.readOffset;

        this.getName(buffer, wld);
        this.data1 = buffer.readInt32LE();
        this.size1 = buffer.readInt32LE();
        this.data2 = buffer.readInt32LE();
        this.data3 = buffer.readInt32LE();
        this.data4 = buffer.readInt32LE();

        for (let i = 0; i < this.size1; i++) {
            this.vertexColors.push(buffer.readInt32LE());
        }

        buffer.readOffset = dataStart + this.sizeByte;
    }
}

module.exports = F32;
