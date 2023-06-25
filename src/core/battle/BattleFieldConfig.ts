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

}

export = BattleFieldConfig;