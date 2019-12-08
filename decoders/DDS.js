const SmartBuffer = require('smart-buffer').SmartBuffer;
const CONSTANTS = require('../constants/constants.js');

const FOURCC_DXT1 = fourCCToInt32('DXT1');
const FOURCC_DXT3 = fourCCToInt32('DXT3');
const FOURCC_DXT5 = fourCCToInt32('DXT5');
const FOURCC_DX10 = fourCCToInt32('DX10');
const FOURCC_FP32F = 116;
const D3D10_RESOURCE_DIMENSION_TEXTURE2D = 3;
const DXGI_FORMAT_R32G32B32A32_FLOAT = 2;

class DDSHeader {
    constructor(data) {
        this.size = data.size;
        this.flags = {
            caps: data.flags & 1 ? true : false,
            height: data.flags & 2 ? true : false,
            width: data.flags & 4 ? true : false,
            pitch: data.flags & 8 ? true : false,
            pixelFormat: data.flags & 1000 ? true : false,
            mipmapCount: data.flags & 20000 ? true : false,
            linearSize: data.flags & 80000 ? true : false,
            depth: data.flags & 800000 ? true : false
        };
        this.height = data.height;
        this.width = data.width;
        this.pitchOrLinearSize = data.pitchOrLinearSize;
        this.depth = data.depth;
        this.mipmapCount = data.mipmapCount;
        this.reserved1 = data.reserved1;
        this.pixelFormat = {
            size: data.pixelFormat.size,
            flags: {
                alphaPixels: data.pixelFormat.flags & 1 ? true : false,
                alpha: data.pixelFormat.flags & 2 ? true : false,
                fourCC: data.pixelFormat.flags & 4 ? true : false,
                rgb: data.pixelFormat.flags &  40 ? true : false,
                yuv: data.pixelFormat.flags & 200 ? true : false,
                luminance: data.pixelFormat.flags & 20000 ? true : false
            },
            fourCC: data.pixelFormat.fourCC,
            rgbBitCount: data.pixelFormat.rgbBitCount,
            rBitmask: data.pixelFormat.rBitmask,
            gBitmask: data.pixelFormat.gBitmask,
            bBitmask: data.pixelFormat.bBitmask,
            aBitmask: data.pixelFormat.aBitmask
        };
        this.caps = {
            complex: data.caps & 8 ? true : false,
            mipmap: data.caps & 400000 ? true : false,
            texture: data.caps & 1000 ? true : false
        };
        this.caps2 = {
            cubemap: data.caps2 & 200 ? true : false,
            cubemap_posX: data.caps2 & 400 ? true : false,
            cubemap_negX: data.caps2 & 800 ? true : false,
            cubemap_posY: data.caps2 & 1000 ? true : false,
            cubemap_negY: data.caps2 & 2000 ? true : false,
            cubemap_posZ: data.caps2 & 4000 ? true : false,
            cubemap_negZ: data.caps2 & 8000 ? true : false,
            volume: data.caps2 & 200000 ? true : false
        };
        this.caps3 = data.caps3;
        this.caps4 = data.caps4;
        this.reserved2 = data.reserved2;
    }
}

class DX10Header {
    constructor(data) {
        this.dxgiFormat = data.dxgiFormat;
        this.resourceDimension = data.resourceDimension;
        this.miscFlag = data.miscFlag;
        this.arraySize = data.arraySize;
        this.miscFlags2 = data.miscFlags2;
    }
}

class DDS {
    constructor() {
        this.signature = undefined;
        this.header = undefined;
        this.dx10Header = undefined;
        this.blockBytes = undefined;
        this.format = undefined;
        this.mipmapCount = undefined;
        this.width = undefined;
        this.height = undefined;
        this.images = [];
    }

