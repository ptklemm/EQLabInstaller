const MultiMaterial = require('./MultiMaterial.js');
const StaticModel = require('./StaticModel.js');
const AnimatedModel = require('./AnimatedModel.js');
const ZoneModel = require('./ZoneModel.js');
const AnimatedCharacterModel = require('./CharacterModels.js').AnimatedCharacterModel;
const StaticCharacterModel = require('./CharacterModels.js').StaticCharacterModel;
const ObjectPlacement = require('./ObjectPlacement.js');
const Light = require('./Light.js');



class GraphicsFactory {
    constructor(logger, zone) {
        this.logger = logger;
        this.zone = zone;
    }

    buildMultiMaterials(wld) {
        const multiMaterials = [];

        for (let i = 0, len = wld.fragments.f31.length; i < len; i++) {
            const f31 = wld.fragments.f31[i];
            multiMaterials.push(new MultiMaterial(f31));
        }

        return multiMaterials;
    }

    buildZoneModel(wld) {
        // f15 -> f14 -> f09 -> f08
        // Model auto-created from all f36s
        const f15 = wld.fragments.f15[0];
        const f14 = f15.ref;
        const f36s = wld.fragments.f36;

        return new ZoneModel(wld, f15, f14, f36s);
    }

    buildObjectPlacements(wld) {
        // f15
        const objectPlacements = [];

        for (let i = 0; i < wld.fragments.f15.length; i++) {
            const f15 = wld.fragments.f15[i];
            const objectPlacement = new ObjectPlacement(f15);
            objectPlacements.push(objectPlacement);
        }

        return objectPlacements;
    }

    buildLights(wld) {
        // f28 -> f1C -> f1B
        const lights = [];
        
        for (let i = 0; i < wld.fragments.f28.length; i++) {
            const f28 = wld.fragments.f28[i];
            const f1C = f28.ref;
            if (!f1C) { continue; }
            const f1B = f1C.ref;
            if (!f1B) { continue; }

            const light = new Light(f28);
            lights.push(light);
        }

        return lights;
    }

    buildObjectModels(wld) {
        // Static: f14 -> f2D -> f36
        // Animated: f14 -> f11 -> f10
        const objectModels = [];

        for (let i = 0, len = wld.fragments.f14.length; i < len; i++) {

            const f14 = wld.fragments.f14[i];
            const modelRefs = f14.fragment3;
            if (!modelRefs.length) {
                this.logger.info(`${this.zone}/${wld.filename}: Object model has no references @${i}`);
                continue;
            } else if (modelRefs.length > 1) {
                this.logger.info(`${this.zone}/${wld.filename}: Object model has multiple references (count: ${modelRefs.length}) @${i}`);
            }

            const modelRef = modelRefs[0];

            let objectModel;

            if (modelRef.fragType === 0x2D) {

                const f36s = [modelRef.ref];
                objectModel = new StaticModel(wld, f14, f36s);
                
            } else if (modelRef.fragType === 0x11) {

                const f10 = modelRef.ref;

                if (!f10) {
                    this.logger.info(`${zone}/${wld.filename}: Animated object model has no skeleton @${i}`);
                    continue;
                }

                objectModel = new AnimatedModel(wld, f14, f10);
            }

            objectModels.push(objectModel);
        }

        return objectModels;
    }

    buildCharacterModels(wld) {
        // Static: f14 -> f2D -> f36
        // Animated: f14 -> f11 -> f10
        const characterModels = [];

        for (let i = 0, len = wld.fragments.f14.length; i < len; i++) {

            const f14 = wld.fragments.f14[i];
            const modelRefs = f14.fragment3;
            if (!modelRefs.length) {
                this.logger.info(`${this.zone}/${wld.filename}: Character model has no references @${i}`);
                continue;
            } else if (modelRefs.length > 1) {
                this.logger.info(`${this.zone}/${wld.filename}: Character model has multiple references (count: ${modelRefs.length}) @${i}`);
            }

            const modelRef = modelRefs[0];

            let characterModel;

            if (modelRef.fragType === 0x2D) {

                const f36s = [modelRef.ref];
                characterModel = new StaticCharacterModel(wld, f14, f36s);
                
            } else if (modelRef.fragType === 0x11) {

                const f10 = modelRef.ref;

                if (!f10) {
                    this.logger.info(`${zone}/${wld.filename}: Animated character model has no skeleton @${i}`);
                    continue;
                }

                characterModel = new AnimatedCharacterModel(wld, f14, f10);
            }

            characterModels.push(characterModel);
        }

        return characterModels;
    }
}

module.exports = GraphicsFactory;