class TeamMember {

    index?: number;
    name?: string;
    id?: string;
    pass?: string;
    external?: boolean;     // 团队编制外，不纳入统计
    master?: boolean;       // 队长标记
    warehouse?: boolean;    // 仓储号，其城堡仓库/牧场不纳入统计

    get available(): boolean {
        return this.name !== undefined && this.id !== undefined && this.pass !== undefined;
    }

    asObject(): {} {
        const obj = {};
        if (this.name) {
            // @ts-ignore
            obj.name = this.name;
        }
        if (this.id) {
            // @ts-ignore
            obj.id = this.id;
        }
        if (this.pass) {
            // @ts-ignore
            obj.pass = this.pass;
        }
        if (this.external) {
            // @ts-ignore
            obj.external = this.external;
        }
        if (this.master) {
            // @ts-ignore
            obj.master = this.master;
        }
        return obj;
    }
}

export = TeamMember;