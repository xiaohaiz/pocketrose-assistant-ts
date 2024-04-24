import Credential from "../../util/Credential";
import MessageBoard from "../../util/MessageBoard";
import NetworkUtils from "../../util/NetworkUtils";
import PocketUtils from "../../util/PocketUtils";
import BankAccount from "./BankAccount";
import {TownBankPage} from "./BankPage";
import {TownBankPageParser} from "./BankPageParser";

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
        const request = this.credential.asRequestMap();
        request.set("con_str", "50");
        request.set("mode", "BANK");
        if (this.townId !== undefined) {
            request.set("town", this.townId);
        }
        const response = await NetworkUtils.post("town.cgi", request);
        const page = TownBankPageParser.parsePage(response);
        if (page.available) return page;
        if (count >= 2) return page;
        return await this.openWithRetries(count + 1);
    }

    async load(): Promise<BankAccount> {
        return (await this.open()).account!;
    }

    async withdraw(amount: number): Promise<void> {
        const action = () => {
            return new Promise<void>((resolve, reject) => {
                if (!PocketUtils.checkAmount(amount)) {
                    MessageBoard.publishWarning("无效的金额，必须是零或者正整数！");
                    reject();
                } else {
                    if (amount === 0) {
                        resolve();
                    } else {
                        const request = this.credential.asRequestMap();
                        request.set("dasu", amount.toString());
                        request.set("mode", "BANK_BUY");
                        NetworkUtils.post("town.cgi", request).then(html => {
                            if (html.includes("您在钱庄里没那么多存款")) {
                                MessageBoard.publishWarning("并没有那么多存款！");
                                reject();
                            } else {
                                MessageBoard.publishMessage("从城市银行取现了" + amount + "万现金。");
                                resolve();
                            }
                        });
                    }
                }
            });
        };
        return await action();
    }

    async deposit(amount?: number): Promise<void> {
        const action = () => {
            return new Promise<void>((resolve, reject) => {
                const request = this.credential.asRequestMap();
                if (amount === undefined) {
                    request.set("azukeru", "all");
                    request.set("mode", "BANK_SELL");
                    NetworkUtils.post("town.cgi", request).then(() => {
                        MessageBoard.publishMessage("在城市银行存入了所有现金。");
                        resolve();
                    });
                } else {
                    if (!PocketUtils.checkAmount(amount)) {
                        MessageBoard.publishWarning("无效的金额，必须是零或者正整数！");
                        reject();
                    } else {
                        if (amount === 0) {
                            resolve();
                        } else {
                            request.set("azukeru", amount.toString());
                            request.set("mode", "BANK_SELL");
                            NetworkUtils.post("town.cgi", request).then(html => {
                                if (html.includes("所持金不足")) {
                                    MessageBoard.publishWarning("并没有那么多现金！");
                                    reject();
                                } else {
                                    MessageBoard.publishMessage("在城市银行存入了" + amount + "万现金。");
                                    resolve();
                                }
                            });
                        }
                    }
                }
            });
        };
        return await action();
    }

    async transfer(target: string, amount: number) {
        const request = this.credential.asRequestMap();
        request.set("gold", (amount * 10).toString());  // 送钱的接口单位是K
        request.set("eid", target);
        request.set("mode", "MONEY_SEND2");
        const response = await NetworkUtils.post("town.cgi", request);
        MessageBoard.processResponseMessage(response);
    }
}

export = TownBank;