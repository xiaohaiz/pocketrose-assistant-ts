import ObjectID from "bson-objectid";
import MonsterProfileDict from "../monster/MonsterProfileDict";
import NpcLoader from "../NpcLoader";

class BattleLog {

    id?: string;
    createTime?: number;
    roleId?: string;
    monster?: string;
    result?: string;
    catch?: number;
    photo?: number;
    treasures?: Map<string, number>;

    initialize(): BattleLog {
        if (this.id === undefined) {
            this.id = ObjectID().toHexString();
        }
        if (this.createTime === undefined) {
            this.createTime = new Date().getTime();
        }
        return this;
    }

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
        let location = MonsterProfileDict.load(this.monster)?.locationText;
        return location ? location : "未知（" + this.monster + "）";
    }
}

export = BattleLog;