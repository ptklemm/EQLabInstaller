class ObjectPlacement {
    constructor(f15) {
        this.model = f15.ref;

        this.x = f15.x;
        this.y = f15.z;
        this.z = f15.y;

        this.rotX = f15.rotateX;
        this.rotY = f15.rotateY;
        this.rotZ = f15.rotateZ;

        this.sclX = f15.scaleX;
        this.sclY = f15.scaleY;
        this.sclZ = f15.scaleZ;
    }
}

module.exports = ObjectPlacement;