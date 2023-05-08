import AbstractPersonalSetupPageProcessor from "./AbstractPersonalSetupPageProcessor";
import Credential from "../../util/Credential";
import PageUtils from "../../util/PageUtils";

class PersonalSetupPageProcessor_Castle extends AbstractPersonalSetupPageProcessor {

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