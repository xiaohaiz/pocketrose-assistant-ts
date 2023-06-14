class TeamMember {

    index?: number;
    name?: string;
    id?: string;
    pass?: string;
    external?: boolean;     // 团队编制外，不纳入统计

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
        return obj;
    }
}

export = TeamMember;