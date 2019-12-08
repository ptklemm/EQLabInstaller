const ReferenceFragment = require('./ReferenceFragment.js');
const CONSTANTS = require('../constants/constants.js');

class F30 extends ReferenceFragment {
    constructor(baseData) {
        super(baseData);
        
        this.type = "Material";
        this.flag = undefined;
        this.visibility = {
            invisible: false,
            masked: false,
            particle: false,
            transparent: false
        };
        this.params2 = undefined;
        this.params3_1 = null;
        this.params3_2 = null;
        this.pair1 = undefined;
        this.pair2 = undefined;
    }
    
    load(buffer, wld) {
        this.getName(buffer, wld);
        this.flag = buffer.readInt32LE();

        let vis = buffer.readInt32LE();

        if (vis === 0) { 
            this.visibility.invisible = true; 
        } else if (vis === -2147483629) {
            this.visibility.masked = true;
        } else if (vis === -2147483637 || vis === -2147483639 || vis === 1363 || vis === -2147483625) {
            this.visibility.particle = true;
        } else if (vis === -2147483643 || vis === -2147483638) {
            this.visibility.transparent = true;
        }
    
        this.params2 = buffer.readBuffer(4);
        
        this.params3_1 = buffer.readFloatLE();
        this.params3_2 = buffer.readFloatLE();

        this.getFragmentReference(buffer, wld);

        this.pair1 = buffer.readInt32LE();
        this.pair2 = buffer.readInt32LE();
    }

}

module.exports = F30;
