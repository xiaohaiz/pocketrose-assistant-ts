class BankRecord {

    id?: string;
    roleId?: string;
    createTime?: number;
    updateTime?: number;
    recordDate?: string;
    cash?: number;
    saving?: number;
    revision?: number;

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
        if (this.updateTime !== undefined) {
            // @ts-ignore
            document.updateTime = this.updateTime;
        }
        if (this.recordDate) {
            // @ts-ignore
            document.recordDate = this.recordDate;
        }
        if (this.cash !== undefined) {
            // @ts-ignore
            document.cash = this.cash;
        }
        if (this.saving !== undefined) {
            // @ts-ignore
            document.saving = this.saving;
        }
        if (this.revision !== undefined) {
            // @ts-ignore
            document.revision = this.revision;
        }
        return document;
    }
}

export = BankRecord;