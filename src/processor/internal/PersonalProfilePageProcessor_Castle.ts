import CastleBank from "../../core/bank/CastleBank";
import Credential from "../../util/Credential";
import PageUtils from "../../util/PageUtils";
import PageProcessorContext from "../PageProcessorContext";
import PersonalProfilePageProcessor from "./PersonalProfilePageProcessor";
import CastleInn from "../../core/inn/CastleInn";
import PersonalMirror from "../../core/role/PersonalMirror";

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

    doLodgeAndChangeMirror(credential: Credential, mirrorIndex: number, handler?: () => void): void {
        new CastleInn(credential).recovery().then(() => {
            new PersonalMirror(credential).change(mirrorIndex).then(() => {
                handler && handler();
            });
        });
    }


}

export = PersonalProfilePageProcessor_Castle;