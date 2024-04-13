import Credential from "../../util/Credential";
import PageUtils from "../../util/PageUtils";
import PersonalTeamPageProcessor from "./PersonalTeamPageProcessor";

class PersonalTeamPageProcessor_Town extends PersonalTeamPageProcessor {

    bindReturnButton(credential: Credential): void {
        const form = PageUtils.generateReturnTownForm(credential);
        $("#hidden-1").html(form);
        $("#returnButton").on("click", () => {
            $("#returnTown").trigger("click");
        });
    }

}

export = PersonalTeamPageProcessor_Town;