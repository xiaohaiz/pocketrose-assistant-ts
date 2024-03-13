class BattleFieldConfig {

    primary = false;
    junior = false;
    senior = false;
    zodiac = false;

    get configured() {
        return this.primary || this.junior || this.senior || this.zodiac;
    }

    get count() {
        let count = 0;
        this.primary && count++;
        this.junior && count++;
        this.senior && count++;
        this.zodiac && count++;
        return count;
    }

    asDocument(): {} {
        const document = {};
        // @ts-ignore
        document["primary"] = this.primary;
        // @ts-ignore
        document["junior"] = this.junior;
        // @ts-ignore
        document["senior"] = this.senior;
        // @ts-ignore
        document["zodiac"] = this.zodiac;
        return document;
    }

}

export = BattleFieldConfig;