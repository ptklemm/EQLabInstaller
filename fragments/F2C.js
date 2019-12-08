const PlainFragment = require('./PlainFragment.js');
const CONSTANTS = require('../constants/constants.js');

class F2C extends PlainFragment {
    constructor(baseData) {
        super(baseData);
        
        this.type = "Alternate Mesh";
        this.flags = {
            position: undefined,
            params2: undefined,
            data8: undefined,
            polyTextures: undefined,
            vertTextures: undefined,
            params3: undefined
        }

        this.vertexCount = undefined;
        this.uvCount = undefined;
        this.normalsCount = undefined;
        this.colorsCount = undefined;
        this.polyCount = undefined;
        this.size6 = undefined;
        this.vertPieceCount = undefined;

        this.fragment1 = undefined;
        this.materials = undefined;
        this.fragment3 = undefined;

        this.x = null;
        this.y = null;
        this.z = null;
        this.params2 = undefined;

        this.vertexEntries = [];
        this.uvEntries = [];
        this.normalEntries = [];
        this.colorEntries = [];
        this.polyEntries = [];
        this.data6Entries = [];
        this.vertPieceEntries = [];
        this.size8 = undefined;
        this.data8Entries = [];

        this.polyTextureCount = undefined;
        this.polyTextureEntries = [];
        this.vertTextureCount = undefined;
        this.vertTextureEntries = [];
        this.params3 = [];
    }
    
    load(buffer, wld) {
        const dataStart = buffer.readOffset;
        this.getName(buffer, wld);
        // Bit 0........If 1, then CenterX, CenterY, and CenterZ are valid. Otherwise they must contain zero.
        // Bit 1........If 1, then Params2 is valid. Otherwise it must contain zero.
        // Bit 9........If 1, then the Size8 field and Data8 entries exist.
        // Bit 11......If 1, then the PolygonTexCount field and PolygonTex entries exist.
        // Bit 12......If 1, then the VertexTexCount field and VertexTex entries exist.
        // Bit 13......If 1, then the Params3[] fields exist.
        const flags = buffer.readInt32LE();
        this.flags.position = flags & 1 ? true : false;
        this.flags.params2 = flags & 2 ? true : false;
        this.flags.data8 = flags & 512 ? true : false;
        this.flags.polyTextures = flags & 2048 ? true : false;
        this.flags.vertTextures = flags & 4096 ? true : false;
        this.flags.params3 = flags & 8192 ? true : false;

        this.vertexCount = buffer.readInt32LE();
        this.uvCount = buffer.readInt32LE();
        this.normalsCount = buffer.readInt32LE();
        this.colorsCount = buffer.readInt32LE();
        this.polyCount = buffer.readInt32LE();
        this.size6 = buffer.readInt16LE();
        this.vertPieceCount = buffer.readInt16LE();

        this.fragment1 = wld.getFragmentByIndex(buffer.readInt32LE());
        this.materials = wld.getFragmentByIndex(buffer.readInt32LE());
        this.fragment3 = wld.getFragmentByIndex(buffer.readInt32LE());

        this.x = buffer.readFloatLE();
        this.y = buffer.readFloatLE();
        this.z = buffer.readFloatLE();
        this.params2 = buffer.readFloatLE();

        // Vertices
        for (let i = 0; i < this.vertexCount; i++) {
            this.vertexEntries.push({
                x: buffer.readFloatLE(),
                y: buffer.readFloatLE(),
                z: buffer.readFloatLE()
            });
        }

         // uv Coords
        for (let i = 0; i < this.uvCount; i++) {
            this.uvEntries.push({
                u: buffer.readFloatLE(),
                v: buffer.readFloatLE()
            });
        }

        // Vertex Normals
        for (let i = 0; i < this.normalsCount; i++) {
            this.normalEntries.push({
                i: buffer.readFloatLE(),
                j: buffer.readFloatLE(),
                k: buffer.readFloatLE()
            });
        }

        // Vertex Colors
        for (let i = 0; i < this.colorsCount; i++) {
            this.colorEntries.push({
                color: buffer.readInt32LE()
            });
        }

        // Polygons
        for (let i = 0; i < this.polyCount; i++) {
            this.polyEntries.push({
                flag: buffer.readInt16LE(),
                polygonData: [
                    buffer.readInt16LE(),
                    buffer.readInt16LE(),
                    buffer.readInt16LE(),
                    buffer.readInt16LE()
                ],
                vertices: [
                    buffer.readInt16LE(),
                    buffer.readInt16LE(),
                    buffer.readInt16LE()
                ]
            });
        }

        // Data6
        for (let i = 0; i < this.size6; i++) {
            const type = buffer.readInt32LE();
            let vertexIndex, offset;
            if (type < 4) {
                vertexIndex = buffer.readInt32LE();
            } else if (type === 4) {
                offset = buffer.readFloatLE();
            }
            const params = [
                buffer.readInt16LE(),
                buffer.readInt16LE()
            ];
            this.data6Entries.push({
                type,
                vertexIndex,
                offset,
                params
            });
        }

        // Vertex Pieces
        for (let i = 0; i < this.vertPieceCount; i++) {
            this.vertPieceEntries.push({
                count: buffer.readInt16LE(),
                index: buffer.readInt16LE()
            });
        }

        // Data8
        if (this.flags.data8 === true) {
            this.size8 = buffer.readInt32LE();

            for (let i = 0; i < this.size8; i++) {
                this.data8Entries.push(buffer.readInt32LE());
            }
        }

        //console.log(dataStart + this.sizeByte - buffer.readOffset)

        // Polygon Textures, Need more info here, this doesn't work
        // if (this.flags.polyTextures === true) {
        //     this.polyTextureCount = buffer.readInt32LE();

        //     for (let i = 0; i < 3; i++) {
        //         this.polyTextureEntries.push({
        //             count: buffer.readInt16LE(),
        //             textureIndex: buffer.readInt16LE()
        //         });
        //     }
        // }

        buffer.readOffset = dataStart + this.sizeByte;
    }
}

module.exports = F2C;
