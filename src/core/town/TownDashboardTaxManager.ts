import SetupLoader from "../../config/SetupLoader";
import Credential from "../../util/Credential";
import MessageBoard from "../../util/MessageBoard";
import NetworkUtils from "../../util/NetworkUtils";
import TownDashboardPage from "../dashboard/TownDashboardPage";

class TownDashboardTaxManager {

    readonly #credential: Credential;
    readonly #page: TownDashboardPage;

    constructor(credential: Credential, page: TownDashboardPage) {
        this.#credential = credential;
        this.#page = page;
    }

    processTownTax(taxCell: JQuery) {
        const town = this.#page.role!.town!;
        if (town.name === "枫丹") {
            taxCell.attr("title", "枫丹的收益不需要关心").html("PRIVACY");
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
                    const request = this.#credential.asRequestMap();
                    request.set("town", this.#page.townId!)
                    request.set("mode", "MAKE_TOWN");
                    NetworkUtils.post("country.cgi", request)
                        .then(html => {
                            MessageBoard.processResponseMessage(html);
                            $("#refreshButton").trigger("click");
                        });
                });
        } else {
            taxCell.removeAttr("style");
        }
    }
}

export = TownDashboardTaxManager;