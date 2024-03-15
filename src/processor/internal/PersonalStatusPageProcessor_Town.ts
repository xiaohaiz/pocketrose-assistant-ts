import {parseInt} from "lodash";
import PersonalMirror from "../../core/role/PersonalMirror";
import PersonalStatusPage from "../../core/role/PersonalStatusPage";
import Role from "../../core/role/Role";
import Credential from "../../util/Credential";
import KeyboardShortcutBuilder from "../../util/KeyboardShortcutBuilder";
import PageUtils from "../../util/PageUtils";
import StringUtils from "../../util/StringUtils";
import PageProcessorContext from "../PageProcessorContext";
import PersonalStatusPageProcessor from "./PersonalStatusPageProcessor";

class PersonalStatusPageProcessor_Town extends PersonalStatusPageProcessor {

    constructor() {
        super();
    }


    doBindKeyboardShortcut() {
        new KeyboardShortcutBuilder()
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


    doPostRenderPage(credential: Credential, page: PersonalStatusPage, context?: PageProcessorContext) {
        super.doPostRenderPage(credential, page, context);
        const mirrorManager = new PersonalMirror(credential, context?.get("townId"));
        mirrorManager.open().then(mirrorPage => {
            const mirrorList = mirrorPage.mirrorList!;
            if (mirrorList.length > 0) {
                $("th:contains('分身类别')")
                    .filter((idx, th) => $(th).text() === "分身类别")
                    .closest("table")
                    .find("tr")
                    .filter((idx, tr) => idx !== 0)
                    .each((idx, tr) => {
                        const td = $(tr).find("td:first");
                        const mirror = mirrorPage.findByCategory(td.text());
                        if (mirror !== null) {
                            td.html("<button role='button' id='mirror_" + mirror.index + "' " +
                                "class='mirror-button'>" + mirror.category + "</button>");
                        }
                    });
                $(".mirror-button").on("click", event => {
                    const buttonId = $(event.target).attr("id") as string;
                    const index = parseInt(StringUtils.substringAfterLast(buttonId, "_"));
                    const target = mirrorPage.findByIndex(index)!;
                    if (!confirm("确认要切换到分身\"" + target.category + "(" + target.career + ")\"吗？")) {
                        return;
                    }
                    mirrorManager.change(index).then(() => {
                        $("#openEquipmentManagement").trigger("click");
                    });
                });
            }
        });
    }
}

export = PersonalStatusPageProcessor_Town;