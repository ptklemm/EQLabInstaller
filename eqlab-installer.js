const os = require('os');
const fs = require('fs-extra');
const winston = require('winston');
const inquirer = require('inquirer');
const path = require('path');
const ProgressBar = require('progress');
const mysql = require('mysql2/promise');
const archiver = require('archiver');
const decodeDXT = require('decode-dxt');
const Jimp = require('jimp');
const _ = require('lodash');
const Lame = require("node-lame").Lame;
const CONFIG = require('./config.json');
const CONSTANTS = require('./constants/constants.js');
const PFS = require('./decoders/PFS.js');
const WLD = require('./decoders/WLD.js');
const DDS = require('./decoders/DDS.js');
const BMP = require('./decoders/BMP.js');
const EFF = require('./decoders/EFF.js');
const GraphicsFactory = require('./graphics/GraphicsFactory.js');
const Texture = require('./graphics/Texture.js');

const ZONELIST_PATH = path.resolve(".\\zones.txt");
const GLOBALLIST_PATH = path.resolve(".\\global_s3ds.txt");
const INPUT_DIR = path.resolve(CONFIG.inputDir);
const OUTPUT_DIR = path.resolve(CONFIG.outputDir);
const GRAPHICS_DIR = `${OUTPUT_DIR}\\graphics`;
const CHARACTER_GRAPHICS_DIR = `${GRAPHICS_DIR}\\characters`;
const SOUNDS_DIR = `${OUTPUT_DIR}\\sounds`;

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

async function getZoneList(method, expansions) {
    let zoneList = [];

    if (method === 'database-all' || method === 'database-expansions') {

        const connection = await mysql.createConnection({
            host: CONFIG.database.host,
            port: CONFIG.database.port,
            user: CONFIG.database.user,
            password: CONFIG.database.password,
            database: CONFIG.database.database
        });

        let query;
        if (method === 'database-all') {
            query = `SELECT short_name FROM zone`;
        } else if (method === 'database-expansions') {
            query = `SELECT short_name FROM zone WHERE zone.expansion = ${expansions[0]}`;

            for (let i = 1; i < expansions.length; i++) {
                query += ` OR zone.expansion = ${expansions[i]}`;
            }
        }

        const [rows, fields] = await connection.execute(query);
        
        connection.destroy();
    
        for (let i = 0; i < rows.length; i++) {
            zoneList.push(rows[i].short_name);
        }

    } else if (method === 'text') {

        const file = await fs.readFile(ZONELIST_PATH, 'utf8');
        const array = file.toString().toLowerCase().split(os.EOL);

        if (array.length) {
            zoneList = array;
        } else {
            console.error(`Zone List is Empty: Check ${ZONELIST_PATH}`);
            process.exit(1);
        }
    }

    return zoneList;
}

async function getGlobalList(method) {
    let globalList;

    if (method === 'read-directory') {

        const filelist = await fs.readdir(INPUT_DIR);
        globalList = filelist.filter(filename => filename.endsWith('.s3d')).filter(filename => filename.includes('global'));

    } else if (method === 'text') {

        const file = await fs.readFile(GLOBALLIST_PATH, 'utf8');
        const array = file.toString().toLowerCase().split(os.EOL);

        if (array.length) {
            globalList = _.uniq(globalList);
            globalList = array;
        } else {
            console.error(`Global S3D List is Empty: Check ${GLOBALLIST_PATH}`);
            process.exit(1);
        }
    }
    
    return globalList;
}

