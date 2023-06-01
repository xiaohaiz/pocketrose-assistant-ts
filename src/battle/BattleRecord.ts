class BattleRecord {

    id?: string;
    updateTime?: number;
    html?: string;

    constructor() {
        this.updateTime = new Date().getTime();
    }

    asObject() {
        const obj = {};
        // @ts-ignore
        obj.id = this.id!;
        // @ts-ignore
        obj.updateTime = this.updateTime!;
        // @ts-ignore
        obj.html = this.html!;
        return obj;
    }

}

export = BattleRecord;