import PersonalSetupPageProcessor from "./PersonalSetupPageProcessor";
import Credential from "../../util/Credential";
import PageUtils from "../../util/PageUtils";

class PersonalSetupPageProcessor_Town extends PersonalSetupPageProcessor {

    doGenerateHiddenForm(credential: Credential, containerId: string): void {
        const html = PageUtils.generateReturnTownForm(credential);
        $("#" + containerId).html(html);
    }

    doBindReturnButton(returnButtonId: string): void {
        $("#" + returnButtonId).on("click", function () {
            $("#returnTown").trigger("click");
        });
    }

}

export = PersonalSetupPageProcessor_Town;