async function processTextures(materials, textures, processUnusedTextures) {

    // Create Used Textures, used textures may be masked
    const usedTextures = [];
    for (let i = 0; i < materials.length; i++) {
        const material = materials[i];
        const isMasked = material.isMasked;
        const isParticle = material.isParticle;
        const matTextures = material.textures;
        
        if (matTextures) {
            for (let j = 0; j < matTextures.length; j++) {
                const textureName = matTextures[j].toLowerCase();
                const texture = _.find(textures, { 'filename': textureName });

                const formattedTextureName = texture.filename
                                                .toLowerCase()
                                                .replace('.bmp', '.png')
                                                .replace('.dds', '.png')
                                                .replace('.jpg', '.png');

                usedTextures.push(new Texture(
                    formattedTextureName,
                    texture.inflatedSize,
                    texture.data,
                    isMasked,
                    isParticle
                ));
            }
        }
    }

    // Create Unused Textures, masking is unknown
    const unusedTextures = [];
    for (let i = 0; i < textures.length; i++) {
        const texture = textures[i];
        const formattedTextureName = texture.filename
                                        .toLowerCase()
                                        .replace('.bmp', '.png')
                                        .replace('.dds', '.png')
                                        .replace('.jpg', '.png');
        const isUsed = _.some(usedTextures, { filename: formattedTextureName });

        if (!isUsed) {
            unusedTextures.push(new Texture(
                formattedTextureName,
                texture.inflatedSize,
                texture.data,
                false,
                false
            ));
        }
    }

    let combinedTextures;
    if (processUnusedTextures === true) {
        combinedTextures = usedTextures.concat(unusedTextures);
    } else {
        combinedTextures = usedTextures;
    }

    const textureBuffers = [];
    for (let i = 0; i < combinedTextures.length; i++) {
        const texture = combinedTextures[i];
        const textureBuffer = await processTexture(texture.data, texture.isMasked, texture.isParticle);
        if (!textureBuffer) { continue; }
        textureBuffers.push({ filename: texture.filename, buffer: textureBuffer });
    }

    return textureBuffers;
}

async function processTexture(data, isMasked, isParticle) {
    const fileType = getTextureFileType(data);
    
    let image;
    if (fileType === 'DDS') {
        image = await processDDS(data);
    } else if (fileType === 'BMP') {
        image = await processBMP(data, isMasked, isParticle);
    } else if (fileType === 'JPG' || fileType === 'PNG') {
        image = await Jimp.read(data);
    } else {
        return;
    }

    return await image.getBufferAsync(Jimp.MIME_PNG);
}

async function processDDS(data) {
    const dds = new DDS().load(data);

    const imgData = dds.images[0];
    const width = imgData.width;
    const height = imgData.height;

    const imgDataView = new DataView(data.buffer, imgData.offset, imgData.length);
    const uIntArray = decodeDXT(imgDataView, width, height, dds.format);
    const imgBuffer = Buffer.from(uIntArray);

    const image = await new Jimp({ data: imgBuffer, width, height });
    image.flip(false, true);

    return image;
}

async function processBMP(data, isMasked, isParticle) {

   const image = await Jimp.read(data);

   if (isMasked) {
        const mask = Jimp.intToRGBA(image.getPixelColor(image.bitmap.width, image.bitmap.height)); // get last pixel

        image.scan(0, 0, image.bitmap.width, image.bitmap.height, (x, y, idx) => {
            const r = image.bitmap.data[idx + 0];
            const g = image.bitmap.data[idx + 1];
            const b = image.bitmap.data[idx + 2];

            if (r === mask.r && g === mask.g && b === mask.b) {
                image.bitmap.data[idx + 3] = 0; // Alpha
            }
        });
   }

   return image;
}

function getTextureFileType(data) {
    let fileType;

    const dds_png_Buffer = Buffer.from(data).slice(0, 4).readInt32LE();
    const bmp_jpg_Buffer = Buffer.from(data).slice(0, 2).readInt16LE();

    if (dds_png_Buffer === CONSTANTS.DDS_SIGNATURE) {
        fileType = 'DDS';
    } else if (dds_png_Buffer === CONSTANTS.PNG_SIGNATURE) {
        fileType = 'PNG';
    } else if (bmp_jpg_Buffer === CONSTANTS.BMP_SIGNATURE) {
        fileType = 'BMP';
    } else if (bmp_jpg_Buffer === CONSTANTS.JPG_SIGNATURE) {
        fileType = 'JPG';
    } else {
        return;
    }

    return fileType;
}

