import Pet from "./Pet";

class RolePetStatus {

    id?: string;
    updateTime?: number;
    json?: string;

    asDocument() {
        const document: any = {};
        (this.id) && (document.id = this.id);
        (this.updateTime !== undefined) && (document.updateTime = this.updateTime);
        (this.json) && (document.json = this.json);
        return document;
    }
}

class RolePetStatusReport {

    roleId?: string;
    petList?: Pet[];

}

export {RolePetStatus, RolePetStatusReport};