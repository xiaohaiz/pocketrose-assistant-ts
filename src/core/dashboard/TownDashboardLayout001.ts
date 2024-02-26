import Credential from "../../util/Credential";
import TownDashboardTaxManager from "../town/TownDashboardTaxManager";
import KeyboardShortcutManager from "./KeyboardShortcutManager";
import TownDashboardLayout from "./TownDashboardLayout";
import TownDashboardPage from "./TownDashboardPage";

class TownDashboardLayout001 extends TownDashboardLayout {

    id(): number {
        return 1;
    }

    battleMode(): boolean {
        return false;
    }

    async render(credential: Credential, page: TownDashboardPage): Promise<void> {
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

        new KeyboardShortcutManager(credential, page.battleLevelShortcut, page).bind();
    }

}

export = TownDashboardLayout001;