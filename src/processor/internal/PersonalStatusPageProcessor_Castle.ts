import Role from "../../common/Role";
import Credential from "../../util/Credential";
import PageUtils from "../../util/PageUtils";
import PersonalStatusPageProcessor from "./PersonalStatusPageProcessor";

class PersonalStatusPageProcessor_Castle extends PersonalStatusPageProcessor {

    constructor() {
        super();
    }

    doBindReturnButton(): void {
        $("#returnButton").on("click", () => {
            $("#returnCastle").trigger("click");
        });
    }

    doGenerateHiddenForm(credential: Credential, containerId: string): void {
        const html = PageUtils.generateReturnCastleForm(credential);
        $("#" + containerId).html(html);
        $("#returnCastle").attr("tabIndex", 1);
    }

    doGenerateReturnButton(role: Role, containerId: string): void {
        let title = "返回";
        if (role.castle !== undefined) {
            title = title + role.castle.name;
        }
        const html: string = "<input type='button' id='returnButton' value='" + title + "'>";
        $("#" + containerId).html(html);
    }


}

export = PersonalStatusPageProcessor_Castle;