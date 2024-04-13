import BankAccount from "./BankAccount";
import Role from "../role/Role";
import StringUtils from "../../util/StringUtils";
import {CastleBankPage, TownBankPage} from "./BankPage";
import _ from "lodash";

class TownBankPageParser {

    static parsePage(html: string): TownBankPage {
        const page = new TownBankPage();
        page.role = new Role();
        page.account = new BankAccount();

        page.welcomeMessage = $(html).find("img[alt='钱庄']")
            .parent()
            .prev()
            .html();

        const table = $(html).find("td:contains('姓名')")
            .filter((_idx, td) => {
                return $(td).text() === "姓名";
            })
            .closest("table");

        table.find("tr:first")
            .next()
            .find("td:first")
            .filter((_idx, td) => {
                page.role!.name = $(td).text();
                return true;
            })
            .next()
            .filter((_idx, td) => {
                page.role!.level = parseInt($(td).text());
                return true;
            })
            .next()
            .filter((_idx, td) => {
                page.role!.attribute = StringUtils.substringBefore($(td).text(), "属");
                return true;
            })
            .next()
            .filter((_idx, td) => {
                page.role!.career = $(td).text();
                return true;
            })
            .parent()
            .next()
            .find("td:first")
            .next()
            .filter((_idx, td) => {
                page.role!.cash = parseInt(StringUtils.substringBefore($(td).text(), " GOLD"));
                return true;
            });

        const font = $(html).find("font:contains('现在的所持金')")
            .filter((_idx, font) => {
                const s = $(font).text();
                return s.startsWith(" ") && s.includes("现在的所持金");
            });
        let s = font.text();
        s = StringUtils.substringBefore(s, "现在的所持金");

        page.account.name = s.substring(1);
        page.account.cash = parseInt($(font).find("font:first").text());
        page.account.saving = parseInt($(font).find("font:last").text());

        return page;
    }

}

class CastleBankPageParser {

    static parsePage(html: string): CastleBankPage {
        const welcomeMessage = $(html).find("img[alt='城堡仆人']")
            .parent()
            .prev()
            .html();

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
        account.cash = _.parseInt($(font).find("font:first").text());
        account.saving = _.parseInt($(font).find("font:last").text());

        const page = new CastleBankPage();
        page.role = role;
        page.account = account;
        page.welcomeMessage = welcomeMessage;
        return page;
    }

}

export {TownBankPageParser, CastleBankPageParser};