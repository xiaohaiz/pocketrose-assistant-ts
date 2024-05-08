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

    get personalPetCount() {
        return this.petList?.filter(it => it.location === "P").length ?? 0;
    }

    get cagePetCount() {
        return this.petList?.filter(it => it.location === "C").length ?? 0;
    }

    get ranchPetCount() {
        return this.petList?.filter(it => it.location === "R").length ?? 0;
    }

}

export {RolePetStatus, RolePetStatusReport};