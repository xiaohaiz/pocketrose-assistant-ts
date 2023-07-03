class BattleScene {

    id?: string;
    updateTime?: number;
    roleId?: string;
    request?: string;
    beforePage?: string;
    afterPage?: string;

    asDocument() {
        const document: any = {};
        (this.id) && (document.id = this.id);
        (this.updateTime !== undefined) && (document.updateTime = this.updateTime);
        (this.roleId) && (document.roleId = this.roleId);
        (this.request) && (document.request = this.request);
        (this.beforePage) && (document.beforePage = this.beforePage);
        (this.afterPage) && (document.afterPage = this.afterPage);
        return document;
    }
}

export = BattleScene;