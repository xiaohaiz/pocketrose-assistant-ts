import Equipment from "../../common/Equipment";
import CastleWarehouse from "../../pocketrose/CastleWarehouse";
import PersonalEquipmentManagement from "../../pocketrose/PersonalEquipmentManagement";
import PersonalEquipmentManagementPage from "../../pocketrose/PersonalEquipmentManagementPage";
import PersonalStatus from "../../pocketrose/PersonalStatus";
import TreasureBag from "../../pocketrose/TreasureBag";
import Credential from "../../util/Credential";
import MessageBoard from "../../util/MessageBoard";
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
        return "<b style='font-size:120%;color:wheat'>又来管理您的装备来啦？真是一刻不得闲啊。</b>";
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
            this.#renderPersonalUI(credential, page, bag.index!, context);
        } else {
            // 已经掌握了剑圣职业，说明应该有百宝袋，但是因为某些bug导致百宝袋不可见了，
            // 还是提供有限的百宝袋功能吧，能够放入、取出，但是不能浏览了。
            // 如果有分身了，那也说明曾经掌握过剑圣职业，就算有百宝袋了
            new PersonalStatus(credential).load().then(role => {
                if (role.masterCareerList!.includes("剑圣") || role.hasMirror!) {
                    // 真的曾经拥有百宝袋，但是又因为某些bug失去了
                    this.#renderPersonalUI(credential, page, -1, context);
                } else {
                    // 是真的没有百宝袋
                    this.#renderPersonalUI(credential, page, -99, context);
                }
            });
        }
    }

    #renderPersonalUI(credential: Credential,
                      page: PersonalEquipmentManagementPage,
                      bagIndex: number,
                      context?: PageProcessorContext) {
        $("#bagIndex").text(bagIndex);

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
            if (equipment.selectable!) {
                html += "<input type='button' value='选择' " +
                    "style='color:grey' " +
                    "class='mutableButton-1 select-1' " +
                    "id='select1_" + equipment.index! + "'>";
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
            if (equipment.selectable!) {
                html += "<input type='button' value='" + equipment.buttonTitle + "' " +
                    "class='mutableButton-1 use-1' " +
                    "id='use1_" + equipment.index! + "'>";
            }
            html += "</td>";
            html += "<td style='background-color:#E8E8D0'>"
            if (equipment.selectable! && !equipment.using! && bagIndex >= -1) {
                html += "<input type='button' value='入袋' " +
                    "class='mutableButton-1 putIntoBag-1' " +
                    "id='putIntoBag1_" + equipment.index! + "'>";
            }
            html += "</td>";
            html += "<td style='background-color:#E8E8D0'>"
            if (!equipment.using!) {
                html += "<input type='button' value='入库' " +
                    "class='mutableButton-1 putIntoWarehouse-1' " +
                    "id='putIntoWarehouse1_" + equipment.index! + "'>";
            }
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
        html += "<input type='button' id='use1' class='mutableButton-1' value='使用装备'>";
        html += "<input type='button' id='putIntoBag1' class='mutableButton-1' value='放入百宝袋' disabled style='display:none'>";
        html += "</td>";
        html += "<td style='text-align:right'>";
        html += "<input type='button' id='openBag' class='mutableButton-1' value='打开百宝袋' disabled style='display:none'>";
        html += "<input type='button' id='closeBag' class='mutableButton-1' value='关闭百宝袋' disabled style='display:none'>";
        html += "<input type='button' id='openWarehouse' class='mutableButton-1' value='打开仓库'>";
        html += "<input type='button' id='closeWarehouse' class='mutableButton-1' value='关闭仓库'>";
        html += "</td>";
        html += "</tr>";
        html += "</tbody>";
        html += "</table>";
        html += "</td>";
        html += "</tr>";

        html += "</tbody>";
        html += "</table>";

        $("#equipmentList").html(html).parent().show();

        // Bind select buttons
        $(".select-1").on("click", event => {
            const buttonId = $(event.target).attr("id")!;
            if (PageUtils.isColorGrey(buttonId)) {
                $(event.target).css("color", "blue");
            } else if (PageUtils.isColorBlue(buttonId)) {
                $(event.target).css("color", "grey");
            }
        });

        // Bind use buttons
        $(".use-1").on("click", event => {
            const buttonId = $(event.target).attr("id")!;
            const index = parseInt(StringUtils.substringAfterLast(buttonId, "_"));
            new PersonalEquipmentManagement(credential).use([index]).then(() => {
                this.doRefreshMutablePage(credential, context);
            });
        });

        // Bind put into bag buttons
        $(".putIntoBag-1").on("click", event => {
            const buttonId = $(event.target).attr("id")!;
            const index = parseInt(StringUtils.substringAfterLast(buttonId, "_"));
            new TreasureBag(credential).putInto([index]).then(() => {
                this.doRefreshMutablePage(credential, context);
            });
        });

        // Bind put into warehouse buttons
        $(".putIntoWarehouse-1").on("click", event => {
            const buttonId = $(event.target).attr("id")!;
            const index = parseInt(StringUtils.substringAfterLast(buttonId, "_"));
            new CastleWarehouse(credential).putInto([index]).then(() => {
                this.doRefreshMutablePage(credential, context);
            });
        });

        // Bind use button
        $("#use1").on("click", () => {
            const indexList: number[] = [];
            $(".select-1").each((idx, button) => {
                const buttonId = $(button).attr("id") as string;
                if (PageUtils.isColorBlue(buttonId)) {
                    const index = parseInt(StringUtils.substringAfterLast(buttonId, "_"));
                    indexList.push(index);
                }
            });
            if (indexList.length === 0) {
                this.doScrollToPageTitle();
                MessageBoard.publishWarning("没有选择物品或装备！");
                return;
            }
            new PersonalEquipmentManagement(credential).use(indexList).then(() => {
                this.doRefreshMutablePage(credential, context);
            });
        });

        // Put into bag
        if (bagIndex >= -1) {
            $("#putIntoBag1").prop("disabled", false).show();
            $("#putIntoBag1").on("click", () => {
                const indexList: number[] = [];
                $(".select-1").each((idx, button) => {
                    const buttonId = $(button).attr("id") as string;
                    if (PageUtils.isColorBlue(buttonId)) {
                        const index = parseInt(StringUtils.substringAfterLast(buttonId, "_"));
                        indexList.push(index);
                    }
                });
                if (indexList.length === 0) {
                    this.doScrollToPageTitle();
                    MessageBoard.publishWarning("没有选择物品或装备！");
                    return;
                }
                new TreasureBag(credential).putInto(indexList).then(() => {
                    this.doRefreshMutablePage(credential, context);
                });
            });
        }

        // Bind open/close bag buttons
        if (bagIndex >= -1) {
            $("#openBag").prop("disabled", false).show();
            $("#closeBag").prop("disabled", false).show();
            $("#openBag").on("click", () => {
                if ($("#bagState").text() === "on") {
                    return;
                }
                $("#bagState").text("on");
                this.#renderBagUI(credential, page, bagIndex, context);
            });
            $("#closeBag").on("click", () => {
                if ($("#bagState").text() === "off") {
                    return;
                }
                $("#bagState").text("off");
                PageUtils.unbindEventBySpecifiedClass("mutableButton-2");
                $("#bagList").html("").parent().hide();
            });
        }

        // Bind open/close warehouse buttons
        $("#openWarehouse").on("click", () => {
            if ($("#warehouseState").text() === "on") {
                return;
            }
            $("#warehouseState").text("on");
            this.#renderWarehouseUI(credential, page, context);
        });
        $("#closeWarehouse").on("click", () => {
            if ($("#warehouseState").text() === "off") {
                return;
            }
            $("#warehouseState").text("off");
            PageUtils.unbindEventBySpecifiedClass("mutableButton-3");
            $("#warehouseList").html("").parent().hide();
        });

        // Render bag or warehouse if necessary
        if ($("#bagState").text() === "on") {
            this.#renderBagUI(credential, page, bagIndex, context);
        }
        if ($("#warehouseState").text() === "on") {
            this.#renderWarehouseUI(credential, page, context);
        }

    }

    #renderBagUI(credential: Credential,
                 page: PersonalEquipmentManagementPage,
                 bagIndex: number,
                 context?: PageProcessorContext) {
        new TreasureBag(credential).open(bagIndex).then(bagPage => {
            const equipmentList = bagPage.sortedEquipmentList;

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
                if (page.spaceCount > 0) {
                    html += "<input type='button' value='选择' " +
                        "style='color:grey' " +
                        "class='mutableButton-2 select-2' " +
                        "id='select2_" + equipment.index! + "'>";
                }
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
                if (page.spaceCount > 0) {
                    html += "<input type='button' value='出袋' " +
                        "class='mutableButton-2 takeOutBag-2' " +
                        "id='takeOutBag1_" + equipment.index! + "'>";
                }
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
            if (page.spaceCount > 0) {
                html += "<input type='button' class='mutableButton-2' " +
                    "id='takeOutFromBag2' " +
                    "value='从百宝袋中取出'>";
            }
            html += "</td>";
            html += "<td style='text-align:right'>";
            html += "<input type='button' id='closeBag2' class='mutableButton-2' value='关闭百宝袋'>";
            html += "</td>";
            html += "</tr>";
            html += "</tbody>";
            html += "</table>";
            html += "</td>";
            html += "</tr>";

            html += "</tbody>";
            html += "</table>";

            $("#bagList").html(html).parent().show();

            // Bind select buttons
            $(".select-2").on("click", event => {
                const buttonId = $(event.target).attr("id")!;
                if (PageUtils.isColorGrey(buttonId)) {
                    $(event.target).css("color", "blue");
                } else if (PageUtils.isColorBlue(buttonId)) {
                    $(event.target).css("color", "grey");
                }
            });

            // Bind take out buttons
            $(".takeOutBag-2").on("click", event => {
                const buttonId = $(event.target).attr("id")!;
                const index = parseInt(StringUtils.substringAfterLast(buttonId, "_"));
                new TreasureBag(credential).takeOut([index]).then(() => {
                    this.doRefreshMutablePage(credential, context);
                });
            });
            $("#takeOutFromBag2").on("click", () => {
                const indexList: number[] = [];
                $(".select-2").each((idx, button) => {
                    const buttonId = $(button).attr("id") as string;
                    if (PageUtils.isColorBlue(buttonId)) {
                        const index = parseInt(StringUtils.substringAfterLast(buttonId, "_"));
                        indexList.push(index);
                    }
                });
                if (indexList.length === 0) {
                    this.doScrollToPageTitle();
                    MessageBoard.publishWarning("没有选择百宝袋中的物品或装备！");
                    return;
                }
                new TreasureBag(credential).takeOut(indexList).then(() => {
                    this.doRefreshMutablePage(credential, context);
                });
            });

            $("#closeBag2").on("click", () => {
                if ($("#bagState").text() === "off") {
                    return;
                }
                $("#bagState").text("off");
                PageUtils.unbindEventBySpecifiedClass("mutableButton-2");
                $("#bagList").html("").parent().hide();
            });
        });
    }

    #renderWarehouseUI(credential: Credential,
                       page: PersonalEquipmentManagementPage,
                       context?: PageProcessorContext) {
        new CastleWarehouse(credential).open().then(warehousePage => {
            const equipmentList = Equipment.sortEquipmentList(warehousePage.storageEquipmentList!);

            let html = "";
            html += "<table style='border-width:0;background-color:#888888;margin:auto;width:100%'>";
            html += "<tbody style='background-color:#F8F0E0;text-align:center'>";
            html += "<tr>";
            html += "<td style='background-color:darkred;color:wheat;font-weight:bold' " +
                "colspan='18'>";
            html += "＜ 城 堡 仓 库 ＞";
            html += "</td>";
            html += "<tr>";
            html += "<th style='background-color:#E8E8D0'>选择</th>";
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
                html += "<td style='background-color:#E8E8D0'>";
                if (page.spaceCount > 0) {
                    if (page.spaceCount > 0) {
                        html += "<input type='button' value='选择' " +
                            "style='color:grey' " +
                            "class='mutableButton-3 select-3' " +
                            "id='select3_" + equipment.index! + "'>";
                    }
                }
                html += "</td>";
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
                    html += "<input type='button' class='mutableButton-3 takeOutFromWarehouse-3' " +
                        "id='takeOutFromWarehouse3_" + equipment.index + "' value='出库'>";
                }
                html += "</td>";
                html += "</tr>";
            }
            // ----------------------------------------------------------------
            // 城堡仓库菜单栏
            // ----------------------------------------------------------------
            html += "<tr>";
            html += "<td style='background-color:#F8F0E0;text-align:center' colspan='18'>";
            html += "<table style='border-width:0;background-color:#F8F0E0;width:100%;margin:auto'>";
            html += "<tbody>";
            html += "<tr>";
            html += "<td style='text-align:left'>";
            if (page.spaceCount > 0) {
                html += "<input type='button' class='mutableButton-3' " +
                    "id='takeOutFromWarehouse3' " +
                    "value='从仓库中取出'>";
            }
            html += "</td>";
            html += "<td style='text-align:right'>";
            html += "<input type='button' id='closeWarehouse3' class='mutableButton-3' value='关闭仓库'>";
            html += "</td>";
            html += "</tr>";
            html += "</tbody>";
            html += "</table>";
            html += "</td>";
            html += "</tr>";

            html += "</tbody>";
            html += "</table>";

            $("#warehouseList").html(html).parent().show();

            // Bind select buttons
            $(".select-3").on("click", event => {
                const buttonId = $(event.target).attr("id")!;
                if (PageUtils.isColorGrey(buttonId)) {
                    $(event.target).css("color", "blue");
                } else if (PageUtils.isColorBlue(buttonId)) {
                    $(event.target).css("color", "grey");
                }
            });

            // Bind take out buttons
            $(".takeOutFromWarehouse-3").on("click", event => {
                const buttonId = $(event.target).attr("id")!;
                const index = parseInt(StringUtils.substringAfterLast(buttonId, "_"));
                new CastleWarehouse(credential).takeOut([index]).then(() => {
                    this.doRefreshMutablePage(credential, context);
                });
            });
            $("#takeOutFromWarehouse3").on("click", () => {
                const indexList: number[] = [];
                $(".select-3").each((idx, button) => {
                    const buttonId = $(button).attr("id") as string;
                    if (PageUtils.isColorBlue(buttonId)) {
                        const index = parseInt(StringUtils.substringAfterLast(buttonId, "_"));
                        indexList.push(index);
                    }
                });
                if (indexList.length === 0) {
                    this.doScrollToPageTitle();
                    MessageBoard.publishWarning("没有选择仓库中的物品或装备！");
                    return;
                }
                new CastleWarehouse(credential).takeOut(indexList).then(() => {
                    this.doRefreshMutablePage(credential, context);
                });
            });

            $("#closeWarehouse3").on("click", () => {
                if ($("#warehouseState").text() === "off") {
                    return;
                }
                $("#warehouseState").text("off");
                PageUtils.unbindEventBySpecifiedClass("mutableButton-3");
                $("#warehouseList").html("").parent().hide();
            });
        });
    }

}

export = PersonalEquipmentManagementPageProcessor_Castle;