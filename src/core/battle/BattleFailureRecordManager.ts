import Credential from "../../util/Credential";
import {BattleFailureRecord} from "./BattleFailureRecord";
import {BattleFailureRecordStorage} from "./BattleFailureRecordStorage";
import _ from "lodash";
import StorageUtils from "../../util/StorageUtils";

class BattleFailureRecordManager {

    private readonly credential: Credential;

    constructor(credential: Credential) {
        this.credential = credential;
    }

    async onValidationCodeFailure() {
        const record = BattleFailureRecord.newInstance();
        record.roleId = this.credential.id;
        record.validationCodeFailure = true;
        await BattleFailureRecordStorage.write(record);
    }

    async findValidationCodeFailureRecords(): Promise<BattleFailureRecord[]> {
        // 查找一个小时零五分之前的记录
        const startTime = new Date().getTime() - 3900000;
        return _.forEach(await BattleFailureRecordStorage.findRecords(startTime))
            .filter(it => it.roleId === this.credential.id)
            .filter(it => it.validationCodeFailure);
    }

    async getValidationCodeFailureCount(): Promise<number> {
        const records = await this.findValidationCodeFailureRecords();
        return records.length;
    }

    static loadConfiguredThreshold(): number {
        const key: string = "_pa_071";
        return StorageUtils.getInt(key, 0);
    }
}

export {BattleFailureRecordManager};