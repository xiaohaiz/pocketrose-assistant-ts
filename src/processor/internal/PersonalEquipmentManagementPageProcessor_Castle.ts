import Equipment from "../../common/Equipment";
import CastleWarehouse from "../../pocket/castle/CastleWarehouse";
import TreasureBag from "../../pocket/TreasureBag";
import PersonalEquipmentManagementPage from "../../pocketrose/PersonalEquipmentManagementPage";
import PersonalStatus from "../../pocketrose/PersonalStatus";
import Credential from "../../util/Credential";
import MessageBoard from "../../util/MessageBoard";
import NetworkUtils from "../../util/NetworkUtils";
import PageUtils from "../../util/PageUtils";
import StringUtils from "../../util/StringUtils";
import PageProcessorContext from "../PageProcessorContext";
import AbstractPersonalEquipmentManagementPageProcessor from "./AbstractPersonalEquipmentManagementPageProcessor";

class PersonalEquipmentManagementPageProcessor_Castle extends AbstractPersonalEquipmentManagementPageProcessor {

    doGeneratePageTitleHtml(context?: PageProcessorContext): string {
        if (context === undefined) {
            return "＜＜  装 备 管 理 （ 城 堡 模 式 ）  ＞＞";
        } else {
            const castleName = context.get("castleName")!;
            return "＜＜  装 备 管 理 （ " + StringUtils.toTitleString(castleName) + " 城 堡 ）  ＞＞";
        }
    }

    doGenerateRoleLocationHtml(context?: PageProcessorContext): string {
        if (context === undefined) {
            return "城堡";
        } else {
            return context.get("castleName")!;
        }
    }

    doGenerateWelcomeMessageHtml(): string {
        return "<b style='font-size:120%;color:wheat'>又来管理您的装备来啦？真是一刻不得闲置啊。</b>";
    }

    doBindReturnButton(credential: Credential): void {
        const html = PageUtils.generateReturnCastleForm(credential);
        $("#hiddenFormContainer").html(html);
        $("#returnButton").on("click", () => {
            $("#returnCastle").trigger("click");
        });
    }

    doRenderMutablePage(credential: Credential, page: PersonalEquipmentManagementPage, context?: PageProcessorContext): void {
        const bag = page.findTreasureBag();
        if (bag !== null) {
            this.#renderMutablePage(credential, page, bag.index!, context);
        } else {
            // 已经掌握了剑圣职业，说明应该有百宝袋，但是因为某些bug导致百宝袋不可见了，
            // 还是提供有限的百宝袋功能吧，能够放入、取出，但是不能浏览了。
            // 如果有分身了，那也说明曾经掌握过剑圣职业，就算有百宝袋了
            new PersonalStatus(credential).load().then(role => {
                if (role.masterCareerList!.includes("剑圣") || role.hasMirror!) {
                    // 真的曾经拥有百宝袋，但是又因为某些bug失去了
                    this.#renderMutablePage(credential, page, -1, context);
                } else {
                    // 是真的没有百宝袋
                    this.#renderMutablePage(credential, page, -99, context);
                }
            });
        }
    }

