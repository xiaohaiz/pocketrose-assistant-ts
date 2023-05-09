import BankAccount from "../common/BankAccount";
import Role from "../pocket/Role";
import Credential from "../util/Credential";
import NetworkUtils from "../util/NetworkUtils";
import StringUtils from "../util/StringUtils";
import TownBankPage from "./TownBankPage";

class TownBank {

    readonly #credential: Credential;

    constructor(credential: Credential) {
        this.#credential = credential;
    }

    static parsePage(html: string): TownBankPage {
        return doParsePage(html);
    }

    async open(townId?: string): Promise<TownBankPage> {
        const action = () => {
            return new Promise<TownBankPage>(resolve => {
                const request = this.#credential.asRequestMap();
                request.set("con_str", "50");
                request.set("mode", "BANK");
                if (townId !== undefined) {
                    request.set("town", townId);
                }
                NetworkUtils.post("town.cgi", request).then(html => {
                    const page = TownBank.parsePage(html);
                    resolve(page);
                });
            });
        };
        return await action();
    }

    async load(townId?: string): Promise<BankAccount> {
        const action = () => {
            return new Promise<BankAccount>(resolve => {
                this.open(townId).then(page => {
                    resolve(page.account!);
                });
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