class BattleScene {

    id?: string;
    updateTime?: number;
    roleId?: string;
    request?: string;
    beforePage?: string;
    afterPage?: string;

    asDocument() {
        const document = {};
        if (this.id) {
            // @ts-ignore
            document.id = this.id;
        }
        if (this.updateTime) {
            // @ts-ignore
            document.updateTime = this.updateTime;
        }
        if (this.roleId) {
            // @ts-ignore
            document.roleId = this.roleId;
        }
        if (this.request) {
            // @ts-ignore
            document.request = this.request;
        }
        if (this.beforePage) {
            // @ts-ignore
            document.beforePage = this.beforePage;
        }
        if (this.afterPage) {
            // @ts-ignore
            document.afterPage = this.afterPage;
        }
        return document;
    }
}

export = BattleScene;