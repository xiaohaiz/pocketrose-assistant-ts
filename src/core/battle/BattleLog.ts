import MonsterProfileLoader from "../monster/MonsterProfileLoader";
import NpcLoader from "../role/NpcLoader";

class BattleLog {

    id?: string;
    createTime?: number;
    roleId?: string;
    monster?: string;
    result?: string;
    catch?: number;
    photo?: number;
    treasures?: Map<string, number>;

    asObject() {
        const obj = {};
        // @ts-ignore
        obj.id = this.id;
        // @ts-ignore
        obj.createTime = this.createTime;
        if (this.roleId !== undefined) {
            // @ts-ignore
            obj.roleId = this.roleId;
        }
        if (this.monster !== undefined) {
            // @ts-ignore
            obj.monster = this.monster;
        }
        if (this.result !== undefined) {
            // @ts-ignore
            obj.result = this.result;
        }
        if (this.catch !== undefined) {
            // @ts-ignore
            obj.catch = this.catch;
        }
        if (this.photo !== undefined) {
            // @ts-ignore
            obj.photo = this.photo!;
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

    get obtainBattleField(): string {
        if (this.monster === "博丽灵梦") {
            return "上洞";
        }
        if (NpcLoader.getZodiacNpcNames().includes(this.monster!)) {
            return "十二宫";
        }
        let location = MonsterProfileLoader.load(this.monster)?.locationText;
        return location ? location : "未知（" + this.monster + "）";
    }
}

export = BattleLog;