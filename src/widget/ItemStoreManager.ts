import {CommonWidget, CommonWidgetFeature} from "./support/CommonWidget";
import Credential from "../util/Credential";
import LocationModeTown from "../core/location/LocationModeTown";
import {PocketPage} from "../pocket/PocketPage";
import OperationMessage from "../util/OperationMessage";
import _ from "lodash";
import StringUtils from "../util/StringUtils";
import TownBank from "../core/bank/TownBank";
import PocketUtils from "../util/PocketUtils";
import TownItemHousePage from "../core/store/TownItemHousePage";
import TownItemHouse from "../core/store/TownItemHouse";

class ItemStoreManager extends CommonWidget {

    readonly feature = new ItemStoreManagerFeature();

    constructor(credential: Credential, locationMode: LocationModeTown) {
        super(credential, locationMode);
    }

    itemPage?: TownItemHousePage;

    generateHTML() {
        let html = "";
        html += "<table style='border-width:0;background-color:transparent;margin:auto;width:100%;border-spacing:0'>";
        html += "<tbody>";
        html += "<tr>";
        html += "<td>";
        html += "<table style='border-width:0;background-color:#888888;margin:auto;width:100%'>";
        html += "<thead style='text-align:center'>";
        html += "<tr>";
        html += "<td style='background-color:skyblue;font-weight:bold' colspan='12'>";
        html += "＜ 随 身 装 备 ＞";
        html += "</td>";
        html += "</tr>";
        html += "<tr style='background-color: wheat'>";
        html += "<th>出售</th>";
        html += "<th>装备</th>";
        html += "<th>名字</th>";
        html += "<th>种类</th>";
        html += "<th>效果</th>";
        html += "<th>重量</th>";
        html += "<th>耐久</th>";
        html += "<th>价值</th>";
        html += "</tr>";
        html += "</thead>";
        html += "<tbody style='background-color:#F8F0E0;text-align:center' id='_pocket_ITM_PersonalEquipmentList'>";
        html += "</tbody>";
        html += "</table>";
        html += "</td>";
        html += "</tr>";
        if (this.feature.enableAutoSellDragonBall || this.feature.enableAutoSellRecoverLotion) {
            html += "<tr style='background-color:#F8F0E0;text-align:center'>";
            html += "<td>";
            if (this.feature.enableAutoSellDragonBall) {
                html += "<span> <button role='button' class='C_pocket_StatelessElement' " +
                    "id='_pocket_ITM_AutoSellDragonBall'>自动出售龙珠</button> </span>";
            }
            if (this.feature.enableAutoSellRecoverLotion) {
                html += "<span> <button role='button' class='C_pocket_StatelessElement' " +
                    "id='_pocket_ITM_AutoSellRecoverLotion'>自动出售药材</button> </span>";
            }
            html += "</td>";
            html += "</tr>";
        }
        html += "<tr>";
        html += "<td>";
        html += "<table style='border-width:0;background-color:#888888;margin:auto;width:100%'>";
        html += "<thead style='text-align:center'>";
        html += "<tr>";
        html += "<td style='background-color:skyblue;font-weight:bold' colspan='16'>";
        html += "＜ 商 品 列 表 ＞";
        html += "</td>";
        html += "</tr>";
        html += "<tr style='background-color:wheat'>";
        html += "<th>数量</th>";
        html += "<th>购买</th>";
        html += "<th>名字</th>";
        html += "<th>价格</th>";
        html += "<th>威力</th>";
        html += "<th>重量</th>";
        html += "<th>耐久</th>";
        html += "<th>属性</th>";
        html += "</tr>";
        html += "</thead>";
        html += "<tbody style='background-color:#F8F0E0;text-align:center' id='_pocket_ITM_MerchandiseList'>";
        html += "</tbody>";
        html += "</table>";
        html += "</td>";
        html += "</tr>";
        html += "</tbody>";
        html += "</table>";
        return "<table style='background-color:#888888;margin:auto;width:100%;border-width:0'>" +
            "<tbody>" +
            "<tr>" +
            "<th style='background-color:navy;color:white;font-size:120%;vertical-align:top'>" +
            "物<br>品<br>商<br>店" +
            "</th>" +
            "<td style='border-spacing:0;width:100%'>" +
            html +
            "</td>" +
            "</tr>" +
            "</tbody>" +
            "</table>";
    }

    bindButtons() {
        if (this.feature.enableAutoSellDragonBall) {
            $("#_pocket_ITM_AutoSellDragonBall").on("click", async () => {
                PocketPage.disableStatelessElements();
                await this.refresh();
                await this._autoSellDragonBall();
                PocketPage.enableStatelessElements();
            });
        }
        if (this.feature.enableAutoSellRecoverLotion) {
            $("#_pocket_ITM_AutoSellRecoverLotion").on("click", async () => {
                PocketPage.disableStatelessElements();
                await this.refresh();
                await this._autoSellRecoverLotion();
                PocketPage.enableStatelessElements();
            });
        }
    }

    async reload() {
        this.itemPage = await new TownItemHouse(this.credential, this.townId!).open();
    }

