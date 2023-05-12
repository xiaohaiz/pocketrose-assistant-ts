import Equipment from "../../common/Equipment";
import DeprecatedTreasureBag from "../../pocket/DeprecatedTreasureBag";
import PersonalEquipmentManagement from "../../pocketrose/PersonalEquipmentManagement";
import PersonalEquipmentManagementPage from "../../pocketrose/PersonalEquipmentManagementPage";
import TreasureBag from "../../pocketrose/TreasureBag";
import Credential from "../../util/Credential";
import MessageBoard from "../../util/MessageBoard";
import PageUtils from "../../util/PageUtils";
import StringUtils from "../../util/StringUtils";
import PageProcessorContext from "../PageProcessorContext";
import AbstractPersonalEquipmentManagementPageProcessor from "./AbstractPersonalEquipmentManagementPageProcessor";

class PersonalEquipmentManagementPageProcessor_Map2 extends AbstractPersonalEquipmentManagementPageProcessor {

    doGeneratePageTitleHtml(context?: PageProcessorContext): string {
        return "＜＜  装 备 管 理 （ 地 图 模 式 ）  ＞＞";
    }

    doGenerateRoleLocationHtml(context?: PageProcessorContext): string {
        if (context === undefined) {
            return "野外";
        } else {
            return context.get("coordinate")!;
        }
    }

    doGenerateWelcomeMessageHtml(): string {
        return "<b style='font-size:120%;color:wheat'>真是难为您了，在野外还不忘捯饬您这些破烂。</b>";
    }

    doBindReturnButton(credential: Credential): void {
        const html = PageUtils.generateReturnMapForm(credential);
        $("#hiddenFormContainer").html(html);
        $("#returnButton").on("click", () => {
            $("#returnMap").trigger("click");
        });
    }

