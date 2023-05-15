import TownPetMapHouse from "../../pocketrose/TownPetMapHouse";
import Credential from "../../util/Credential";
import PageUtils from "../../util/PageUtils";
import PageProcessorContext from "../PageProcessorContext";
import PageProcessorCredentialSupport from "../PageProcessorCredentialSupport";

class TownPetMapHousePageProcessor extends PageProcessorCredentialSupport {

    constructor() {
        super();
    }

    doProcess(credential: Credential, context?: PageProcessorContext): void {
        const page = TownPetMapHouse.parsePage(PageUtils.currentPageHtml());
        const petIdText = page.asText();
        if (petIdText !== "") {
            $("td:contains('可以在这里看到收集到的图鉴')")
                .filter(function () {
                    return $(this).text().startsWith("可以在这里看到收集到的图鉴");
                })
                .attr("id", "messageBoard");
            $("#messageBoard").css("color", "white");

            let html = $("#messageBoard").html();
            html += "<br>" + petIdText;
            $("#messageBoard").html(html);
        }
    }

}

export = TownPetMapHousePageProcessor;