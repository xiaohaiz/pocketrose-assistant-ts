import Conversation from "../../pocketrose/Conversation";
import Credential from "../../util/Credential";
import PageUtils from "../../util/PageUtils";
import PersonalSetupPageProcessor from "./PersonalSetupPageProcessor";

class PersonalSetupPageProcessor_Town extends PersonalSetupPageProcessor {

    doGenerateHiddenForm(credential: Credential, containerId: string): void {
        new Conversation(credential).open().then()
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