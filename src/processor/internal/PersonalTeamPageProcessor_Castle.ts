import Credential from "../../util/Credential";
import PageUtils from "../../util/PageUtils";
import AbstractPersonalTeamPageProcessor from "./AbstractPersonalTeamPageProcessor";

class PersonalTeamPageProcessor_Castle extends AbstractPersonalTeamPageProcessor {

    bindReturnButton(credential: Credential): void {
        const form = PageUtils.generateReturnCastleForm(credential);
        $("#hidden-1").html(form);
        $("#returnButton").on("click", () => {
            $("#returnCastle").trigger("click");
        });
    }

}

export = PersonalTeamPageProcessor_Castle;