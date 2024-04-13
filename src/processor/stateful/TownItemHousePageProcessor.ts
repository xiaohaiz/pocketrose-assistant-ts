import StatefulPageProcessor from "../StatefulPageProcessor";
import Credential from "../../util/Credential";
import PageProcessorContext from "../PageProcessorContext";
import TownItemHousePageParser from "../../core/store/TownItemHousePageParser";
import PageUtils from "../../util/PageUtils";
import TownItemHousePage from "../../core/store/TownItemHousePage";
import ButtonUtils from "../../util/ButtonUtils";
import KeyboardShortcutBuilder from "../../util/KeyboardShortcutBuilder";
import NpcLoader from "../../core/role/NpcLoader";
import MessageBoard from "../../util/MessageBoard";
import TownItemHouse from "../../core/store/TownItemHouse";
import StringUtils from "../../util/StringUtils";
import _ from "lodash";
import TownBank from "../../core/bank/TownBank";
import PocketUtils from "../../util/PocketUtils";
import EquipmentSpaceTrigger from "../../core/trigger/EquipmentSpaceTrigger";
import PocketPageRenderer from "../../util/PocketPageRenderer";
import TreasureBag from "../../core/equipment/TreasureBag";
import {Equipment} from "../../core/equipment/Equipment";

class TownItemHousePageProcessor extends StatefulPageProcessor {

    constructor(credential: Credential, context: PageProcessorContext) {
        super(credential, context);
    }

    private itemHousePage?: TownItemHousePage;
    private autoSellDragonBallTimer?: any;

    protected async doProcess(): Promise<void> {
        if (this.townId === undefined) return;
        this.itemHousePage = TownItemHousePageParser.parsePage(PageUtils.currentPageHtml());
        if (this.townId !== this.itemHousePage.townId) return;
        await this.renderImmutablePage();
        await this.renderEquipmentList();
        await this.renderMerchandiseList();
        KeyboardShortcutBuilder.newInstance()
            .onKeyPressed("e", () => PageUtils.triggerClick("equipmentButton"))
            .onKeyPressed("r", () => PageUtils.triggerClick("refreshButton"))
            .onEscapePressed(() => PageUtils.triggerClick("returnButton"))
            .withDefaultPredicate()
            .bind();
    }

