class Material {
    constructor(f30) {
        let f05 = f30.ref ? f30.ref : undefined;
        let f04 = f05 && f05.ref ? f05.ref : undefined;
        let f03s = f04 && f04.refs.length ? f04.refs : undefined;

        this.name = f30.name;
        this.isNull = f05 && f04 && f03s ? false : true;
        this.isInvisible = f30.visibility.invisible;
        this.isMasked = f30.visibility.masked;
        this.isParticle = f30.visibility.particle;
        this.isTransparent = f30.visibility.transparent;

        if (!this.isNull) {
            if (f04.isAnimated === true) {
                this.isAnimated = true;
                this.animDelay = f04.milliseconds;
            } else {
                this.isAnimated = false;
            }

            this.textures = [];

            for (let i = 0; i < f03s.length; i++) {
                const f03 = f03s[i];
    
                for (let j = 0; j < f03.entries.length; j++) {
                    this.textures.push(f03.entries[j]);
                }
            }
        }
    }
}

module.exports = Material;
