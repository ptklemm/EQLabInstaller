const Model = require('./Model.js');
const Mesh = require('./Mesh.js');

class StaticModel extends Model {
    constructor(wld, f14, f36s) {
        super(wld, f14);
        this.isAnimated = false;

        for (let i = 0, len = f36s.length; i < len; i++) {
            const f36 = f36s[i];
            this.meshes.push(new Mesh(f36));
        }
    }
}

module.exports = StaticModel;
