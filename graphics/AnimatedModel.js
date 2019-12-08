const Model = require('./Model.js');
const Mesh = require('./Mesh.js');

class Frame {
    constructor(data) {
        this.rotX = data.rotateX;
        this.rotY = data.rotateY;
        this.rotZ = data.rotateZ;
        this.rotW = data.rotate;

        this.traX = data.shiftX;
        this.traY = data.shiftY;
        this.traZ = data.shiftZ;
        this.traW = data.shift;
    }
}

class Bone {
    constructor(data, boneArray) {
        this.name = data.name;
        this.mesh = null;
        this.frames = [];
        this.children = [];

        if (data.meshRef) {
            if (data.meshRef.fragType === 0x2D) {
                const f36 = data.meshRef.ref;
                if (f36 && f36.fragType === 0x36) { // Skip alternate meshes for now
                    this.mesh = new Mesh(f36);
                }
            } else if (data.meshRef.fragType === 0x34) {
                // MeshRef can also be a f34 Particle Emitter, skip these for now
            }
        }
        
        if (data.animationRef) {
            const f12 = data.animationRef.ref;
            
            for (let i = 0, len = f12.frames.length; i < len; i++) {
                const frameData = f12.frames[i];
                this.frames.push(new Frame(frameData));
            }
        }

        for (let i = 0, len = data.children.length; i < len; i++) {
            const childIndex = data.children[i];
            this.children.push(new Bone(boneArray[childIndex], boneArray));
        }
    }
}

class Skeleton {
    constructor(f10) {
        this.name = f10.name;
        this.rootBone = null;

        const boneArray = f10.bones;
        // Create bone hierarchy
        if (boneArray.length) {
            const rootBone = boneArray[0]; // Not sure if root bone is always index 0
            this.rootBone = new Bone(rootBone, boneArray);
        }
    }
}

class AnimatedModel extends Model {
    constructor(wld, f14, f10) {
        super(wld, f14);
        this.isAnimated = true;
        this.skeleton = new Skeleton(f10);

        if (f10.meshes.length) {
            for (let i = 0, len = f10.meshes.length; i < len; i++) {
                const f2D = f10.meshes[i];
                if (f2D.fragType !== 0x2D) { continue; } // Not sure if this can be anything other than an f2D but check anyway

                const f36 = f2D.ref;
                if (!f36) { continue; }
                if (f36.fragType !== 0x36) { continue; } // Alternate mesh, skip for now

                this.meshes.push(new Mesh(f36));
            }
        }
    }
}

module.exports = AnimatedModel;