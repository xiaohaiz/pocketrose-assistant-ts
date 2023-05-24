import Credential from "../../util/Credential";
import PageUtils from "../../util/PageUtils";
import PersonalTeamPageProcessor from "./PersonalTeamPageProcessor";

class PersonalTeamPageProcessor_Castle extends PersonalTeamPageProcessor {

    bindReturnButton(credential: Credential): void {
        const form = PageUtils.generateReturnCastleForm(credential);
        $("#hidden-1").html(form);
        $("#returnButton").on("click", () => {
            $("#returnCastle").trigger("click");
        });
    }

}

export = PersonalTeamPageProcessor_Castle;