    async render() {
        $(".C_ITM_PersonalEquipmentButton").off("click");
        $(".C_ITM_MerchandiseButton").off("click");
        $(".C_ITM_PersonalEquipment").remove();
        $(".C_ITM_Merchandise").remove();

        const equipmentTable = $("#_pocket_ITM_PersonalEquipmentList");
        for (const equipment of this.itemPage!.equipmentList!) {
            let html = "<tr style='background-color:#F8F0E0' class='C_ITM_PersonalEquipment'>";
            html += "<td>";
            if (equipment.isSellable) {
                html += "<button role='button' " +
                    "class='C_ITM_PersonalEquipmentButton C_pocket_StatelessElement C_ITM_SellEquipmentButton' " +
                    "id='_pocket_ITM_Sell_" + equipment.index + "'>出售</button>";
            } else {
                html += "<button role='button' disabled>禁售</button>";
            }
            html += "</td>";
            html += "<td>" + equipment.usingHTML + "</td>";
            html += "<td>" + equipment.nameHTML + "</td>";
            html += "<td>" + equipment.category + "</td>";
            html += "<td>" + equipment.power + "</td>";
            html += "<td>" + equipment.weight + "</td>";
            html += "<td>" + equipment.endureHtml + "</td>";
            html += "<td style='background-color:#F8F0E0;text-align:right'>" + equipment.priceHTML + "</td>";
            html += "</tr>";
            equipmentTable.append($(html));
        }

        const merchandiseTable = $("#_pocket_ITM_MerchandiseList");
        for (const merchandise of this.itemPage!.merchandiseList!) {
            let html = "<tr style='background-color:#F8F0E0' class='C_ITM_Merchandise'>";
            html += "<td>";
            if (this.itemPage!.spaceCount! > 0) {
                html += "<select id='_pocket_ITM_BuyCount_" + merchandise.index + "'>";
                for (let i = 1; i <= this.itemPage!.spaceCount!; i++) {
                    html += "<option value='" + i + "'>" + i + "</option>";
                }
                html += "</select>";
            }
            html += "</td>";
            html += "<td>";
            if (this.itemPage!.spaceCount! > 0) {
                html += "<button role='button' " +
                    "class='C_ITM_MerchandiseButton C_pocket_StatelessElement C_ITM_BuyMerchandiseButton' " +
                    "id='_pocket_ITM_Buy_" + merchandise.index + "'>购买</button>";
            } else {
                html += "<button role='button' disabled>购买</button>";
            }
            html += "</td>";
            html += "<td>" + merchandise.nameHtml + "</td>";
            html += "<td style='text-align:right'>" + merchandise.priceHtml + "</td>";
            html += "<td>" + merchandise.power + "</td>";
            html += "<td>" + merchandise.weight + "</td>";
            html += "<td>" + merchandise.endureHtml + "</td>";
            html += "<td>" + merchandise.attribute + "</td>";
            html += "</tr>";
            merchandiseTable.append($(html));
        }

        this._bindEquipmentButtons();
        this._bindMerchandiseButtons();
    }

    async refresh(message?: OperationMessage) {
        await this.reload();
        await this.render();
        this.feature.publishRefresh(message ?? OperationMessage.success());
    }

    async dispose() {
    }

    private _bindEquipmentButtons() {
        $(".C_ITM_SellEquipmentButton").on("click", async (event) => {
            const btnId = $(event.target).attr("id") as string;
            const index = _.parseInt(StringUtils.substringAfter(btnId, "_pocket_ITM_Sell_"));
            const equipment = this.itemPage!.findEquipment(index)!;
            if (!confirm("确认要出售“" + equipment.fullName + "”？")) return;
            await new TownItemHouse(this.credential, this.itemPage!.townId!).sell(index, this.itemPage!.discount!);
            await new TownBank(this.credential, this.itemPage?.townId).deposit();
            await this.refresh();
        });
    }

    private _bindMerchandiseButtons() {
        $(".C_ITM_BuyMerchandiseButton").on("click", async (event) => {
            const btnId = $(event.target).attr("id") as string;
            const index = _.parseInt(StringUtils.substringAfter(btnId, "_pocket_ITM_Buy_"));
            const count = _.parseInt($("#_pocket_ITM_BuyCount_" + index).val() as string);
            const merchandise = this.itemPage!.findMerchandise(index)!;
            const totalPrice = merchandise.price! * count;
            const amount = PocketUtils.calculateCashDifferenceAmount(this.itemPage!.role!.cash!, totalPrice);
            if (!confirm("确认要购买" + count + "件“" + merchandise.name + "”？大约需要再支取" + amount + "万GOLD。")) return;
            await new TownBank(this.credential, this.itemPage?.townId).withdraw(amount);
            await new TownItemHouse(this.credential, this.itemPage!.townId!).buy(index, count, this.itemPage!.discount!);
            await new TownBank(this.credential, this.itemPage?.townId).deposit();
            await this.refresh();
        });
    }

    private async _autoSellDragonBall() {
        const dragonBall = this.itemPage!.findLastSellableDragonBall();
        if (dragonBall === null) return;
        const discount = this.itemPage!.discount!;
        await new TownItemHouse(this.credential, this.townId!).sell(dragonBall.index!, discount);
        await new TownBank(this.credential, this.townId).deposit();
        await this.refresh();
        await this._autoSellDragonBall();
    }

    private async _autoSellRecoverLotion() {
        const lotion = this.itemPage!.findLastSellableRecoverLotion();
        if (lotion === null) return;
        const discount = this.itemPage!.discount!;
        await new TownItemHouse(this.credential, this.townId!).sell(lotion.index!, discount);
        await new TownBank(this.credential, this.townId).deposit();
        await this.refresh();
        await this._autoSellRecoverLotion();
    }
}

class ItemStoreManagerFeature extends CommonWidgetFeature {

    enableAutoSellDragonBall: boolean = false;
    enableAutoSellRecoverLotion: boolean = false;

}

export {ItemStoreManager, ItemStoreManagerFeature};