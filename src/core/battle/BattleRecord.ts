class BattleRecord {

    id?: string;
    html?: string;
    harvestList?: string[];

    asObject() {
        const obj = {};
        // @ts-ignore
        obj.id = this.id!;
        // @ts-ignore
        obj.html = this.html!;
        if (this.harvestList) {
            // @ts-ignore
            obj.harvestList = this.harvestList!;
        }
        return obj;
    }

}

export = BattleRecord;