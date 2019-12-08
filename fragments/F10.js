const PlainFragment = require('./PlainFragment.js');

class F10 extends PlainFragment {
    constructor(baseData) {
        super(baseData);
        
        this.type = "Skeleton";
        this.flags = {
            bit0: undefined,
            bit1: undefined,
            bit9: undefined
        }
        this.numBones = undefined;
        this.fragment1 = undefined;
        this.params1 = undefined;
        this.params2 = undefined;
        this.bones = [];
        this.numMeshes = undefined;
        this.meshes = [];
        this.data3 = [];
    }
    
    load(buffer, wld) {
        this.getName(buffer, wld);
        const flags = buffer.readInt32LE();
        this.flags.bit0 = flags & 1 ? 1 : 0;
        this.flags.bit1 = flags & 2 ? 1 : 0;
        this.flags.bit9 = flags & 512 ? 1 : 0;

        this.numBones = buffer.readInt32LE();
        this.fragment1 = wld.getFragmentByIndex(buffer.readInt32LE());

        if (this.flags.bit0 === 1) {
            this.params1 = {
                0: buffer.readInt32LE(),
                1: buffer.readInt32LE(),
                2: buffer.readInt32LE()
            }
        }

        if (this.flags.bit1 === 1) { this.params2 = buffer.readFloatLE(); }

        for (let i = 0; i < this.numBones; i++) {
            const bone = {
                name: wld.getFragmentByStringIndex(buffer.readInt32LE()),
                flags: buffer.readInt32LE(),
                animationRef: wld.getFragmentByIndex(buffer.readInt32LE()),
                meshRef: wld.getFragmentByIndex(buffer.readInt32LE()),
                numChildren: buffer.readInt32LE(),
                children: []
            }

            for (let j = 0; j < bone.numChildren; j++) {
                bone.children.push(buffer.readInt32LE());
            }

            this.bones.push(bone);
        }

        if (this.flags.bit9 === 1) {
            this.numMeshes = buffer.readInt32LE();

            for (let i = 0; i < this.numMeshes; i++) {
                this.meshes.push(wld.getFragmentByIndex(buffer.readInt32LE()));
            }

            for (let i = 0; i < this.numMeshes; i++) {
                this.data3.push(buffer.readInt32LE());
            }
        }
    }
}

module.exports = F10;