    doRenderMutablePage(credential: Credential, page: PersonalEquipmentManagementPage, context?: PageProcessorContext): void {

        const treasureBag = page.findTreasureBag();

        let html = "";
        html += "<table style='border-width:0;background-color:#888888;text-align:center;width:100%;margin:auto'>";
        html += "<tbody>";
        html += "<tr>";
        html += "<td style='background-color:darkred;color:wheat;font-weight:bold;font-size:120%;text-align:center' colspan='20'>＜ 随 身 装 备 ＞</td>";
        html += "</tr>";
        html += "<tr>";
        html += "<th style='background-color:#E8E8D0'>选择</th>"
        html += "<th style='background-color:#EFE0C0'>装备</th>"
        html += "<th style='background-color:#E0D0B0'>名字</th>"
        html += "<th style='background-color:#EFE0C0'>种类</th>"
        html += "<th style='background-color:#E0D0B0'>效果</th>"
        html += "<th style='background-color:#EFE0C0'>重量</th>"
        html += "<th style='background-color:#EFE0C0'>耐久</th>"
        html += "<th style='background-color:#E0D0B0'>职需</th>"
        html += "<th style='background-color:#E0D0B0'>攻需</th>"
        html += "<th style='background-color:#E0D0B0'>防需</th>"
        html += "<th style='background-color:#E0D0B0'>智需</th>"
        html += "<th style='background-color:#E0D0B0'>精需</th>"
        html += "<th style='background-color:#E0D0B0'>速需</th>"
        html += "<th style='background-color:#EFE0C0'>威＋</th>"
        html += "<th style='background-color:#EFE0C0'>重＋</th>"
        html += "<th style='background-color:#EFE0C0'>幸＋</th>"
        html += "<th style='background-color:#E0D0B0'>经验</th>"
        html += "<th style='background-color:#EFE0C0'>属性</th>"
        html += "<th style='background-color:#E8E8D0'>使用</th>"
        html += "<th style='background-color:#E8E8D0'>入袋</th>"
        html += "</tr>";

        for (const equipment of page.equipmentList!) {
            if (equipment.isGoldenCage || equipment.isTreasureBag) {
                continue;
            }
            html += "<tr>";
            html += "<td style='background-color:#E8E8D0'>"
            if (equipment.selectable) {
                html += "<input type='button' " +
                    "value='选择' " +
                    "style='color:grey' " +
                    "id='selectPersonal_" + equipment.index + "' " +
                    "class='mutableButton-1'>";
            }
            html += "</td>";
            html += "<td style='background-color:#EFE0C0'>" + equipment.usingHTML + "</td>"
            html += "<td style='background-color:#E0D0B0'>" + equipment.nameHTML + "</td>"
            html += "<td style='background-color:#EFE0C0'>" + equipment.category + "</td>"
            html += "<td style='background-color:#E0D0B0'>" + equipment.power + "</td>"
            html += "<td style='background-color:#EFE0C0'>" + equipment.weight + "</td>"
            html += "<td style='background-color:#EFE0C0'>" + equipment.endureHtml + "</td>"
            html += "<td style='background-color:#E0D0B0'>" + equipment.requiredCareerHtml + "</td>"
            html += "<td style='background-color:#E0D0B0'>" + equipment.requiredAttackHtml + "</td>"
            html += "<td style='background-color:#E0D0B0'>" + equipment.requiredDefenseHtml + "</td>"
            html += "<td style='background-color:#E0D0B0'>" + equipment.requiredSpecialAttackHtml + "</td>"
            html += "<td style='background-color:#E0D0B0'>" + equipment.requiredSpecialDefenseHtml + "</td>"
            html += "<td style='background-color:#E0D0B0'>" + equipment.requiredSpeedHtml + "</td>"
            html += "<td style='background-color:#EFE0C0'>" + equipment.additionalPowerHtml + "</td>"
            html += "<td style='background-color:#EFE0C0'>" + equipment.additionalWeightHtml + "</td>"
            html += "<td style='background-color:#EFE0C0'>" + equipment.additionalLuckHtml + "</td>"
            html += "<td style='background-color:#E0D0B0'>" + equipment.experienceHTML + "</td>"
            html += "<td style='background-color:#EFE0C0'>" + equipment.attributeHtml + "</td>"
            html += "<td style='background-color:#E8E8D0'>"
            if (equipment.selectable) {
                html += "<input type='button' " +
                    "value='" + equipment.buttonTitle + "' " +
                    "id='use_" + equipment.index + "' " +
                    "class='mutableButton-1'>";
            }
            html += "</td>";
            html += "<td style='background-color:#E8E8D0'>"
            if (treasureBag !== null && equipment.selectable && !equipment.using) {
                html += "<input type='button' " +
                    "value='入袋' " +
                    "id='store_" + equipment.index + "' " +
                    "class='mutableButton-1'>";
            }
            html += "</td>";
            html += "</tr>";
        }

        // ------------------------------------------------------------------------
        // 装备菜单栏
        // ------------------------------------------------------------------------
        html += "<tr>";
        html += "<td style='background-color:#F8F0E0;text-align:center' colspan='20'>";
        html += "<table style='border-width:0;background-color:#F8F0E0;width:100%;margin:auto'>";
        html += "<tbody>";
        html += "<tr>";
        html += "<td style='text-align:left'>";
        html += "<input type='button' id='use' class='mutableButton-1' value='使用装备'>";
        html += "<input type='button' id='bag' class='mutableButton-1' value='放入百宝袋'>";
        html += "</td>";
        html += "<td style='text-align:right'>";
        html += "<input type='button' id='openBag' class='mutableButton-1' value='打开百宝袋'>";
        html += "<input type='button' id='closeBag' class='mutableButton-1' value='关闭百宝袋'>";
        html += "</td>";
        html += "</tr>";
        html += "</tbody>";
        html += "</table>";
        html += "</td>";
        html += "</tr>";

        html += "</tbody>";
        html += "</table>";

        $("#equipmentList").html(html).parent().show();

        if (treasureBag === null) {
            $("#bag").prop("disabled", true).hide();
            $("#openBag").prop("disabled", true).hide();
            $("#closeBag").prop("disabled", true).hide();
        } else {
            if ($("#treasureBag").text() === "on") {
                $("#openBag").prop("disabled", true);
            } else {
                $("#closeBag").prop("disabled", true);
            }
        }

        this.#bindSelectPersonalButton();
        this.#bindUseButton(credential, context);
        this.#bindStoreButton(credential, treasureBag, context);
    }

