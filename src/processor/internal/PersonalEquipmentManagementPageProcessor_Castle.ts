import _, {parseInt} from "lodash";
import CastleBank from "../../core/bank/CastleBank";
import CastleGemAutoStore from "../../core/castle/CastleGemAutoStore";
import CastleGemAutoTransfer from "../../core/castle/CastleGemAutoTransfer";
import CastleEquipmentExpressHouse from "../../core/equipment/CastleEquipmentExpressHouse";
import CastleWarehouse from "../../core/equipment/CastleWarehouse";
import Equipment from "../../core/equipment/Equipment";
import PersonalEquipmentManagement from "../../core/equipment/PersonalEquipmentManagement";
import PersonalEquipmentManagementPage from "../../core/equipment/PersonalEquipmentManagementPage";
import TreasureBag from "../../core/equipment/TreasureBag";
import PersonalStatus from "../../core/role/PersonalStatus";
import TeamMemberLoader from "../../core/team/TeamMemberLoader";
import Credential from "../../util/Credential";
import MessageBoard from "../../util/MessageBoard";
import OperationMessage from "../../util/OperationMessage";
import PageUtils from "../../util/PageUtils";
import StringUtils from "../../util/StringUtils";
import PageProcessorContext from "../PageProcessorContext";
import PersonalEquipmentManagementPageProcessor from "./PersonalEquipmentManagementPageProcessor";

class PersonalEquipmentManagementPageProcessor_Castle extends PersonalEquipmentManagementPageProcessor {

    #gemAutoStore?: CastleGemAutoStore;
    #gemAutoTransfer?: CastleGemAutoTransfer;

