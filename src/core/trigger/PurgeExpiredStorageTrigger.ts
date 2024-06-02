import Credential from "../../util/Credential";
import BankRecordStorage from "../bank/BankRecordStorage";
import TeamMemberLoader from "../team/TeamMemberLoader";
import BattleLogStorage from "../battle/BattleLogStorage";
import {BattleFailureRecordStorage} from "../battle/BattleFailureRecordStorage";
import CareerChangeLogStorage from "../career/CareerChangeLogStorage";
import EquipmentConsecrateLogStorage from "../equipment/EquipmentConsecrateLogStorage";
import GemFuseLogStorage from "../forge/GemFuseLogStorage";

class PurgeExpiredStorageTrigger {

    private readonly credential: Credential;

    constructor(credential: Credential) {
        this.credential = credential;
    }

    async triggerPurgeExpiredStorage() {
        if (!TeamMemberLoader.isMaster(this.credential.id)) return;
        await Promise.all([
            BankRecordStorage.purgeExpired(),
            BattleFailureRecordStorage.purgeExpired(),
            BattleLogStorage.purgeExpired(),
            CareerChangeLogStorage.purgeExpired(),
            EquipmentConsecrateLogStorage.purgeExpired(),
            GemFuseLogStorage.purgeExpired(),
        ]);
    }

}

export {PurgeExpiredStorageTrigger};