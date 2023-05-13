import TownLoader from "../../core/TownLoader";
import PersonalEquipmentManagement from "../../pocketrose/PersonalEquipmentManagement";
import PersonalEquipmentManagementPage from "../../pocketrose/PersonalEquipmentManagementPage";
import PersonalStatus from "../../pocketrose/PersonalStatus";
import TownEquipmentExpressHouse from "../../pocketrose/TownEquipmentExpressHouse";
import TownForgeHouse from "../../pocketrose/TownForgeHouse";
import TreasureBag from "../../pocketrose/TreasureBag";
import Credential from "../../util/Credential";
import MessageBoard from "../../util/MessageBoard";
import PageUtils from "../../util/PageUtils";
import StringUtils from "../../util/StringUtils";
import PageProcessorContext from "../PageProcessorContext";
import AbstractPersonalEquipmentManagementPageProcessor from "./AbstractPersonalEquipmentManagementPageProcessor";

class PersonalEquipmentManagementPageProcessor_Town extends AbstractPersonalEquipmentManagementPageProcessor {

    doGeneratePageTitleHtml(context?: PageProcessorContext): string {
        if (context === undefined) {
            return "＜＜  装 备 管 理 （ 城 市 模 式 ）  ＞＞";
        } else {
            const townId = context.get("townId")!;
            const town = TownLoader.getTownById(townId)!;
            return "＜＜  装 备 管 理 （ " + town.nameTitle + " ）  ＞＞";
        }
    }

    doGenerateRoleLocationHtml(context?: PageProcessorContext): string {
        if (context === undefined) {
            return "城市";
        } else {
            const townId = context.get("townId")!;
            const town = TownLoader.getTownById(townId)!;
            return town.name;
        }
    }

    doGenerateWelcomeMessageHtml(): string {
        return "<b style='font-size:120%;color:wheat'>又来管理您的装备来啦？就这点破烂折腾来折腾去的，您累不累啊。</b>";
    }