async function exportZoneGraphics(zone, zoneModel, zoneModelTextures, objectPlacements,
    lights, objectModels, objectModelTextures, zoneModelMultiMaterials, objectModelMultiMaterials) {

    /*------------- TEXTURES --------------------------------------*/

    const zoneModelMaterials = zoneModelMultiMaterials[0].materials; // Zone Models only have 1 multimaterial

    zoneModelMaterials.forEach(mat => {
        if (mat.textures) {
            mat.textures.forEach(texName => {
                let foundTexture = _.find(zoneModelTextures, { 'filename': texName.toLowerCase() });
                if (!foundTexture) {
                    // Check object model textures
                    foundTexture = _.find(objectModelTextures, { 'filename': texName.toLowerCase() });
                    if (foundTexture) { zoneModelTextures.push(foundTexture); }
                }
            });
        }
    });

    objectModelMultiMaterials = _.uniqBy(objectModelMultiMaterials, 'name'); // Just in case any are repeated

    let objectModelMaterials = [];
    for (let i = 0, len = objectModelMultiMaterials.length; i < len; i++) {
        const mmat = objectModelMultiMaterials[i];
        objectModelMaterials = objectModelMaterials.concat(mmat.materials);
    }

    objectModelMaterials = _.uniqBy(objectModelMaterials, 'name'); // Just in case any are repeated
    
    // Process texture buffers before texture names
    const zoneTextureBuffers = await processTextures(zoneModelMaterials, zoneModelTextures, false);
    const objectTextureBuffers = await processTextures(objectModelMaterials, objectModelTextures, false);

    for (let i = 0, len = zoneModelMultiMaterials.length; i < len; i++) {
        zoneModelMultiMaterials[i].processTextureNames();
    }

    for (let i = 0, len = objectModelMultiMaterials.length; i < len; i++) {
        objectModelMultiMaterials[i].processTextureNames();
    }

    /*------------- GRAPHICS --------------------------------------*/

    let zoneGraphics = {
        zoneModelMultiMaterials,
        zoneModel,
        lights,
        objectModelMultiMaterials,
        objectModels,
        objectPlacements
    }

    const zoneGraphicsBuffer = Buffer.from(JSON.stringify(zoneGraphics));

    /*------------- ZONE.ZIP --------------------------------------*/

    const zoneZip = fs.createWriteStream(`${GRAPHICS_DIR}\\${zone}.zip`);
    const zoneArchive = archiver('zip', {
        zlib: { level: 9 }
    });
    
    zoneArchive.pipe(zoneZip);
    
    zoneArchive.append(zoneGraphicsBuffer, { name: `${zone}.json` });

    for (let i = 0, len = zoneTextureBuffers.length; i < len; i++) {
        const texture = zoneTextureBuffers[i];
        zoneArchive.append(texture.buffer, { name: texture.filename, prefix: 'zone_textures' });
    }

    for (let i = 0, len = objectTextureBuffers.length; i < len; i++) {
        const texture = objectTextureBuffers[i];
        zoneArchive.append(texture.buffer, { name: texture.filename, prefix: 'object_textures' });
    }
    
    zoneArchive.finalize();
}

async function createCharacterList(name, dir, modelNames) {
    const filename = `${name}_chr.json`;
    const path = `${dir}\\${filename}`;
    const fileExists = await fs.pathExists(path);

    modelNames = modelNames.map(name => { return name.slice(0, name.indexOf("_")).toLowerCase(); });

    let fileData;
    if (fileExists) {
        const existingData = await fs.readJSON(path);
        const combinedData = existingData.concat(modelNames);
        const uniqueData = _.uniq(combinedData);
        
        fileData = uniqueData;
    } else {
        fileData = modelNames;
    }
    
    if (fileData) {
        await fs.writeJSON(path, fileData);
    }
}

async function exportGlobalCharacterModels(models, textures) {

    /*------------- TEXTURES --------------------------------------*/

    let materials = [];
    for (let i = 0, len = models.length; i < len; i++) {
        materials = materials.concat(models[i].multiMaterial.materials);
    }

    // Only process unique materials
    materials = _.uniqBy(materials, 'name');

    // Process texture buffers before texture names
    const textureBuffers = await processTextures(materials, textures, false);

    for (let i = 0, len = models.length; i < len; i++) {
        models[i].multiMaterial.processTextureNames();
    }

    /*------------- GRAPHICS --------------------------------------*/

    const modelGraphicsBuffer = Buffer.from(JSON.stringify(models));

    /*------------- GLOBAL.ZIP --------------------------------------*/

    const globalChrZip = fs.createWriteStream(`${CHARACTER_GRAPHICS_DIR}\\global_chr.zip`);
    const globalChrArchive = archiver('zip', {
        zlib: { level: 9 }
    });

    globalChrArchive.pipe(globalChrZip);

    globalChrArchive.append(modelGraphicsBuffer, { name: 'global_chr.json' });

    for (let i = 0, len = textureBuffers.length; i < len; i++) {
        const texture = textureBuffers[i];
        globalChrArchive.append(texture.buffer, { name: texture.filename });
    }

    globalChrArchive.finalize();
}

