class BattleFieldConfig {

    primary = false;
    junior = false;
    senior = false;
    zodiac = false;

    get configured() {
        return this.primary || this.junior || this.senior || this.zodiac;
    }

}

export = BattleFieldConfig;