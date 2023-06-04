class BattleRecord {

    id?: string;
    html?: string;

    asObject() {
        const obj = {};
        // @ts-ignore
        obj.id = this.id!;
        // @ts-ignore
        obj.html = this.html!;
        return obj;
    }

}

export = BattleRecord;