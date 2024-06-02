import StatefulPageProcessor from "../StatefulPageProcessor";
import Credential from "../../util/Credential";
import PageProcessorContext from "../PageProcessorContext";
import LocationModeTown from "../../core/location/LocationModeTown";
import LocationModeCastle from "../../core/location/LocationModeCastle";
import {PersonalStatusPage, PersonalStatusPageParser} from "../../core/role/PersonalStatus";
import PageUtils from "../../util/PageUtils";
import {RoleStatusManager} from "../../core/role/RoleStatus";
import _ from "lodash";
import {PocketFormGenerator, PocketPage} from "../../pocket/PocketPage";
import ButtonUtils from "../../util/ButtonUtils";
import KeyboardShortcutBuilder from "../../util/KeyboardShortcutBuilder";
import SetupLoader from "../../setup/SetupLoader";
import StringUtils from "../../util/StringUtils";

class PersonalStatusPageProcessor extends StatefulPageProcessor {

    private readonly location: LocationModeTown | LocationModeCastle;
    private readonly statusManager: RoleStatusManager;

    constructor(credential: Credential, context: PageProcessorContext) {
        super(credential, context);
        this.location = this.createLocationMode() as LocationModeTown | LocationModeCastle;
        this.statusManager = new RoleStatusManager(credential);
    }

    private rolePage?: PersonalStatusPage;

    protected async doProcess(): Promise<void> {
        await this.initializeProcessor();
        await this.generateHTML();
        await this.bindButtons();
        await this.render();
        KeyboardShortcutBuilder.newInstance()
            .onEscapePressed(() => PageUtils.triggerClick("returnButton"))
            .withDefaultPredicate()
            .doBind();
    }

    private async initializeProcessor() {
        this.rolePage = PersonalStatusPageParser.parsePage(PageUtils.currentPageHtml());
        await this.statusManager.writeRoleStatus(this.rolePage.role);
    }

    private async generateHTML() {
        $("body:first > center:first > p:first").remove();
        $("body:first > center:first > form:first").remove();

        const messageDialog = $("input:text[name='message']");
        if (messageDialog.length > 0) {
            // 如果有私聊消息输入框则删除，毫无意义
            messageDialog.parent().parent().remove();
        }
        const t0 = $("body:first > center:first > table:first")
            .attr("id", "t0")
            .css("width", "100%");

        t0.find("> tbody:first > form:first").remove();
        t0.find("> tbody:first").prepend($("" +
            "<tr style='text-align:center'>" +
            "<td>" +
            PocketPage.generatePageHeaderHTML("＜＜ 个 人 状 态 ＞＞", this.roleLocation) +
            "</td>" +
            "</tr>" +
            ""));
        $("#_pocket_page_command").html(() => {
            const returnButtonTitle = ButtonUtils.createTitle("退出", "Esc");
            return "" +
                "<span> <button role='button' class='C_StatelessElement' id='returnButton'>" + returnButtonTitle + "</button></span>" +
                "";
        });

        t0.find("> tbody:first > tr:last")
            .prev()
            .find("> td:first > table:first")
            .attr("id", "t1");

        // 修改荣誉栏的样式
        $("td:contains('荣誉：')")
            .filter((_idx, td) => {
                return _.startsWith($(td).text(), "荣誉：");
            })
            .attr("id", "PersonalHonor")
            .css("word-break", "break-all")
            .html((_idx, s) => {
                return s.replace(/<br>/g, '');
            });

        if (SetupLoader.isRenameHistoriesHidden()) {
            const td = $("td:contains('改名历史')")
                .filter((_idx, td) => {
                    return _.startsWith($(td).text(), "改名历史");
                });
            if (td.length > 0) {
                td.closest("table").remove();
            }
        }
    }

    private async bindButtons() {
        $("#_pocket_page_extension_0").html(() => {
            return new PocketFormGenerator(this.credential, this.location).generateReturnFormHTML();
        });
        $("#returnButton").on("click", () => {
            PageUtils.disablePageInteractiveElements();
            this.dispose().then(() => PageUtils.triggerClick("_pocket_ReturnSubmit"));
        });
    }

    private async render() {
        if (SetupLoader.isExperienceProgressBarEnabled()) {
            const t1 = $("#t1");
            let tr = $(t1).find("tr:eq(16)");
            let td = $(tr).find("td:eq(2)");
            if (this.rolePage!.role!.level === 150) {
                $(td).attr("style", "color: blue").text("MAX");
            } else {
                const ratio = this.rolePage!.role!.level! / 150;
                const progressBar = PageUtils.generateProgressBarHTML(ratio);
                const exp = $(td).text() + " EX";
                $(td).html("<span title='" + exp + "'>" + progressBar + "</span>");
            }

            $("th:contains('分身类别')")
                .filter(function () {
                    return $(this).text() === "分身类别";
                })
                .closest("table")
                .find("tr")
                .each(function (_idx, tr) {
                    if (_idx > 0) {
                        const td = $(tr).find("td:last");
                        const exp = parseInt($(td).text());
                        const level = Math.floor(exp / 100) + 1;
                        if (level === 150) {
                            $(td).attr("style", "color: blue").text("MAX");
                        } else {
                            const ratio = level / 150;
                            const progressBar = PageUtils.generateProgressBarHTML(ratio);
                            $(td).html("<span title='" + (exp + " EX") + "'>" + progressBar + "</span>");
                        }
                    }
                });

            $("td:contains('宠物名 ：')")
                .filter(function () {
                    return $(this).text().startsWith("宠物名 ：");
                })
                .closest("table")
                .each(function (_idx, table) {
                    let s = $(table).find("tr:eq(1) td:first").text();
                    const level = parseInt(StringUtils.substringAfter(s, "Ｌｖ"));

                    const td = $(table).find("tr:last td:eq(1)");
                    if (level === 100) {
                        $(td).attr("style", "color: blue").text("MAX");
                    } else {
                        s = $(td).text();
                        const a = parseInt(StringUtils.substringBeforeSlash(s));
                        const b = parseInt(StringUtils.substringAfterSlash(s));
                        const ratio = a / b;
                        const progressBar = PageUtils.generateProgressBarHTML(ratio);
                        $(td).html("<span title='" + s + "'>" + progressBar + "</span>");
                    }
                });
        }
        await this._renderWeaponSkills();
    }

    private async dispose() {
    }

    private async _renderWeaponSkills() {
        const table = $("td:contains('技  能')")
            .filter((_idx, e) => {
                const t = $(e).text();
                return t === "技  能";
            })
            .closest("table");
        table.find("> tbody:first")
            .find("> tr")
            .filter(idx => idx > 0)
            .each((_idx, e) => {
                const tr = $(e);
                tr.remove();
            });
        _.forEach(this.rolePage!.role!.weaponSkills, it => {
            const html = "<tr style='text-align:center'>" +
                "<th style='text-align:left;background-color:#E8E8D0' colspan='2'>" + it.fullName + "</th>" +
                "<td style='background-color:#E0D0B0' colspan='2'>" + it.rankHTML + "</td>" +
                "<td style='background-color:#E8E8D0'>" + it.fullLevel + "</td>" +
                "</tr>";
            table.find("> tbody:first").append($(html));
        });
    }
}

export {PersonalStatusPageProcessor};