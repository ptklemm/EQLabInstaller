const PlainFragment = require('./PlainFragment.js');

class F37 extends PlainFragment {
    constructor(baseData) {
        super(baseData);
        
        this.type = "Mesh Animated Vertices";
        this.flags = undefined;
        this.vertexCount = undefined;
        this.frameCount = undefined;
        this.param1 = undefined;
        this.param2 = undefined;
        this.scale = undefined;
        this.frameEntries = [];
        this.size6 = undefined;
    }
    
    load(buffer, wld) {
        const dataStart = buffer.readOffset;
        this.getName(buffer, wld);
        // TO DO
        buffer.readOffset = dataStart + this.sizeByte;
    }
}

module.exports = F37;
