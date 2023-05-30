import SetupLoader from "../config/SetupLoader";
import TownDashboardPage from "../pocketrose/TownDashboardPage";
import Credential from "../util/Credential";
import TownDashboardLayout from "./TownDashboardLayout";

class TownDashboardLayout001 extends TownDashboardLayout {

    id(): number {
        return 1;
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
                const town = page.role!.town!;
                if (town.name === "枫丹") {
                    $(td).css("color", "red")
                        .css("font-weight", "bold")
                        .attr("title", "枫丹的收益不需要关心")
                        .html("PRIVACY");
                } else if (page.role!.country !== "在野" && page.role!.country === page.townCountry) {
                    const tax = page.townTax!;
                    if (tax >= 50000 && (tax - Math.floor(tax / 50000) * 50000 <= 10000)) {
                        $(td).css("color", "white")
                            .css("background-color", "green")
                            .css("font-weight", "bold")
                            .on("click", () => {
                                if (!SetupLoader.isCollectTownTaxDisabled()) {
                                    $("option[value='MAKE_TOWN']")
                                        .prop("selected", true)
                                        .closest("td")
                                        .next()
                                        .find("> input:submit:first")
                                        .trigger("click");
                                }
                            });
                    }
                }
            });
    }

}

export = TownDashboardLayout001;