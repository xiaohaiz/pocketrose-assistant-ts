import Credential from "../../util/Credential";
import {PersonalSalaryRecordStorage} from "../bank/PersonalSalaryRecordStorage";
import {PersonalSalary} from "../bank/PersonalSalary";
import TownBank from "../bank/TownBank";

class PersonalSalaryTrigger {

    private readonly credential: Credential;

    constructor(credential: Credential) {
        this.credential = credential;
    }

    async triggerReceive(battleCount: number) {
        let doReceive: boolean;
        const record = await PersonalSalaryRecordStorage.load(this.credential.id);
        if (record === null) {
            // 没有之前的领取记录，尝试自动领取一次吧，会触发创建新的记录。
            doReceive = true;
        } else {
            doReceive = record.canReceive(battleCount);
        }
        if (doReceive) {
            const ps = new PersonalSalary(this.credential);
            ps.battleCount = battleCount;
            if (await ps.receiveSalary()) {
                await new TownBank(this.credential).deposit();
            }
        }
    }

}

export {PersonalSalaryTrigger};