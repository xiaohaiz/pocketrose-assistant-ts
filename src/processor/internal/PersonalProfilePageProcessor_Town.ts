import TownLoader from "../../core/TownLoader";
import Credential from "../../util/Credential";
import PageUtils from "../../util/PageUtils";
import PageProcessorContext from "../PageProcessorContext";
import AbstractPersonalProfilePageProcessor from "./AbstractPersonalProfilePageProcessor";

class PersonalProfilePageProcessor_Town extends AbstractPersonalProfilePageProcessor {

    doBindReturnButton(credential: Credential, context?: PageProcessorContext): void {
        const html = PageUtils.generateReturnTownForm(credential);
        $("#hiddenCell-1").html(html);
        const townId = context?.get("townId");
        if (townId !== undefined) {
            const town = TownLoader.getTownById(townId)!;
            $("#returnButton").text("返回" + town.name);
        }
        $("#returnButton").on("click", () => {
            $("#returnTown").trigger("click");
        });
    }

}

export = PersonalProfilePageProcessor_Town;