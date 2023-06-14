import Credential from "../../util/Credential";
import SetupLoader from "../config/SetupLoader";
import TownDashboardTaxManager from "../town/TownDashboardTaxManager";
import TownDashboardLayout from "./TownDashboardLayout";
import TownDashboardPage from "./TownDashboardPage";

class TownDashboardLayout002 extends TownDashboardLayout {

    id(): number {
        return 2;
    }

    battleMode(): boolean {
        return false;
    }

    render(credential: Credential, page: TownDashboardPage): void {
        $("center:first").hide();
        $("br:first").hide();

        $("table:first")
            .find("> tbody:first")
            .find("> tr:eq(1)")
            .find("> td:first")
            .find("> table:first")
            .find("> tbody:first")
            .find("> tr:first").hide();

        $("#leftPanel").hide();

        $("#rightPanel")
            .removeAttr("width")
            .css("width", "100%")
            .find("> table:first")
            .find("> tbody:first")
            .find("> tr:eq(1)")
            .find("> td:first")
            .find("> table:first")
            .find("> tbody:first")
            .find("> tr:first")
            .find("> th:first")
            .css("font-size", "200%");

        $("#rightPanel")
            .find("> table:first")
            .find("> tbody:first")
            .find("> tr:eq(1)")
            .find("> td:first")
            .find("> table:first")
            .find("> tbody:first")
            .find("> tr:eq(3)")
            .each((idx, tr) => {
                const tax = page.townTax!;
                $(tr).after($("<tr><td height='5'>收益</td><th id='townTax'>" + tax + "</th><td colspan='2'></td></tr>"));
                new TownDashboardTaxManager(credential, page).processTownTax($("#townTax"));
            });

        $("table:first")
            .next()
            .find("> tbody:first")
            .find("> tr:first").hide()
            .next()
            .next()
            .find("> td:first")
            .removeAttr("width")
            .css("width", "100%")
            .next().hide();

        const enlargeRatio = SetupLoader.getEnlargeBattleRatio();
        if (enlargeRatio > 0) {
            const fontSize = 100 * enlargeRatio;
            $("#battleCell")
                .find("select:first")
                .css("font-size", fontSize + "%");
            $("#townCell")
                .find("select:first")
                .css("font-size", fontSize + "%");
            $("#personalCell")
                .find("select:first")
                .css("font-size", fontSize + "%");
            $("#countryNormalCell")
                .find("select:first")
                .css("font-size", fontSize + "%");
            $("#countryAdvancedCell")
                .find("select:first")
                .css("font-size", fontSize + "%");
        }
        $("#battleCell")
            .parent()
            .before($("<tr><td colspan='4'>　</td></tr>"))
            .after($("<tr><td colspan='4'>　</td></tr>"));
        $("#townCell")
            .parent()
            .after($("<tr><td colspan='4'>　</td></tr>"));
        $("#personalCell")
            .parent()
            .after($("<tr><td colspan='4'>　</td></tr>"));
        $("#countryNormalCell")
            .parent()
            .after($("<tr><td colspan='4'>　</td></tr>"));
    }

}

export = TownDashboardLayout002;