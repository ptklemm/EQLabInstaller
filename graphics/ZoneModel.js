const StaticModel = require('./StaticModel.js');

class ZoneModel extends StaticModel {
    constructor(wld, f15, f14, f36s) {
        super(wld, f14, f36s);

        this.rotX = f15.rotateX;
        this.rotY = f15.rotateY;
        this.rotZ = f15.rotateZ;
        this.sclX = f15.scaleX;
        this.sclY = f15.scaleY;
        this.sclZ = f15.scaleZ;
    }
}

module.exports = ZoneModel;