async function processZone(zone) {

// ZONE.S3D
    const zoneS3D = await new PFS(INPUT_DIR, `${zone}.s3d`).load();

    // zone.wld - Zone Model
    const zoneWLDData = zoneS3D.getEntryByName(`${zone}.wld`).data;
    const zoneWLD = new WLD(`${zone}.wld`, CONFIG.WLD).load(zoneWLDData);
    
    // objects.wld - Object Placements
    const objectsWLDData = zoneS3D.getEntryByName(`objects.wld`).data;
    const objectsWLD = new WLD(`objects.wld`, CONFIG.WLD).load(objectsWLDData);

    // lights.wld - Light Placements
    let lightsWLDData = zoneS3D.getEntryByName(`lights.wld`);
    let lightsWLD;
    // Some zones don't have lights.wld (kerraridge)
    if (lightsWLDData) {
        lightsWLDData = lightsWLDData.data;
        lightsWLD = new WLD(`lights.wld`, CONFIG.WLD).load(lightsWLDData);
    }

    // Zone Model Textures
    const zoneModelTextures = zoneS3D.getTextures();

// ZONE_OBJ.S3D
    const zone_objS3D = await new PFS(INPUT_DIR, `${zone}_obj.s3d`).load();

    // Check for any _2_obj files
    const zone_2_objS3DExists = await fs.pathExists(`${INPUT_DIR}\\${zone}_2_obj.s3d`);
    let zone_2_objS3D;
    if (zone_2_objS3DExists) {
        zone_2_objS3D = await new PFS(INPUT_DIR, `${zone}_2_obj.s3d`).load();
    }

    // zone_obj.wld - Object Models
    const zone_objWLDData = zone_objS3D.getEntryByName(`${zone}_obj.wld`).data;
    const zone_objWLD = new WLD(`${zone}_obj.wld`, CONFIG.WLD).load(zone_objWLDData);
    
    // Object Model Textures
    let objectModelTextures = zone_objS3D.getTextures();

    // zone_2_obj.wld - Object Models 2
    let zone_2_objWLDData, zone_2_objWLD, objectModelTextures2;
    if (zone_2_objS3D) {
        zone_2_objWLDData = zone_2_objS3D.getEntryByName(`${zone}_2_obj.wld`).data;
        zone_2_objWLD = new WLD(`${zone}_2_obj.wld`, CONFIG.WLD).load(zone_2_objWLDData);

        // Object Model 2 Textures
        objectModelTextures = objectModelTextures.concat(zone_2_objS3D.getTextures());
    }
    
// ZONE_CHR.S3D
    // Some zones don't have _chr.s3d files (veksar)
    const zone_chrS3DExists = await fs.pathExists(`${INPUT_DIR}\\${zone}_chr.s3d`);
    let zone_chrS3D, zone_chrWLDData, zone_chrWLD, characterModelTextures;

    if (zone_chrS3DExists) {
        zone_chrS3D = await new PFS(INPUT_DIR, `${zone}_chr.s3d`).load();
        // Check for any _chr2 files

        // zone_chr.wld - Zone Character Models
        zone_chrWLDData = zone_chrS3D.getEntryByName(`${zone}_chr.wld`).data;
        zone_chrWLD = new WLD(`${zone}_chr.wld`, CONFIG.WLD).load(zone_chrWLDData);

        // Zone Character Model Textures
        characterModelTextures = zone_chrS3D.getTextures();
    }

// ZONE_SOUNDS.EFF
    // TO DO

// Create Graphics
    const graphicsFactory = new GraphicsFactory(logger, zone);

    // Create Zone Model
    const zoneModel = graphicsFactory.buildZoneModel(zoneWLD);
    const zoneModelMultiMaterials = graphicsFactory.buildMultiMaterials(zoneWLD);
    
    // Create Object Placements
    const objectPlacements = graphicsFactory.buildObjectPlacements(objectsWLD);
    
    // Create Lights
    let lights = [];
    if (lightsWLD) {
        lights = graphicsFactory.buildLights(lightsWLD);
    }
    
    // Create Object Models
    let objectModels = graphicsFactory.buildObjectModels(zone_objWLD);
    let objectModelMultiMaterials = graphicsFactory.buildMultiMaterials(zone_objWLD);

    if (zone_2_objWLD) {
        objectModels = objectModels.concat(graphicsFactory.buildObjectModels(zone_2_objWLD));
        objectModelMultiMaterials = objectModelMultiMaterials.concat(graphicsFactory.buildMultiMaterials(zone_2_objWLD));
    }

//     // Create Zone Character Models
//     let characterModels;
//     if (zone_chrS3DExists) {
//         characterModels = graphicsFactory.buildCharacterModels(zone_chrWLD);
//     }

// Export
    try {
        await exportZoneGraphics(zone, zoneModel, zoneModelTextures, objectPlacements,
            lights, objectModels, objectModelTextures, zoneModelMultiMaterials, objectModelMultiMaterials);

    } catch (error) {
        console.error(`${zone}: Error while exporting zone graphics\n` + error);
    }
   
    // // Export Character Models
    // if (characterModels) {
    //     const modelNames = [];
    //     for (let i = 0; i < characterModels.length; i++) {
    //         const model = characterModels[i];
    //         modelNames.push(model.name);
    //     }

    //     try {
    //         await exportCharacterModels(characterModels, characterModelTextures);
    //         await createCharacterList(zone, ZONE_DIR, modelNames);
    //     } catch (error) {
    //         console.error(`${zone}: Error while exporting zone character models\n` + error);
    //     }
    // }
}

