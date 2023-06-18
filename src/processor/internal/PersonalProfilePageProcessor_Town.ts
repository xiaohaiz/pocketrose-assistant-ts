import TownBank from "../../core/bank/TownBank";
import TownLoader from "../../core/town/TownLoader";
import Credential from "../../util/Credential";
import PageUtils from "../../util/PageUtils";
import PageProcessorContext from "../PageProcessorContext";
import PersonalProfilePageProcessor from "./PersonalProfilePageProcessor";

class PersonalProfilePageProcessor_Town extends PersonalProfilePageProcessor {

    doBindReturnButton(credential: Credential, context?: PageProcessorContext): void {
        const html = PageUtils.generateReturnTownForm(credential);
        $("#hiddenCell-1").html(html);
        const townId = context?.get("townId");
        if (townId) {
            const town = TownLoader.load(townId);
            $("#returnButton").text("返回" + town?.name);
        } else {
            $("#returnButton").text("返回城市");
        }
        $("#returnButton").on("click", () => {
            $("#returnTown").trigger("click");
        });
    }

    doLoadBankAccount(credential: Credential, context?: PageProcessorContext): void {
        new TownBank(credential, context?.get("townId")).load().then(account => {
            $("#roleSaving").text(account.saving + " GOLD");
        });
    }

}

export = PersonalProfilePageProcessor_Town;