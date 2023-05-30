import TownDashboardTaxManager from "../core/TownDashboardTaxManager";
import BattlePage from "../pocketrose/BattlePage";
import TownDashboardPage from "../pocketrose/TownDashboardPage";
import Credential from "../util/Credential";
import NetworkUtils from "../util/NetworkUtils";
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
            .find("> tr:first")
            .find("> th:first")
            .find("> font:first")
            .attr("id", "battlePanelTitle")
            .parent()
            .parent()
            .next().hide()
            .next()
            .find("> td:first")
            .removeAttr("bgcolor")
            .attr("id", "battlePanel")
            .css("text-align", "center")
            .html("")
            .parent()
            .next()
            .css("height", "100%")
            .find("> td:first")
            .html("" +
                "<div style='display:none' id='hidden-1'></div>" +
                "<div style='display:none' id='hidden-2'></div>" +
                "<div style='display:none' id='hidden-3'></div>" +
                "<div style='display:none' id='hidden-4'></div>" +
                "<div style='display:none' id='hidden-5'></div>" +
                "");

        $("#battleButton")
            .attr("type", "button")
            .on("click", () => {
                const request = credential.asRequestMap();
                $("#battleCell")
                    .find("> form[action='battle.cgi']")
                    .find("> input:hidden")
                    .filter((idx, input) => $(input).attr("name") !== "id")
                    .filter((idx, input) => $(input).attr("name") !== "pass")
                    .each((idx, input) => {
                        const name = $(input).attr("name")!;
                        const value = $(input).val()! as string;
                        request.set(name, value);
                    });
                $("#battleCell")
                    .find("> form[action='battle.cgi']")
                    .find("> select[name='level']")
                    .each((idx, select) => {
                        const value = $(select).val()! as string;
                        // noinspection JSDeprecatedSymbols
                        request.set("level", escape(value));
                    });

                NetworkUtils.post("battle.cgi", request).then(html => {
                    const page = BattlePage.parse(html);
                    $("#battlePanel").html(page.reportHtml!);
                });
            });
    }

}

export = TownDashboardLayout005;