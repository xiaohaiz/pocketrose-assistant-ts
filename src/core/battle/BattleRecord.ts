class BattleRecord {

    id?: string;
    createTime?: number;
    html?: string;
    harvestList?: string[];
    petEggHatched?: boolean;        // 是否宠物蛋孵化
    petSpellLearned?: boolean;      // 是否宠物学会新技能
    petBeforeLevel?: number;        // 宠物学习技能时，尝试记录缓存中宠物的等级，正常应该尾数为9
    validationCodeFailed?: boolean; // 是否验证码选择错误

    get available(): boolean {
        if (this.createTime === undefined) return true;     // 兼容老的数据（没有创建时间的字段）
        return Date.now() - this.createTime <= 300000;      // 5分钟之内的记录有效
    }

    get hasAdditionalNotification(): boolean {
        if (this.harvestList && this.harvestList.length > 0) {
            return true;
        }
        return !!this.petEggHatched || !!this.petSpellLearned || !!this.validationCodeFailed;
    }

    asDocument() {
        const document: any = {};
        (this.id) && (document.id = this.id);
        (this.createTime !== undefined) && (document.createTime = this.createTime);
        (this.html) && (document.html = this.html);
        (this.harvestList) && (document.harvestList = this.harvestList);
        (this.petEggHatched) && (document.petEggHatched = this.petEggHatched);
        (this.petSpellLearned) && (document.petSpellLearned = this.petSpellLearned);
        (this.petBeforeLevel !== undefined) && (document.petBeforeLevel = this.petBeforeLevel);
        (this.validationCodeFailed) && (document.validationCodeFailed = this.validationCodeFailed);
        return document;
    }


}

export = BattleRecord;