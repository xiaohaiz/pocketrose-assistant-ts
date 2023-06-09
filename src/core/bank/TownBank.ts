import Credential from "../../util/Credential";
import MessageBoard from "../../util/MessageBoard";
import NetworkUtils from "../../util/NetworkUtils";
import PocketUtils from "../../util/PocketUtils";
import TownLoader from "../town/TownLoader";
import BankAccount from "./BankAccount";
import TownBankPage from "./TownBankPage";
import TownBankPageParser from "./TownBankPageParser";

class TownBank {

    readonly #credential: Credential;
    readonly #townId?: string;

    constructor(credential: Credential, townId?: string) {
        this.#credential = credential;
        this.#townId = townId;
    }

    get bankTitle() {
        if (this.#townId === undefined) {
            return "口袋银行";
        } else {
            const town = TownLoader.load(this.#townId)!;
            return town.name + "分行";
        }
    }

    async open(): Promise<TownBankPage> {
        const action = () => {
            return new Promise<TownBankPage>(resolve => {
                const request = this.#credential.asRequestMap();
                request.set("con_str", "50");
                request.set("mode", "BANK");
                if (this.#townId !== undefined) {
                    request.set("town", this.#townId);
                }
                NetworkUtils.post("town.cgi", request).then(html => {
                    new TownBankPageParser().parse(html).then(page => resolve(page));
                });
            });
        };
        return await action();
    }

    async load(): Promise<BankAccount> {
        const action = () => {
            return new Promise<BankAccount>(resolve => {
                this.open().then(page => {
                    resolve(page.account!);
                });
            });
        };
        return await action();
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
                        const request = this.#credential.asRequestMap();
                        request.set("dasu", amount.toString());
                        request.set("mode", "BANK_BUY");
                        NetworkUtils.post("town.cgi", request).then(html => {
                            if (html.includes("您在钱庄里没那么多存款")) {
                                MessageBoard.publishWarning("并没有那么多存款！");
                                reject();
                            } else {
                                MessageBoard.publishMessage("从" + this.bankTitle + "取现了" + amount + "万现金。");
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
                const request = this.#credential.asRequestMap();
                if (amount === undefined) {
                    request.set("azukeru", "all");
                    request.set("mode", "BANK_SELL");
                    NetworkUtils.post("town.cgi", request).then(() => {
                        MessageBoard.publishMessage("在" + this.bankTitle + "存入了所有现金。");
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
                                    MessageBoard.publishMessage("在" + this.bankTitle + "存入了" + amount + "万现金。");
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
}

export = TownBank;