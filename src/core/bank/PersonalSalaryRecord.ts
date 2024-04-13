class PersonalSalaryRecord {

    id?: string;
    createTime?: number;
    battleCount?: number;           // 战数
    code?: number;                  // 0-成功；1-时间不到；2-战数不够；负数-原因不明
    requiredTime?: number;          // 还需要多少秒
    requiredBattleCount?: number;   // 还需要多少战
    estimatedTime?: number;         // 预估下次领取的时间
    estimatedBattleCount?: number;  // 预估下次领取需要的战数

    asDocument() {
        const document: any = {};
        (this.id) && (document.id = this.id);
        (this.createTime !== undefined) && (document.createTime = this.createTime);
        (this.battleCount !== undefined) && (document.battleCount = this.battleCount);
        (this.code !== undefined) && (document.code = this.code);
        (this.requiredTime !== undefined) && (document.requiredTime = this.requiredTime);
        (this.requiredBattleCount !== undefined) && (document.requiredBattleCount = this.requiredBattleCount);
        (this.estimatedTime !== undefined) && (document.estimatedTime = this.estimatedTime);
        (this.estimatedBattleCount !== undefined) && (document.estimatedBattleCount = this.estimatedBattleCount);
        return document;
    }

    canReceive(battleCount: number): boolean {
        const now = new Date().getTime();
        switch (this.code!) {
            case 0:
                return battleCount >= this.estimatedBattleCount! && now >= this.estimatedTime!;
            case 1:
                return now >= this.estimatedTime!;
            case 2:
                return battleCount >= this.estimatedBattleCount!;
            default:
                return false;
        }
    }
}

export {PersonalSalaryRecord};