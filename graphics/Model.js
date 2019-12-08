class Model {
    constructor(wld, f14) {
        this.name = f14.name;
        this.isAnimated = undefined;
        this.multiMaterial = undefined;
        this.meshes = [];

        if (this.name === "PLAYER_1") {
            this.multiMaterial = wld.fragments.f31[0].name; // Special case for zone models
        } else {
            const formattedModelName = this.name.slice(0, this.name.indexOf("_"));

            for (let i = 0, len = wld.fragments.f31.length; i < len; i++) {
                const f31 = wld.fragments.f31[i];
                const formattedMatName = f31.name.slice(0, f31.name.indexOf("_"));
    
                if (formattedMatName === formattedModelName) {
                    this.multiMaterial = f31.name;
                    break;
                }  
            }
        }
    }
}

module.exports = Model;