    load(buffer) {
        const dds = SmartBuffer.fromBuffer(buffer);

        this.signature = dds.readInt32LE();

        this.header = new DDSHeader({
            size: dds.readInt32LE(),
            flags: dds.readInt32LE(),
            height: dds.readInt32LE(),
            width: dds.readInt32LE(),
            pitchOrLinearSize: dds.readInt32LE(),
            depth: dds.readInt32LE(),
            mipmapCount: dds.readInt32LE(),
            reserved1: dds.readBuffer(11 * CONSTANTS.DWORD),
            pixelFormat: {
                size: dds.readInt32LE(),
                flags: dds.readInt32LE(),
                fourCC: dds.readInt32LE(),
                rgbBitCount: dds.readInt32LE(),
                rBitmask: dds.readInt32LE(),
                gBitmask: dds.readInt32LE(),
                bBitmask: dds.readInt32LE(),
                aBitmask: dds.readInt32LE()
            },
            caps: dds.readInt32LE(),
            caps2: dds.readInt32LE(),
            caps3: dds.readInt32LE(),
            caps4: dds.readInt32LE(),
            reserved2: dds.readInt32LE()
        });

        switch (this.header.pixelFormat.fourCC) {
            case FOURCC_DXT1:
                this.format = 'dxt1';
                this.blockBytes = 8;
                break;
            case FOURCC_DXT3:
                this.format = 'dxt3';
                this.blockBytes = 16;
                break;
            case FOURCC_DXT5:
                this.format = 'dxt5';
                this.blockBytes = 16;
                break;
            case FOURCC_FP32F:
                this.format = 'rgba32f';
                break;
            case FOURCC_DX10:
                this.dx10Header = new DX10Header({
                    dxgiFormat: dds.readInt32LE(),
                    resourceDimension: dds.readInt32LE(),
                    miscFlag: dds.readInt32LE(),
                    arraySize: dds.readInt32LE(),
                    miscFlags2: dds.readInt32LE()
                });

                this.format = this.dx10Header.dxgiFormat;

                if (this.dx10Header.resourceDimension === D3D10_RESOURCE_DIMENSION_TEXTURE2D && this.format === DXGI_FORMAT_R32G32B32A32_FLOAT) {
                    this.format = 'rgba32f';
                } else {
                    throw new Error('Unsupported DX10 texture format ' + this.format);
                }
                break;
            default:
                throw new Error('Invalid FourCC code');
        }

        this.mipmapCount = Math.max(1, this.header.mipmapCount);
        this.width = this.header.width;
        this.height = this.header.height;

        let dataLength,
            width = this.width,
            height = this.height;

        if (this.header.caps2.cubemap) {
            for (let f = 0; f < 6; f++) {
                if (this.format !== 'rgba32f') { throw new Error('Only RGBA32f cubemaps are supported'); }

                const bpp = 4 * 32 / 8
          
                width = this.width;
                height = this.height;
          
                // cubemap should have all mipmap levels defined
                // Math.log2(width) + 1
                const requiredMipLevels = Math.log(width) / Math.log(2) + 1;
          
                for (let i = 0; i < requiredMipLevels; i++) {
                    dataLength = width * height * bpp;

                    this.images.push({
                        offset: dds.readOffset,
                        length: dataLength,
                        width,
                        height
                    });

                    // Reuse data from the previous level if we are beyond mipmapCount
                    // This is hack for CMFT not publishing full mipmap chain https://github.com/dariomanesku/cmft/issues/10
                    if (i < this.mipmapCount) {
                        dds.readOffset += dataLength;
                    }

                    width = Math.floor(width / 2);
                    height = Math.floor(height / 2);
                }
            }
        } else {
            for (let i = 0; i < this.mipmapCount; i++) {
                dataLength = Math.max(4, width) / 4 * Math.max(4, height) / 4 * this.blockBytes;
          
                this.images.push({
                  offset: dds.readOffset,
                  length: dataLength,
                  width,
                  height
                });
    
                dds.readOffset += dataLength;
                width = Math.floor(width / 2);
                height = Math.floor(height / 2);
            }
        }

        dds.destroy();
        return this;
    }
}

function fourCCToInt32(value) {
    return value.charCodeAt(0) +
      (value.charCodeAt(1) << 8) +
      (value.charCodeAt(2) << 16) +
      (value.charCodeAt(3) << 24)
}

module.exports = DDS;