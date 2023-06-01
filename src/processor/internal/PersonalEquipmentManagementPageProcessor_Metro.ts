import Equipment from "../../common/Equipment";
import EquipmentSet from "../../common/EquipmentSet";
import SetupLoader from "../../config/SetupLoader";
import EquipmentSetLoader from "../../core/EquipmentSetLoader";
import PersonalEquipmentManagement from "../../pocketrose/PersonalEquipmentManagement";
import PersonalEquipmentManagementPage from "../../pocketrose/PersonalEquipmentManagementPage";
import TreasureBag from "../../pocketrose/TreasureBag";
import Credential from "../../util/Credential";
import MessageBoard from "../../util/MessageBoard";
import PageUtils from "../../util/PageUtils";
import StringUtils from "../../util/StringUtils";
import PageProcessorContext from "../PageProcessorContext";
import PersonalEquipmentManagementPageProcessor from "./PersonalEquipmentManagementPageProcessor";

class PersonalEquipmentManagementPageProcessor_Metro extends PersonalEquipmentManagementPageProcessor {

    doGeneratePageTitleHtml(context?: PageProcessorContext): string {
        return "＜＜  装 备 管 理 （ 地 铁 区 域 ）  ＞＞";
    }

    doGenerateRoleLocationHtml(context?: PageProcessorContext): string {
        return "地铁区域";
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
        html += "<tr>";
        html += "<td style='text-align:right' colspan='2'>";
        html += "<input type='button' class='mutableButton-1' id='setButton_A' value='套装Ａ' disabled>";
        html += "<input type='button' class='mutableButton-1' id='setButton_B' value='套装Ｂ' disabled>";
        html += "<input type='button' class='mutableButton-1' id='setButton_C' value='套装Ｃ' disabled>";
        html += "<input type='button' class='mutableButton-1' id='setButton_D' value='套装Ｄ' disabled>";
        html += "<input type='button' class='mutableButton-1' id='setButton_E' value='套装Ｅ' disabled>";
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
            if ($("#bagState").text() === "on") {
                $("#openBag").prop("disabled", true);
            } else {
                $("#closeBag").prop("disabled", true);
            }
        }

        this.#bindSelectPersonalButton();
        this.#bindUseButton(credential, context);
        this.#bindStoreButton(credential, treasureBag, context);
        this.#bindOpenBagButton(credential, context);
        this.#bindCloseBagButton(credential, context);

        this.#bindSetButton(credential, page, "A", context);
        this.#bindSetButton(credential, page, "B", context);
        this.#bindSetButton(credential, page, "C", context);
        this.#bindSetButton(credential, page, "D", context);
        this.#bindSetButton(credential, page, "E", context);

        if (treasureBag !== null && $("#bagState").text() === "on") {
            this.#doRenderStorageEquipmentList(credential, treasureBag, context);
        }
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
            new TreasureBag(credential)
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


