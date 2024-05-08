import {CommonWidget, CommonWidgetFeature} from "./support/CommonWidget";
import Credential from "../util/Credential";
import LocationModeTown from "../core/location/LocationModeTown";
import TownWeaponHousePage from "../core/store/TownWeaponHousePage";
import TownWeaponHouse from "../core/store/TownWeaponHouse";
import StringUtils from "../util/StringUtils";
import _ from "lodash";
import PocketUtils from "../util/PocketUtils";
import TownBank from "../core/bank/TownBank";
import OperationMessage from "../util/OperationMessage";
import {PocketPage} from "../pocket/PocketPage";

class WeaponStoreManager extends CommonWidget {

    readonly feature = new WeaponStoreManagerFeature();

    constructor(credential: Credential, locationMode: LocationModeTown) {
        super(credential, locationMode);
    }

    weaponPage?: TownWeaponHousePage;

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
        html += "<tbody style='background-color:#F8F0E0;text-align:center' id='_pocket_WSM_PersonalEquipmentList'>";
        html += "</tbody>";
        html += "</table>";
        html += "</td>";
        html += "</tr>";
        if (this.feature.enableAutoSellDragonBall) {
            html += "<tr style='background-color:#F8F0E0;text-align:center'>";
            html += "<td>";
            html += "<button role='button' class='C_pocket_StatelessElement' " +
                "id='_pocket_WSM_AutoSellDragonBall'>自动出售龙珠</button>";
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
        html += "<th>特产</th>";
        html += "<th>名字</th>";
        html += "<th>价格</th>";
        html += "<th>威力</th>";
        html += "<th>重量</th>";
        html += "<th>耐久</th>";
        html += "<th>职业</th>";
        html += "<th>攻击</th>";
        html += "<th>防御</th>";
        html += "<th>智力</th>";
        html += "<th>精神</th>";
        html += "<th>速度</th>";
        html += "<th>类型</th>";
        html += "<th>宝石</th>";
        html += "</tr>";
        html += "</thead>";
        html += "<tbody style='background-color:#F8F0E0;text-align:center' id='_pocket_WSM_MerchandiseList'>";
        html += "</tbody>";
        html += "</table>";
        html += "</td>";
        html += "</tr>";
        html += "</tbody>";
        html += "</table>";
        return "" +
            "<table style='background-color:#888888;margin:auto;width:100%;border-width:0'>" +
            "<tbody>" +
            "<tr>" +
            "<th style='writing-mode:vertical-rl;text-orientation:mixed;" +
            "background-color:navy;color:white;font-size:120%;text-align:left'>" +
            "武 器 商 店" +
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
            $("#_pocket_WSM_AutoSellDragonBall").on("click", async () => {
                PocketPage.disableStatelessElements();
                await this.refresh();
                await this.autoSellDragonBall();
                PocketPage.enableStatelessElements();
            });
        }
    }

    async reload() {
        this.weaponPage = await new TownWeaponHouse(this.credential, this.townId!).open();
    }

    async render() {
        $(".C_WSM_PersonalEquipmentButton").off("click");
        $(".C_WSM_MerchandiseButton").off("click");
        $(".C_WSM_PersonalEquipment").remove();
        $(".C_WSM_Merchandise").remove();

        const equipmentTable = $("#_pocket_WSM_PersonalEquipmentList");
        for (const equipment of this.weaponPage!.personalEquipmentList!) {
            let html = "<tr style='background-color:#F8F0E0' class='C_WSM_PersonalEquipment'>";
            html += "<td>";
            if (equipment.isSellable) {
                html += "<button role='button' " +
                    "class='C_WSM_PersonalEquipmentButton C_pocket_StatelessElement C_WSM_SellEquipmentButton' " +
                    "id='_pocket_WSM_Sell_" + equipment.index + "'>出售</button>";
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

        const merchandiseTable = $("#_pocket_WSM_MerchandiseList");
        for (const merchandise of this.weaponPage!.weaponMerchandiseList!) {
            let html = "<tr style='background-color:#F8F0E0' class='C_WSM_Merchandise'>";
            html += "<td>";
            if (this.weaponPage!.spaceCount! > 0) {
                html += "<select id='_pocket_WSM_BuyCount_" + merchandise.index + "'>";
                for (let i = 1; i <= this.weaponPage!.spaceCount!; i++) {
                    html += "<option value='" + i + "'>" + i + "</option>";
                }
                html += "</select>";
            }
            html += "</td>";
            html += "<td>";
            if (this.weaponPage!.spaceCount! > 0) {
                html += "<button role='button' " +
                    "class='C_WSM_MerchandiseButton C_pocket_StatelessElement C_WSM_BuyMerchandiseButton' " +
                    "id='_pocket_WSM_Buy_" + merchandise.index + "'>购买</button>";
            } else {
                html += "<button role='button' disabled>购买</button>";
            }
            html += "</td>";
            html += "<td>" + merchandise.specialityHtml + "</td>";
            html += "<td>" + merchandise.nameHtml + "</td>";
            html += "<td style='text-align:right'>" + merchandise.priceHtml + "</td>";
            html += "<td>" + merchandise.power + "</td>";
            html += "<td>" + merchandise.weight + "</td>";
            html += "<td>" + merchandise.endureHtml + "</td>";
            html += "<td>" + merchandise.requiredCareerHtml + "</td>";
            html += "<td>" + merchandise.requiredAttackHtml + "</td>";
            html += "<td>" + merchandise.requiredDefenseHtml + "</td>";
            html += "<td>" + merchandise.requiredSpecialAttackHtml + "</td>";
            html += "<td>" + merchandise.requiredSpecialDefenseHtml + "</td>";
            html += "<td>" + merchandise.requiredSpeedHtml + "</td>";
            html += "<td>" + merchandise.weaponCategory + "</td>";
            html += "<td>" + merchandise.gemCountHtml + "</td>";
            html += "</tr>";
            merchandiseTable.append($(html));
        }

        await this.bindEquipmentButtons();
        await this.bindMerchandiseButtons();
    }

    async refresh(message?: OperationMessage) {
        await this.reload();
        await this.render();
        this.feature.publishRefresh(message ?? OperationMessage.success());
    }

    async dispose() {
    }

    async bindEquipmentButtons() {
        $(".C_WSM_SellEquipmentButton").on("click", async (event) => {
            const btnId = $(event.target).attr("id") as string;
            const index = _.parseInt(StringUtils.substringAfter(btnId, "_pocket_WSM_Sell_"));
            const equipment = this.weaponPage!.findEquipment(index)!;
            if (!confirm("确认要出售“" + equipment.fullName + "”？")) return;
            await new TownWeaponHouse(this.credential, this.weaponPage!.townId).sell(index, this.weaponPage!.discount!);
            await new TownBank(this.credential, this.weaponPage!.townId).deposit();
            await this.refresh();
        });
    }

    async bindMerchandiseButtons() {
        $(".C_WSM_BuyMerchandiseButton").on("click", async (event) => {
            const btnId = $(event.target).attr("id") as string;
            const index = _.parseInt(StringUtils.substringAfter(btnId, "_pocket_WSM_Buy_"));
            const count = _.parseInt($("#_pocket_WSM_BuyCount_" + index).val() as string);
            const merchandise = this.weaponPage!.findMerchandise(index)!;
            const totalPrice = merchandise.price! * count;
            const amount = PocketUtils.calculateCashDifferenceAmount(this.weaponPage!.roleCash!, totalPrice);
            if (!confirm("确认要购买" + count + "把“" + merchandise.name + "”？大约需要再支取" + amount + "万GOLD。")) return;
            await new TownBank(this.credential, this.weaponPage?.townId).withdraw(amount);
            await new TownWeaponHouse(this.credential, this.weaponPage!.townId).buy(index, count, this.weaponPage!.discount!);
            await new TownBank(this.credential, this.weaponPage?.townId).deposit();
            await this.refresh();
        });
    }

    private async autoSellDragonBall() {
        const dragonBall = this.weaponPage!.findFirstSellableDragonBall();
        if (dragonBall === null) return;
        const discount = this.weaponPage!.discount!;
        await new TownWeaponHouse(this.credential, this.townId!).sell(dragonBall.index!, discount);
        await new TownBank(this.credential, this.townId).deposit();
        await this.refresh();
        await this.autoSellDragonBall();
    }
}

class WeaponStoreManagerFeature extends CommonWidgetFeature {

    enableAutoSellDragonBall: boolean = false;

}

export {WeaponStoreManager, WeaponStoreManagerFeature};