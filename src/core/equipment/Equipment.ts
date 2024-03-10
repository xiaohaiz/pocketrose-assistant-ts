import _ from "lodash";
import Coordinate from "../../util/Coordinate";
import PageUtils from "../../util/PageUtils";
import StringUtils from "../../util/StringUtils";
import SetupLoader from "../config/SetupLoader";
import TownLoader from "../town/TownLoader";

const PROHIBIT_SELLING_ITEM_LIST = [
    "千与千寻",
    "勿忘我",
    "神枪 永恒",
    "霸邪斧 天煌",
    "魔刀 哭杀",
    "神器 苍穹",
    "魔神器 幻空",
    "真·圣剑 苍白的正义",
    "双经斩",
    "千幻碧水猿洛克奇斯",
    "地纹玄甲龟斯特奥特斯",
    "幽冥黑鳞蟒罗尼科斯",
    "火睛混沌兽哈贝达",
    "羽翅圣光虎阿基勒斯",
    "金翅追日鹰庞塔雷斯",
    "风翼三足凤纳托利斯",
    "圣皇铠甲 天威",
    "薄翼甲",
    "魔盔 虚无",
    "神冠 灵通",
    "龙",
    "玉佩",
    "宠物蛋"
];

const NO_EXPERIENCE_ITEM_LIST = [
    "大师球",
    "宗师球",
    "超力怪兽球",
    "宠物蛋"
];

const NONE_REPAIRABLE_ITEM_LIST = [
    "大师球",
    "宗师球",
    "超力怪兽球",
    "宠物蛋"
];

const ATTRIBUTE_HEAVY_ARMOR_ITEM_LIST = [
    "千幻碧水猿洛克奇斯",
    "地纹玄甲龟斯特奥特斯",
    "幽冥黑鳞蟒罗尼科斯",
    "火睛混沌兽哈贝达",
    "羽翅圣光虎阿基勒斯",
    "金翅追日鹰庞塔雷斯",
    "风翼三足凤纳托利斯"
];

class Equipment {

    index?: number;                      // 下标（唯一性）
    selectable?: boolean;                // 是否可以被选择
    using?: boolean;                     // 是否装备
    name?: string;                       // 名字
    star?: boolean;                      // 是否齐心
    nameHTML?: string;                   // 名字HTML代码
    category?: string;                   // 种类
    power?: number;                      // 效果
    weight?: number;                     // 重量
    endure?: number;                     // 耐久
    maxEndure?: number;                  // 最大耐久
    requiredCareer?: string;             // 装备需要的职业
    requiredAttack?: number;             // 装备需要的攻击力
    requiredDefense?: number;            // 装备需要的防御力
    requiredSpecialAttack?: number;      // 装备需要的智力
    requiredSpecialDefense?: number;     // 装备需要的精神力
    requiredSpeed?: number;              // 装备需要的速度
    experience?: number;                 // 经验
    additionalPower?: number;            // 附加威力
    additionalWeight?: number;           // 附加重量
    additionalLuck?: number;             // 附加幸运
    attribute?: string;                  // 属性
    price?: number;                      // 价格
    priceHTML?: string;                  // 价格HTML代码
    repairPrice?: number;
    gemCount?: number;
    maxGemCount?: number;
    location?: string;

    static parse(text: string) {
        const ss = _.split(text, "/");
        const equipment = new Equipment();
        equipment.parseName(_.unescape(ss[0]));
        equipment.category = ss[1];
        equipment.power = _.parseInt(ss[2]);
        equipment.weight = _.parseInt(ss[3]);
        equipment.endure = _.parseInt(ss[4]);
        equipment.additionalPower = _.parseInt(ss[5]);
        equipment.additionalWeight = _.parseInt(ss[6]);
        equipment.additionalLuck = _.parseInt(ss[7]);
        equipment.experience = _.parseInt(ss[8]);
        equipment.location = ss[9];
        if (ss.length > 10) {
            equipment.using = (ss[10] === "true");
        }
        return equipment;
    }

    parseName(nameHtml: string) {
        this.nameHTML = PageUtils.fixBrokenImageIfNecessary(nameHtml);
        const s = PageUtils.convertHtmlToText(this.nameHTML);
        if (s.startsWith("齐心★")) {
            this.star = true;
            this.name = StringUtils.substringAfter(s, "齐心★");
        } else {
            this.star = false;
            this.name = s;
        }
    }

    parseEndure(endureText: string) {
        if (endureText.includes("/")) {
            const a = StringUtils.substringBeforeSlash(endureText);
            const b = StringUtils.substringAfterSlash(endureText);
            this.endure = parseInt(a);
            this.maxEndure = parseInt(b);
        } else {
            this.endure = parseInt(endureText);
        }
    }

