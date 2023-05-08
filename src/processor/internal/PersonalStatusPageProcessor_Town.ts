import AbstractPersonalStatusPageProcessor from "./AbstractPersonalStatusPageProcessor";
import Credential from "../../util/Credential";
import PageUtils from "../../util/PageUtils";
import Role from "../../pocket/Role";

class PersonalStatusPageProcessor_Town extends AbstractPersonalStatusPageProcessor {

    constructor() {
        super();
    }

    doBindReturnButton(): void {
        $("#returnButton").on("click", () => {
            $("#returnTown").trigger("click");
        });
    }

    doGenerateHiddenForm(credential: Credential, containerId: string): void {
        const html = PageUtils.generateReturnTownForm(credential);
        $("#" + containerId).html(html);
    }

    doGenerateReturnButton(role: Role, containerId: string): void {
        let title = "返回";
        if (role.town !== undefined) {
            title = title + role.town.name;
        }
        const html: string = "<input type='button' id='returnButton' value='" + title + "'>";
        $("#" + containerId).html(html);
    }


}

export = PersonalStatusPageProcessor_Town;