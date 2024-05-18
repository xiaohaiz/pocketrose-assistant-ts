import BankAccount from "./BankAccount";
import Credential from "../../util/Credential";
import MessageBoard from "../../util/MessageBoard";
import PocketUtils from "../../util/PocketUtils";
import _ from "lodash";
import {CastleBankPageParser} from "./BankPageParser";
import {CastleBankPage} from "./BankPage";
import {PocketLogger} from "../../pocket/PocketLogger";
import {PocketNetwork} from "../../pocket/PocketNetwork";

const logger = PocketLogger.getLogger("BANK");

class CastleBank {

    readonly #credential: Credential;

    constructor(credential: Credential) {
        this.#credential = credential;
    }

    async open(): Promise<CastleBankPage> {
        return await this._open();
    }

    private async _open(count: number = 0): Promise<CastleBankPage> {
        const request = this.#credential.asRequest();
        request.set("mode", "CASTLE_BANK");
        const response = await PocketNetwork.post("castle.cgi", request);
        const page = CastleBankPageParser.parsePage(response.html);
        response.touch();
        logger.debug("Castle bank page loaded.", response.durationInMillis);
        if (page.available) return page;
        if (count >= 2) return page;
        return await this._open(count + 1);
    }

    async load(): Promise<BankAccount> {
        return (await this.open()).account!;
    }

    async deposit(amount?: number) {
        const request = this.#credential.asRequest();
        if (amount === undefined) {
            // deposit all
            request.set("azukeru", "all");
            request.set("mode", "CASTLEBANK_SELL");
            await PocketNetwork.post("castle.cgi", request);
            logger.info("在城堡支行存入全部现金。");
        } else {
            // deposit specified amount
            if (!PocketUtils.checkAmount(amount)) {
                logger.warn("非法的金额" + amount + "！");
                return;
            } else if (amount === 0) {
                // 真逗，没钱凑什么热闹。
                return;
            } else {
                request.set("azukeru", amount.toString());
                request.set("mode", "CASTLEBANK_SELL");
                await PocketNetwork.post("castle.cgi", request);
                logger.info("在城堡支行存入了" + amount + "万现金。");
            }
        }
    }

    async withdraw(amount: number) {
        if (isNaN(amount) || !Number.isInteger(amount) || amount < 0) {
            return;
        }
        if (amount === 0) {
            return;
        }
        const request = this.#credential.asRequest();
        request.set("dasu", amount.toString());
        request.set("mode", "CASTLEBANK_BUY");
        const response = await PocketNetwork.post("castle.cgi", request);
        if (_.includes(response.html, "您在钱庄里没那么多存款")) {
            MessageBoard.processResponseMessage(response.html);
            return;
        }
        logger.info("从城堡支行里提取了" + amount + "万现金。");
    }

    async transfer(target: string, amount: number) {
        const request = this.#credential.asRequest();
        request.set("gold", (amount * 10).toString());  // 送钱的接口单位是K
        request.set("eid", target);
        request.set("mode", "CASTLE_SENDMONEY2");
        const response = await PocketNetwork.post("castle.cgi", request);
        MessageBoard.processResponseMessage(response.html);
    }
}

export = CastleBank;