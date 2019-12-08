const SmartBuffer = require('smart-buffer').SmartBuffer;
const CONSTANTS = require('../constants/constants.js');
const FRAGMENT = require('../fragments');

class WLD {
    constructor(filename, config) {
        this.filename = filename;
        this.config = config;
        this.size = null;
        this.header = {
            signature: undefined,
            version: undefined,
            fragCount: undefined,
            bspRegionCount: undefined,
            header4: undefined,
            stringHashSize: undefined,
            header6: undefined
        }
        this.string = undefined;
        this.firstFragmentOffset = undefined;
        this.fragments = {
            f03: [],
            f04: [],
            f05: [],
            f06: [],
            f07: [],
            f08: [],
            f09: [],
            f10: [],
            f11: [],
            f12: [],
            f13: [],
            f14: [],
            f15: [],
            f16: [],
            f17: [],
            f18: [],
            f1B: [],
            f1C: [],
            f21: [],
            f22: [],
            f26: [],
            f28: [],
            f29: [],
            f2A: [],
            f2C: [],
            f2D: [],
            f2F: [],
            f30: [],
            f31: [],
            f32: [],
            f33: [],
            f34: [],
            f35: [],
            f36: [],
            f37: []
        };
    }

    load(buffer) {
        const wld = SmartBuffer.fromBuffer(buffer);

        this.size = wld.length;

        this.header.signature = wld.readInt32LE();
        if (this.header.signature !== CONSTANTS.WLD_SIGNATURE)
            throw new Error(`${this.filename} is not a valid .wld file: Invalid filetype`);

        this.header.version = wld.readInt32LE();
        if (!(this.header.version === CONSTANTS.WLD_VERSION_1 || this.header.version === CONSTANTS.WLD_VERSION_2))
            throw new Error(`${this.filename} is not a valid .wld file: Invalid version`);
        
        this.header.fragCount = wld.readInt32LE();
        this.header.bspRegionCount = wld.readInt32LE();
        this.header.header4 = wld.readInt32LE();
        this.header.stringHashSize = wld.readInt32LE();
        this.header.header6 = wld.readInt32LE();

        this.string = wld.readBuffer(this.header.stringHashSize);
        this.string = this.decodeString(this.string);

        // Fragments
        this.firstFragmentOffset = wld.readOffset;
        for (let i = 1; i < this.header.fragCount + 1; i++) {

            const fragment = this.createFragment(
                wld.readOffset,
                i,
                wld.readInt32LE(),
                wld.readInt32LE()
            );

            this.loadFragment(wld, fragment);
        }

        wld.destroy();
        delete this.config;
        return this;
    }

