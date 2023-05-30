import SetupLoader from "../config/SetupLoader";
import TownDashboardPage from "../pocketrose/TownDashboardPage";

class TownDashboardTaxManager {

    readonly #page: TownDashboardPage;

    constructor(page: TownDashboardPage) {
        this.#page = page;
    }

    processTownTax(taxCell: JQuery) {
        const town = this.#page.role!.town!;
        if (town.name === "枫丹") {
            taxCell.css("color", "red")
                .css("font-weight", "bold")
                .attr("title", "枫丹的收益不需要关心")
                .html("PRIVACY");
            return;
        }

        if (SetupLoader.isCollectTownTaxDisabled()) {
            return;
        }

        if (this.#page.role!.country === "在野") {
            return;
        }
        if (this.#page.role!.country !== this.#page.townCountry) {
            return;
        }

        const tax = this.#page.townTax!;
        if (tax >= 50000 && (tax - Math.floor(tax / 50000) * 50000 <= 10000)) {
            taxCell.css("color", "white")
                .css("background-color", "green")
                .css("font-weight", "bold")
                .on("click", () => {
                    $("option[value='MAKE_TOWN']")
                        .prop("selected", true)
                        .closest("td")
                        .next()
                        .find("> input:submit:first")
                        .trigger("click");
                });
        }
    }
}

export = TownDashboardTaxManager;