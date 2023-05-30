import TownDashboardTaxManager from "../core/TownDashboardTaxManager";
import TownDashboardPage from "../pocketrose/TownDashboardPage";
import Credential from "../util/Credential";
import TownDashboardLayout from "./TownDashboardLayout";

class TownDashboardLayout005 extends TownDashboardLayout {

    id(): number {
        return 5;
    }

    render(credential: Credential, page: TownDashboardPage): void {
        $("#leftPanel")
            .removeAttr("width")
            .css("width", "40%")
            .find("> table:first")
            .removeAttr("width")
            .css("width", "95%");
        $("#rightPanel")
            .removeAttr("width")
            .css("width", "60%")
            .find("> table:first")
            .find("> tbody:first")
            .find("> tr:eq(1)")
            .find("> td:first")
            .find("> table:first")
            .find("> tbody:first")
            .find("> tr:eq(3)")
            .each((idx, tr) => {
                const tax = page.townTax!;
                $(tr).after($("<tr><td>收益</td><th id='townTax'>" + tax + "</th><td colspan='2'></td></tr>"));
                new TownDashboardTaxManager(page).processTownTax($("#townTax"));
            });

        $("#leftPanel")
            .find("> table:first")
            .find("> tbody:first")
            .find("> tr:eq(1)").hide()
            .next()
            .find("> td:first")
            .removeAttr("bgcolor")
            .attr("id", "battlePanel")
            .html("")
            .parent()
            .next()
            .css("height", "100%")
            .find("> td:first")
            .html("");
    }

}

export = TownDashboardLayout005;