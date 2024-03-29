import TownBank from "../../core/bank/TownBank";
import NpcLoader from "../../core/role/NpcLoader";
import TownWeaponHouse from "../../core/store/TownWeaponHouse";
import TownWeaponHousePage from "../../core/store/TownWeaponHousePage";
import TownWeaponHousePageParser from "../../core/store/TownWeaponHousePageParser";
import Credential from "../../util/Credential";
import KeyboardShortcutBuilder from "../../util/KeyboardShortcutBuilder";
import MessageBoard from "../../util/MessageBoard";
import PageUtils from "../../util/PageUtils";
import PocketUtils from "../../util/PocketUtils";
import PageProcessorContext from "../PageProcessorContext";
import PageProcessorCredentialSupport from "../PageProcessorCredentialSupport";

class TownWeaponHousePageProcessor extends PageProcessorCredentialSupport {

    async doProcess(credential: Credential, context?: PageProcessorContext): Promise<void> {
        await processPage(credential);
        KeyboardShortcutBuilder.newInstance()
            .onKeyPressed("r", () => $("#refresh_button").trigger("click"))
            .onKeyPressed("e", () => $("#equipmentManagementButton").trigger("click"))
            .onEscapePressed(() => $("#return_button").trigger("click"))
            .withDefaultPredicate()
            .bind();
    }

}

async function processPage(credential: Credential): Promise<void> {
    const page = await new TownWeaponHousePageParser().parse(PageUtils.currentPageHtml());

    // 重新绘制页面框架
    const t1 = $("table:eq(1)");
    t1.find("td:first")
        .attr("id", "title_cell")
        .removeAttr("width")
        .removeAttr("height")
        .removeAttr("bgcolor")
        .css("text-align", "center")
        .css("font-size", "150%")
        .css("font-weight", "bold")
        .css("background-color", "navy")
        .css("color", "yellowgreen")
        .text("＜＜  " + page.title + "  ＞＞")
        .parent()
        .next()
        .find("table:first")
        .find("td:eq(1)")
        .find("table:first")
        .find("td:last")
        .attr("id", "roleCash");

    // 删除原有页面所有的表单
    $("form").remove();

    // 消息面板
    t1.find("tr:first")
        .next()
        .next()
        .find("table:first")
        .find("td:first")
        .attr("id", "messageBoard")
        .css("color", "white")
        .html("倍“锋”来袭,特“利”独行。")
        .next()
        .attr("id", "messageBoardManager");

    // 清空原来的商品栏，保留行作为新的UI的位置
    t1.find("tr:first")
        .next()
        .next()
        .next()
        .html("<td id='weapon_store_UI' style='width:100%;background-color:#F8F0E0'></td>");

    // 绘制新的内容
    let html = "";
    html += "<table style='width:100%;border-width:0;background-color:#888888;margin:auto'>";
    html += "<tbody>";
    // ------------------------------------------------------------------------
    // 隐藏的表单
    // ------------------------------------------------------------------------
    html += "<tr style='display:none'>";
    html += "<td id='hidden_form_cell'></td>";
    html += "</tr>";
    // ------------------------------------------------------------------------
    // 主菜单
    // ------------------------------------------------------------------------
    html += "<tr>";
    html += "<td style='background-color:#F8F0E0;text-align:center'>";
    html += "<input type='button' id='refresh_button' value='刷新武器屋(r)'>";
    html += "<input type='button' id='return_button' value='离开武器屋(Esc)'>";
    html += "<input type='button' id='equipmentManagementButton' value='装备管理(e)'>";
    html += "</td>";
    // ------------------------------------------------------------------------
    // 个人物品栏
    // ------------------------------------------------------------------------
    html += "<tr style='display:none'>";
    html += "<td id='personal_equipment_list_cell'></td>";
    html += "</tr>";
    // ------------------------------------------------------------------------
    // 武器屋商品栏
    // ------------------------------------------------------------------------
    html += "<tr style='display:none'>";
    html += "<td id='weapon_merchandise_list_cell'></td>";
    html += "</tr>";
    html += "</tbody>";
    html += "</table>";

    $("#weapon_store_UI").html(html);

    doGenerateHiddenForm(credential);
    doBindReturnButton();
    doBindRefreshButton(credential, page);
    $("#equipmentManagementButton").on("click", () => {
        $("#openEquipmentManagement").trigger("click");
    });

    doRender(credential, page);
}

