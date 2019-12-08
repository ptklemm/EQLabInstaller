module.exports = {
    INT8: 1,
    INT16: 2,
    INT32: 4,
    FLOAT: 4,
    BYTE: 1,
    WORD: 2,
    DWORD: 4,
    PFS_SIGNATURE: 0x20534650,
    WLD_SIGNATURE: 0x54503D02,
    WLD_VERSION_1: 0x00015500,
    WLD_VERSION_2: 0x1000C800,
    WLD_STRING_HASH: [0x95, 0x3A, 0xC5, 0x2A, 0x95, 0x7A, 0x95, 0x6A],
    BMP_SIGNATURE: 0x4D42,
    JPG_SIGNATURE: 0xD8FF,
    DDS_SIGNATURE: 0x20534444,
    PNG_SIGNATURE: 0x474E5089,
    EFF_SOUNDENTRY_SIZE: 84,
    EFF_SOUND_TYPES: {
        0: "AMBIENT",
        1: "MUSIC",
        2: "SPATIAL SOUND",
        3: "DAY/NIGHT SPATIAL SOUND"
    },
    EFF_HARDCODED_SOUNDS: {
        // 39: "death_me", // no sound exists with this name
        143: "thunder1",
        144: "thunder2",
        158: "wind_lp1",
        159: "rainloop",
        160: "torch_lp",
        161: "watundlp"
    },
    EXPANSIONS: [
        { name: "EverQuest", value: 1 },
        { name: "The Ruins of Kunark", value: 2 },
        { name: "The Scars of Velious", value: 3 },
        { name: "The Shadows of Luclin", value: 4 },
        { name: "The Planes of Power", value: 5 }
    ]
}