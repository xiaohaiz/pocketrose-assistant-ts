import Credential from "../../util/Credential";
import PageUtils from "../../util/PageUtils";
import AbstractPersonalTeamPageProcessor from "./AbstractPersonalTeamPageProcessor";

class PersonalTeamPageProcessor_Town extends AbstractPersonalTeamPageProcessor {

    bindReturnButton(credential: Credential): void {
        const form = PageUtils.generateReturnTownForm(credential);
        $("#hidden-1").html(form);
        $("#returnButton").on("click", () => {
            $("#returnTown").trigger("click");
        });
    }

}

export = PersonalTeamPageProcessor_Town;