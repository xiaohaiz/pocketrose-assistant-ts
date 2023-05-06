import Credential from "../../util/Credential";
import Equipment from "../Equipment";

class CastleWarehousePage {

    readonly credential: Credential;

    roleCash?: number;
    personalEquipmentList?: Equipment[];
    storageEquipmentList?: Equipment[];

    constructor(credential: Credential) {
        this.credential = credential;
    }
}

export = CastleWarehousePage;