    createFragment(byteLocation, index, sizeByte, fragType) {
        const baseData = { byteLocation, index, sizeByte, fragType };
        let fragment = undefined;

        switch(fragType) {
            case 0x03: {
                fragment = new FRAGMENT.F03(baseData);
                this.fragments.f03.push(fragment);
                break;
            } 
            case 0x04: {
                fragment = new FRAGMENT.F04(baseData);
                this.fragments.f04.push(fragment);
                break;
            } 
            case 0x05: {
                fragment = new FRAGMENT.F05(baseData);
                this.fragments.f05.push(fragment);
                break;
            } 
            case 0x06: {
                fragment = new FRAGMENT.F06(baseData);
                this.fragments.f06.push(fragment);
                break;
            } 
            case 0x07: {
                fragment = new FRAGMENT.F07(baseData);
                this.fragments.f07.push(fragment);
                break;
            } 
            case 0x08: {
                fragment = new FRAGMENT.F08(baseData);
                this.fragments.f08.push(fragment);
                break;
            } 
            case 0x09: {
                fragment = new FRAGMENT.F09(baseData);
                this.fragments.f09.push(fragment);
                break;
            } 
            case 0x10: {
                fragment = new FRAGMENT.F10(baseData);
                this.fragments.f10.push(fragment);
                break;
            } 
            case 0x11: {
                fragment = new FRAGMENT.F11(baseData);
                this.fragments.f11.push(fragment);
                break;
            } 
            case 0x12: {
                fragment = new FRAGMENT.F12(baseData);
                this.fragments.f12.push(fragment);
                break;
            } 
            case 0x13: {
                fragment = new FRAGMENT.F13(baseData);
                this.fragments.f13.push(fragment);
                break;
            } 
            case 0x14: {
                fragment = new FRAGMENT.F14(baseData);
                this.fragments.f14.push(fragment);
                break;
            } 
            case 0x15: {
                fragment = new FRAGMENT.F15(baseData);
                this.fragments.f15.push(fragment);
                break;
            } 
            case 0x16: {
                fragment = new FRAGMENT.F16(baseData);
                this.fragments.f16.push(fragment);
                break;
            } 
            case 0x17: {
                fragment = new FRAGMENT.F17(baseData);
                this.fragments.f17.push(fragment);
                break;
            } 
            case 0x18: {
                fragment = new FRAGMENT.F18(baseData);
                this.fragments.f18.push(fragment);
                break;
            } 
            case 0x1B: {
                fragment = new FRAGMENT.F1B(baseData);
                this.fragments.f1B.push(fragment);
                break;
            } 
            case 0x1C: {
                fragment = new FRAGMENT.F1C(baseData);
                this.fragments.f1C.push(fragment);
                break;
            } 
            case 0x21: {
                fragment = new FRAGMENT.F21(baseData);
                this.fragments.f21.push(fragment);
                break;
            } 
            case 0x22: {
                fragment = new FRAGMENT.F22(baseData);
                this.fragments.f22.push(fragment);
                break;
            } 
            case 0x26: {
                fragment = new FRAGMENT.F26(baseData);
                this.fragments.f26.push(fragment);
                break;
            } 
            case 0x28: {
                fragment = new FRAGMENT.F28(baseData);
                this.fragments.f28.push(fragment);
                break;
            } 
            case 0x29: {
                fragment = new FRAGMENT.F29(baseData);
                this.fragments.f29.push(fragment);
                break;
            } 
            case 0x2A: {
                fragment = new FRAGMENT.F2A(baseData);
                this.fragments.f2A.push(fragment);
                break;
            } 
            case 0x2C: {
                fragment = new FRAGMENT.F2C(baseData);
                this.fragments.f2C.push(fragment);
                break;
            } 
            case 0x2D: {
                fragment = new FRAGMENT.F2D(baseData);
                this.fragments.f2D.push(fragment);
                break;
            } 
            case 0x2F: {
                fragment = new FRAGMENT.F2F(baseData);
                this.fragments.f2F.push(fragment);
                break;
            } 
            case 0x30: {
                fragment = new FRAGMENT.F30(baseData);
                this.fragments.f30.push(fragment);
                break;
            } 
            case 0x31: {
                fragment = new FRAGMENT.F31(baseData);
                this.fragments.f31.push(fragment);
                break;
            } 
            case 0x32: {
                fragment = new FRAGMENT.F32(baseData);
                this.fragments.f32.push(fragment);
                break;
            } 
            case 0x33: {
                fragment = new FRAGMENT.F33(baseData);
                this.fragments.f33.push(fragment);
                break;
            } 
            case 0x34: {
                fragment = new FRAGMENT.F34(baseData);
                this.fragments.f34.push(fragment);
                break;
            } 
            case 0x35: {
                fragment = new FRAGMENT.F35(baseData);
                this.fragments.f35.push(fragment);
                break;
            }
            case 0x36: {
                fragment = new FRAGMENT.F36(baseData);
                this.fragments.f36.push(fragment);
                break;
            } 
            case 0x37: {
                fragment = new FRAGMENT.F37(baseData);
                this.fragments.f37.push(fragment);
                break;
            } 
            default:
                throw new Error(`${this.filename}: Invalid fragment type at byte ${byteLocation}`);
        }

        return fragment;
    }