    #bindOpenBagButton(credential: Credential, context?: PageProcessorContext) {
        if ($("#openBag").prop("disabled")) {
            return;
        }
        const instance = this;
        $("#openBag").on("click", function () {
            $("#bagState").text("on");
            instance.doRefreshMutablePage(credential, context);
        });
    }

    #bindCloseBagButton(credential: Credential, context?: PageProcessorContext) {
        if ($("#closeBag").prop("disabled")) {
            return;
        }
        const instance = this;
        $("#closeBag").on("click", function () {
            $("#bagState").text("off");
            instance.doRefreshMutablePage(credential, context);
        });
    }

    #doRenderStorageEquipmentList(credential: Credential,
                                  treasureBag: Equipment,
                                  context?: PageProcessorContext) {
        new TreasureBag(credential)
            .open(treasureBag.index!)
            .then(bagPage => {
                const equipmentList = bagPage.sortedEquipmentList;
                if (equipmentList.length === 0) {
                    // Nothing found in bag.
                    return;
                }

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
                    html += "<input type='button' " +
                        "value='选择' " +
                        "style='color:grey' " +
                        "id='selectStorage_" + equipment.index + "' " +
                        "class='mutableElement'>";
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
                    html += "<input type='button' " +
                        "value='取出' " +
                        "id='takeOut_" + equipment.index + "' " +
                        "class='mutableElement'>";
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
                html += "<input type='button' id='takeOut' class='mutableElement' value='取出百宝袋'>";
                html += "</td>";
                html += "</tr>";
                html += "</tbody>";
                html += "</table>";
                html += "</td>";
                html += "</tr>";
                html += "</tbody>";
                html += "</table>";

                $("#bagList").html(html).parent().show();

                this.#bindSelectStorageButton();
                this.#bindTakeOutButton(credential, treasureBag, context);
            });
    }

    #bindSelectStorageButton() {
        $("input:button[value='选择']")
            .filter(function () {
                const buttonId = $(this).attr("id") as string;
                return buttonId.startsWith("selectStorage_");
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

    #bindTakeOutButton(credential: Credential, treasureBag: Equipment, context?: PageProcessorContext) {
        const instance = this;
        $("input:button[value='取出']").on("click", function () {
            const buttonId = $(this).attr("id") as string;
            const index = parseInt(StringUtils.substringAfter(buttonId, "_"));
            new TreasureBag(credential)
                .takeOut([index])
                .then(() => {
                    instance.doRefreshMutablePage(credential, context);
                });
        });
        $("#takeOut").on("click", function () {
            const indexList: number[] = [];
            $("input:button[value='选择']")
                .filter(function () {
                    const buttonId = $(this).attr("id") as string;
                    return buttonId.startsWith("selectStorage_");
                })
                .each(function (_idx, input) {
                    const buttonId = $(input).attr("id") as string;
                    if (PageUtils.isColorBlue(buttonId)) {
                        const index = parseInt(StringUtils.substringAfter(buttonId, "_"));
                        indexList.push(index);
                    }
                });
            if (indexList.length === 0) {
                instance.doScrollToPageTitle();
                MessageBoard.publishWarning("没有选择装备或者物品！");
                return;
            }
            new TreasureBag(credential)
                .takeOut(indexList)
                .then(() => {
                    instance.doRefreshMutablePage(credential, context);
                });
        });
    }

    #bindSetButton(credential: Credential,
                   page: PersonalEquipmentManagementPage,
                   setId: string,
                   context?: PageProcessorContext) {
        let setConfig: {} | null = null;
        switch (setId) {
            case "A":
                setConfig = SetupLoader.loadEquipmentSet_A(credential.id);
                break;
            case "B":
                setConfig = SetupLoader.loadEquipmentSet_B(credential.id);
                break;
            case "C":
                setConfig = SetupLoader.loadEquipmentSet_C(credential.id);
                break;
            case "D":
                setConfig = SetupLoader.loadEquipmentSet_D(credential.id);
                break;
            case "E":
                setConfig = SetupLoader.loadEquipmentSet_E(credential.id);
                break;
            default:
                break;
        }
        if (!this.doCheckSetConfiguration(setConfig)) {
            return;
        }
        const buttonId = "setButton_" + setId;
        $("#" + buttonId).prop("disabled", false);

        // @ts-ignore
        if (setConfig["alias"] !== undefined) {
            // @ts-ignore
            $("#" + buttonId).val(setConfig["alias"]);
        }

        $("#" + buttonId).on("click", () => {
            const set = new EquipmentSet();
            set.initialize();

            // @ts-ignore
            set.weaponName = setConfig["weaponName"];
            // @ts-ignore
            if (setConfig["weaponStar"] !== undefined && setConfig["weaponStar"]) {
                set.weaponName = "齐心★" + set.weaponName;
            }
            // @ts-ignore
            set.armorName = setConfig["armorName"];
            // @ts-ignore
            if (setConfig["armorStar"] !== undefined && setConfig["armorStar"]) {
                set.armorName = "齐心★" + set.armorName;
            }
            // @ts-ignore
            set.accessoryName = setConfig["accessoryName"];
            // @ts-ignore
            if (setConfig["accessoryStar"] !== undefined && setConfig["accessoryStar"]) {
                set.accessoryName = "齐心★" + set.accessoryName;
            }

            new EquipmentSetLoader(credential, page.equipmentList!).load(set)
                .then(() => {
                    this.doRefreshMutablePage(credential, context);
                });

        });
    }
}

export = PersonalEquipmentManagementPageProcessor_Metro;