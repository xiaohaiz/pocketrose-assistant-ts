class GemFuseLog {

    id?: string;
    roleId?: string;
    createTime?: number;
    gem?: string;
    effort?: number;

    asDocument() {
        const document = {};
        // @ts-ignore
        (this.id) && (document.id = this.id);
        // @ts-ignore
        (this.roleId) && (document.roleId = this.roleId);
        // @ts-ignore
        (this.createTime !== undefined) && (document.createTime = this.createTime);
        // @ts-ignore
        (this.gem) && (document.gem = this.gem);
        // @ts-ignore
        (this.effort !== undefined) && (document.effort = this.effort);
        return document;
    }
}

export = GemFuseLog;