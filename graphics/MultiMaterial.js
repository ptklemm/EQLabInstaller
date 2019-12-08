const Material = require('./Material.js');

class MultiMaterial {
    constructor(f31) {
        this.name = f31.name;
        this.materials = [];

        for (let i = 0, len = f31.materials.length; i < len; i++) {
            const f30 = f31.materials[i];
            this.materials.push(new Material(f30));
        }
    }

    processTextureNames() {
        for (let i = 0, len = this.materials.length; i < len; i++) {
            const material = this.materials[i];
            const textures = material.textures;

            if (textures) {
                this.materials[i].textures = textures.map(texture => {
                    return texture.toLowerCase()
                                    .replace('.bmp', '.png')
                                    .replace('.dds', '.png')
                                    .replace('.jpg', '.png');
                });
            }
        }
    }
}

module.exports = MultiMaterial;