    doBindReturnButton(credential: Credential): void {
        const html = PageUtils.generateReturnTownForm(credential);
        $("#hiddenFormContainer").html(html);
        $("#returnButton").on("click", () => {
            $("#returnTown").trigger("click");
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
            "colspan='22'>＜ 随 身 装 备 ＞</td>";
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
        html += "<th style='background-color:#E8E8D0'>修理</th>"
        html += "<th style='background-color:#E8E8D0'>入袋</th>"
        html += "<th style='background-color:#E8E8D0'>发送</th>"
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
                    "class='mutableButton-1 selectButton-1' " +
                    "id='selectButton_1_" + equipment.index! + "'>";
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
                    "class='mutableButton-1 useButton-1' " +
                    "id='useButton_1_" + equipment.index! + "'>";
            }
            html += "</td>";
            html += "<td style='background-color:#E8E8D0'>";
            if (equipment.isRepairable) {
                html += "<input type='button' value='修理' " +
                    "class='mutableButton-1 repairButton-1' " +
                    "id='repairButton_1_" + equipment.index! + "'>";
            }
            html += "</td>";
            html += "<td style='background-color:#E8E8D0'>"
            if (equipment.selectable! && !equipment.using! && bagIndex >= -1) {
                html += "<input type='button' value='入袋' " +
                    "class='mutableButton-1 storeButton-1' " +
                    "id='storeButton_1_" + equipment.index! + "'>";
            }
            html += "</td>";
            html += "<td style='background-color:#E8E8D0'>"
            html += "<input type='button' value='发送' " +
                "class='mutableButton-1 sendButton-1' " +
                "id='sendButton_1_" + equipment.index! + "' disabled style='display:none'>";
            html += "</td>";
            html += "</tr>";
        }

        // ------------------------------------------------------------------------
        // 装备菜单栏
        // ------------------------------------------------------------------------
        html += "<tr>";
        html += "<td style='background-color:#F8F0E0;text-align:center' colspan='22'>";
        html += "<table style='border-width:0;background-color:#F8F0E0;width:100%;margin:auto'>";
        html += "<tbody>";
        html += "<tr>";
        html += "<td style='text-align:center;font-weight:bold' colspan='2'>";
        html += "<span style='color:navy'>目前剩余空位数：</span><span style='color:red'>" + page.spaceCount + "</span>";
        html += "</td>";
        html += "</tr>";
        html += "<tr>";
        html += "<td style='text-align:left'>";
        html += "<input type='button' id='useButton' class='mutableButton-1' value='使用装备'>";
        html += "<input type='button' id='storeButton' class='mutableButton-1' value='放入百宝袋' disabled style='display:none'>";
        html += "</td>";
        html += "<td style='text-align:right'>";
        html += "<input type='button' id='openBagButton' class='mutableButton-1' value='打开百宝袋' disabled style='display:none'>";
        html += "<input type='button' id='closeBagButton' class='mutableButton-1' value='关闭百宝袋' disabled style='display:none'>";
        html += "</td>";
        html += "</tr>";
        html += "<tr>";
        html += "<td style='text-align:left' colspan='2'>";
        html += "<input type='text' id='searchName' size='15' maxlength='20'>";
        html += "<input type='button' id='searchButton' class='mutableButton-1' value='找人'>";
        html += "<select id='peopleSelect'><option value=''>选择发送对象</select>";
        html += "<input type='button' id='sendButton' class='mutableButton-1' value='发送'>";
        html += "</td>";
        html += "</tr>";
        html += "<tr style='display:none'>";
        html += "<td style='text-align:right' colspan='2'>";
        html += "</td>";
        html += "</tr>";
        html += "</tbody>";
        html += "</table>";
        html += "</td>";
        html += "</tr>";

        html += "</tbody>";
        html += "</table>";

        $("#equipmentList").html(html).parent().show();

        // --------------------------------------------------------------------
        // 选择
        // --------------------------------------------------------------------
        this.doBindSelectButtons("selectButton-1");

        // --------------------------------------------------------------------
        // 使用
        // --------------------------------------------------------------------
        $(".useButton-1").on("click", event => {
            const buttonId = $(event.target).attr("id")!;
            const index = parseInt(StringUtils.substringAfterLast(buttonId, "_"));
            new PersonalEquipmentManagement(credential, context?.get("townId")).use([index]).then(() => {
                this.doRefreshMutablePage(credential, context);
            });
        });

        // --------------------------------------------------------------------
        // 修理
        // --------------------------------------------------------------------
        $(".repairButton-1").on("click", event => {
            const buttonId = $(event.target).attr("id")!;
            const index = parseInt(StringUtils.substringAfterLast(buttonId, "_"));
            new TownForgeHouse(credential, context?.get("townId")).repair(index).then(() => {
                const equipment = page.findEquipment(index)!;
                MessageBoard.publishMessage("修理了" + equipment.fullName + "。");
                this.doRefreshMutablePage(credential, context);
            });
        });

        // --------------------------------------------------------------------
        // 入袋
        // --------------------------------------------------------------------
        $(".storeButton-1").on("click", event => {
            const buttonId = $(event.target).attr("id")!;
            const index = parseInt(StringUtils.substringAfterLast(buttonId, "_"));
            new TreasureBag(credential).putInto([index]).then(() => {
                this.doRefreshMutablePage(credential, context);
            });
        });

        // --------------------------------------------------------------------
        // 找人
        // --------------------------------------------------------------------
        $("#searchButton").on("click", () => {
            const s = $("#searchName").val();
            if (s === undefined || (s as string).trim() === "") {
                this.doScrollToPageTitle();
                MessageBoard.publishWarning("没有正确输入人名！");
                return;
            }
            new TownEquipmentExpressHouse(credential, context?.get("townId")).search(s as string).then(optionListHtml => {
                $("#peopleSelect").html(optionListHtml);
            });
        });

        // --------------------------------------------------------------------
        // 打开百宝袋 / 关闭百宝袋
        // --------------------------------------------------------------------
        if (bagIndex >= -1) {
            $("#openBagButton").prop("disabled", false).show();
            $("#closeBagButton").prop("disabled", false).show();
            $("#openBagButton").on("click", () => {
                if ($("#bagState").text() === "on") {
                    return;
                }
                $("#bagState").text("on");
                this.#renderBagUI(credential, page, bagIndex, context);
            });
            $("#closeBagButton").on("click", () => {
                if ($("#bagState").text() === "off") {
                    return;
                }
                $("#bagState").text("off");
                PageUtils.unbindEventBySpecifiedClass("mutableButton-2");
                $("#bagList").html("").parent().hide();
            });
        }

        if ($("#bagState").text() === "on") {
            this.#renderBagUI(credential, page, bagIndex, context);
        }
    }

