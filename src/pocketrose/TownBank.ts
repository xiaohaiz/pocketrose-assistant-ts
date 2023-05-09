import BankAccount from "../common/BankAccount";
import Role from "../common/Role";
import TownLoader from "../core/TownLoader";
import BankUtils from "../util/BankUtils";
import Credential from "../util/Credential";
import MessageBoard from "../util/MessageBoard";
import NetworkUtils from "../util/NetworkUtils";
import StringUtils from "../util/StringUtils";
import TownBankPage from "./TownBankPage";

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
            const town = TownLoader.getTownById(this.#townId)!;
            return town.name + "分行";
        }
    }

    static parsePage(html: string): TownBankPage {
        return doParsePage(html);
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
                    const page = TownBank.parsePage(html);
                    resolve(page);
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
                if (!BankUtils.checkAmountAvailability(amount)) {
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
                    if (!BankUtils.checkAmountAvailability(amount)) {
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

function doParsePage(html: string): TownBankPage {
    const table = $(html).find("td:contains('姓名')")
        .filter((_idx, td) => {
            return $(td).text() === "姓名";
        })
        .closest("table");

    const role = new Role();
    table.find("tr:first")
        .next()
        .find("td:first")
        .filter((_idx, td) => {
            role.name = $(td).text();
            return true;
        })
        .next()
        .filter((_idx, td) => {
            role.level = parseInt($(td).text());
            return true;
        })
        .next()
        .filter((_idx, td) => {
            role.attribute = StringUtils.substringBefore($(td).text(), "属");
            return true;
        })
        .next()
        .filter((_idx, td) => {
            role.career = $(td).text();
            return true;
        })
        .parent()
        .next()
        .find("td:first")
        .next()
        .filter((_idx, td) => {
            role.cash = parseInt(StringUtils.substringBefore($(td).text(), " GOLD"));
            return true;
        });

    const font = $(html).find("font:contains('现在的所持金')")
        .filter((_idx, font) => {
            const s = $(font).text();
            return s.startsWith(" ") && s.includes("现在的所持金");
        });
    let s = font.text();
    s = StringUtils.substringBefore(s, "现在的所持金");

    const account = new BankAccount();
    account.name = s.substring(1);
    account.cash = parseInt($(font).find("font:first").text());
    account.saving = parseInt($(font).find("font:last").text());

    const page = new TownBankPage();
    page.role = role;
    page.account = account;
    return page;
}

export = TownBank;