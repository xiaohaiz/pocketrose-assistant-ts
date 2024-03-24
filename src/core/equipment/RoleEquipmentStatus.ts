class RoleEquipmentStatus {

    id?: string;
    json?: string;
    updateTime?: number;

    asDocument() {
        const document: any = {};
        (this.id) && (document.id = this.id);
        (this.json) && (document.json = this.json);
        if (this.updateTime !== undefined) {
            document.updateTime = this.updateTime;
        } else {
            document.updateTime = new Date().getTime();
        }
        return document;
    }
}

export = RoleEquipmentStatus;