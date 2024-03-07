class BattleRecord {

    id?: string;
    html?: string;
    harvestList?: string[];
    petEggHatched?: boolean;        // 是否宠物蛋孵化
    petSpellLearned?: boolean;      // 是否宠物学会新技能
    validationCodeFailed?: boolean; // 是否验证码选择错误

    asObject() {
        const obj = {};
        // @ts-ignore
        obj.id = this.id!;
        // @ts-ignore
        obj.html = this.html!;
        if (this.harvestList) {
            // @ts-ignore
            obj.harvestList = this.harvestList!;
        }
        if (this.petEggHatched) {
            // @ts-ignore
            obj.petEggHatched = this.petEggHatched!;
        }
        if (this.petSpellLearned) {
            // @ts-ignore
            obj.petSpellLearned = this.petSpellLearned!;
        }
        if (this.validationCodeFailed) {
            // @ts-ignore
            obj.validationCodeFailed = this.validationCodeFailed!;
        }
        return obj;
    }

}

export = BattleRecord;