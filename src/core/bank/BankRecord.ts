class BankRecord {

    id?: string;
    roleId?: string;
    createTime?: number;
    updateTime?: number;
    recordDate?: string;
    cash?: number;
    saving?: number;
    revision?: number;

    asDocument() {
        const document: any = {};
        (this.id) && (document.id = this.id);
        (this.roleId) && (document.roleId = this.roleId);
        (this.createTime !== undefined) && (document.createTime = this.createTime);
        (this.updateTime !== undefined) && (document.updateTime = this.updateTime);
        (this.recordDate) && (document.recordDate = this.recordDate);
        (this.cash !== undefined) && (document.cash = this.cash);
        (this.saving !== undefined) && (document.saving = this.saving);
        (this.revision !== undefined) && (document.revision = this.revision);
        return document;
    }
}

export = BankRecord;