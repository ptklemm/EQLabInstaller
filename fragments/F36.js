const PlainFragment = require('./PlainFragment.js');
const CONSTANTS = require('../constants/constants.js');

class F36 extends PlainFragment {
    constructor(baseData) {
        super(baseData);
        
        this.type = "Mesh";
        this.flags = undefined;
        this.multiMaterial = undefined;
        this.animatedVertices = undefined;
        this.fragment3 = undefined;
        this.fragment4 = undefined;

        this.x = null;
        this.y = null;
        this.z = null;
        this.rotation = [];
        this.maxDist = null;
        this.minX = null;
        this.minY = null;
        this.minZ = null;
        this.maxX = null;
        this.maxY = null;
        this.maxZ = null;

        this.vertexCount = undefined;
        this.uvCount = undefined;
        this.normalsCount = undefined;
        this.colorsCount = undefined;
        this.polyCount = undefined;
        this.vertPieceCount = undefined;
        this.polyMaterialCount = undefined;
        this.vertMaterialCount = undefined;
        this.size9 = undefined;
        this.scale = undefined;

        this.vertexEntries = [];
        this.uvEntries = [];
        this.normalEntries = [];
        this.colorEntries = [];
        this.polyEntries = [];
        this.vertPieceEntries = [];
        this.polyMaterialEntries = [];
        this.vertMaterialEntries = [];
        this.data9Entries = [];
    }
    
    load(buffer, wld) {
        const dataStart = buffer.readOffset;

        let ref;
        this.getName(buffer, wld);

        this.flags = buffer.readInt32LE();

        this.multiMaterial = wld.getFragmentByIndex(buffer.readInt32LE());

        ref = wld.getFragmentByIndex(buffer.readInt32LE());
        this.animatedVertices =  ref && ref.name;

        ref = wld.getFragmentByIndex(buffer.readInt32LE());
        this.fragment3 =  ref && ref.name;

        ref = wld.getFragmentByStringIndex(buffer.readInt32LE());
        this.fragment4 = ref && ref.name;

        this.x = buffer.readFloatLE();
        this.y = buffer.readFloatLE();
        this.z = buffer.readFloatLE();

        this.rotation[0] = buffer.readInt32LE();
        this.rotation[1] = buffer.readInt32LE();
        this.rotation[2] = buffer.readInt32LE();

        this.maxDist = buffer.readFloatLE();

        this.minX = buffer.readFloatLE();
        this.minY = buffer.readFloatLE();
        this.minZ = buffer.readFloatLE();       
        
        this.maxX = buffer.readFloatLE();
        this.maxY = buffer.readFloatLE();
        this.maxZ = buffer.readFloatLE();

        this.vertexCount = buffer.readInt16LE();
        this.uvCount = buffer.readInt16LE();
        this.normalsCount = buffer.readInt16LE();
        this.colorsCount = buffer.readInt16LE();
        this.polyCount = buffer.readInt16LE();
        this.vertPieceCount = buffer.readInt16LE();
        this.polyMaterialCount = buffer.readInt16LE();
        this.vertMaterialCount = buffer.readInt16LE();
        this.size9 = buffer.readInt16LE();
        this.scale = buffer.readInt16LE();

        // const vScale = 1.0 / (1 << this.scale);
        // const uvScale = 1.0 / 256.0;
        // const nScale = 1.0 / 127;

        // Vertices
        for (let i = 0; i < this.vertexCount; i++) {
            this.vertexEntries.push({
                x: buffer.readInt16LE(),
                y: buffer.readInt16LE(),
                z: buffer.readInt16LE()
            });
        }

        // uv Coords
        if (wld.header.version === CONSTANTS.WLD_VERSION_1) {
            for (let i = 0; i < this.uvCount; i++) {
                this.uvEntries.push({
                    u: buffer.readInt16LE(),
                    v: buffer.readInt16LE()
                });
            }
        } else {
            for (let i = 0; i < this.uvCount; i++) {
                this.uvEntries.push({
                    u: buffer.readInt32LE(),
                    v: buffer.readInt32LE()
                });
            }
        }

        // Vertex Normals
        for (let i = 0; i < this.normalsCount; i++) {
            this.normalEntries.push({
                i: buffer.readInt8(),
                j: buffer.readInt8(),
                k: buffer.readInt8()
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
                vertices: [
                    buffer.readInt16LE(),
                    buffer.readInt16LE(),
                    buffer.readInt16LE()
                ]
            });
        }

        // Vertex Pieces
        for (let i = 0; i < this.vertPieceCount; i++) {
            this.vertPieceEntries.push({
                count: buffer.readInt16LE(),
                index: buffer.readInt16LE()
            });
        }

        // Polygon Materials
        for (let i = 0; i < this.polyMaterialCount; i++) {
            this.polyMaterialEntries.push({
                count: buffer.readInt16LE(),
                materialIndex: buffer.readInt16LE()
            });
        }

        // Vertex Materials
        for (let i = 0; i < this.vertMaterialCount; i++) {
            this.vertMaterialEntries.push({
                count: buffer.readInt16LE(),
                materialIndex: buffer.readInt16LE()
            });
        }

        // Data9
        // Need more info here, skip for now
        // for (let i = 0; i < this.size9; i++) {
            // const type = buffer.readInt32LE();
            // let vertexIndex, offset;
            // if (type < 4) {
            //     vertexIndex = buffer.readInt32LE();
            // } else if (type === 4) {
            //     offset = buffer.readFloatLE();
            // }
            // const params = [
            //     buffer.readInt16LE(),
            //     buffer.readInt16LE()
            // ];
            // this.data6Entries.push({
            //     type,
            //     vertexIndex,
            //     offset,
            //     params
            // });
        // }

        buffer.readOffset = dataStart + this.sizeByte;
    }
}

module.exports = F36;
