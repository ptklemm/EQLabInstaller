const CONFIG = require('./config.json');
const fs = require('fs-extra');
const EFF = require('./decoders/EFF.js');
const PFS = require('./decoders/PFS.js');
const WLD = require('./decoders/WLD.js');
const GraphicsFactory = require('./graphics/GraphicsFactory.js');
const AnimatedModel = require('./graphics/AnimatedModel.js');
const BMP = require('./decoders/BMP.js');
const Jimp = require('jimp');
const winston = require('winston');

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.simple(),
        winston.format.align(),
        winston.format.timestamp()
    ),
    transports: [
        new winston.transports.File({
            filename: 'eqlab-installer.log',
            maxsize: 1 * 1024 * 1024,
            maxFiles: 1
        })
    ],
    exitOnError: true,
    silent: false
});

const INPUT_DIR = "X:\\EQCLIENT";
const OUTPUT_DIR = '.\\test';
const zone = 'airplane';

(async () => {

    const s3d = await new PFS(INPUT_DIR, `${zone}.s3d`).load();

    // const wldData = s3d.getEntryByName(`${zone}_chr.wld`).data;
    // const wld = new WLD(`${zone}_chr.wld`, CONFIG.WLD).load(wldData);

    // const graphicsFactory = new GraphicsFactory(logger, zone);

    // let characterModels = graphicsFactory.buildCharacterModels(wld);
    // console.log(characterModels)

})();