    #renderBagUI(credential: Credential,
                 page: PersonalEquipmentManagementPage,
                 bagIndex: number,
                 context?: PageProcessorContext) {
        if (bagIndex < 0) {
            this.#renderLostBagUI(credential, page, context)
        } else {
            this.#renderNormalBagUI(credential, page, bagIndex, context)
        }
    }

    #renderLostBagUI(credential: Credential,
                     page: PersonalEquipmentManagementPage,
                     context?: PageProcessorContext) {
        let html = "";
        html += "<table style='border-width:0;background-color:#888888;text-align:center;width:100%;margin:auto'>";
        html += "<tbody>";
        html += "<tr>";
        html += "<td style='background-color:darkgreen;color:wheat;font-weight:bold;font-size:120%;text-align:center'>＜ 百 宝 袋 ＞</td>";
        html += "</tr>";
        html += "<tr>";
        html += "<th style='background-color:#E8E8D0;text-align:center;color:navy;font-weight:bold'>百宝袋丢失了呀？那只能为您提供受限的功能了。</th>"
        html += "</tr>";
        // ----------------------------------------------------------------
        // 百宝袋菜单栏
        // ----------------------------------------------------------------
        html += "<tr>";
        html += "<td style='background-color:#F8F0E0;text-align:center'>";
        html += "<table style='border-width:0;background-color:#F8F0E0;width:100%;margin:auto'>";
        html += "<tbody>";
        html += "<tr>";
        html += "<td style='text-align:left'>";
        if (page.spaceCount > 0) {
            html += "<input type='button' class='mutableButton-2' " +
                "id='takeOutButton' " +
                "value='从百宝袋中盲取'>";
        }
        html += "</td>";
        html += "<td style='text-align:right'>";
        html += "<input type='button' id='closeBagButton_2' class='mutableButton-2' value='关闭百宝袋'>";
        html += "</td>";
        html += "</tr>";
        html += "</tbody>";
        html += "</table>";
        html += "</td>";
        html += "</tr>";
        html += "</tbody>";
        html += "</table>";

        $("#bagList").html(html).parent().show();

        $("#takeOutButton").on("click", () => {
            new TreasureBag(credential).tryTakeOut(page.spaceCount).then(() => {
                this.doRefreshMutablePage(credential, context);
            });
        });

        $("#closeBagButton_2").on("click", () => {
            if ($("#bagState").text() === "off") {
                return;
            }
            $("#bagState").text("off");
            PageUtils.unbindEventBySpecifiedClass("mutableButton-2");
            $("#bagList").html("").parent().hide();
        });
    }

    #renderNormalBagUI(credential: Credential,
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
                        "class='mutableButton-2 selectButton-2' " +
                        "id='selectButton_2_" + equipment.index! + "'>";
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
                        "class='mutableButton-2 takeOutButton-2' " +
                        "id='takeOutButton_2_" + equipment.index! + "'>";
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
                    "id='takeOutButton' " +
                    "value='从百宝袋中取出'>";
            }
            html += "</td>";
            html += "<td style='text-align:right'>";
            html += "<input type='button' id='closeBagButton_2' class='mutableButton-2' value='关闭百宝袋'>";
            html += "</td>";
            html += "</tr>";
            html += "</tbody>";
            html += "</table>";
            html += "</td>";
            html += "</tr>";

            html += "</tbody>";
            html += "</table>";

            $("#bagList").html(html).parent().show();

            $(".takeOutButton-2").on("click", event => {
                const buttonId = $(event.target).attr("id")!;
                const index = parseInt(StringUtils.substringAfterLast(buttonId, "_"));
                new TreasureBag(credential).takeOut([index]).then(() => {
                    this.doRefreshMutablePage(credential, context);
                });
            });

            $("#closeBagButton_2").on("click", () => {
                if ($("#bagState").text() === "off") {
                    return;
                }
                $("#bagState").text("off");
                PageUtils.unbindEventBySpecifiedClass("mutableButton-2");
                $("#bagList").html("").parent().hide();
            });
        });
    }
}

export = PersonalEquipmentManagementPageProcessor_Town;