    #bindSelectPersonalButton() {
        $("input:button[value='选择']")
            .filter(function () {
                const buttonId = $(this).attr("id") as string;
                return buttonId.startsWith("selectPersonal_");
            })
            .on("click", function () {
                const buttonId = $(this).attr("id") as string;
                if (PageUtils.isColorGrey(buttonId)) {
                    $(this).css("color", "blue");
                } else if (PageUtils.isColorBlue(buttonId)) {
                    $(this).css("color", "grey");
                }
            });
    }

    #bindUseButton(credential: Credential, context?: PageProcessorContext) {
        const instance = this;
        for (let i = 0; i < 20; i++) {
            const buttonId = "use_" + i;
            if ($("#" + buttonId).length === 0) {
                continue;
            }
            $("#" + buttonId).on("click", function () {
                new PersonalEquipmentManagement(credential)
                    .use([i])
                    .then(() => {
                        instance.doRefreshMutablePage(credential, context);
                    });
            });
        }
        $("#use").on("click", function () {
            const indexList: number[] = [];
            $("input:button[value='选择']")
                .filter(function () {
                    const buttonId = $(this).attr("id") as string;
                    return buttonId.startsWith("selectPersonal_");
                })
                .each(function (_idx, input) {
                    const buttonId = $(input).attr("id") as string;
                    if (PageUtils.isColorBlue(buttonId)) {
                        const index = parseInt(StringUtils.substringAfter(buttonId, "_"));
                        indexList.push(index);
                    }
                });
            if (indexList.length === 0) {
                PageUtils.scrollIntoView("pageTitle");
                MessageBoard.publishWarning("没有选择装备或者物品！");
                return;
            }
            new PersonalEquipmentManagement(credential)
                .use(indexList)
                .then(() => {
                    instance.doRefreshMutablePage(credential, context);
                });
        });
    }

    #bindStoreButton(credential: Credential, treasureBag: Equipment | null, context?: PageProcessorContext) {
        if (treasureBag === null) {
            return;
        }
        const instance = this;
        $("input:button[value='入袋']").on("click", function () {
            const buttonId = $(this).attr("id") as string;
            const index = parseInt(StringUtils.substringAfter(buttonId, "_"));
            new DeprecatedTreasureBag(credential, treasureBag.index!)
                .putInto([index])
                .then(() => {
                    instance.doRefreshMutablePage(credential, context);
                });
        });
        $("#bag").on("click", function () {
            const indexList: number[] = [];
            $("input:button[value='选择']")
                .filter(function () {
                    const buttonId = $(this).attr("id") as string;
                    return buttonId.startsWith("selectPersonal_");
                })
                .each(function (_idx, input) {
                    const buttonId = $(input).attr("id") as string;
                    if (PageUtils.isColorBlue(buttonId)) {
                        const index = parseInt(StringUtils.substringAfter(buttonId, "_"));
                        indexList.push(index);
                    }
                });
            if (indexList.length === 0) {
                PageUtils.scrollIntoView("pageTitle");
                MessageBoard.publishWarning("没有选择装备或者物品！");
                return;
            }
            new TreasureBag(credential)
                .putInto(indexList)
                .then(() => {
                    instance.doRefreshMutablePage(credential, context);
                });
        });
    }

}

export = PersonalEquipmentManagementPageProcessor_Map2;