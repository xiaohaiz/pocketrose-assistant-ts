import _ from "lodash";
import MonsterProfile from "./MonsterProfile";

class MonsterRelationLoader {


    static getPetRelations(code: number) {
        const profile = allProfiles().get(code)!;

        let sources: number[] = [];
        findSources(profile.source, sources);
        sources = sources.reverse();

        let targets: number[] = [];
        findTargets(profile, targets);

        const codeList: number[] = [];
        codeList.push(...sources);
        codeList.push(code);
        codeList.push(...targets);
        return codeList;
    }


}

function findSources(profile: MonsterProfile | undefined, sources: number[]) {
    if (!profile) return;
    sources.push(_.parseInt(profile.code!));
    findSources(profile.source, sources);
}

function findTargets(profile: MonsterProfile, targets: number[]) {
    if (!profile.targets || profile.targets.length === 0) return;
    for (const target of profile.targets) {
        targets.push(_.parseInt(target.code!));
        findTargets(target, targets);
    }
}

const PET_RELATIONSHIPS = {
    1: [2],
    2: [3],
    4: [5],
    5: [6],
    7: [8],
    8: [9],
    10: [11],
    11: [12],
    13: [14],
    14: [15],
    16: [17],
    17: [18],
    19: [20],
    21: [22],
    23: [24],
    25: [26],
    27: [28],
    29: [30],
    30: [31],
    32: [33],
    33: [34],
    35: [36],
    37: [38],
    39: [40],
    41: [42],
    42: [169],
    43: [44],
    44: [45, 182],
    46: [47],
    48: [49],
    50: [51],
    52: [53],
    54: [55],
    56: [57],
    58: [59],
    60: [61],
    61: [62, 186],
    63: [64],
    64: [65],
    66: [67],
    67: [68],
    69: [70],
    70: [71],
    72: [73],
    74: [75],
    75: [76],
    77: [78],
    79: [80],
    80: [199],
    81: [82],
    82: [462],
    84: [85],
    86: [87],
    88: [89],
    90: [91],
    92: [93],
    93: [94],
    95: [208],
    96: [97],
    98: [99],
    100: [101],
    102: [103],
    104: [105],
    108: [463],
    109: [110],
    111: [112],
    112: [464],
    113: [242],
    114: [465],
    116: [117],
    117: [230],
    118: [119],
    120: [121],
    123: [212],
    125: [466],
    126: [467],
    129: [130],
    133: [134, 135, 136, 196, 197, 470, 471],
    137: [233],
    138: [139],
    140: [141],
    147: [148],
    148: [149],
    152: [153],
    153: [154],
    155: [156],
    156: [157],
    158: [159],
    159: [160],
    161: [162],
    163: [164],
    165: [166],
    167: [168],
    170: [171],
    172: [25],
    173: [35],
    174: [39],
    175: [176],
    176: [468],
    177: [178],
    179: [180],
    180: [181],
    183: [184],
    187: [188],
    188: [189],
    190: [424],
    191: [192],
    193: [469],
    194: [195],
    198: [430],
    200: [429],
    204: [205],
    207: [472],
    209: [210],
    215: [461],
    216: [217],
    218: [219],
    220: [221],
    221: [473],
    223: [224],
    228: [229],
    231: [232],
    233: [474],
    236: [106, 107, 237],
    238: [124],
    239: [125],
    240: [126],
    246: [247],
    247: [248],
    252: [253],
    253: [254],
    255: [256],
    256: [257],
    258: [259],
    259: [260],
    261: [262],
    263: [264],
    265: [266, 268],
    266: [267],
    268: [269],
    270: [271],
    271: [272],
    273: [274],
    274: [275],
    276: [277],
    278: [279],
    280: [281],
    281: [282],
    282: [475],
    283: [284],
    285: [286],
    287: [288],
    288: [289],
    290: [291],
    291: [292],
    293: [294],
    294: [295],
    296: [297],
    298: [183],
    299: [476],
    300: [301],
    304: [305],
    305: [306],
    307: [308],
    309: [310],
    315: [407],
    316: [317],
    318: [319],
    320: [321],
    322: [323],
    325: [326],
    328: [329],
    329: [330],
    331: [332],
    333: [334],
    339: [340],
    341: [342],
    343: [344],
    345: [346],
    347: [348],
    349: [350],
    353: [354],
    355: [356],
    356: [477],
    360: [202],
    361: [362, 478],
    363: [364],
    364: [365],
    366: [367, 368],
    371: [372],
    372: [373],
    374: [375],
    375: [376],
    387: [388],
    388: [389],
    390: [391],
    391: [392],
    393: [394],
    394: [395],
    396: [397],
    397: [398],
    399: [400],
    401: [402],
    403: [404],
    404: [405],
    406: [315],
    408: [409],
    410: [411],
    412: [413, 414],
    415: [416],
    418: [419],
    420: [421],
    422: [423],
    425: [426],
    427: [428],
    431: [432],
    433: [358],
    434: [435],
    436: [437],
    438: [185],
    439: [122],
    440: [113],
    443: [444],
    444: [445],
    446: [143],
    447: [448],
    449: [450],
    451: [452],
    453: [454],
    456: [457],
    458: [226],
    459: [460],
};

function allProfiles() {
    const profiles = new Map<number, MonsterProfile>();
    for (let i = 1; i <= 493; i++) {
        const profile = new MonsterProfile();
        profile.code = _.padStart(i.toString(), 3, "0");
        profile.targets = [];
        profiles.set(i, profile);
    }

    const keys = Object.keys(PET_RELATIONSHIPS);
    for (const key of keys) {
        const id = parseInt(key);
        // @ts-ignore
        const arr: [] = PET_RELATIONSHIPS[id];

        if (arr === undefined) {
            continue;
        }
        const parent = profiles.get(id)!;
        for (const it of arr) {
            const child = profiles.get(it)!;
            child.source = parent;
            parent.targets!.push(child);
        }
    }

    return profiles;
}

export = MonsterRelationLoader;