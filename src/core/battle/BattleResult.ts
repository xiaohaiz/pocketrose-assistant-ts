import NpcLoader from "../NpcLoader";
import PetLocationLoader from "../PetLocationLoader";

class BattleResult {

    id?: string;            // roleId/monster
    updateTime?: number;
    roleId?: string;
    monster?: string;
    winCount?: number;
    loseCount?: number;
    drawCount?: number;
    catchCount?: number;
    photoCount?: number;

    asObject() {
        const obj = {};
        // @ts-ignore
        obj.id = this.id!;
        if (this.updateTime !== undefined) {
            // @ts-ignore
            obj.updateTime = this.updateTime;
        }
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
        if (this.catchCount !== undefined) {
            // @ts-ignore
            obj.catchCount = this.catchCount!;
        }
        if (this.photoCount !== undefined) {
            // @ts-ignore
            obj.photoCount = this.photoCount!;
        }
        return obj;
    }

    get obtainWinCount() {
        return this.winCount === undefined ? 0 : this.winCount;
    }

    get obtainLoseCount() {
        return this.loseCount === undefined ? 0 : this.loseCount;
    }

    get obtainDrawCount() {
        return this.drawCount === undefined ? 0 : this.drawCount;
    }

    get obtainTotalCount(): number {
        return this.obtainWinCount + this.obtainLoseCount + this.obtainDrawCount;
    }

    get obtainWinRatio(): number {
        return this.obtainWinCount / this.obtainTotalCount;
    }

    get obtainBattleField(): string {
        if (this.monster === "博丽灵梦") {
            return "上洞";
        }
        if (NpcLoader.getZodiacNpcNames().includes(this.monster!)) {
            return "十二宫";
        }
        const location = PetLocationLoader.getPetLocation(this.monster!);
        if (location === null) {
            return "未知（" + this.monster + "）";
        }
        return location;
    }
}

export = BattleResult;