import BankAccount from "../common/BankAccount";
import Role from "../common/Role";
import Credential from "../util/Credential";
import MessageBoard from "../util/MessageBoard";
import NetworkUtils from "../util/NetworkUtils";
import StringUtils from "../util/StringUtils";
import CastleBankPage from "./CastleBankPage";

class CastleBank {

    readonly #credential: Credential;

    constructor(credential: Credential) {
        this.#credential = credential;
    }

    static parsePage(html: string): CastleBankPage {
        return doParsePage(html);
    }

    async open(): Promise<CastleBankPage> {
        const action = () => {
            return new Promise<CastleBankPage>(resolve => {
                const request = this.#credential.asRequestMap();
                request.set("mode", "CASTLE_BANK");
                NetworkUtils.post("castle.cgi", request)
                    .then(html => {
                        const page = CastleBank.parsePage(html);
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

    async depositAll(): Promise<void> {
        const action = () => {
            return new Promise<void>(resolve => {
                const request = this.#credential.asRequestMap();
                request.set("azukeru", "all");
                request.set("mode", "CASTLEBANK_SELL");
                NetworkUtils.post("castle.cgi", request)
                    .then(() => {
                        MessageBoard.publishMessage("在城堡银行存入全部现金。");
                        resolve();
                    });
            });
        };
        return await action();
    }

    async deposit(amount: number): Promise<void> {
        const action = () => {
            return new Promise<void>((resolve, reject) => {
                if (isNaN(amount) || !Number.isInteger(amount) || amount < 0) {
                    reject();
                    return;
                }
                if (amount === 0) {
                    resolve();
                    return;
                }
                const request = this.#credential.asRequestMap();
                request.set("azukeru", amount.toString());
                request.set("mode", "CASTLEBANK_SELL");
                NetworkUtils.post("castle.cgi", request)
                    .then(() => {
                        MessageBoard.publishMessage("在城堡支行存入了" + amount + "万现金。");
                        resolve();
                    });
            });
        };
        return await action();
    }

    async withdraw(amount: number): Promise<void> {
        const action = () => {
            return new Promise<void>((resolve, reject) => {
                if (isNaN(amount) || !Number.isInteger(amount) || amount < 0) {
                    reject();
                    return;
                }
                if (amount === 0) {
                    resolve();
                    return;
                }
                const request = this.#credential.asRequestMap();
                request.set("dasu", amount.toString());
                request.set("mode", "CASTLEBANK_BUY");
                NetworkUtils.post("castle.cgi", request)
                    .then(html => {
                        if ($(html).text().includes("您在钱庄里没那么多存款")) {
                            MessageBoard.publishWarning("真可怜，银行里面连" + amount + "万存款都没有！");
                            reject();
                        } else {
                            MessageBoard.publishMessage("从城堡支行里提取了" + amount + "万现金。");
                            resolve();
                        }
                    });
            });
        };
        return await action();
    }
}

function doParsePage(html: string): CastleBankPage {
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

    const page = new CastleBankPage();
    page.role = role;
    page.account = account;
    return page;
}

export = CastleBank;