async function processZones(zoneList, bar) {
    for (let i = 0; i < zoneList.length; i++) {
        const zone = zoneList[i];
        bar.tick({ 'file': zone });
        await processZone(zone);
    }
}

async function processGlobalChrS3D(filename) {
    const shortName = filename.replace("_chr.s3d", "");

    const chrS3D = await new PFS(INPUT_DIR, `${shortName}_chr.s3d`).load();
    const chrWLDData = chrS3D.getEntryByName(`${shortName}_chr.wld`).data;
    const chrWLD = new WLD(`${shortName}_chr.wld`, CONFIG.WLD).load(chrWLDData);

    const characterModelTextures = chrS3D.getTextures();

    const graphicsFactory = new GraphicsFactory(logger, filename);
    const characterModels = graphicsFactory.buildCharacterModels(chrWLD);
    //console.log(characterModels);

    return {
        characterModels,
        characterModelTextures
    }
}

async function processGlobalChrS3Ds(globalChrList, bar) {
    let globalCharacterModels = [];
    let globalCharacterTextures = [];

    for (let i = 0; i < globalChrList.length; i++) {
        const filename = globalChrList[i];
        bar.tick({ 'file': filename });
        const results = await processGlobalChrS3D(filename);

        globalCharacterModels = globalCharacterModels.concat(results.characterModels);
        globalCharacterTextures = globalCharacterTextures.concat(results.characterModelTextures);
    }

    try {
        await exportGlobalCharacterModels(globalCharacterModels, globalCharacterTextures);
    } catch (error) {
        console.error(`${filename}: Error while exporting global character models\n` + error);
    }
}

async function exportBmpWads() {
    let filelist = await fs.readdir(INPUT_DIR);
    filelist =  filelist.filter(filename => filename.endsWith('.s3d')).filter(filename => filename.includes('bmpwad'));

    if (filelist.length) {
        await fs.ensureDir(`${OUTPUT_DIR}\\UI`, { recursive: false });
    }
    
    for (let i = 0; i < filelist.length; i++) {
        const filename = filelist[i];

        const bmpwadPFS = new PFS(INPUT_DIR, filename);
        await bmpwadPFS.load();
        
        for (let j = 0; j < bmpwadPFS.files.length; j++) {
            const file = bmpwadPFS.files[j];
            await fs.writeFile(`${OUTPUT_DIR}\\UI\\${file.filename}`, file.data);
        }
    }
}

