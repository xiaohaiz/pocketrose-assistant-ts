class BankRecord {

    id?: string;
    roleId?: string;
    createTime?: number;
    cash?: number;
    saving?: number;

    asDocument(): {} {
        const document = {};
        if (this.id) {
            // @ts-ignore
            document.id = this.id;
        }
        if (this.roleId) {
            // @ts-ignore
            document.roleId = this.roleId;
        }
        if (this.createTime !== undefined) {
            // @ts-ignore
            document.createTime = this.createTime;
        }
        if (this.cash !== undefined) {
            // @ts-ignore
            document.cash = this.cash;
        }
        if (this.saving !== undefined) {
            // @ts-ignore
            document.saving = this.saving;
        }
        return document;
    }
}

export = BankRecord;