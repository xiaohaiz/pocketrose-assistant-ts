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

    asDocument(): {} {
        const doc = {};
        if (this.name) {
            // @ts-ignore
            doc.name = this.name;
        }
        if (this.id) {
            // @ts-ignore
            doc.id = this.id;
        }
        if (this.pass) {
            // @ts-ignore
            doc.pass = this.pass;
        }
        if (this.external) {
            // @ts-ignore
            doc.external = this.external;
        }
        if (this.master) {
            // @ts-ignore
            doc.master = this.master;
        }
        if (this.warehouse) {
            // @ts-ignore
            doc.warehouse = this.warehouse;
        }
        return doc;
    }
}

export = TeamMember;