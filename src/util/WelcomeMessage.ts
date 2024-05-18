import RandomUtils from "./RandomUtils";

class WelcomeMessage {

    static randomWelcomeMessage(): string {
        return RandomUtils.randomElement(WELCOME_MESSAGES)!;
    }

}

const WELCOME_MESSAGES: string[] = [

    "东风夜放花千树。更吹落、星如雨。宝马雕车香满路。凤箫声动，玉壶光转，一夜鱼龙舞。<br>" +
    "蛾儿雪柳黄金缕。笑语盈盈暗香去。众里寻他千百度。蓦然回首，那人却在，灯火阑珊处。",

    "醉里挑灯看剑，梦回吹角连营。八百里分麾下炙，五十弦翻塞外声，沙场秋点兵。<br>" +
    "马作的卢飞快，弓如霹雳弦惊。了却君王天下事，赢得生前身后名。可怜白发生！",

    "昨夜雨疏风骤，浓睡不消残酒。试问卷帘人，却道海棠依旧。知否？知否？应是绿肥红瘦。",

    "驿外断桥边，寂寞开无主。已是黄昏独自愁，更着风和雨。<br>" +
    "无意苦争春，一任群芳妒。零落成泥碾作尘，只有香如故。",

    "山不在高，有仙则名。水不在深，有龙则灵。斯是陋室，惟吾德馨。<br>" +
    "苔痕上阶绿，草色入帘青。谈笑有鸿儒，往来无白丁。<br>" +
    "可以调素琴，阅金经。无丝竹之乱耳，无案牍之劳形。<br>" +
    "南阳诸葛庐，西蜀子云亭。孔子云：何陋之有？",

    "无言独上西楼，月如钩。寂寞梧桐深院锁清秋。<br>" +
    "剪不断，理还乱，是离愁。别是一般滋味在心头。",

    "十年生死两茫茫。不思量，自难忘。千里孤坟，无处话凄凉。纵使相逢应不识，尘满面，鬓如霜。<br>" +
    "夜来幽梦忽还乡。小轩窗，正梳妆。相顾无言，惟有泪千行。料得年年肠断处，明月夜，短松冈。",

    "红藕香残玉簟秋，轻解罗裳，独上兰舟。云中谁寄锦书来？雁字回时，月满西楼。<br>" +
    "花自飘零水自流，一种相思，两处闲愁。此情无计可消除，才下眉头，却上心头。",

    "滚滚长江东逝水，浪花淘尽英雄。是非成败转头空。青山依旧在，几度夕阳红。<br>" +
    "白发渔樵江渚上，惯看秋月春风。一壶浊酒喜相逢。古今多少事，都付笑谈中。",

    "淮左名都，竹西佳处，解鞍少驻初程。过春风十里，尽荠麦青青。<br>" +
    "自胡马窥江去后，废池乔木，犹厌言兵。渐黄昏，清角吹寒，都在空城。<br>" +
    "杜郎俊赏，算而今，重到须惊。纵豆蔻词工，青楼梦好，难赋深情。<br>" +
    "二十四桥仍在，波心荡，冷月无声。念桥边红药，年年知为谁生？",

    "塞下秋来风景异，衡阳雁去无留意。四面边声连角起，千嶂里，长烟落日孤城闭。<br>" +
    "浊酒一杯家万里，燕然未勒归无计。羌管悠悠霜满地，人不寐，将军白发征夫泪。",

    "怒发冲冠，凭栏处、潇潇雨歇。抬望眼，仰天长啸，壮怀激烈。<br>" +
    "三十功名尘与土，八千里路云和月。莫等闲，白了少年头，空悲切！<br>" +
    "靖康耻，犹未雪。臣子恨，何时灭！驾长车，踏破贺兰山缺。<br>" +
    "壮志饥餐胡虏肉，笑谈渴饮匈奴血。待从头、收拾旧山河，朝天阙。",

    "一曲新词酒一杯，去年天气旧亭台。夕阳西下几时回？<br>" +
    "无可奈何花落去，似曾相识燕归来。小园香径独徘徊。",
];

export {WelcomeMessage};