function doGenerateHiddenForm(credential: Credential) {
    let html = "";
    // noinspection HtmlUnknownTarget
    html += "<form action='status.cgi' method='post' id='return_form'>";
    html += "<input type='hidden' name='id' value='" + credential.id + "'>";
    html += "<input type='hidden' name='pass' value='" + credential.pass + "'>";
    html += "<input type='hidden' name='mode' value='STATUS'>";
    html += "<input type='submit' id='return_submit'>";
    html += "</form>";
    html += PageUtils.generateEquipmentManagementForm(credential);
    $("#hidden_form_cell").html(html);
}

function doBindReturnButton() {
    $("#return_button").on("click", function () {
        $("#return_submit").trigger("click");
    });
}

function doRefresh(credential: Credential, page: TownWeaponHousePage) {
    document.getElementById("title_cell")?.scrollIntoView();
    $("#personal_equipment_list_cell").parent().hide();
    $("#weapon_merchandise_list_cell").parent().hide();
    $(".dynamic_button_class").off("click");
    new TownWeaponHouse(credential, page.townId).enter()
        .then(page => {
            const roleCash = page.roleCash!;
            $("#roleCash").text(roleCash + " GOLD");
            doRender(credential, page);
        });
}

function doBindRefreshButton(credential: Credential, page: TownWeaponHousePage) {
    $("#refresh_button").on("click", function () {
        $("#messageBoardManager").html(NpcLoader.randomNpcImageHtml());
        MessageBoard.resetMessageBoard("倍“锋”来袭,特“利”独行。");
        doRefresh(credential, page);
    });
}

