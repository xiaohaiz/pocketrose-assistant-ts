class GemFuseLog {

    id?: string;
    roleId?: string;
    createTime?: number;
    gem?: string;
    effort?: number;        // 七心宝石1成功，0失败
    equipment?: string;
    success?: boolean;

    asDocument() {
        const document: any = {};
        (this.id) && (document.id = this.id);
        (this.roleId) && (document.roleId = this.roleId);
        (this.createTime !== undefined) && (document.createTime = this.createTime);
        (this.gem) && (document.gem = this.gem);
        (this.effort !== undefined) && (document.effort = this.effort);
        (this.equipment) && (document.equipment = this.equipment);
        (this.success !== undefined) && (document.success = this.success);
        return document;
    }
}

export = GemFuseLog;