    async doInitialization(credential: Credential, context?: PageProcessorContext): Promise<void> {
        this.#gemAutoStore = new CastleGemAutoStore(credential);
        this.#gemAutoStore.success = () => {
            this.doRefreshMutablePage(credential, context);
        };
    }

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

    async doGenerateWelcomeMessageHtml(credential: Credential): Promise<string | undefined> {
        return "<b style='font-size:120%;color:wheat'>又来管理您的装备来啦？真是一刻不得闲啊。</b>";
    }

    doGenerateImmutableButtons(): string {
        let html = super.doGenerateImmutableButtons();
        html += "<button role='button' id='gemAutoStoreButton' " +
            "style='color:grey' class='COMMAND_BUTTON'>自动扫描身上宝石并入库</button>";
        html += "<button role='button' id='transferGemBetweenTeam' " +
            "class='COMMAND_BUTTON' style='background-color:red;color:white'>团队内宝石传输</button>";
        return html;
    }

    doGenerateSetupButtons(credential: Credential, context?: PageProcessorContext) {
        $("#gemAutoStoreButton").on("click", () => {
            if (PageUtils.isColorBlue("gemAutoStoreButton")) {
                if (this.#gemAutoStore) {
                    this.#gemAutoStore.shutdown();
                }
                $("#gemAutoStoreButton").css("color", "grey");
            } else if (PageUtils.isColorGrey("gemAutoStoreButton")) {
                if (this.#gemAutoStore) {
                    this.#gemAutoStore.start();
                }
                $("#gemAutoStoreButton").css("color", "blue");
            }
        });
        $("#transferGemBetweenTeam").on("click", () => {
            $("#transferGemBetweenTeam").prop("disabled", true).hide();

            let html = "";
            html += "<select id='_transfer_target'>";
            html += "<option value=''>选择队员</option>";
            _.forEach(TeamMemberLoader.loadTeamMembers())
                .filter(it => it.id !== credential.id)
                .forEach(it => {
                    const memberId = it.id;
                    const memberName = it.name;
                    html += "<option value='" + memberId + "'>" + memberName + "</option>";
                });
            html += "</select>";

            html += "<select id='_space_count'>";
            html += "<option value='0'>可用空位</option>";
            for (let i = 1; i <= 20; i++) {
                html += "<option value='" + i + "'>" + i + "</option>";
            }
            html += "</select>";

            html += "<select id='_gem_category'>";
            html += "<option value='ALL'>所有宝石</option>";
            html += "<option value='POWER'>威力宝石</option>";
            html += "<option value='LUCK'>幸运宝石</option>";
            html += "<option value='WEIGHT'>重量宝石</option>";
            html += "</select>";

            html += "<button role='button' id='_auto_transfer_gem' style='color:grey'>自动传输身上宝石给队友</button>";
            html += "<button role='button' id='_take_out_gem_for_transfer'>从仓库取出宝石准备传输</button>";

            $("#tr4_0").find("> td:first").html(html).parent().show();

            $("#_auto_transfer_gem").on("click", () => {
                if (PageUtils.isColorGrey("_auto_transfer_gem")) {
                    const target = $("#_transfer_target").val() as string;
                    if (target === "") {
                        MessageBoard.publishWarning("没有选择传输宝石的队友！");
                        return;
                    }
                    const space = _.parseInt($("#_space_count").val() as string);
                    if (space === 0) {
                        MessageBoard.publishWarning("必须选择可用的空位！");
                        return;
                    }
                    const category = $("#_gem_category").val() as string;
                    if (this.#gemAutoTransfer === undefined) {
                        this.#gemAutoTransfer = new CastleGemAutoTransfer(credential, target, space, category);
                        this.#gemAutoTransfer.success = () => this.doRefreshMutablePage(credential);
                    }
                    this.#gemAutoTransfer.start();
                    $("#_auto_transfer_gem").css("color", "blue");
                } else if (PageUtils.isColorBlue("_auto_transfer_gem")) {
                    if (this.#gemAutoTransfer !== undefined) {
                        this.#gemAutoTransfer.shutdown();
                        this.#gemAutoTransfer = undefined;
                    }
                    $("#_auto_transfer_gem").css("color", "grey");
                }
            });

            $("#_take_out_gem_for_transfer").on("click", () => {
                const space = _.parseInt($("#_space_count").val() as string);
                if (space === 0) {
                    MessageBoard.publishWarning("必须选择可用的空位！");
                    return;
                }
                const category = $("#_gem_category").val() as string;
                $("#_take_out_gem_for_transfer").prop("disabled", true);
                this.#takeOutGemForTransfer(credential, space, category).then(message => {
                    if (message.success && message.doRefresh) {
                        this.doRefreshMutablePage(credential);
                    }
                    $("#_take_out_gem_for_transfer").prop("disabled", false);
                });
            });
        });
    }

    async #takeOutGemForTransfer(credential: Credential, space: number, category: string): Promise<OperationMessage> {
        const warehousePage = await new CastleWarehouse(credential).open();
        if (warehousePage.storageEquipmentList === undefined || warehousePage.storageEquipmentList.length === 0) {
            return OperationMessage.failure();
        }
        const indexList = _.forEach(warehousePage.storageEquipmentList)
            .filter(it => it.isGem)
            .filter(it => {
                if (category === "POWER") {
                    return it.name === "威力宝石";
                } else if (category === "LUCK") {
                    return it.name === "幸运宝石";
                } else if (category === "WEIGHT") {
                    return it.name === "重量宝石";
                } else {
                    return true;
                }
            })
            .map(it => it.index!);
        if (indexList.length === 0) {
            return OperationMessage.failure();
        }

        const len = _.min([indexList.length, space])!;
        const list: number[] = [];
        for (let i = 0; i < len; i++) {
            list.push(indexList[i]);
        }

        await new CastleWarehouse(credential).takeOut(list);
        const message = OperationMessage.success();
        message.doRefresh = true;
        return message;
    }

    doBindReturnButton(credential: Credential): void {
        const html = PageUtils.generateReturnCastleForm(credential);
        $("#hiddenFormContainer").html(html);
        $("#returnButton").on("click", () => {
            PageUtils.disableButtons();
            PageUtils.triggerClick("returnCastle");
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
        html += "<th style='background-color:#E8E8D0'>入袋</th>"
        html += "<th style='background-color:#E8E8D0'>入库</th>"
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
            html += "<td style='background-color:#E8E8D0'>"
            html += "<input type='button' value='发送' " +
                "class='mutableButton-1 send-1' " +
                "id='send1_" + equipment.index! + "' disabled style='display:none'>";
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
        html += "<input type='button' id='use1' class='mutableButton-1' value='使用装备'>";
        html += "<input type='button' id='putIntoBag1' class='mutableButton-1' value='放入百宝袋' disabled style='display:none'>";
        html += "<input type='button' id='putIntoWarehouse1' class='mutableButton-1' value='放入仓库'>";
        html += "</td>";
        html += "<td style='text-align:right'>";
        html += "<input type='button' id='openBag' class='mutableButton-1' value='打开百宝袋' disabled style='display:none'>";
        html += "<input type='button' id='closeBag' class='mutableButton-1' value='关闭百宝袋' disabled style='display:none'>";
        html += "<input type='button' id='openWarehouse' class='mutableButton-1' value='打开仓库'>";
        html += "<input type='button' id='closeWarehouse' class='mutableButton-1' value='关闭仓库'>";
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
        html += "<tr>";
        html += "<td style='text-align:right' colspan='2'>";
        if (bagIndex >= 0) {
            html += "<input type='button' id='takeGemsOutFromBag' class='mutableButton-1' value='取出袋中全部宝石'>";
        }
        html += "<input type='button' id='putGemsIntoWarehouse' class='mutableButton-1' value='随身宝石全部入库'>";
        html += "</td>";
        html += "</tr>";
        html += "</tbody>";
        html += "</table>";
        html += "</td>";
        html += "</tr>";

        html += "</tbody>";
        html += "</table>";

        $("#equipmentList").html(html).parent().show();

        new CastleEquipmentExpressHouse(credential).open().then(expressPage => {
            for (const equipment of expressPage.equipmentList!) {
                const index = equipment.index!;
                if (equipment.selectable) {
                    $("#send1_" + index).prop("disabled", false).show();
                } else {
                    $("#send1_" + index).remove();
                }
            }
            $(".send-1").on("click", event => {
                const buttonId = $(event.target).attr("id")!;
                const index = parseInt(StringUtils.substringAfterLast(buttonId, "_"));

                const s = $("#peopleSelect").val();
                if (s === undefined || (s as string).trim() === "") {
                    this.doScrollToPageTitle();
                    MessageBoard.publishWarning("没有选择发送对象！");
                    return;
                }

                const bank = new CastleBank(credential);
                bank.withdraw(10).then(() => {
                    new CastleEquipmentExpressHouse(credential).send(s as string, [index]).then(() => {
                        bank.deposit().then(() => {
                            this.doRefreshMutablePage(credential, context);
                        });
                    });
                });

            });
        });

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

        // Put into warehouse
        $("#putIntoWarehouse1").on("click", () => {
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
            new CastleWarehouse(credential).putInto(indexList).then(() => {
                this.doRefreshMutablePage(credential, context);
            });
        });

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

        $("#searchButton").on("click", () => {
            const s = $("#searchName").val();
            if (s === undefined || (s as string).trim() === "") {
                this.doScrollToPageTitle();
                MessageBoard.publishWarning("没有正确输入人名！");
                return;
            }
            new CastleEquipmentExpressHouse(credential).search(s as string).then(optionListHtml => {
                $("#peopleSelect").html(optionListHtml);
            });
        });

        $("#sendButton").on("click", () => {
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

            const s = $("#peopleSelect").val();
            if (s === undefined || (s as string).trim() === "") {
                this.doScrollToPageTitle();
                MessageBoard.publishWarning("没有选择发送对象！");
                return;
            }

            const bank = new CastleBank(credential);
            bank.withdraw(10).then(() => {
                new CastleEquipmentExpressHouse(credential).send(s as string, indexList).then(() => {
                    bank.deposit().then(() => {
                        this.doRefreshMutablePage(credential, context);
                    });
                });
            });
        });

        $("#takeGemsOutFromBag").on("click", () => {
            const bag = new TreasureBag(credential);
            bag.open(bagIndex).then(bagPage => {
                let count = 0;
                const indexList: number[] = [];
                for (const equipment of bagPage.equipmentList!) {
                    if (equipment.name!.endsWith("宝石")) {
                        count++;
                        if (count <= page.spaceCount) {
                            indexList.push(equipment.index!);
                        }
                    }
                }
                if (indexList.length === 0) {
                    // Nothing found, ignore
                    return;
                }
                bag.takeOut(indexList).then(() => {
                    this.doRefreshMutablePage(credential, context);
                });
            });
        });

        $("#putGemsIntoWarehouse").on("click", () => {
            $(".select-1").each((idx, button) => {
                const buttonId = $(button).attr("id") as string;
                const index = parseInt(StringUtils.substringAfterLast(buttonId, "_"));
                const equipment = page.findEquipment(index);
                if (equipment !== null && equipment.name!.endsWith("宝石")) {
                    $("#" + buttonId).css("color", "blue");
                } else {
                    $("#" + buttonId).css("color", "grey");
                }
            });
            $("#putIntoWarehouse1").trigger("click");
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
        if (bagIndex < 0) {
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
                    "id='tryTakeOutFromBag2' " +
                    "value='从百宝袋中盲取'>";
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

            $("#tryTakeOutFromBag2").on("click", () => {
                new TreasureBag(credential).tryTakeOut(page.spaceCount).then(() => {
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

            return;
        }
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