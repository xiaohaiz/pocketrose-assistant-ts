import BankAccount from "./BankAccount";
import Credential from "../../util/Credential";
import MessageBoard from "../../util/MessageBoard";
import PocketUtils from "../../util/PocketUtils";
import {TownDashboardPage, TownDashboardPageParser} from "../dashboard/TownDashboardPage";
import _ from "lodash";
import {PocketLogger} from "../../pocket/PocketLogger";
import {PocketNetwork} from "../../pocket/PocketNetwork";
import {TownBankPageParser} from "./BankPageParser";
import {TownBankPage} from "./BankPage";

const logger = PocketLogger.getLogger("BANK");

class TownBank {

    private readonly credential: Credential;
    private readonly townId?: string;

    constructor(credential: Credential, townId?: string) {
        this.credential = credential;
        this.townId = townId;
    }

    async open(): Promise<TownBankPage> {
        return await this.openWithRetries();
    }

    private async openWithRetries(count: number = 0): Promise<TownBankPage> {
        const request = this.credential.asRequest();
        request.set("con_str", "50");
        request.set("mode", "BANK");
        if (this.townId !== undefined) {
            request.set("town", this.townId);
        }
        const response = await PocketNetwork.post("town.cgi", request);
        const page = TownBankPageParser.parsePage(response.html);
        response.touch();
        logger.debug("Town bank page loaded.", response.durationInMillis);
        if (page.available) return page;
        if (count >= 2) return page;
        return await this.openWithRetries(count + 1);
    }

    async load(): Promise<BankAccount> {
        return (await this.open()).account!;
    }

    async withdraw(amount: number) {
        if (!PocketUtils.checkAmount(amount)) {
            logger.warn("无效的金额，必须是零或者正整数！");
            return;
        } else {
            if (amount === 0) {
                return;
            } else {
                const request = this.credential.asRequest();
                request.set("dasu", amount.toString());
                request.set("mode", "BANK_BUY");
                const response = await PocketNetwork.post("town.cgi", request);
                if (_.includes(response.html, "您在钱庄里没那么多存款")) {
                    MessageBoard.processResponseMessage(response.html);
                    return;
                }
                logger.info("从城市银行取现了" + amount + "万现金。");
            }
        }
    }

    async depositAll(): Promise<TownDashboardPage> {
        const request = this.credential.asRequest();
        request.set("azukeru", "all");
        request.set("mode", "BANK_SELL");
        const response = await PocketNetwork.post("town.cgi", request);
        const page = new TownDashboardPageParser(this.credential).parse(response.html);
        response.touch();
        logger.debug("All cash deposited into bank and dashboard page returned.", response.durationInMillis);
        return page;
    }

    async deposit(amount?: number) {
        const request = this.credential.asRequest();
        if (amount === undefined) {
            request.set("azukeru", "all");
            request.set("mode", "BANK_SELL");
            await PocketNetwork.post("town.cgi", request);
            logger.info("在城市银行存入了所有现金。");
        } else {
            if (!PocketUtils.checkAmount(amount)) {
                logger.warn("无效的金额，必须是零或者正整数！");
                return;
            } else {
                if (amount === 0) {
                    return;
                } else {
                    request.set("azukeru", amount.toString());
                    request.set("mode", "BANK_SELL");
                    const response = await PocketNetwork.post("town.cgi", request);
                    if (_.includes(response.html, "所持金不足")) {
                        MessageBoard.processResponseMessage(response.html);
                        return;
                    }
                    logger.info("在城市银行存入了" + amount + "万现金。");
                }
            }
        }
    }

    async transfer(target: string, amount: number) {
        const request = this.credential.asRequest();
        request.set("gold", (amount * 10).toString());  // 送钱的接口单位是K
        request.set("eid", target);
        request.set("mode", "MONEY_SEND2");
        const response = await PocketNetwork.post("town.cgi", request);
        MessageBoard.processResponseMessage(response.html);
    }
}

export = TownBank;