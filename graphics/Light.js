class Light {
    constructor(f28) {
        const f1C = f28.ref;
        const f1B = f1C.ref;

        this.name = f1B.name;
        this.x = f28.x;
        this.y = f28.y;
        this.z = f28.z;
        this.radius = f28.radius;

        const hasColor = f1B.flags.hasColor || f1B.flags.hasColor2 ? true : false;
        this.hasColor = hasColor;

        if (hasColor) {
            this.color = f1B.color;
        }
    }
}

module.exports = Light;