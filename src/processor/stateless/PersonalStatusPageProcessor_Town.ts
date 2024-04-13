import Role from "../../core/role/Role";
import Credential from "../../util/Credential";
import KeyboardShortcutBuilder from "../../util/KeyboardShortcutBuilder";
import PageUtils from "../../util/PageUtils";
import PersonalStatusPageProcessor from "./PersonalStatusPageProcessor";

class PersonalStatusPageProcessor_Town extends PersonalStatusPageProcessor {

    constructor() {
        super();
    }


    doBindKeyboardShortcut() {
        KeyboardShortcutBuilder.newInstance()
            .onKeyPressed("e", () => $("#openEquipmentManagement").trigger("click"))
            .onKeyPressed("u", () => $("#openPetManagement").trigger("click"))
            .onEscapePressed(() => $("#returnButton").trigger("click"))
            .withDefaultPredicate()
            .bind();
    }

    doBindReturnButton(): void {
        $("#returnButton").on("click", () => {
            $("#returnTown").trigger("click");
        });
    }

    doGenerateHiddenForm(credential: Credential, containerId: string): void {
        let html = PageUtils.generateReturnTownForm(credential);
        html += PageUtils.generateEquipmentManagementForm(credential);
        html += PageUtils.generatePetManagementForm(credential);

        $("#" + containerId).html(html);
        $("#returnTown").attr("tabIndex", 1);
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