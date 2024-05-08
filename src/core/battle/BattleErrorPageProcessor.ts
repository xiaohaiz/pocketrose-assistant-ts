import BattleRecord from "./BattleRecord";
import BattleRecordStorage from "./BattleRecordStorage";
import Credential from "../../util/Credential";
import _ from "lodash";
import {BattleFailureRecordManager} from "./BattleFailureRecordManager";

class BattleErrorPageProcessor {

    private readonly credential: Credential;

    constructor(credential: Credential) {
        this.credential = credential;
    }

    async processErrorPage(errorPage: string) {
        if (!_.includes(errorPage, "ERROR !")) {
            return;
        }
        let errMsg = $(errorPage).find("font:first").html();
        const validationCodeFailed = errMsg.includes("选择验证码错误");
        errMsg = "<p style='color:red;font-size:200%'>" + errMsg + "</p>";

        const record = new BattleRecord();
        record.id = this.credential.id;
        record.html = errMsg;
        record.validationCodeFailed = validationCodeFailed;
        await BattleRecordStorage.write(record);

        if (validationCodeFailed) {
            await new BattleFailureRecordManager(this.credential).onValidationCodeFailure();
        }
    }

}

export {BattleErrorPageProcessor};