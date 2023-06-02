class BattleResult {

    id?: string;            // roleId/monster
    roleId?: string;
    monster?: string;
    winCount?: number;
    loseCount?: number;
    drawCount?: number;

    asObject() {
        const obj = {};
        // @ts-ignore
        obj.id = this.id!;
        // @ts-ignore
        obj.roleId = this.roleId!;
        // @ts-ignore
        obj.monster = this.monster!;
        if (this.winCount !== undefined) {
            // @ts-ignore
            obj.winCount = this.winCount!;
        }
        if (this.loseCount !== undefined) {
            // @ts-ignore
            obj.loseCount = this.loseCount!;
        }
        if (this.drawCount !== undefined) {
            // @ts-ignore
            obj.drawCount = this.drawCount!;
        }
        return obj;
    }
}

export = BattleResult;