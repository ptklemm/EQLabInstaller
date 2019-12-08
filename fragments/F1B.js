const PlainFragment = require('./PlainFragment.js');

class F1B extends PlainFragment {
    constructor(baseData) {
        super(baseData);
        
        this.type = "Light";
        //this.flags = undefined;
        this.flags = {
            bit0: undefined,
            isPointLight: undefined,
            bit2: undefined,
            hasColor: undefined,
            hasColor2: undefined
        };
        this.params2 = undefined;
        this.alpha = undefined;
        this.attenuation = undefined;
        this.color = undefined;

        this.test;
    }
    
    load(buffer, wld) {
        this.getName(buffer, wld);
        let flags = buffer.readInt32LE();
        this.flags.bit0 = flags & 1 ? 1 : 0;
        this.flags.isPointLight = flags & 2 ? true : false;
        this.flags.bit2 = flags & 4 ? 1 : 0;
        this.flags.hasColor = flags & 8 ? true : false;
        this.flags.hasColor2 = flags & 16 ? true : false;

        this.params2 = buffer.readInt32LE();

        if (this.flags.isPointLight) { this.attenuation = buffer.readInt32LE(); }

        if (this.flags.hasColor || this.flags.hasColor2) {
            this.color = {
                a: buffer.readFloatLE(),
                r: buffer.readFloatLE(),
                g: buffer.readFloatLE(),
                b: buffer.readFloatLE()
            }
        } else {
            this.alpha = buffer.readFloatLE();
        }
    }
}

module.exports = F1B;
