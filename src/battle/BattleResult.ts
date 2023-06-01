class BattleResult {

    id?: string;
    updateTime?: number;
    monster?: string;
    winCount?: number;
    loseCount?: number;
    drawCount?: number;

    constructor() {
        this.updateTime = new Date().getTime();
    }
}

export = BattleResult;