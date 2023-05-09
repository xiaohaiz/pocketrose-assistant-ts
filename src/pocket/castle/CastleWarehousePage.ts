import Equipment from "../../common/Equipment";
import Credential from "../../util/Credential";

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