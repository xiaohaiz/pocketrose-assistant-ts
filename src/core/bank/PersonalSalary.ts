import Credential from "../../util/Credential";
import MessageBoard from "../../util/MessageBoard";
import _ from "lodash";
import {PersonalSalaryRecord} from "./PersonalSalaryRecord";
import {PersonalStatus} from "../role/PersonalStatus";
import {PersonalSalaryRecordStorage} from "./PersonalSalaryRecordStorage";
import StringUtils from "../../util/StringUtils";
import {PocketNetwork} from "../../pocket/PocketNetwork";
import {PocketLogger} from "../../pocket/PocketLogger";

const logger = PocketLogger.getLogger("SALARY");

class PersonalSalary {

    private readonly credential: Credential;
    private readonly townId?: string;

    constructor(credential: Credential, townId?: string) {
        this.credential = credential;
        this.townId = townId;
    }

    battleCount?: number;

    private async initializeBattleCount() {
        if (this.battleCount === undefined) {
            const role = await new PersonalStatus(this.credential).load();
            this.battleCount = role.battleCount;
        }
    }

    async receiveSalary() {
        const request = this.credential.asRequest();
        request.set("mode", "SALARY");
        if (this.townId !== undefined) {
            request.set("town", this.townId);
        }
        const response = await PocketNetwork.post("mydata.cgi", request);
        MessageBoard.processResponseMessage(response.html);
        return await this._processResponse(response.html);
    }

    private async _processResponse(response: string) {
        let success = false;
        const record = new PersonalSalaryRecord();
        record.id = this.credential.id;
        record.createTime = new Date().getTime();
        await this.initializeBattleCount();
        record.battleCount = this.battleCount;
        if (_.includes(response, "领取了")) {
            // 成功
            record.code = 0;
            record.estimatedTime = record.createTime! + 86400 * 7 * 1000;   // 7天后可再次领取
            record.estimatedBattleCount = record.battleCount! + 300;        // 300战后可领取
            success = true;
        } else if (_.includes(response, "下次领取俸禄还需要等待")) {
            // 时间不到
            // e.g. 下次领取俸禄还需要等待 604757 秒。
            record.code = 1;
            let s = StringUtils.substringAfter(response, "下次领取俸禄还需要等待 ");
            s = StringUtils.substringBefore(s, " 秒。");
            record.requiredTime = _.parseInt(s);
            record.estimatedTime = record.createTime! + record.requiredTime! * 1000 + 1000;
        } else if (_.includes(response, "虽然到了领取俸禄时间")) {
            // 战数不够
            // e.g. 虽然到了领取俸禄时间，但是您只战斗了95战，需要300战才可以领取。
            record.code = 2;
            let s = StringUtils.substringAfter(response, "虽然到了领取俸禄时间，但是您只战斗了");
            s = StringUtils.substringBefore(s, "战，需要300战才可以领取。");
            const occurs = _.parseInt(s);
            record.requiredBattleCount = (300 - occurs);
            record.estimatedBattleCount = record.battleCount! + record.requiredBattleCount!;
        } else {
            record.code = -1;
        }
        await PersonalSalaryRecordStorage.write(record);
        logger.debug("Personal salary record saved into IndexedDB (code=" + record.code + ").");
        return success;
    }
}

export {PersonalSalary};