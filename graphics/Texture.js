class Texture {
    constructor(filename, size, data, isMasked, isParticle) {
        this.filename = filename;
        this.size = size;
        this.data = data;
        this.isMasked = isMasked;
        this.isParticle = isParticle;
    }
}

module.exports = Texture;