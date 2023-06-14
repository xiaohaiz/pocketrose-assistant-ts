import Credential from "../../util/Credential";
import TownDashboardTaxManager from "../town/TownDashboardTaxManager";
import TownDashboardLayout from "./TownDashboardLayout";
import TownDashboardLayout002 from "./TownDashboardLayout002";
import TownDashboardPage from "./TownDashboardPage";

class TownDashboardLayout003 extends TownDashboardLayout {

    readonly #layout002 = new TownDashboardLayout002();

    id(): number {
        return 3;
    }

    battleMode(): boolean {
        return false;
    }

    render(credential: Credential, page: TownDashboardPage): void {
        this.#layout002.render(credential, page);
        $("#townTax").off("click");

        let tr1 = "";
        let tr2 = "";
        $("#rightPanel")
            .find("> table:first")
            .find("> tbody:first")
            .find("> tr:eq(1)")
            .each((idx, tr) => {
                tr1 = $(tr).html();
            })
            .next()
            .each((idx, tr) => {
                tr2 = $(tr).html();
            });
        $("#rightPanel")
            .find("> table:first")
            .find("> tbody:first")
            .find("> tr")
            .filter(idx => idx > 0)
            .each((idx, tr) => {
                $(tr).remove();
            });
        $("#rightPanel")
            .find("> table:first")
            .find("> tbody:first")
            .prepend("<tr>" + tr2 + "</tr>");
        $("#rightPanel")
            .find("> table:first")
            .find("> tbody:first")
            .prepend("<tr>" + tr1 + "</tr>");

        new TownDashboardTaxManager(credential, page).processTownTax($("#townTax"));
    }

}

export = TownDashboardLayout003;