import CastleBank from "../../core/bank/CastleBank";
import Credential from "../../util/Credential";
import PageUtils from "../../util/PageUtils";
import PageProcessorContext from "../PageProcessorContext";
import PersonalProfilePageProcessor from "./PersonalProfilePageProcessor";

class PersonalProfilePageProcessor_Castle extends PersonalProfilePageProcessor {

    doBindReturnButton(credential: Credential, context?: PageProcessorContext): void {
        const html = PageUtils.generateReturnCastleForm(credential);
        $("#hiddenCell-1").html(html);
        const castleName = context?.get("castleName");
        if (castleName !== undefined) {
            $("#returnButton").text("返回" + castleName);
        } else {
            $("#returnButton").text("返回城堡");
        }
        $("#returnButton").on("click", () => {
            $("#returnCastle").trigger("click");
        });
    }

    doLoadBankAccount(credential: Credential, context?: PageProcessorContext): void {
        new CastleBank(credential).load().then(account => {
            $("#roleSaving").text(account.saving + " GOLD");
        });
    }

}

export = PersonalProfilePageProcessor_Castle;