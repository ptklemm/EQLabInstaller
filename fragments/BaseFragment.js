class BaseFragment {
    constructor(baseData) {
        this.byteLocation = baseData.byteLocation;
        this.index = baseData.index;
        this.name = undefined;
        this.sizeByte = baseData.sizeByte;
        this.fragType = baseData.fragType; 
    }

    getName(buffer, wld) {
        let val = buffer.readInt32LE();
        if (val == -16777216) { val = 0 } //Special case for first fragment
        
        if (val < 0) {
            this.name = wld.getStringByIndex(-1 * val);
        }
    }

    skip(buffer) {
        buffer.readOffset += this.sizeByte;
    }
}

module.exports = BaseFragment;