import _ from "lodash";

class MonsterSpellDict {

    static getSpellName(id: number | null | undefined): string | null {
        if (!id) return null;
        // @ts-ignore
        const name = SPELLS[id];
        return name ? name : null;
    }

    static findBySpellName(name: string | null | undefined): number | null {
        if (!name) return null;
        let id: number | null = null;
        for (const it of Object.keys(SPELLS)) {
            // @ts-ignore
            const value = SPELLS[it];
            if (value === name) {
                id = _.parseInt(it);
                break;
            }
        }
        return id;
    }


}

const SPELLS = {
    1: "三角攻击",
    2: "三连踢",
    3: "下马威",
    4: "临别礼物",
    5: "乱抓",
    6: "乱突",
    7: "二段踢",
    8: "亚空间弹",
    9: "交叉剪",
    10: "亿万冲击波",
    11: "亿万威力吸取",
    12: "仿制",
    13: "体格强化",
    14: "佯攻",
    15: "保护",
    16: "保护色",
    17: "信号光线",
    18: "假哭",
    19: "偷",
    20: "偷换",
    21: "偷袭",
    22: "催眠术",
    23: "催眠粉",
    24: "充电",
    25: "先发制人",
    26: "光之壁",
    27: "光合成",
    28: "光壁",
    29: "光栅净化",
    30: "克制",
    31: "八叶斩",
    32: "冥想",
    33: "冰冻拳",
    34: "冰冻风",
    35: "冰柱针",
    36: "冰球",
    37: "冰结之风",
    38: "冰雹",
    39: "冷冻光线",
    40: "冷冻拳",
    41: "刀背打",
    42: "刀背斩",
    43: "刃叶斩",
    44: "分担痛苦",
    45: "切裂",
    46: "制裁飞砾",
    47: "剑之舞",
    48: "剧毒",
    49: "剧毒之牙",
    50: "剪刀断头台",
    51: "劈斩",
    52: "力量宝石",
    53: "勒住",
    54: "十万伏特",
    55: "十字切",
    56: "升天拳",
    57: "卷紧",
    58: "压制",
    59: "原始力量",
    60: "双刃头槌",
    61: "双重攻击",
    62: "双针",
    63: "双飞踢",
    64: "反击",
    65: "反射盾",
    66: "变圆",
    67: "变小",
    68: "变方",
    69: "变硬",
    70: "变身",
    71: "叩打",
    72: "叫声",
    73: "可疑光",
    74: "叶刃",
    75: "叶暴雨",
    76: "同旅",
    77: "吐丝",
    78: "吵闹",
    79: "吸取",
    80: "吸收",
    81: "吸血",
    82: "吹飞(地球)",
    83: "吼叫(地球)",
    84: "咬咬",
    85: "咬碎",
    86: "哈欠",
    87: "唱歌",
    88: "啄",
    89: "啮咬",
    90: "啮碎",
    91: "喷水",
    92: "喷火",
    93: "喷烟",
    94: "嗅觉",
    95: "噩梦",
    96: "噪音",
    97: "回击",
    98: "回复指令",
    99: "回旋踢",
    100: "围攻",
    101: "圣炎",
    102: "地狱车",
    103: "地球投",
    104: "地裂",
    105: "地震",
    106: "垂死挣扎",
    107: "埋伏",
    108: "墨汁炮",
    109: "复仇",
    110: "夜影",
    111: "大地之力",
    112: "大字火",
    113: "大文字火",
    114: "大爆炸",
    115: "大钳槌",
    116: "天使之吻",
    117: "天使吻",
    118: "天升拳",
    119: "天气球",
    120: "太阳光线",
    121: "头槌",
    122: "头突",
    123: "夹",
    124: "媚惑",
    125: "宇宙力量",
    126: "宇宙能量",
    127: "守护",
    128: "寄生种子",
    129: "寒冰牙",
    130: "寻衅",
    131: "导弹针",
    132: "封印",
    133: "封印回复",
    134: "尖刺加农炮",
    135: "尖角钻",
    136: "属性切换",
    137: "属性切换2",
    138: "岩崩",
    139: "岩石封印",
    140: "岩石封杀",
    141: "岩石崩塌",
    142: "岩石巨炮",
    143: "岩石爆破",
    144: "崩击之爪",
    145: "帅尾",
    146: "帮手",
    147: "弹跳",
    148: "强夺",
    149: "当身投",
    150: "影击",
    151: "影分身",
    152: "影子球",
    153: "影遁",
    154: "往复拍打",
    155: "心灵交换",
    156: "心灵斩",
    157: "心眼",
    158: "必杀门牙",
    159: "忍耐",
    160: "快击",
    161: "念力",
    162: "怒之门牙",
    163: "思念头槌",
    164: "怠惰",
    165: "怨念",
    166: "怪异光",
    167: "怪异旋风",
    168: "恐惧颜",
    169: "恨",
    170: "恶梦",
    171: "恶颜",
    172: "恶魔之吻",
    173: "惊吓",
    174: "惩罚",
    175: "愈之铃",
    176: "愤怒",
    177: "愤怒门牙",
    178: "慧星拳",
    179: "懈怠",
    180: "戏法",
    181: "扎根",
    182: "打倒",
    183: "打落",
    184: "扔沙",
    185: "扣押",
    186: "抓",
    187: "抓击",
    188: "投掷",
    189: "投蛋",
    190: "折弯匙子",
    191: "折磨",
    192: "报恩",
    193: "拍打",
    194: "招财猫",
    195: "拨沙",
    196: "挑拨",
    197: "挖洞(地球)",
    198: "挠痒",
    199: "挡路",
    200: "挣扎",
    201: "换装",
    202: "掐碎",
    203: "接力棒",
    204: "摇尾巴",
    205: "摇手指",
    206: "撒娇",
    207: "撒气",
    208: "撒泥浆",
    209: "撒菱",
    210: "撞击",
    211: "攀瀑(地球)",
    212: "攻击指令",
    213: "放晴",
    214: "放电",
    215: "新月之舞",
    216: "旋风",
    217: "日本晴",
    218: "时间咆哮",
    219: "暗影拳",
    220: "暗影爪",
    221: "暗影球",
    222: "暴走",
    223: "暴风雪",
    224: "替身",
    225: "最终保存",
    226: "最终保留",
    227: "月之光",
    228: "月光",
    229: "朝之阳",
    230: "木叶槌",
    231: "未来预知",
    232: "束缚",
    233: "极光光线",
    234: "极光束",
    235: "栅栏",
    236: "梦话",
    237: "棉花孢子",
    238: "榨取",
    239: "模仿",
    240: "歌唱",
    241: "殊途同归",
    242: "毒刺",
    243: "毒十字斩",
    244: "毒尾巴",
    245: "毒烟",
    246: "毒粉",
    247: "毒菱",
    248: "毒针",
    249: "毒雾",
    250: "气合拳",
    251: "气象球",
    252: "水之尾",
    253: "水之波动",
    254: "水枪",
    255: "水波动",
    256: "水流喷射",
    257: "沙尘暴",
    258: "沙陷阱",
    259: "治愈愿望",
    260: "泡沫光线",
    261: "泡泡",
    262: "泡泡光线",
    263: "波导弹",
    264: "泥攻击",
    265: "泥浆喷射",
    266: "泥浆炸弹",
    267: "泥爆弹",
    268: "流星",
    269: "浊流",
    270: "海潮",
    271: "液体圈",
    272: "清醒",
    273: "清醒击",
    274: "溶化",
    275: "溶解液",
    276: "滚动",
    277: "漩涡",
    278: "潜水",
    279: "激鳞",
    280: "火炎拳",
    281: "火炎放射",
    282: "火炎车",
    283: "火焰拳",
    284: "火焰放射",
    285: "火焰漩涡",
    286: "火焰牙",
    287: "火焰车",
    288: "火箭头突",
    289: "火花",
    290: "火花踢",
    291: "火苗",
    292: "灭亡之歌",
    293: "炎之涡",
    294: "点穴",
    295: "烈焰突击",
    296: "烟幕",
    297: "烟雾",
    298: "烦恼种子",
    299: "热风",
    300: "焚风",
    301: "煽动",
    302: "熔岩风暴",
    303: "燕返",
    304: "爆炎踢",
    305: "爆裂拳",
    306: "猫之手",
    307: "猫手",
    308: "猫袭",
    309: "玩水",
    310: "玩泥",
    311: "瑜珈之形",
    312: "瑜迦姿势",
    313: "瓦割",
    314: "生蛋(地球)",
    315: "生长",
    316: "甩尾",
    317: "电光石火",
    318: "电击",
    319: "电击波",
    320: "电气震",
    321: "电火花",
    322: "电磁波",
    323: "电磁浮游",
    324: "电磁炮",
    325: "痊愈铃",
    326: "痛苦平分",
    327: "白雾",
    328: "百万吨拳击",
    329: "百万吨级强踢",
    330: "百万吨级铁拳",
    331: "百万大角",
    332: "百万威力吸取",
    333: "百万威力角突",
    334: "盗窃",
    335: "真空斩",
    336: "真空波",
    337: "眩晕之舞",
    338: "眩晕拳",
    339: "眩晕舞",
    340: "着迷",
    341: "睡眠",
    342: "瞑想",
    343: "瞪眼",
    344: "瞬间移动(地球)",
    345: "石刃",
    346: "砂地狱",
    347: "砂岚",
    348: "破坏光线",
    349: "破灭之愿",
    350: "破碎爪",
    351: "磁力变化",
    352: "磁力炸弹",
    353: "礼物",
    354: "祈祷",
    355: "祈雨",
    356: "神秘的守护",
    357: "神通力",
    358: "神速",
    359: "神鸟",
    360: "禁止通行(地球)",
    361: "种子机枪",
    362: "种子爆弹",
    363: "种子闪光弹",
    364: "空中爆破",
    365: "空元气",
    366: "空手切",
    367: "空气切",
    368: "突张",
    369: "突进",
    370: "粉雪",
    371: "精神光线",
    372: "精神制动",
    373: "精神回复",
    374: "精神增压",
    375: "精神干扰",
    376: "精神波动",
    377: "精神转移",
    378: "素描",
    379: "索要",
    380: "细雪",
    381: "绝对零度",
    382: "缠绕",
    383: "缩壳",
    384: "羽毛之舞",
    385: "翅膀拍击",
    386: "翅膀攻击",
    387: "聚气",
    388: "能量储存",
    389: "能量吸入",
    390: "能量吸收",
    391: "能量喷发",
    392: "能量放出",
    393: "能量球",
    394: "腹太鼓",
    395: "腹鼓",
    396: "自我再生",
    397: "自我暗示",
    398: "自然力量",
    399: "自然恩惠",
    400: "自爆",
    401: "舌头舔",
    402: "舌舔",
    403: "舍身一击",
    404: "色彩拳",
    405: "色诱幻术",
    406: "花瓣之舞",
    407: "芳香气味",
    408: "芳香治疗",
    409: "芳香疗法",
    410: "苏醒",
    411: "英勇之鸟",
    412: "草笛",
    413: "莽撞",
    414: "萤火",
    415: "落石",
    416: "蓄气",
    417: "蔓藤鞭",
    418: "蘑菇孢子",
    419: "虚伪空间",
    420: "虚张声势",
    421: "虫蛀",
    422: "虫鸣",
    423: "虹彩炮",
    424: "蛇瞪眼",
    425: "蛋蛋爆弹",
    426: "蛮力",
    427: "蛮力藤鞭",
    428: "蜘蛛丝(地球)",
    429: "蜻蜓点水",
    430: "融化",
    431: "螺旋球",
    432: "见切",
    433: "觉醒力量",
    434: "角撞",
    435: "角突",
    436: "讨厌的声音",
    437: "许愿",
    438: "诅咒",
    439: "识破",
    440: "试刃",
    441: "话匣子",
    442: "请别打我",
    443: "贝壳夹",
    444: "起死回生",
    445: "起风",
    446: "超级健忘",
    447: "超级尖牙",
    448: "超音波",
    449: "践踏",
    450: "躲进贝壳",
    451: "过肩摔",
    452: "近身拳",
    453: "远吠",
    454: "连续切",
    455: "连续拍打",
    456: "连续拳",
    457: "迷雾球",
    458: "追击",
    459: "逆鳞",
    460: "道具回收",
    461: "重力场",
    462: "重臂槌",
    463: "金属声音",
    464: "金属爆破",
    465: "金属音",
    466: "针刺臂膀",
    467: "钢之尾",
    468: "钢之爪",
    469: "钢之翼",
    470: "钢爪",
    471: "钢铁头槌",
    472: "钻孔啄",
    473: "铁壁",
    474: "银色之风",
    475: "银色旋风",
    476: "锁定",
    477: "镜像反射",
    478: "镜面反射",
    479: "镜面射击",
    480: "镰鼬",
    481: "闪电",
    482: "闪电拳",
    483: "防御指令",
    484: "阴谋",
    485: "雷典牙",
    486: "雷电拳",
    487: "雷电牙",
    488: "震级变化",
    489: "音速拳",
    490: "音速波",
    491: "预知未来",
    492: "飘飘拳",
    493: "飞叶斩",
    494: "飞弹针",
    495: "飞空(地球)",
    496: "飞膝踢",
    497: "飞跃",
    498: "飞踢",
    499: "食梦",
    500: "饮奶(地球)",
    501: "香甜气息",
    502: "骨头击",
    503: "骨头回旋镖",
    504: "骨头突刺",
    505: "骨头闪",
    506: "高压水泵",
    507: "高速旋转",
    508: "高速星",
    509: "高速移动",
    510: "高音",
    511: "鬼火",
    512: "魔叶斩",
    513: "魔法叶",
    514: "魔法衣",
    515: "魔装反射",
    516: "鸟栖",
    517: "鹦鹉学舌",
    518: "麻痹粉",
    519: "黑夜魔影",
    520: "黑暗波动",
    521: "黑洞",
    522: "黑眼神(地球)",
    523: "黑雾",
    524: "鼓掌",
    525: "鼾声",
    526: "龙之怒",
    527: "龙之息吹",
    528: "龙之爪",
    529: "龙之舞",
    530: "龙卷",
    531: "龙气息",
    532: "龙波动",
    533: "龙遁"
};

export = MonsterSpellDict;