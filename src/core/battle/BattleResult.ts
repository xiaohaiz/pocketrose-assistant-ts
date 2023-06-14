import _ from "lodash";
import MonsterProfileDict from "../monster/MonsterProfileDict";
import NpcLoader from "../role/NpcLoader";
import BattleLog from "./BattleLog";

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
    treasures?: Map<string, number>;

    static newInstance(log: BattleLog): BattleResult {
        const data = new BattleResult();
        data.id = log.roleId + "/" + log.monster;
        data.updateTime = log.createTime;
        data.roleId = log.roleId;
        data.monster = log.monster;
        switch (log.result) {
            case "战胜":
                data.winCount = 1;
                break;
            case "战败":
                data.loseCount = 1;
                break;
            case "平手":
                data.drawCount = 1;
                break;
        }
        data.catchCount = log.catch;
        data.photoCount = log.photo;
        data.treasures = log.treasures;
        return data;
    }

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

        if (this.treasures !== undefined) {
            // @ts-ignore
            obj.treasures = {};

            this.treasures!.forEach((v, k) => {
                // @ts-ignore
                obj.treasures[k] = v;
            });
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

    get obtainCatchCount() {
        return this.catchCount === undefined ? 0 : this.catchCount;
    }

    get obtainPhotoCount() {
        return this.photoCount === undefined ? 0 : this.photoCount;
    }

    get obtainTotalCount(): number {
        return this.obtainWinCount + this.obtainLoseCount + this.obtainDrawCount;
    }

    get obtainTreasureCount(): number {
        if (this.treasures === undefined) {
            return 0;
        }
        let treasureCount = 0;
        this.treasures.forEach((v, k) => {
            const code = _.parseInt(k);
            if (code >= 1 && code <= 49) {
                treasureCount += v;
            }
        });
        return treasureCount;
    }

    get obtainTreasureHintCount(): number {
        if (this.treasures === undefined) {
            return 0;
        }
        let treasureHintCount = 0;
        this.treasures.forEach((v, k) => {
            const code = _.parseInt(k);
            if (code === 50) {
                treasureHintCount += v;
            }
        });
        return treasureHintCount;
    }

    get obtainGemCount(): number {
        if (this.treasures === undefined) {
            return 0;
        }
        let gemCount = 0;
        this.treasures.forEach((v, k) => {
            const code = _.parseInt(k);
            if (code >= 51 && code <= 53) {
                gemCount += v;
            }
        });
        return gemCount;
    }

    get obtainBattleField(): string {
        if (this.monster === "博丽灵梦") {
            return "上洞";
        }
        if (NpcLoader.getZodiacNpcNames().includes(this.monster!)) {
            return "十二宫";
        }
        const location = MonsterProfileDict.load(this.monster)?.locationText;
        return location ? location : "未知（" + this.monster + "）";
    }
}

export = BattleResult;