    private async renderImmutablePage() {
        $("table[height='100%']").removeAttr("height");

        $("table:first")
            .attr("id", "t0")
            .find("td:first")
            .attr("id", "pageTitle")
            .removeAttr("width")
            .removeAttr("height")
            .removeAttr("bgcolor")
            .css("text-align", "center")
            .css("background-color", "navy")
            .parent()
            .next()
            .find("table:first")
            .find("td:eq(1)")
            .find("table:first")
            .find("td:last")
            .attr("id", "roleCash");

        $("#pageTitle").html("" +
            "<table style='background-color:transparent;width:100%;margin:auto;border-width:0;border-spacing:0'>" +
            "<tbody>" +
            "<tr>" +
            "<td style='text-align:left;font-size:150%;font-weight:bold;color:yellowgreen;width:100%'>" +
            "＜＜  " + this.town?.nameTitle + " 物 品 屋  ＞＞" +
            "</td>" +
            "<td style='text-align:right;white-space:nowrap'>" +
            "<span> <button role='button' class='C_commandButton' id='equipmentButton'>" + ButtonUtils.createTitle("装备", "e") + "</button></span>" +
            "<span> <button role='button' class='C_commandButton' id='refreshButton'>" + ButtonUtils.createTitle("刷新", "r") + "</button></span>" +
            "<span> <button role='button' class='C_commandButton' id='returnButton'>" + ButtonUtils.createTitle("退出", "Esc") + "</button></span>" +
            "</td>" +
            "</tr>" +
            "</tbody>" +
            "</table>" +
            "");

        $("form").remove();
        const t0 = $("#t0");

        t0.find("tr:first")
            .next()
            .next()
            .find("table:first")
            .find("td:first")
            .attr("id", "messageBoard")
            .css("color", "white")
            .next()
            .attr("id", "messageBoardManager");

        await this.initializeMessageBoard();

        t0.find("tr:first")
            .next()
            .next()
            .next()
            .html("<td id='storeUI' style='width:100%;background-color:#F8F0E0'></td>");

        let html = "";
        html += "<table style='width:100%;border-width:0;background-color:#888888;margin:auto'>";
        html += "<tbody>";
        html += "<tr style='display:none'>";
        html += "<td>";
        html += "<div id='extension_1'></div>";
        html += "<div id='extension_2'></div>";
        html += "<div id='extension_3'></div>";
        html += "<div id='extension_4'></div>";
        html += "<div id='extension_5'></div>";
        html += "</td>";
        html += "</tr>";
        html += "<tr>";
        html += "<td id='commandPanel' style='background-color:#E8E8D0;text-align:center'>";
        html += PocketPageRenderer.createScanIntervalSelection();
        html += PocketPageRenderer.AND();
        html += "<button role='button' id='autoSellDragonBall' style='color:grey'>自动扫描卖出龙珠</button>";
        html += PocketPageRenderer.OR(true);
        html += "<button role='button' id='takeOutDragonBall' style='display:none' disabled>从百宝袋中取出龙珠</button>";
        html += "</td>";
        html += "</tr>";
        html += "<tr style='display:none'>";
        html += "<td id='equipmentList' style='text-align:center'></td>";
        html += "</tr>";
        html += "<tr style='display:none'>";
        html += "<td id='merchandiseList' style='text-align:center'></td>";
        html += "</tr>";
        html += "</tbody>";
        html += "</table>";
        $("#storeUI").html(html);

        await this.createReturnButton();
        await this.createRefreshButton();
        await this.createEquipmentButton();
        await this.createDragonBallButtons();

        html = "";
        html += "<table style='border-width:0;background-color:#888888;margin:auto;width:100%'>";
        html += "<tbody style='background-color:#F8F0E0;text-align:center' id='equipmentTable'>";
        html += "<tr>";
        html += "<td style='background-color:skyblue;font-weight:bold' colspan='12'>";
        html += "＜ 随 身 装 备 ＞";
        html += "</td>";
        html += "</tr>";
        html += "<tr>";
        html += "<th style='background-color:#E8E8D0'>出售</th>";
        html += "<th style='background-color:#EFE0C0'>装备</th>";
        html += "<th style='background-color:#E0D0B0'>名字</th>";
        html += "<th style='background-color:#EFE0C0'>种类</th>";
        html += "<th style='background-color:#E0D0B0'>效果</th>";
        html += "<th style='background-color:#EFE0C0'>重量</th>";
        html += "<th style='background-color:#EFE0C0'>耐久</th>";
        html += "<th style='background-color:#E0D0B0'>价值</th>";
        html += "</tr>";
        html += "</tbody>";
        html += "</table>";
        $("#equipmentList").html(html).parent().show();

        html = "";
        html += "<table style='border-width:0;background-color:#888888;margin:auto;width:100%'>";
        html += "<tbody style='background-color:#F8F0E0;text-align:center' id='merchandiseTable'>";
        html += "<tr>";
        html += "<td style='background-color:skyblue;font-weight:bold' colspan='8'>";
        html += "＜ 商 品 列 表 ＞";
        html += "</td>";
        html += "</tr>";
        html += "<tr>";
        html += "<th style='background-color:#E8E8D0'>数量</th>";
        html += "<th style='background-color:#E8E8D0'>购买</th>";
        html += "<th style='background-color:#E0D0B0'>名字</th>";
        html += "<th style='background-color:#EFE0C0'>价格</th>";
        html += "<th style='background-color:#E0D0B0'>威力</th>";
        html += "<th style='background-color:#EFE0C0'>重量</th>";
        html += "<th style='background-color:#EFE0C0'>耐久</th>";
        html += "<th style='background-color:#E0D0B0'>属性</th>";
        html += "</tr>";
        html += "</tbody>";
        html += "</table>";
        $("#merchandiseList").html(html).parent().show();
    }

    private async reloadItemHousePage() {
        this.itemHousePage = await new TownItemHouse(this.credential, this.townId!).open();
        $("#roleCash").html(this.itemHousePage.role?.cash + " GOLD");
    }

    private async initializeMessageBoard() {
        $("#messageBoardManager").html(NpcLoader.randomNpcImageHtml());
        const message = "<span style='font-weight:bold;font-size:120%;color:wheat'>" +
            "欢迎，欢迎，随意看，买卖不成仁义在。本店当前的折扣率是：" +
            "<span style='background-color:red;color:white'>" + this.itemHousePage?.discount + "</span>" +
            "</span>";
        MessageBoard.resetMessageBoard(message);
    }

    private async refresh() {
        PageUtils.scrollIntoView("pageTitle");
        await this.reloadItemHousePage();
        await this.renderEquipmentList();
        await this.renderMerchandiseList();
        await this.initializeMessageBoard();
        MessageBoard.publishMessage("刷新操作完成。");
    }

    private async beforeReturn() {
        const trigger = new EquipmentSpaceTrigger(this.credential);
        trigger.itemHousePage = this.itemHousePage;
        await trigger.triggerUpdate();
    }

