class BattleRecord {

    id?: string;
    createTime?: number;
    html?: string;

    constructor() {
        this.createTime = new Date().getTime();
    }

    asObject() {
        const obj = {};
        // @ts-ignore
        obj.id = this.id!;
        // @ts-ignore
        obj.createTime = this.createTime!;
        // @ts-ignore
        obj.html = this.html!;
        return obj;
    }

}

export = BattleRecord;