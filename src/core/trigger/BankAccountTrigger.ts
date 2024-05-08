import _ from "lodash";
import Credential from "../../util/Credential";
import {DayRange} from "../../util/PocketDateUtils";
import BankRecord from "../bank/BankRecord";
import BankRecordStorage from "../bank/BankRecordStorage";
import TownBank from "../bank/TownBank";
import {PocketLogger} from "../../pocket/PocketLogger";

const logger = PocketLogger.getLogger("BANK");

/**
 * ============================================================================
 * 银 行 账 户 触 发 器
 * ----------------------------------------------------------------------------
 * 1. 战斗定期触发，战数尾数73。
 * 2. 秘宝之岛战斗后触发。
 * 3. 退出城市银行时触发。
 * ============================================================================
 */
class BankAccountTrigger {

    readonly #credential: Credential;

    constructor(credential: Credential) {
        this.#credential = credential;
    }

    async triggerUpdate() {
        const account = await new TownBank(this.#credential).load();
        if (_.isNaN(account.cash) || _.isNaN(account.saving)) {
            return;
        }
        const data = new BankRecord();
        data.roleId = this.#credential.id;
        data.recordDate = DayRange.current().asText();
        data.cash = account.cash;
        data.saving = account.saving;
        await BankRecordStorage.getInstance().upsert(data);
        logger.debug("Bank record saved.");
    }

    static async importFromJson(json: string) {
        const documentList = JSON.parse(json);
        $("#bankRecordCount").html(documentList.length);
        if (documentList.length > 0) doImport(0, documentList);
    }
}

function doImport(index: number, documentList: {}[]) {
    const document = documentList[index];
    if (!document) {
        return;
    }
    const data = new BankRecord();
    // @ts-ignore
    data.id = document.id;
    // @ts-ignore
    data.roleId = document.roleId;
    // @ts-ignore
    data.createTime = document.createTime;
    // @ts-ignore
    data.updateTime = document.updateTime;
    // @ts-ignore
    data.recordDate = document.recordDate;
    // @ts-ignore
    data.cash = document.cash;
    // @ts-ignore
    data.saving = document.saving;
    // @ts-ignore
    data.revision = document.revision;

    BankRecordStorage.getInstance().replay(data)
        .then(() => {
            let c = _.parseInt($("#importedBankRecordCount").text());
            c++;
            $("#importedBankRecordCount").text(c);
            doImport(index + 1, documentList);
        })
        .catch(() => {
            let c = _.parseInt($("#duplicatedBankRecordCount").text());
            c++;
            $("#duplicatedBankRecordCount").text(c);
            doImport(index + 1, documentList);
        });
}

export = BankAccountTrigger;