    parseGemCount(gemCountText: string) {
        if (gemCountText.includes("/")) {
            const a = StringUtils.substringBeforeSlash(gemCountText);
            const b = StringUtils.substringAfterSlash(gemCountText);
            this.gemCount = parseInt(a);
            this.maxGemCount = parseInt(b);
        } else {
            this.endure = parseInt(gemCountText);
        }
    }

    parsePrice(priceHtml: string) {
        this.priceHTML = priceHtml;
        let s = PageUtils.convertHtmlToText(priceHtml);
        if (s.includes(" ")) {
            s = StringUtils.substringBefore(s, " ");
        }
        this.price = parseInt(s);
    }

    get locationOrder() {
        switch (this.location) {
            case "P":
                return 1;
            case "B":
                return 2;
            case "W":
                return 3;
            default:
                return 0;
        }
    }

    get nameOrder() {
        if (this.star) {
            return 0;
        } else if (_.startsWith(this.name, "20")) {
            return 1;
        } else {
            return 2;
        }
    }

    get categoryOrder() {
        if (this.isWeapon) {
            return 1;
        }
        if (this.isArmor) {
            return 2;
        }
        if (this.isAccessory) {
            return 3;
        }
        if (this.isItem) {
            return 4;
        }
        return 0;
    }

    get isWeapon() {
        return this.category === "武器";
    }

    get isArmor() {
        return this.category === "防具";
    }

    get isAccessory() {
        return this.category === "饰品";
    }

    get isItem() {
        return this.category === "物品";
    }

    get isTreasureBag(): boolean {
        return this.isItem && this.name === "百宝袋";
    }

    get isGoldenCage(): boolean {
        return this.isItem && this.name === "黄金笼子";
    }

    get isSellable() {
        if (this.selectable !== undefined && !this.selectable) {
            return false;
        }
        if (this.using !== undefined && this.using) {
            return false;
        }
        for (const it of PROHIBIT_SELLING_ITEM_LIST) {
            if (this.name!.endsWith(it)) {
                return false;
            }
        }
        return true;
    }

    get isRepairable() {
        if (this.isItem) {
            return this.name!.includes("(自动)");
        } else {
            return !NONE_REPAIRABLE_ITEM_LIST.includes(this.name!);
        }
    }

    get isStorable(): boolean {
        if (this.using!) {
            return false;
        }
        if (this.isItem) {
            return false;
        }
        return !NONE_REPAIRABLE_ITEM_LIST.includes(this.name!);
    }

    get fullExperienceRatio() {
        if (this.isItem) {
            return -1;
        }
        if (NO_EXPERIENCE_ITEM_LIST.includes(this.name!)) {
            return -1;
        }
        let maxExperience = 0;
        if (isAttributeHeavyArmor(this.name!)) {
            // 属性重铠满级经验为76000
            maxExperience = 76000;
        } else if (this.power !== 0) {
            const powerForUse = Math.abs(this.power!);
            maxExperience = Math.floor(powerForUse * 0.2) * 1000;
        }
        if (maxExperience === 0) {
            return -1;
        }
        if (this.experience! >= maxExperience) {
            return 1;
        }
        if (this.experience === 0) {
            return 0;
        }
        return this.experience! / maxExperience;
    }

    get checkboxHTML() {
        if (this.selectable) {
            return "<input type='checkbox' name='item" + this.index + "' value='" + this.index + "' class='personal_checkbox'>";
        } else {
            return "";
        }
    }

    get usingHTML() {
        if (!this.using) {
            return "";
        }
        if (this.experience === undefined) {
            return "★";
        }
        const ratio = this.fullExperienceRatio;
        if (ratio === 1 || ratio < 0) {
            return "<span title='装备中' style='color:red'>★</span>";
        } else {
            return "<span title='装备中'>★</span>";
        }
    }

    get experienceHTML() {
        if (this.isItem) {
            if (this.name === "藏宝图") {
                const coordinate = new Coordinate(this.power!, this.weight!);
                if (!coordinate.isAvailable) {
                    return "<b style='color:red'>活动图</b>";
                }
                const town = TownLoader.load(coordinate);
                if (town !== null) {
                    return "<b style='color:red'>" + town.name + "</b>";
                } else {
                    return "-";
                }
            } else {
                return "-";
            }
        }
        const ratio = this.fullExperienceRatio;
        if (ratio < 0) {
            return "-";
        }
        if (ratio === 1) {
            return "<span style='color:red' title='" + this.experience + "'>MAX</span>";
        }
        if (SetupLoader.isExperienceProgressBarEnabled()) {
            const progressBar = PageUtils.generateProgressBarHTML(ratio);
            return "<span title='" + this.experience + " (" + (ratio * 100).toFixed(2) + "%)'>" + progressBar + "</span>"
        } else {
            return this.experience!.toString();
        }
    }

