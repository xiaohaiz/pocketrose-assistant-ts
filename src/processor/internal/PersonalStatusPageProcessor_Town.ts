import Role from "../../core/role/Role";
import PersonalMirror from "../../pocketrose/PersonalMirror";
import PersonalStatusPage from "../../pocketrose/PersonalStatusPage";
import Credential from "../../util/Credential";
import PageUtils from "../../util/PageUtils";
import StringUtils from "../../util/StringUtils";
import PageProcessorContext from "../PageProcessorContext";
import PersonalStatusPageProcessor from "./PersonalStatusPageProcessor";

class PersonalStatusPageProcessor_Town extends PersonalStatusPageProcessor {

    constructor() {
        super();
    }

    doBindReturnButton(): void {
        $("#returnButton").on("click", () => {
            $("#returnTown").trigger("click");
        });
    }

    doGenerateHiddenForm(credential: Credential, containerId: string): void {
        let html = PageUtils.generateReturnTownForm(credential);

        // noinspection HtmlUnknownTarget
        html += "<form action='mydata.cgi' method='post'>";
        html += "<input type='hidden' name='id' value='" + credential.id + "'>";
        html += "<input type='hidden' name='pass' value='" + credential.pass + "'>"
        html += "<input type='hidden' name='mode' value='USE_ITEM'>";
        html += "<input type='submit' id='equipmentButton'>";
        html += "</form>";

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
                        $("#equipmentButton").trigger("click");
                    });
                });
            }
        });
    }
}

export = PersonalStatusPageProcessor_Town;