import LocalSettingManager from "../../core/config/LocalSettingManager";
import PersonalMirrorPage from "../../core/role/PersonalMirrorPage";
import Credential from "../../util/Credential";
import KeyboardShortcutBuilder from "../../util/KeyboardShortcutBuilder";
import PageUtils from "../../util/PageUtils";
import PageProcessorContext from "../PageProcessorContext";
import StatelessPageProcessorCredentialSupport from "../StatelessPageProcessorCredentialSupport";
import PageProcessorUtils from "../PageProcessorUtils";
import PersonalMirrorPageParser from "../../core/role/PersonalMirrorPageParser";
import Mirror from "../../core/role/Mirror";
import _ from "lodash";
import SetupLoader from "../../core/config/SetupLoader";
import MouseClickEventBuilder from "../../util/MouseClickEventBuilder";
import StringUtils from "../../util/StringUtils";
import StorageUtils from "../../util/StorageUtils";
import PersonalMirror from "../../core/role/PersonalMirror";
import TownInn from "../../core/inn/TownInn";
import MessageBoard from "../../util/MessageBoard";

class PersonalMirrorPageProcessor extends StatelessPageProcessorCredentialSupport {

    async doProcess(credential: Credential, context?: PageProcessorContext): Promise<void> {
        const mirrorPage = PersonalMirrorPageParser.parsePage(PageUtils.currentPageHtml());
        await this.#reformatPage(credential, context);
        await this.#bindImmutableButton();
        await this.#renderEquipmentList(credential, mirrorPage, context);
        KeyboardShortcutBuilder.newInstance()
            .onKeyPressed("e", () => PageUtils.triggerClick("equipmentButton"))
            .onEscapePressed(() => PageUtils.triggerClick("returnButton"))
            .withDefaultPredicate()
            .bind();
        // Clear current role's mirror status when accessing mirror page.
        LocalSettingManager.clearMirrorStatus(credential.id);
    }

