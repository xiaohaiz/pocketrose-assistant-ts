class PalaceTask {

    id?: string;            // role id
    updateTime?: number;    // update time
    monster?: string;       // 杀怪任务

    asObject(): {} {
        const obj = {};
        // @ts-ignore
        obj.id = this.id;
        // @ts-ignore
        obj.updateTime = this.updateTime;
        if (this.monster !== undefined) {
            // @ts-ignore
            obj.monster = this.monster;
        }
        return obj;
    }
}

export = PalaceTask;