    private async createReturnButton() {
        $("#extension_1").html(PageUtils.generateReturnTownForm(this.credential));
        $("#returnButton").on("click", () => {
            PageUtils.disablePageInteractiveElements();
            this.beforeReturn().then(() => {
                PageUtils.triggerClick("returnTown")
            });
        });
    }

    private async createRefreshButton() {
        $("#refreshButton").on("click", () => {
            $(".C_commandButton").prop("disabled", true);
            this.refresh().then(() => {
                $(".C_commandButton").prop("disabled", false);
            });
        });
    }

    private async createEquipmentButton() {
        $("#extension_2").html(PageUtils.generateEquipmentManagementForm(this.credential));
        $("#equipmentButton").on("click", () => {
            PageUtils.disablePageInteractiveElements();
            this.beforeReturn().then(() => {
                PageUtils.triggerClick("openEquipmentManagement")
            });
        });
    }

    private async createDragonBallButtons() {
        $("#autoSellDragonBall")
            .on("click", () => {
                PageUtils.toggleColor(
                    "autoSellDragonBall",
                    () => {
                        PageUtils.disableElement("takeOutDragonBall");
                        if (this.autoSellDragonBallTimer === undefined) {
                            const s = $("#_pocket_scanInterval").val() as string;
                            const i = _.parseInt(s);
                            this.autoSellDragonBallTimer = setInterval(() => {
                                this.sellDragonBall().then(success => {
                                    if (!success) {
                                        if (PageUtils.isColorBlue("autoSellDragonBall")) {
                                            PageUtils.triggerClick("autoSellDragonBall");
                                        }
                                    }
                                });
                            }, i);
                        }
                    },
                    () => {
                        PageUtils.enableElement("takeOutDragonBall");
                        if (this.autoSellDragonBallTimer !== undefined) {
                            clearInterval(this.autoSellDragonBallTimer);
                            this.autoSellDragonBallTimer = undefined;
                        }
                    }
                );
            });
        if (this.itemHousePage!.hasTreasureBag) {
            $("#takeOutDragonBall")
                .prop("disabled", false)
                .show()
                .on("click", () => {
                    PageUtils.disableElement("takeOutDragonBall");
                    this.takeOutDragonBalls().then(() => {
                        PageUtils.enableElement("takeOutDragonBall");
                    });
                })
                .prev()
                .show();
        }
    }

    private async renderEquipmentList() {
        $(".C_equipmentButton").off("click");
        $(".C_equipment").remove();
        const equipmentList = this.itemHousePage!.equipmentList!;
        for (const equipment of equipmentList) {
            let html = "<tr class='C_equipment'>";
            html += "<td style='background-color:#E8E8D0'>";
            if (equipment.isSellable) {
                html += "<button role='button' class='C_equipmentButton C_sellEquipmentButton' " +
                    "id='sell_" + equipment.index + "'>出售</button>";
            } else {
                html += "<button role='button' disabled>禁售</button>";
            }
            html += "</td>";
            html += "<td style='background-color:#EFE0C0'>" + equipment.usingHTML + "</td>";
            html += "<td style='background-color:#E0D0B0'>" + equipment.nameHTML + "</td>";
            html += "<td style='background-color:#EFE0C0'>" + equipment.category + "</td>";
            html += "<td style='background-color:#E0D0B0'>" + equipment.power + "</td>";
            html += "<td style='background-color:#EFE0C0'>" + equipment.weight + "</td>";
            html += "<td style='background-color:#EFE0C0'>" + equipment.endureHtml + "</td>";
            html += "<td style='background-color:#E0D0B0;text-align:right'>" + equipment.priceHTML + "</td>";
            html += "</tr>";
            $("#equipmentTable").append($(html));
        }
        $(".C_sellEquipmentButton").on("click", event => {
            $(".C_sellEquipmentButton").prop("disabled", true);
            const btnId = $(event.target).attr("id") as string;
            const index = _.parseInt(StringUtils.substringAfterLast(btnId, "_"));
            this.sellItem(index, true).then(() => {
                $(".C_sellEquipmentButton").prop("disabled", false);
            });
        });
    }

