const ReferenceFragment = require('./ReferenceFragment.js');

class F15 extends ReferenceFragment {
    constructor(baseData) {
        super(baseData);
        
        this.type = "Object Location";
        this.flags = undefined;
        this.fragment1 = undefined;
        this.x = null;
        this.y = null;
        this.z = null;
        this.rotateX = null;
        this.rotateY = null;
        this.rotateZ = null;
        this.scaleX = null;
        this.scaleY = null;
        this.scaleZ = null;
        this.fragment2 = undefined;
        this.params2 = undefined;
    }
    
    load(buffer, wld) {
        this.getName(buffer, wld);
        this.getFragmentReference(buffer, wld);
        this.flags = buffer.readInt32LE();
        this.fragment1 = wld.getFragmentByIndex(buffer.readInt32LE());

        this.x = buffer.readFloatLE();
        this.y = buffer.readFloatLE();
        this.z = buffer.readFloatLE();

        this.rotateX = buffer.readFloatLE();
        this.rotateY = buffer.readFloatLE();
        this.rotateZ = buffer.readFloatLE();

        this.scaleX = buffer.readFloatLE();
        this.scaleY = buffer.readFloatLE();
        this.scaleZ = buffer.readFloatLE();
        

        this.fragment2 = wld.getFragmentByIndex(buffer.readInt32LE());
        if (this.fragment2) { this.params2 = buffer.readInt32LE(); }
    }
}

module.exports = F15;
