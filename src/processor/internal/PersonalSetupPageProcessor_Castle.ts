import Credential from "../../util/Credential";
import PageUtils from "../../util/PageUtils";
import PersonalSetupPageProcessor from "./PersonalSetupPageProcessor";

class PersonalSetupPageProcessor_Castle extends PersonalSetupPageProcessor {

    doGenerateHiddenForm(credential: Credential, containerId: string): void {
        const html = PageUtils.generateReturnCastleForm(credential);
        $("#" + containerId).html(html);
    }

    doBindReturnButton(returnButtonId: string): void {
        $("#" + returnButtonId).on("click", function () {
            $("#returnCastle").trigger("click");
        });
    }

}

export = PersonalSetupPageProcessor_Castle;