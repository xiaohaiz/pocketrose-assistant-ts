import TownDashboardPage from "../core/dashboard/TownDashboardPage";
import TownDashboardTaxManager from "../core/town/TownDashboardTaxManager";
import Credential from "../util/Credential";
import TownDashboardLayout from "./TownDashboardLayout";

class TownDashboardLayout001 extends TownDashboardLayout {

    id(): number {
        return 1;
    }

    battleMode(): boolean {
        return false;
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
            .css("width", "60%");

        $("#leftPanel")
            .find("> table:first")
            .find("> tbody:first")
            .find("> tr:last")
            .find("> td:first")
            .find("> table:first")
            .find("> tbody:first")
            .find("> tr:eq(1)")
            .find("> td:first")
            .each((idx, td) => {
                new TownDashboardTaxManager(credential, page).processTownTax($(td));
            });
    }

}

export = TownDashboardLayout001;