    private async renderMerchandiseList() {
        $(".C_merchandiseButton").off("click");
        $(".C_merchandise").remove();
        const merchandiseList = this.itemHousePage!.merchandiseList!;
        for (const merchandise of merchandiseList) {
            let html = "<tr class='C_merchandise'>";
            html += "<td style='background-color:#E8E8D0'>";
            const spaceCount = 19 - this.itemHousePage!.equipmentList!.length;
            if (spaceCount > 0) {
                html += "<select id='count_" + merchandise.index + "'>";
                for (let i = 1; i <= spaceCount; i++) {
                    html += "<option value='" + i + "'>" + i + "</option>";
                }
                html += "</select>";
            }
            html += "</td>";
            html += "<td style='background-color:#E8E8D0'>";
            if (spaceCount > 0) {
                html += "<button role='button' class='C_merchandiseButton C_buyMerchandiseButton' " +
                    "id='buy_" + merchandise.index + "'>购买</button>";
            } else {
                html += "<button role='button' disabled>满</button>";
            }
            html += "</td>";
            html += "<td style='background-color:#E0D0B0'>" + merchandise.nameHtml + "</td>";
            html += "<td style='background-color:#EFE0C0;text-align:right'>" + merchandise.priceHtml + "</td>";
            html += "<td style='background-color:#E0D0B0'>" + merchandise.power + "</td>";
            html += "<td style='background-color:#EFE0C0'>" + merchandise.weight + "</td>";
            html += "<td style='background-color:#EFE0C0'>" + merchandise.endureHtml + "</td>";
            html += "<td style='background-color:#E0D0B0'>" + merchandise.attribute + "</td>";
            html += "</tr>";
            $("#merchandiseTable").append($(html));
        }
        $(".C_buyMerchandiseButton").on("click", event => {
            $(".C_buyMerchandiseButton").prop("disabled", true);
            const btnId = $(event.target).attr("id") as string;
            const index = _.parseInt(StringUtils.substringAfterLast(btnId, "_"));
            const count = _.parseInt($("#count_" + index).val() as string);
            this.buyItems(index, count, true).then(() => {
                $(".C_buyMerchandiseButton").prop("disabled", false);
            });
        });
    }

    private async sellItem(index: number, userConfirm?: boolean) {
        if (userConfirm) {
            const item = this.itemHousePage!.findEquipment(index);
            if (item === null) return;
            if (!confirm("确认要出售“" + item.fullName + "”？")) return;
        }
        const discount = this.itemHousePage!.discount!;
        await new TownItemHouse(this.credential, this.townId!).sell(index, discount);
        await new TownBank(this.credential, this.townId).deposit();
        await this.reloadItemHousePage();
        await this.renderEquipmentList();
        await this.renderMerchandiseList();
    }

    private async buyItems(index: number, count: number, userConfirm?: boolean) {
        const merchandise = this.itemHousePage!.findMerchandise(index);
        if (merchandise === null) return;
        const totalPrice = merchandise.price! * count;
        const amount = PocketUtils.calculateCashDifferenceAmount(this.itemHousePage!.role!.cash!, totalPrice);
        if (userConfirm && !confirm("确认要购买" + count + "件“" + merchandise.name + "”？大约需要再支取" + amount + "万GOLD。")) return;

        const discount = this.itemHousePage!.discount!;
        await new TownBank(this.credential, this.townId).withdraw(amount);
        await new TownItemHouse(this.credential, this.townId!).buy(index, count, discount);
        await this.reloadItemHousePage();
        await this.renderEquipmentList();
        await this.renderMerchandiseList();
    }

    private async sellDragonBall(): Promise<boolean> {
        let dragonBall: Equipment | null = null;
        for (const equipment of this.itemHousePage!.equipmentList!) {
            if (equipment.isDragonBall) {
                dragonBall = equipment;
                break;
            }
        }
        if (dragonBall === null) return false;
        const discount = this.itemHousePage!.discount!;
        await new TownItemHouse(this.credential, this.townId!).sell(dragonBall.index!, discount);
        await new TownBank(this.credential, this.townId).deposit();
        await this.reloadItemHousePage();
        await this.renderEquipmentList();
        await this.renderMerchandiseList();
        return true;
    }

    private async takeOutDragonBalls() {
        const space = 20 - this.itemHousePage!.equipmentList!.length;
        if (space === 0) return;
        const treasureBag = this.itemHousePage!.treasureBag;
        if (treasureBag === null) return;
        const bagPage = await new TreasureBag(this.credential).open(treasureBag.index!);
        const dragonBalls = bagPage.findGems("DRAGON");
        if (dragonBalls.length === 0) return;
        const size = _.min([space, dragonBalls.length])!;
        const indexList = dragonBalls.slice(0, size).map(it => it.index!);
        await new TreasureBag(this.credential).takeOut(indexList);
        await this.reloadItemHousePage();
        await this.renderEquipmentList();
        await this.renderMerchandiseList();
    }
}

export = TownItemHousePageProcessor;