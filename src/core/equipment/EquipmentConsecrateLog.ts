class EquipmentConsecrateLog {

    id?: string;
    createTime?: number;
    roleId?: string;
    equipments?: string;

    asDocument() {
        const document = {};
        // @ts-ignore
        (this.id) && (document.id = this.id);
        // @ts-ignore
        (this.createTime !== undefined) && (document.createTime = this.createTime);
        // @ts-ignore
        (this.roleId) && (document.roleId = this.roleId);
        // @ts-ignore
        (this.equipments) && (document.equipments = this.equipments);
        return document;
    }
}

export = EquipmentConsecrateLog;