    async #reformatPage(credential: Credential,
                        context?: PageProcessorContext) {
        $("table[height='100%']").removeAttr("height");
        $("td:first")
            .attr("id", "pageTitle")
            .removeAttr("width")
            .removeAttr("height")
            .removeAttr("bgcolor")
            .css("text-align", "center")
            .css("font-size", "150%")
            .css("font-weight", "bold")
            .css("background-color", "navy")
            .css("color", "yellowgreen")
            .text("＜＜  分 身 试 管  ＞＞");

        const table = $("table:first");

        table.find("> tbody:first")
            .find("> tr:eq(2)")
            .find("> td:first")
            .find("> table:first")
            .find("> tbody:first")
            .find("> tr:first")
            .find("> td:first")
            .attr("id", "messageBoard");

        const mirrorPanel = table.find("> tbody:first")
            .find("> tr:eq(3)")
            .find("> td:first")
            .attr("id", "mirrorPanel")
            .css("background-color", "#888888");

        if (_.includes(mirrorPanel.html(), "消耗5kw Gold(请带在身上，获取时直接从身上扣除)")) {
            // New mirror available
            const noticeHTML = mirrorPanel.find("> center:first")
                .find("> font:first")
                .html();
            mirrorPanel.parent()
                .after($("" +
                    "<tr>" +
                    "<td style='background-color:#F8F0E0;color:red;text-align:center'>" +
                    noticeHTML +
                    "</td>" +
                    "</tr>" +
                    "<tr style='background-color:#F8F0E0;text-align:center'>" +
                    "<td>" +
                    "<form action='mydata.cgi' method='post'>" +
                    "<input type='hidden' name='id' value='" + credential.id + "'>" +
                    "<input type='hidden' name='pass' value='" + credential.pass + "'>" +
                    "<input type='hidden' name='mode' value='FENSHENGETNEW'>" +
                    "<input type='submit' value='获取新分身'>" +
                    "</form>" +
                    "</td>" +
                    "</tr>" +
                    ""));
        }
        mirrorPanel.html("");

        mirrorPanel.parent().after(
            "<tr style='display:none'><td id='extension_1'></td></tr>" +
            "<tr style='display:none'><td id='extension_2'></td></tr>" +
            "<tr style='display:none'><td id='extension_3'></td></tr>" +
            "<tr><td style='background-color:#F8F0E0;text-align:center' id='commandPanel'></td></tr>"
        );

        $("#extension_1").html(
            PageUtils.generateReturnTownForm(credential) +
            PageUtils.generateEquipmentManagementForm(credential)
        );
        const buttonText = PageProcessorUtils.generateReturnTownButtonTitle(context);
        $("#commandPanel").html(
            "<button role='button' id='returnButton'>" + buttonText + "(Esc)</button>" +
            "<button role='button' id='equipmentButton'>装备管理(e)</button>"
        );

        $("#messageBoard").append($("<br><span style='font-weight:bold;color:wheat'>" +
            "点击分身头像可修改是否定型的设置（PC版双击/手机版单击）。</span>"));
    }

    async #bindImmutableButton() {
        $("#returnButton").on("click", () => {
            PageUtils.disableButtons();
            PageUtils.triggerClick("returnTown");
        });
        $("#equipmentButton").on("click", () => {
            PageUtils.disableButtons();
            PageUtils.triggerClick("openEquipmentManagement");
        });
    }

    async #renderEquipmentList(credential: Credential,
                               mirrorPage: PersonalMirrorPage,
                               context?: PageProcessorContext) {
        $(".C_mirrorListButton").off("dblclick").off("click");

        const allMirrorList: Mirror[] = [];
        allMirrorList.push(mirrorPage.currentMirror!);
        _.forEach(mirrorPage.mirrorList!, it => allMirrorList.push(it));
        const mirrorList = allMirrorList.sort((a, b) => a.index! - b.index!);

        let html = "";
        html += "<table style='text-align:center;border-width:0;margin:auto;width:100%'>";
        html += "<tbody style='background-color:#E8E8D0'>";
        html += "<tr style='background-color:skyblue'>";
        html += "<th>切换</th>";
        html += "<th>类别</th>";
        html += "<th>头像</th>";
        html += "<th>姓名</th>";
        html += "<th>性别</th>";
        html += "<th>ＨＰ</th>";
        html += "<th>ＭＰ</th>";
        html += "<th>属性</th>";
        html += "<th>攻击</th>";
        html += "<th>防御</th>";
        html += "<th>智力</th>";
        html += "<th>精神</th>";
        html += "<th>速度</th>";
        html += "<th>职业</th>";
        html += "<th>技能</th>";
        html += "<th>经验</th>";
        html += "</tr>";
        _.forEach(mirrorList, it => {
            html += "<tr style='height:64px;vertical-align:center'>";
            if (it.using) {
                html += "<td><button role='button' disabled>当前</button></td>";
            } else {
                html += "<td><button role='button' class='C_mirrorListButton C_changeMirror' id='change_mirror_" + it.index + "'>切换</button></td>"
            }
            if (it.using) {
                html += "<th style='color:red'>" + it.category + "</th>";
            } else {
                html += "<th>" + it.category + "</th>";
            }
            html += "<td style='width:64px;height:64px'>" + it.generateImageHtml("mirror_image_" + it.index, "C_mirrorListButton C_mirrorImage") + "</td>";
            html += "<td>" + it.name + "</td>";
            html += "<td>" + it.gender + "</td>";
            html += "<td>" + it.healthHtml + "</td>";
            html += "<td>" + it.manaHtml + "</td>";
            html += "<td>" + it.attribute + "</td>";
            html += "<td id='mirror_attack_" + it.index + "'>" + it.attackHtml + "</td>";
            html += "<td id='mirror_defense_" + it.index + "'>" + it.defenseHtml + "</td>";
            html += "<td id='mirror_specialAttack_" + it.index + "'>" + it.specialAttackHtml + "</td>";
            html += "<td id='mirror_specialDefense_" + it.index + "'>" + it.specialDefenseHtml + "</td>";
            html += "<td id='mirror_speed_" + it.index + "'>" + it.speedHtml + "</td>";
            html += "<td>" + it.career + "</td>";
            html += "<td>" + it.spell + "</td>";
            html += "<td>" + it.experienceHtml + "</td>";
            html += "</tr>";
        });
        html += "</tbody>";
        html += "</table>";

        const mirrorPanel = $("#mirrorPanel");
        mirrorPanel.html(html);

        _.forEach(mirrorList, it => {
            const mirrorIndex = it.index!;
            this.#changeCareerFixedStyle(credential, mirrorIndex);
        });

        new MouseClickEventBuilder(credential)
            .bind($(".C_mirrorImage"), target => {
                const buttonId = $(target).attr("id") as string;
                const mirrorIndex = _.parseInt(StringUtils.substringAfter(buttonId, "mirror_image_"));

                const key = "_m_" + mirrorIndex;
                const c: any = SetupLoader.loadMirrorCareerFixedConfig(credential.id);
                c[key] = !c[key];
                StorageUtils.set("_pa_070_" + credential.id, JSON.stringify(c));

                this.#changeCareerFixedStyle(credential, mirrorIndex);
            });

        $(".C_changeMirror").on("click", event => {
            const buttonId = $(event.target).attr("id") as string;
            const mirrorIndex = _.parseInt(StringUtils.substringAfter(buttonId, "change_mirror_"));
            this.#changeMirror(credential, mirrorIndex).then(() => {
                this.#refresh(credential, context);
            });
        });
    }

    async #refresh(credential: Credential, context?: PageProcessorContext) {
        const mirrorPage = await new PersonalMirror(credential, context?.get("townId")).open();
        await this.#renderEquipmentList(credential, mirrorPage, context);
    }

    #changeCareerFixedStyle(credential: Credential, mirrorIndex: number) {
        const elementIds = [
            "mirror_attack_" + mirrorIndex,
            "mirror_defense_" + mirrorIndex,
            "mirror_specialAttack_" + mirrorIndex,
            "mirror_specialDefense_" + mirrorIndex,
            "mirror_speed_" + mirrorIndex
        ];
        if (SetupLoader.isCareerFixed(credential.id, mirrorIndex)) {
            _.forEach(elementIds, elementId => {
                $("#" + elementId).css("background-color", "black")
                    .css("color", "white");
            });
        } else {
            _.forEach(elementIds, elementId => {
                $("#" + elementId).removeAttr("style");
            });
        }
    }

    async #changeMirror(credential: Credential, mirrorIndex: number) {
        await new TownInn(credential).recovery();
        MessageBoard.publishMessage("完全恢复了体力。");
        await new PersonalMirror(credential).change(mirrorIndex);
        MessageBoard.publishMessage("已经切换了分身。");
    }

}

export = PersonalMirrorPageProcessor;