    loadFragment(buffer, fragment) {
        const fragType = fragment.fragType;
        const index = fragment.index;

        try {
            switch(fragType) {
                case 0x03: {
                    if (this.config.load.f03 === true) { fragment.load(buffer, this) } else { fragment.skip(buffer) };
                    break;
                } 
                case 0x04: {
                    if (this.config.load.f04 === true) { fragment.load(buffer, this) } else { fragment.skip(buffer) };
                    break;
                } 
                case 0x05: {
                    if (this.config.load.f05 === true) { fragment.load(buffer, this) } else { fragment.skip(buffer) };
                    break;
                } 
                case 0x06: {
                    if (this.config.load.f06 === true) { fragment.load(buffer, this) } else { fragment.skip(buffer) };
                    break;
                } 
                case 0x07: {
                    if (this.config.load.f07 === true) { fragment.load(buffer, this) } else { fragment.skip(buffer) };
                    break;
                } 
                case 0x08: {
                    if (this.config.load.f08 === true) { fragment.load(buffer, this) } else { fragment.skip(buffer) };
                    break;
                } 
                case 0x09: {
                    if (this.config.load.f09 === true) { fragment.load(buffer, this) } else { fragment.skip(buffer) };
                    break;
                } 
                case 0x10: {
                    if (this.config.load.f10 === true) { fragment.load(buffer, this) } else { fragment.skip(buffer) };
                    break;
                } 
                case 0x11: {
                    if (this.config.load.f11 === true) { fragment.load(buffer, this) } else { fragment.skip(buffer) };
                    break;
                } 
                case 0x12: {
                    if (this.config.load.f12 === true) { fragment.load(buffer, this) } else { fragment.skip(buffer) };
                    break;
                } 
                case 0x13: {
                    if (this.config.load.f13 === true) { fragment.load(buffer, this) } else { fragment.skip(buffer) };
                    break;
                } 
                case 0x14: {
                    if (this.config.load.f14 === true) { fragment.load(buffer, this) } else { fragment.skip(buffer) };
                    break;
                } 
                case 0x15: {
                    if (this.config.load.f15 === true) { fragment.load(buffer, this) } else { fragment.skip(buffer) };
                    break;
                } 
                case 0x16: {
                    if (this.config.load.f16 === true) { fragment.load(buffer, this) } else { fragment.skip(buffer) };
                    break;
                } 
                case 0x17: {
                    if (this.config.load.f17 === true) { fragment.load(buffer, this) } else { fragment.skip(buffer) };
                    break;
                } 
                case 0x18: {
                    if (this.config.load.f18 === true) { fragment.load(buffer, this) } else { fragment.skip(buffer) };
                    break;
                } 
                case 0x1B: {
                    if (this.config.load.f1B === true) { fragment.load(buffer, this) } else { fragment.skip(buffer) };
                    break;
                } 
                case 0x1C: {
                    if (this.config.load.f1C === true) { fragment.load(buffer, this) } else { fragment.skip(buffer) };
                    break;
                } 
                case 0x21: {
                    if (this.config.load.f21 === true) { fragment.load(buffer, this) } else { fragment.skip(buffer) };
                    break;
                } 
                case 0x22: {
                    if (this.config.load.f22 === true) { fragment.load(buffer, this) } else { fragment.skip(buffer) };
                    break;
                } 
                case 0x26: {
                    if (this.config.load.f26 === true) { fragment.load(buffer, this) } else { fragment.skip(buffer) };
                    break;
                } 
                case 0x28: {
                    if (this.config.load.f28 === true) { fragment.load(buffer, this) } else { fragment.skip(buffer) };
                    break;
                } 
                case 0x29: {
                    if (this.config.load.f29 === true) { fragment.load(buffer, this) } else { fragment.skip(buffer) };
                    break;
                } 
                case 0x2A: {
                    if (this.config.load.f2A === true) { fragment.load(buffer, this) } else { fragment.skip(buffer) };
                    break;
                } 
                case 0x2C: {
                    if (this.config.load.f2C === true) { fragment.load(buffer, this) } else { fragment.skip(buffer) };
                    break;
                } 
                case 0x2D: {
                    if (this.config.load.f2D === true) { fragment.load(buffer, this) } else { fragment.skip(buffer) };
                    break;
                } 
                case 0x2F: {
                    if (this.config.load.f2F === true) { fragment.load(buffer, this) } else { fragment.skip(buffer) };
                    break;
                } 
                case 0x30: {
                    if (this.config.load.f30 === true) { fragment.load(buffer, this) } else { fragment.skip(buffer) };
                    break;
                } 
                case 0x31: {
                    if (this.config.load.f31 === true) { fragment.load(buffer, this) } else { fragment.skip(buffer) };
                    break;
                } 
                case 0x32: {
                    if (this.config.load.f32 === true) { fragment.load(buffer, this) } else { fragment.skip(buffer) };
                    break;
                } 
                case 0x33: {
                    if (this.config.load.f33 === true) { fragment.load(buffer, this) } else { fragment.skip(buffer) };
                    break;
                }
                case 0x34: {
                    if (this.config.load.f34 === true) { fragment.load(buffer, this) } else { fragment.skip(buffer) };
                    break;
                } 
                case 0x35: {
                    if (this.config.load.f35 === true) { fragment.load(buffer, this) } else { fragment.skip(buffer) };
                    break;
                }
                case 0x36: {
                    if (this.config.load.f36 === true) { fragment.load(buffer, this) } else { fragment.skip(buffer) };
                    break;
                } 
                case 0x37: {
                    if (this.config.load.f37 === true) { fragment.load(buffer, this) } else { fragment.skip(buffer) };
                    break;
                } 
                default:
                    throw new Error(`${this.filename}: Invalid fragment id at fragment ${index}:` + fragment);
            }
        } catch (error) {
            throw new Error(`${this.filename}: Error loading fragment. Fragment Index: ${fragment.index}`);
        }
    }

    getFragmentByIndex(index) {
        let fragments = this.fragments;

        for (let key in fragments) {
            let arr = fragments[key];
            if (arr.length) {
                for (let i = 0, len = arr.length; i < len; i++) {
                    if (arr[i].index == index) { return arr[i] }
                }
            }
        }

        return;
    }

    getFragmentByName(str) {
        let fragments = this.fragments;

        for (let key in fragments) {
            let arr = fragments[key];
            if (arr.length) {
                for (let i = 0, len = arr.length; i < len; i++) {
                    if (arr[i].name == str) { return arr[i] }
                }
            }
        }

        return;
    }

    getFragmentByStringIndex(index) {
        if (index < 0) {
            index = (-1 * index);
            
            return this.getStringByIndex(index);
        } else {
            
            return this.getFragmentByIndex(index);
        }
    }

    decodeString(strBuffer) {
        let string = Buffer.alloc(strBuffer.length);

        for (let i = 0; i < string.length; i++) {
            string[i] = strBuffer[i] ^ CONSTANTS.WLD_STRING_HASH[i % CONSTANTS.WLD_STRING_HASH.length];
        }
        
        return string.toString('ascii');
    }

    getStringByIndex(index) {
        let string = "";

        for (let i = index; i < this.string.length; i++) {
            if (this.string[i] == "\0") { break; }
            string += this.string[i];
        }

        return string;
    }

}

module.exports = WLD;
