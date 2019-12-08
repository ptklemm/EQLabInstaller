class Vertex {
    constructor(x, y, z, i, j, k, u, v) {
        this.x = x;
        this.y = y;
        this.z = z;

        this.i = i;
        this.j = j;
        this.k = k;

        this.u = u;
        this.v = v;
    }
}

class SubMesh {
    constructor(count, materialIndex) {
        this.c = count;
        this.m = materialIndex;
    }
}

class Mesh {
    constructor(f36) {
        //this.n = f36.name;
        //this.m = f36.multiMaterial.name;
        this.x = f36.x;
        this.y = f36.y;
        this.z = f36.z;
        this.s = f36.scale;
        this.v = [];
        this.p = [];
        this.sM = [];

        for (let i = 0, len = f36.vertexEntries.length; i < len; i++) {
            const vertex = f36.vertexEntries[i];
            const normal = f36.normalEntries[i];
            const uv = f36.uvEntries[i];
            
            this.v.push(new Vertex(
                vertex.x,
                vertex.y,
                vertex.z,
                normal.i,
                normal.j,
                normal.k,
                uv ? uv.u : 0,
                uv ? uv.v : 0
            ));
        }

        for (let i = 0, len = f36.polyEntries.length; i < len; i++) {
            this.p.push(f36.polyEntries[i].vertices);
        }

        if (!f36.polyMaterialEntries) {
            console.log(f36)
        }

        for (let i = 0, len = f36.polyMaterialEntries.length; i < len; i++) {
            const entry = f36.polyMaterialEntries[i];
            this.sM.push(new SubMesh(entry.count, entry.materialIndex));
        }
    }
}

module.exports = Mesh;