async function exportSky() {
    const path = `${INPUT_DIR}\\sky.s3d`;
    const skyS3dExists = await fs.pathExists(path);

    if (skyS3dExists) {
        await fs.ensureDir(`${GRAPHICS_DIR}\\_sky`, { recursive: false });

        const skyPFS = new PFS(INPUT_DIR, 'sky.s3d');
        await skyPFS.load();
        
        for (let j = 0; j < skyPFS.files.length; j++) {
            const file = skyPFS.files[j];
            await fs.writeFile(`${GRAPHICS_DIR}\\_sky\\${file.filename}`, file.data);
        }
    }
}

(async () => {
    console.log('EQLab Installer');

    // const answers1 = await inquirer.prompt([{
    //     type: 'confirm',
    //     name: 'proceed',
    //     message: "Warning: Running the EQLab Installer will overwrite any existing files in the files directory. Continue?",
    //     default: false
    // }]);

    // if (!answers1.proceed) { process.exit(0); }

    // const answers2 = await inquirer.prompt([{
    //     type: 'list',
    //     name: 'zonelist',
    //     message: "Zone List:",
    //     choices: [
    //         { name: 'Load All from Database', value: 'database-all' },
    //         { name: 'Load Expansions from Database', value: 'database-expansions' },
    //         { name: 'Load from zones.txt', value: 'text' },
    //         { name: 'None', value: 'none' }
    //     ]
    // }]);

    const answers2 = { zonelist: 'none' }

    let expansions;
    if (answers2.zonelist === 'database-expansions') {
        const answers3 = await inquirer.prompt([{
            type: 'checkbox',
            name: 'expansions',
            message: "Expansions:",
            choices: CONSTANTS.EXPANSIONS
        }]);

        expansions = answers3.expansions;

        if (!expansions.length) {
            console.error(`You must select at least one expansion.`);
            process.exit(1);
        }
    }

    // const answers4 = await inquirer.prompt([{
    //     type: 'list',
    //     name: 'globalchrlist',
    //     message: "Global Characters S3D List:",
    //     choices: [
    //         { name: 'Load from global_s3ds.txt', value: 'text' },
    //         { name: 'None', value: 'none' },
    //         { name: 'Load All from EQ Directory', value: 'read-directory', disabled: true }
    //     ]
    // }]);

    const answers4 = { globalchrlist: 'text' }

    if (answers2.zonelist === 'text') {
        const zoneListExists = await fs.pathExists(ZONELIST_PATH);
        if (!zoneListExists) {
            console.error(`Zone List "${ZONELIST_PATH}" does not exist`);
            process.exit(1);
        }
    }

    if (answers4.globalchrlist === 'text') {
        const globalListExists = await fs.pathExists(GLOBALLIST_PATH);
        if (!globalListExists) {
            console.error(`Global S3D List "${GLOBALLIST_PATH}" does not exist`);
            process.exit(1);
        }
    }

    const inputDirExists = await fs.pathExists(INPUT_DIR);
    if (!inputDirExists) {
        console.error(`Input directory "${INPUT_DIR}" is invalid - check config.json`);
        process.exit(1);
    }

    const outputDirExists = await fs.pathExists(OUTPUT_DIR);
    if (!outputDirExists) {
        console.error(`Input directory "${OUTPUT_DIR}" is invalid - check config.json`);
        process.exit(1);
    }

    // Check directory tree
    await fs.ensureDir(GRAPHICS_DIR, { recursive: false });
    await fs.ensureDir(CHARACTER_GRAPHICS_DIR, { recursive: false });
    await fs.ensureDir(SOUNDS_DIR, { recursive: false });

    let zoneList = [];
    if (answers2.zonelist !== 'none') {
        zoneList = await getZoneList(answers2.zonelist, expansions);
    }
    
    let globalChrList = [];
    if (answers4.globalchrlist !== 'none') {
        globalChrList = await getGlobalList(answers4.globalchrlist);
    }
    
    const numFiles = zoneList.length + globalChrList.length;
    const bar = new ProgressBar('EQLab Installation [:bar] :current/:total :file', { 
        total: numFiles, 
        width: 40,
        complete: '/',
        incomplete: '-',
        clear: true
    });

    //Extract S3Ds
    try {

        if (zoneList.length) {
            await processZones(zoneList, bar);
        }
        
        if (globalChrList.length) {
            await processGlobalChrS3Ds(globalChrList, bar);
        }

        console.log('\nEQLab Installer Complete');
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
})();