    get fullName() {
        if (this.star) {
            return "齐心★" + this.name!;
        } else {
            return this.name!;
        }
    }

    get endureHtml() {
        if (this.isItem && !this.name!.includes("自动")) {
            return "-";
        }
        if (this.maxEndure === undefined) {
            return this.endure!.toString();
        } else {
            return this.endure! + "/" + this.maxEndure!;
        }
    }

    get gemCountHtml() {
        if (this.maxGemCount === undefined) {
            if (this.gemCount === undefined || this.gemCount === 0) {
                return "-";
            } else {
                return this.gemCount.toString();
            }
        } else {
            return "<span style='color:red'>" + this.gemCount + "</span> / <span style='color:red'>" + this.maxGemCount + "</span>"
        }
    }

    get requiredCareerHtml() {
        if (this.requiredCareer === undefined || this.requiredCareer === "所有职业") {
            return "-";
        }
        return this.requiredCareer;
    }

    get requiredAttackHtml() {
        if (this.requiredAttack === undefined || this.requiredAttack === 0) {
            return "-";
        }
        return this.requiredAttack.toString();
    }

    get requiredDefenseHtml() {
        if (this.requiredDefense === undefined || this.requiredDefense === 0) {
            return "-";
        }
        return this.requiredDefense.toString();
    }

    get requiredSpecialAttackHtml() {
        if (this.requiredSpecialAttack === undefined || this.requiredSpecialAttack === 0) {
            return "-";
        }
        return this.requiredSpecialAttack.toString();
    }

    get requiredSpecialDefenseHtml() {
        if (this.requiredSpecialDefense === undefined || this.requiredSpecialDefense === 0) {
            return "-";
        }
        return this.requiredSpecialDefense.toString();
    }

    get requiredSpeedHtml() {
        if (this.requiredSpeed === undefined || this.requiredSpeed === 0) {
            return "-";
        }
        return this.requiredSpeed.toString();
    }

    get additionalPowerHtml() {
        if (this.additionalPower === undefined || this.additionalPower === 0) {
            return "-";
        }
        return this.additionalPower.toString();
    }

    get additionalWeightHtml() {
        if (this.additionalWeight === undefined || this.additionalWeight === 0) {
            return "-";
        }
        return this.additionalWeight.toString();
    }

    get additionalLuckHtml() {
        if (this.additionalLuck === undefined || this.additionalLuck === 0) {
            return "-";
        }
        return this.additionalLuck.toString();
    }

    get attributeHtml() {
        if (this.attribute === undefined || this.attribute === "无") {
            return "-";
        }
        return this.attribute;
    }

    get buttonTitle() {
        if (this.isItem) {
            return "使用";
        }
        let title = "装备";
        if (this.using) {
            title = "卸下";
        }
        return title;
    }

    static sortEquipmentList(source: Equipment[]): Equipment[] {
        const target = _.clone(source);
        target.sort(Equipment.sorter);
        return target;
    }

    static sorter(a: Equipment, b: Equipment): number {
        if (!SetupLoader.isEquipmentPetSortEnabled()) {
            return 0;
        }

        let ret = a.locationOrder - b.locationOrder;
        if (ret !== 0) return ret;
        ret = a.nameOrder - b.nameOrder;
        if (ret !== 0) return ret;

        ret = (a.requiredCareer !== "所有职业" ? 0 : 1) - (b.requiredCareer !== "所有职业" ? 0 : 1);
        if (ret !== 0) return ret;

        let ca = (a.requiredCareer === "所有职业") ? "" : a.requiredCareer;
        ca = ca ? ca : "";
        let cb = (b.requiredCareer === "所有职业") ? "" : b.requiredCareer;
        cb = cb ? cb : "";
        ret = cb.localeCompare(ca);
        if (ret !== 0) return ret;

        ret = a.categoryOrder - b.categoryOrder;
        if (ret !== 0) return ret;

        let a1 = a.star! ? 1 : 0;
        let b1 = b.star! ? 1 : 0;
        ret = a1 - b1;
        if (ret !== 0) {
            return ret;
        }
        ret = b.power! - a.power!;
        if (ret !== 0) {
            return ret;
        }
        ret = a.fullName!.localeCompare(b.fullName);
        if (ret !== 0) {
            return ret;
        }
        return b.additionalPower! - a.additionalPower!;
    }
}

function isAttributeHeavyArmor(name: string) {
    for (const it of ATTRIBUTE_HEAVY_ARMOR_ITEM_LIST) {
        if (name.endsWith(it)) {
            return true;
        }
    }
    return false;
}

export = Equipment;