    #renderMutablePage(credential: Credential,
                       page: PersonalEquipmentManagementPage,
                       bagIndex: number,
                       context?: PageProcessorContext) {
        $("#bagIndex").text(bagIndex);

        if (page.equipmentList!.length > 0) {
            let html = "";
            html += "<table style='border-width:0;background-color:#888888;text-align:center;width:100%;margin:auto'>";
            html += "<tbody>";
            html += "<tr>";
            html += "<td style='background-color:darkred;color:wheat;font-weight:bold;font-size:120%;text-align:center' " +
                "colspan='21'>＜ 随 身 装 备 ＞</td>";
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
            html += "<th style='background-color:#E8E8D0'>入库</th>"
            html += "</tr>";

            for (const equipment of page.equipmentList!) {
                if (equipment.isGoldenCage || equipment.isTreasureBag) {
                    continue;
                }
                html += "<tr>";
                html += "<td style='background-color:#E8E8D0'>"
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
                html += "</td>";
                html += "<td style='background-color:#E8E8D0'>"
                html += "</td>";
                html += "<td style='background-color:#E8E8D0'>"
                html += "</td>";
                html += "</tr>";
            }
            // ------------------------------------------------------------------------
            // 装备菜单栏
            // ------------------------------------------------------------------------
            html += "<tr>";
            html += "<td style='background-color:#F8F0E0;text-align:center' colspan='21'>";
            html += "<table style='border-width:0;background-color:#F8F0E0;width:100%;margin:auto'>";
            html += "<tbody>";
            html += "<tr>";
            html += "<td style='text-align:left'>";
            html += "<input type='button' id='use' class='mutableButton' value='使用装备'>";
            html += "<input type='button' id='bag' class='mutableButton' value='入百宝袋'>";
            html += "</td>";
            html += "<td style='text-align:right'>";
            html += "<input type='button' id='openBag' class='mutableButton' value='打开百宝袋'>";
            html += "<input type='button' id='closeBag' class='mutableButton' value='关闭百宝袋'>";
            html += "<input type='button' id='openWarehouse' class='mutableButton' value='打开仓库'>";
            html += "<input type='button' id='closeWarehouse' class='mutableButton' value='关闭仓库'>";
            html += "</td>";
            html += "</tr>";
            html += "</tbody>";
            html += "</table>";
            html += "</td>";
            html += "</tr>";

            html += "</tbody>";
            html += "</table>";

            $("#equipmentList").html(html).parent().show();
        }

        if (bagIndex < 0) {
            $("#openBag").prop("disabled", true).hide();
            $("#closeBag").prop("disabled", true).hide();
        }

        if ($("#bagState").text() === "on") {
            $("#openBag").prop("disabled", true);
            this.#loadAndRenderBagList(credential, bagIndex, context);
        } else {
            $("#closeBag").prop("disabled", true);
        }
        if ($("#warehouseState").text() === "on") {
            $("#openWarehouse").prop("disabled", true);
            this.#loadAndRenderWarehouseList(credential, page, context);
        } else {
            $("#closeWarehouse").prop("disabled", true);
        }

        if (!$("#openBag").prop("disabled")) {
            $("#openBag").on("click", () => {
                $("#bagState").text("on");
                this.doRefreshMutablePage(credential, context);
            });
        }
        if (!$("#closeBag").prop("disabled")) {
            $("#closeBag").on("click", () => {
                $("#bagState").text("off");
                this.doRefreshMutablePage(credential, context);
            });
        }
        if (!$("#openWarehouse").prop("disabled")) {
            $("#openWarehouse").on("click", () => {
                $("#warehouseState").text("on");
                this.doRefreshMutablePage(credential, context);
            });
        }
        if (!$("#closeWarehouse").prop("disabled")) {
            $("#closeWarehouse").on("click", () => {
                $("#warehouseState").text("off");
                this.doRefreshMutablePage(credential, context);
            });
        }
    }

    #loadAndRenderBagList(credential: Credential, bagIndex: number, context?: PageProcessorContext) {
        new TreasureBag(credential, bagIndex).open().then(equipments => {
            const equipmentList = Equipment.sortEquipmentList(equipments);

            let html = "";
            html += "<table style='border-width:0;background-color:#888888;text-align:center;width:100%;margin:auto'>";
            html += "<tbody>";
            html += "<tr>";
            html += "<td style='background-color:darkgreen;color:wheat;font-weight:bold;font-size:120%;text-align:center' colspan='11'>＜ 百 宝 袋 ＞</td>";
            html += "</tr>";
            html += "<tr>";
            html += "<th style='background-color:#E8E8D0'>选择</th>"
            html += "<th style='background-color:#E0D0B0'>名字</th>"
            html += "<th style='background-color:#EFE0C0'>种类</th>"
            html += "<th style='background-color:#E0D0B0'>效果</th>"
            html += "<th style='background-color:#EFE0C0'>重量</th>"
            html += "<th style='background-color:#EFE0C0'>耐久</th>"
            html += "<th style='background-color:#EFE0C0'>威＋</th>"
            html += "<th style='background-color:#EFE0C0'>重＋</th>"
            html += "<th style='background-color:#EFE0C0'>幸＋</th>"
            html += "<th style='background-color:#E0D0B0'>经验</th>"
            html += "<th style='background-color:#E8E8D0'>取出</th>"
            html += "</tr>";

            for (const equipment of equipmentList) {
                html += "<tr>";
                html += "<td style='background-color:#E8E8D0'>";
                html += "</td>";
                html += "<td style='background-color:#E0D0B0'>" + equipment.nameHTML + "</td>";
                html += "<td style='background-color:#EFE0C0'>" + equipment.category + "</td>";
                html += "<td style='background-color:#E0D0B0'>" + equipment.power + "</td>";
                html += "<td style='background-color:#EFE0C0'>" + equipment.weight + "</td>";
                html += "<td style='background-color:#EFE0C0'>" + equipment.endureHtml + "</td>";
                html += "<td style='background-color:#EFE0C0'>" + equipment.additionalPowerHtml + "</td>";
                html += "<td style='background-color:#EFE0C0'>" + equipment.additionalWeightHtml + "</td>";
                html += "<td style='background-color:#EFE0C0'>" + equipment.additionalLuckHtml + "</td>";
                html += "<td style='background-color:#E0D0B0'>" + equipment.experienceHTML + "</td>";
                html += "<td style='background-color:#E8E8D0'>";
                html += "</td>";
                html += "</tr>";
            }
            // ----------------------------------------------------------------
            // 百宝袋菜单栏
            // ----------------------------------------------------------------
            html += "<tr>";
            html += "<td style='background-color:#F8F0E0;text-align:center' colspan='11'>";
            html += "<table style='border-width:0;background-color:#F8F0E0;width:100%;margin:auto'>";
            html += "<tbody>";
            html += "<tr>";
            html += "<td style='text-align:left'>";
            html += "<input type='button' id='takeOut' class='mutableButton' value='出百宝袋'>";
            html += "</td>";
            html += "<td style='text-align:right'>";
            html += "<input type='button' id='internalCloseBag' class='mutableButton' value='关闭百宝袋'>";
            html += "</td>";
            html += "</tr>";
            html += "</tbody>";
            html += "</table>";
            html += "</td>";
            html += "</tr>";
            html += "</tbody>";
            html += "</table>";

            $("#bagList").html(html).parent().show();

            $("#internalCloseBag").on("click", () => {
                $("#bagState").text("off");
                this.doRefreshMutablePage(credential, context);
            });
        });
    }

    #loadAndRenderWarehouseList(credential: Credential, page: PersonalEquipmentManagementPage, context?: PageProcessorContext) {
        new CastleWarehouse(credential).open().then(warehousePage => {
            const equipmentList = Equipment.sortEquipmentList(warehousePage.storageEquipmentList!);

            let html = "";
            html += "<table style='border-width:0;background-color:#888888;margin:auto;width:100%'>";
            html += "<tbody style='background-color:#F8F0E0;text-align:center'>";
            html += "<tr>";
            html += "<td style='background-color:darkred;color:wheat;font-weight:bold' " +
                "colspan='17'>";
            html += "＜ 城 堡 仓 库 ＞";
            html += "</td>";
            html += "<tr>";
            html += "<th style='background-color:#E8E8D0'>名字</th>";
            html += "<th style='background-color:#EFE0C0'>种类</th>";
            html += "<th style='background-color:#E0D0B0'>效果</th>";
            html += "<th style='background-color:#EFE0C0'>重量</th>";
            html += "<th style='background-color:#E0D0B0'>耐久</th>";
            html += "<th style='background-color:#EFE0C0'>职业</th>";
            html += "<th style='background-color:#E0D0B0'>攻击</th>";
            html += "<th style='background-color:#E0D0B0'>防御</th>";
            html += "<th style='background-color:#E0D0B0'>智力</th>";
            html += "<th style='background-color:#E0D0B0'>精神</th>";
            html += "<th style='background-color:#E0D0B0'>速度</th>";
            html += "<th style='background-color:#EFE0C0'>威力</th>";
            html += "<th style='background-color:#EFE0C0'>重量</th>";
            html += "<th style='background-color:#EFE0C0'>幸运</th>";
            html += "<th style='background-color:#E0D0B0'>经验</th>";
            html += "<th style='background-color:#E0D0B0'>属性</th>";
            html += "<th style='background-color:#E8E8D0'>取出</th>";
            html += "</tr>";

            for (const equipment of equipmentList) {
                html += "<tr>";
                html += "<td style='background-color:#E8E8D0'>" + equipment.nameHTML + "</td>";
                html += "<td style='background-color:#EFE0C0'>" + equipment.category + "</td>";
                html += "<td style='background-color:#E0D0B0'>" + equipment.power + "</td>";
                html += "<td style='background-color:#EFE0C0'>" + equipment.weight + "</td>";
                html += "<td style='background-color:#E0D0B0'>" + equipment.endureHtml + "</td>";
                html += "<td style='background-color:#EFE0C0'>" + equipment.requiredCareerHtml + "</td>";
                html += "<td style='background-color:#E0D0B0'>" + equipment.requiredAttackHtml + "</td>";
                html += "<td style='background-color:#E0D0B0'>" + equipment.requiredDefenseHtml + "</td>";
                html += "<td style='background-color:#E0D0B0'>" + equipment.requiredSpecialAttackHtml + "</td>";
                html += "<td style='background-color:#E0D0B0'>" + equipment.requiredSpecialDefenseHtml + "</td>";
                html += "<td style='background-color:#E0D0B0'>" + equipment.requiredSpeedHtml + "</td>";
                html += "<td style='background-color:#EFE0C0'>" + equipment.additionalPowerHtml + "</td>";
                html += "<td style='background-color:#EFE0C0'>" + equipment.additionalWeightHtml + "</td>";
                html += "<td style='background-color:#EFE0C0'>" + equipment.additionalLuckHtml + "</td>";
                html += "<td style='background-color:#E0D0B0'>" + equipment.experienceHTML + "</td>";
                html += "<td style='background-color:#E0D0B0'>" + equipment.attributeHtml + "</td>";
                html += "<td style='background-color:#E8E8D0'>";
                if (page.spaceCount > 0) {
                    html += "<input type='button' class='mutableButton' " +
                        "id='outWarehouse_" + equipment.index + "' value='出库'>";
                }
                html += "</td>";
                html += "</tr>";
            }
            // ----------------------------------------------------------------
            // 城堡仓库菜单栏
            // ----------------------------------------------------------------
            html += "<tr>";
            html += "<td style='background-color:#F8F0E0;text-align:center' colspan='17'>";
            html += "<table style='border-width:0;background-color:#F8F0E0;width:100%;margin:auto'>";
            html += "<tbody>";
            html += "<tr>";
            html += "<td style='text-align:left'>";
            html += "</td>";
            html += "<td style='text-align:right'>";
            html += "<input type='button' id='internalCloseWarehouse' class='mutableButton' value='关闭仓库'>";
            html += "</td>";
            html += "</tr>";
            html += "</tbody>";
            html += "</table>";
            html += "</td>";
            html += "</tr>";
            html += "</tbody>";
            html += "</table>";

            html += "</tbody>";
            html += "</table>";

            $("#warehouseList").html(html).parent().show();

            $("#internalCloseWarehouse").on("click", () => {
                $("#warehouseState").text("off");
                this.doRefreshMutablePage(credential, context);
            });

            $("input:button[value='出库']").on("click", event => {
                const buttonId = $(event.target).attr("id")!;
                const index = parseInt(buttonId.split("_")[1]);
                const request = credential.asRequestMap();
                request.set("item" + index, index.toString());
                request.set("chara", "1");
                request.set("mode", "CASTLE_ITEMWITHDRAW");
                NetworkUtils.post("castle.cgi", request).then(html => {
                    MessageBoard.processResponseMessage(html);
                    this.doRefreshMutablePage(credential, context);
                });
            });
        });
    }

}

export = PersonalEquipmentManagementPageProcessor_Castle;