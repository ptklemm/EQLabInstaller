const AnimatedModel = require('./AnimatedModel.js');
const StaticModel = require('./StaticModel.js');
const MultiMaterial = require('./MultiMaterial.js');
const _ = require('lodash');

class AnimatedCharacterModel extends AnimatedModel {
    constructor(wld, f14, f10) {
        super(wld, f14, f10);

        this.name = this.name.slice(0, this.name.indexOf("_")).toLowerCase();

        const f31 = _.find(wld.fragments.f31, { name: this.multiMaterial });
        if (f31) { this.multiMaterial = new MultiMaterial(f31); }
    }
}

class StaticCharacterModel extends StaticModel {
    constructor(wld, f14, f36s) {
        super(wld, f14, f36s);

        this.name = this.name.slice(0, this.name.indexOf("_")).toLowerCase();

        const f31 = _.find(wld.fragments.f31, { name: this.multiMaterial });
        if (f31) { this.multiMaterial = new MultiMaterial(f31); }
    }
}

module.exports = {
    AnimatedCharacterModel,
    StaticCharacterModel
}