function doRender(credential: Credential, page: TownWeaponHousePage) {
    // ------------------------------------------------------------------------
    // 渲染随身装备
    // ------------------------------------------------------------------------
    const equipmentList = page.personalEquipmentList!;
    if (equipmentList.length > 0) {
        let html = "";
        html += "<table style='border-width:0;width:100%;background-color:#888888'>";
        html += "<tbody style='background-color:#F8F0E0;text-align:center'>";
        html += "<tr>";
        html += "<td style='background-color:darkred;color:wheat;font-weight:bold' colspan='12'>";
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

        const indexList: number[] = [];
        for (const equipment of equipmentList) {
            html += "<tr>";
            html += "<td style='background-color:#E8E8D0'>";
            if (equipment.isSellable) {
                html += "<input type='button' value='出售' " +
                    "id='sell_" + equipment.index! + "' class='dynamic_button_class'>";
                indexList.push(equipment.index!);
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
        }

        html += "</tbody>";
        html += "</table>";

        $("#personal_equipment_list_cell")
            .html(html)
            .parent()
            .show();

        doBindSellButton(credential, page, indexList);
    }

    // ------------------------------------------------------------------------
    // 渲染武器店商品
    // ------------------------------------------------------------------------
    const merchandiseList = page.weaponMerchandiseList!;
    if (merchandiseList.length > 0) {
        let html = "";
        html += "<table style='border-width:0;width:100%;background-color:#888888'>";
        html += "<tbody style='background-color:#F8F0E0;text-align:center'>";
        html += "<tr>";
        html += "<td style='background-color:darkgreen;color:wheat;font-weight:bold' colspan='16'>";
        html += "＜ 商 品 列 表 ＞";
        html += "</td>";
        html += "</tr>";
        html += "<tr>";
        html += "<th style='background-color:#E8E8D0'>数量</th>";
        html += "<th style='background-color:#E8E8D0'>购买</th>";
        html += "<th style='background-color:#EFE0C0'>特产</th>";
        html += "<th style='background-color:#E0D0B0'>名字</th>";
        html += "<th style='background-color:#EFE0C0'>价格</th>";
        html += "<th style='background-color:#E0D0B0'>威力</th>";
        html += "<th style='background-color:#EFE0C0'>重量</th>";
        html += "<th style='background-color:#EFE0C0'>耐久</th>";
        html += "<th style='background-color:#E0D0B0'>职业</th>";
        html += "<th style='background-color:#E0D0B0'>攻击</th>";
        html += "<th style='background-color:#E0D0B0'>防御</th>";
        html += "<th style='background-color:#E0D0B0'>智力</th>";
        html += "<th style='background-color:#E0D0B0'>精神</th>";
        html += "<th style='background-color:#E0D0B0'>速度</th>";
        html += "<th style='background-color:#E0D0B0'>类型</th>";
        html += "<th style='background-color:#E0D0B0'>宝石</th>";
        html += "</tr>";

        const indexList: number[] = [];
        for (const merchandise of merchandiseList) {
            html += "<tr>";
            html += "<td style='background-color:#E8E8D0'>";
            if (page.spaceCount! > 0) {
                html += "<select id='count_" + merchandise.index + "'>";
                for (let i = 1; i <= page.spaceCount!; i++) {
                    html += "<option value='" + i + "'>" + i + "</option>";
                }
                html += "</select>";
            }
            html += "</td>";
            html += "<td style='background-color:#E8E8D0'>";
            if (page.spaceCount! > 0) {
                html += "<input type='button' value='购买' " +
                    "id='buy_" + merchandise.index + "' class='dynamic_button_class'>";
                indexList.push(merchandise.index);
            }
            html += "</td>";
            html += "<td style='background-color:#EFE0C0'>" + merchandise.specialityHtml + "</td>";
            html += "<td style='background-color:#E0D0B0'>" + merchandise.nameHtml + "</td>";
            html += "<td style='background-color:#EFE0C0;text-align:right'>" + merchandise.priceHtml + "</td>";
            html += "<td style='background-color:#E0D0B0'>" + merchandise.power + "</td>";
            html += "<td style='background-color:#EFE0C0'>" + merchandise.weight + "</td>";
            html += "<td style='background-color:#EFE0C0'>" + merchandise.endureHtml + "</td>";
            html += "<td style='background-color:#E0D0B0'>" + merchandise.requiredCareerHtml + "</td>";
            html += "<td style='background-color:#E0D0B0'>" + merchandise.requiredAttackHtml + "</td>";
            html += "<td style='background-color:#E0D0B0'>" + merchandise.requiredDefenseHtml + "</td>";
            html += "<td style='background-color:#E0D0B0'>" + merchandise.requiredSpecialAttackHtml + "</td>";
            html += "<td style='background-color:#E0D0B0'>" + merchandise.requiredSpecialDefenseHtml + "</td>";
            html += "<td style='background-color:#E0D0B0'>" + merchandise.requiredSpeedHtml + "</td>";
            html += "<td style='background-color:#E0D0B0'>" + merchandise.weaponCategory + "</td>";
            html += "<td style='background-color:#E0D0B0'>" + merchandise.gemCountHtml + "</td>";
            html += "</tr>";
        }

        html += "</tbody>";
        html += "</table>";

        $("#weapon_merchandise_list_cell")
            .html(html)
            .parent()
            .show();

        doBindBuyButton(credential, page, indexList);
    }
}

function doBindSellButton(credential: Credential, page: TownWeaponHousePage, indexList: number[]) {
    for (const index of indexList) {
        const buttonId = "sell_" + index;
        $("#" + buttonId).on("click", function () {
            const equipment = page.findEquipment(index)!;
            if (!confirm("确认要出售“" + equipment.fullName + "”？")) {
                return;
            }
            new TownWeaponHouse(credential, page.townId)
                .sell(index, page.discount!)
                .then(() => {
                    new TownBank(credential).deposit().then(() => {
                        doRefresh(credential, page);
                    });
                });
        });
    }
}

function doBindBuyButton(credential: Credential, page: TownWeaponHousePage, indexList: number[]) {
    for (const index of indexList) {
        const buttonId = "buy_" + index;
        $("#" + buttonId).on("click", function () {
            const count = parseInt($("#count_" + index).val() as string);
            const merchandise = page.findMerchandise(index)!;
            const totalPrice = merchandise.price! * count;
            const amount = PocketUtils.calculateCashDifferenceAmount(page.roleCash!, totalPrice);
            if (!confirm("确认要购买" + count + "把“" + merchandise.name + "”？大约需要再支取" + amount + "万GOLD。")) {
                return;
            }
            const bank = new TownBank(credential);
            bank.withdraw(amount).then(() => {
                new TownWeaponHouse(credential, page.townId)
                    .buy(index, count, page.discount!)
                    .then(() => {
                        bank.deposit().then(() => {
                            doRefresh(credential, page);
                        });
                    });
            })
                .catch(() => {
                    // Nothing changed, ignore.
                });
        });
    }
}

export = TownWeaponHousePageProcessor;