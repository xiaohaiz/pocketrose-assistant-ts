import StringUtils from "../../util/StringUtils";
import Role from "../role/Role";
import BankAccount from "./BankAccount";
import TownBankPage from "./TownBankPage";

class TownBankPageParser {

    async parse(html: string): Promise<TownBankPage> {
        const page = new TownBankPage(new Role(), new BankAccount());

        const table = $(html).find("td:contains('姓名')")
            .filter((_idx, td) => {
                return $(td).text() === "姓名";
            })
            .closest("table");

        table.find("tr:first")
            .next()
            .find("td:first")
            .filter((_idx, td) => {
                page.role.name = $(td).text();
                return true;
            })
            .next()
            .filter((_idx, td) => {
                page.role.level = parseInt($(td).text());
                return true;
            })
            .next()
            .filter((_idx, td) => {
                page.role.attribute = StringUtils.substringBefore($(td).text(), "属");
                return true;
            })
            .next()
            .filter((_idx, td) => {
                page.role.career = $(td).text();
                return true;
            })
            .parent()
            .next()
            .find("td:first")
            .next()
            .filter((_idx, td) => {
                page.role.cash = parseInt(StringUtils.substringBefore($(td).text(), " GOLD"));
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

export = TownBankPageParser;