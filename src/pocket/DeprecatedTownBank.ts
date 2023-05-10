import Credential from "../util/Credential";
import MessageBoard from "../util/MessageBoard";
import NetworkUtils from "../util/NetworkUtils";
import StringUtils from "../util/StringUtils";
import BankAccount from "./BankAccount";

/**
 * @deprecated
 */
class DeprecatedTownBank {

    readonly #credential: Credential;

    constructor(credential: Credential) {
        this.#credential = credential;
    }

    async loadBankAccount(): Promise<BankAccount> {
        const action = (credential: Credential) => {
            return new Promise<BankAccount>(resolve => {
                const request = credential.asRequest();
                // @ts-ignore
                request["con_str"] = "50";
                // @ts-ignore
                request["mode"] = "BANK";
                NetworkUtils.sendPostRequest("town.cgi", request, function (html) {
                    const account = new BankAccount();
                    account.credential = credential;
                    const font = $(html).find("font:contains('现在的所持金'):first");
                    let s = $(font).text();
                    s = StringUtils.substringBefore(s, "现在的所持金");
                    account.name = s.substring(1);
                    account.cash = parseInt($(font).find("font:first").text());
                    account.saving = parseInt($(font).find("font:last").text());
                    resolve(account);
                });
            });
        };
        return await action(this.#credential);
    }

    async deposit(amount?: number): Promise<boolean> {
        const action = (credential: Credential, amount?: number) => {
            return new Promise<boolean>(resolve => {
                const request = credential.asRequest();
                // @ts-ignore
                request["mode"] = "BANK_SELL";
                if (amount === undefined || amount === null) {
                    // @ts-ignore
                    request["azukeru"] = "all";
                    NetworkUtils.sendPostRequest("town.cgi", request, function () {
                        MessageBoard.publishMessage("在城市银行存入了全部现金。");
                        resolve(true);
                    });
                } else {
                    if (amount <= 0) {
                        resolve(true);
                    } else {
                        // @ts-ignore
                        request["azukeru"] = amount;
                        NetworkUtils.sendPostRequest("town.cgi", request, function (html: string) {
                            if ($(html).text().includes("所持金不足")) {
                                MessageBoard.publishWarning("银行出纳鄙视的说：你身上并没有" + amount + "万现金。");
                                resolve(false);
                            } else {
                                MessageBoard.publishMessage("在城市银行存入了" + amount + "万现金。");
                                resolve(true);
                            }
                        });
                    }
                }
            });
        };
        return await action(this.#credential, amount);
    }

    async withdraw(amount: number): Promise<boolean> {
        const action = (credential: Credential, amount: number) => {
            return new Promise<boolean>(resolve => {
                if (amount === undefined || amount === null || amount <= 0) {
                    resolve(true);
                } else {
                    const request = credential.asRequest();
                    // @ts-ignore
                    request["mode"] = "BANK_BUY";
                    // @ts-ignore
                    request["dasu"] = amount;
                    NetworkUtils.sendPostRequest("town.cgi", request, function (html: string) {
                        if ($(html).text().includes("您在钱庄里没那么多存款")) {
                            MessageBoard.publishWarning("真可怜，银行里面连" + amount + "万存款都没有。");
                            resolve(false);
                        } else {
                            MessageBoard.publishMessage("从城市银行提取了" + amount + "万现金。");
                            resolve(true);
                        }
                    });
                }
            });
        };
        return await action(this.#credential, amount);
    }

}

export = DeprecatedTownBank;