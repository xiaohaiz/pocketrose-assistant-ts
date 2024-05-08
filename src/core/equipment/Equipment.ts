import _ from "lodash";
import Coordinate from "../../util/Coordinate";
import PageUtils from "../../util/PageUtils";
import StringUtils from "../../util/StringUtils";
import SetupLoader from "../config/SetupLoader";
import TownLoader from "../town/TownLoader";
import EquipmentConstants from "./EquipmentConstants";
import EquipmentProfileLoader from "./EquipmentProfileLoader";
import Role from "../role/Role";

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

    checkGem(category: string): boolean {
        if (this.isDragonBall) {
            return category === "ALL" || category === "DRAGON";
        }
        if (this.isSevenHeart) {
            return category === "ALL" || category === "SEVEN";
        }
        if (!this.isGem) return false;
        switch (category) {
            case "ALL":
                return true;
            case "POWER":
                return this.name === "威力宝石";
            case "LUCK":
                return this.name === "幸运宝石";
            case "WEIGHT":
                return this.name === "重量宝石";
            default:
                return false;
        }
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

    get isGem(): boolean {
        return this.isItem && (this.name === "威力宝石" || this.name === "幸运宝石" || this.name === "重量宝石");
    }

    get isDragonBall(): boolean {
        return this.isItem && _.endsWith(this.name, "星龙珠");
    }

    get isSevenHeart(): boolean {
        return this.isItem && this.name === "七心宝石";
    }

    get isTreasureBag(): boolean {
        return this.isItem && this.name === "百宝袋";
    }

    get isGoldenCage(): boolean {
        return this.isItem && this.name === "黄金笼子";
    }

    get canSend(): boolean {
        if (_.includes(this.name, "魔法使的闪光弹")) return false;
        if (_.includes(this.name, "千与千寻")) return false;
        if (_.includes(this.name, "勿忘我")) return false;
        if (_.includes(this.name, "降魔杖")) return false;
        if (_.includes(this.name, "九齿钉耙")) return false;
        if (_.includes(this.name, "1.5倍界王拳套")) return false;
        if (_.includes(this.name, "双经斩")) return false;
        if (_.includes(this.name, "霸者倚天玉佩")) return false;
        if (_.includes(this.name, "王道倚天玉佩")) return false;
        if (_.includes(this.name, "霸者磐石玉佩")) return false;
        if (_.includes(this.name, "王道磐石玉佩")) return false;
        if (_.includes(this.name, "霸者仙人玉佩")) return false;
        if (_.includes(this.name, "王道仙人玉佩")) return false;
        if (_.includes(this.name, "霸者军神玉佩")) return false;
        if (_.includes(this.name, "王道军神玉佩")) return false;
        if (_.includes(this.name, "霸者疾风玉佩")) return false;
        if (_.includes(this.name, "王道疾风玉佩")) return false;
        if (_.endsWith(this.name, "星龙珠")) return false;
        return true;
    }

    get isSellable() {
        if (this.selectable !== undefined && !this.selectable) {
            return false;
        }
        if (this.using !== undefined && this.using) {
            return false;
        }
        for (const it of EquipmentConstants.PROHIBIT_SELLING_ITEM_LIST) {
            if (this.name!.endsWith(it)) {
                return false;
            }
        }
        return true;
    }

    get isRepairable() {
        if (this.isRecoverItem) {
            return true;
        }
        if (this.isItem) {
            return false;
        }
        if (_.includes(EquipmentConstants.NONE_REPAIRABLE_ITEM_LIST, this.name)) {
            // 不能修理的名单
            return false;
        }
        if (this.maxEndure !== undefined && this.maxEndure! === 0) {
            // 最大耐久为0的装备不需要修理
            return false;
        }
        if (this.endure !== undefined && this.maxEndure !== undefined) {
            const c = this.endure!;
            const m = this.maxEndure!;
            if (c >= m) {
                // 当前耐久度满值，不需要修理
                return false;
            }
        }
        if (this.endure !== undefined && this.maxEndure === undefined) {
            // 只有当前耐久度的数据，没有最大耐久度数据，尝试从装备资料中查询
            const profile = EquipmentProfileLoader.loadEquipmentProfile(this.fullName);
            if (profile !== null) {
                const c = this.endure;
                const m = profile.maxEndure;
                if (c >= m) {
                    // 当前耐久度满值，不需要修理
                    return false;
                }
            }
        }
        return true;
    }

    /**
     * 闲置装备的判断标准。
     */
    get isIdle(): boolean {
        return (this.using === undefined || !this.using)
            && !this.isGoldenCage
            && !this.isTreasureBag
            && !(this.name === "无忧之果(自动)")
            && !(this.name === "回魂丹(自动)");
    }

    get isRecoverItem(): boolean {
        return this.isItem && _.includes(this.name, "(自动)");
    }

    get isStorable(): boolean {
        if (this.using!) {
            return false;
        }
        if (this.isItem) {
            return false;
        }
        return !EquipmentConstants.NONE_REPAIRABLE_ITEM_LIST.includes(this.name!);
    }

    get fullExperienceRatio() {
        if (this.isItem) {
            return -1;
        }
        if (EquipmentConstants.NO_EXPERIENCE_ITEM_LIST.includes(this.name!)) {
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

    calculateRemainingExperience() {
        if (this.isItem) return 0;
        if (this.power! === 0) return 0;
        let basePower = this.power!;
        let maxExperience = _.floor(Math.abs(basePower) * 0.2) * 1000;
        if (this.isArmor && isAttributeHeavyArmor(this.name!)) {
            maxExperience = 76000;
        }
        const remaining = maxExperience - this.experience!;
        return _.max([0, remaining])!;
    }

    calculateActualPowerHTML(role: Role) {
        if (this.isRecoverItem) {
            return _.toString(this.power);
        }
        if (this.isItem) {
            return "-";
        }
        let basePower = this.power!;
        if (this.isArmor && isAttributeHeavyArmor(this.name!)) {
            if (this.attribute! === role.attribute!) {
                basePower = _.floor(basePower * 1.5);
            }
        }
        const maxExperience = _.floor(Math.abs(basePower) * 0.2) * 1000;
        const effectedExperience = _.min([maxExperience, this.experience])!;

        const actualPower = basePower + _.floor(effectedExperience / 1000) + this.additionalPower!;
        let color = "none";
        if (this.isWeapon) color = "red";
        if (this.isArmor) color = "green";
        if (this.isAccessory) color = "blue";

        return this.power + "/<span style='color:" + color + "'>" + actualPower + "</span>";
    }

    calculateActualWeightHTML() {
        if (this.isItem) return "-";
        const actualWeight = this.weight! + this.additionalWeight!;
        let color = "none";
        if (this.isWeapon) color = "red";
        if (this.isArmor) color = "green";
        if (this.isAccessory) color = "blue";
        return this.weight + "/<span style='color:" + color + "'>" + actualWeight + "</span>";
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
    for (const it of EquipmentConstants.ATTRIBUTE_HEAVY_ARMOR_ITEM_LIST) {
        if (name.endsWith(it)) {
            return true;
        }
    }
    return false;
}

class EquipmentPosition {

    fullName?: string;      // 装备的全名
    sequence?: number;      // 出现的位置是同名的第几个

}

export {Equipment, EquipmentPosition};