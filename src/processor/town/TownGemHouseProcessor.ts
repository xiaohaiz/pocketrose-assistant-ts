import Processor from "../Processor";
import PageUtils from "../../util/PageUtils";
import TownGemHouse from "../../pocket/house/TownGemHouse";
import TownGemHousePage from "../../pocket/house/TownGemHousePage";
import Credential from "../../util/Credential";
import NpcLoader from "../../pocket/NpcLoader";
import MessageBoard from "../../util/MessageBoard";
import Constants from "../../util/Constants";
import NetworkUtils from "../../util/NetworkUtils";

class TownGemHouseProcessor implements Processor {

    accept(cgi: string, pageText: string): boolean {
        if (cgi === "town.cgi") {
            return pageText.includes("＜＜ * 合 成 屋 *＞＞");
        }
        return false;
    }

    process(): void {
        PageUtils.removeUnusedHyperLinks();
        PageUtils.removeGoogleAnalyticsScript();
        TownGemHouse.parsePage(PageUtils.currentPageHtml())
            .then(page => {
                doProcess(page);
            });
    }

}

function doProcess(page: TownGemHousePage) {
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
        .text("＜＜  宝 石 屋  ＞＞")
        .parent()
        .next()
        .find("table:first")
        .find("td:eq(1)")
        .find("table:first")
        .find("td:first")
        .find("table:first")
        .find("td:last")
        .attr("id", "roleCash");

    t1.find("tr:first")
        .next()
        .next()
        .find("table:first")
        .find("td:first")
        .attr("id", "messageBoard")
        .removeAttr("width")
        .removeAttr("bgcolor")
        .css("width", "100%")
        .css("background-color", "black")
        .css("color", "white")
        .next()
        .attr("id", "messageBoardManager");

    // 清空原来的页面内容，准备重新绘制
    t1.find("tr:first")
        .next()
        .next()
        .next()
        .html("<td id='gem_house_UI' style='width:100%;text-align:center'></td>")
        .next()
        .remove();

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
    html += "<input type='button' id='refresh_button' value='刷新宝石屋'>";
    html += "<input type='button' id='return_button' value='离开宝石屋'>";
    html += "</td>";
    // ------------------------------------------------------------------------
    // 个人物品栏
    // ------------------------------------------------------------------------
    html += "<tr style='display:none'>";
    html += "<td id='equipment_list_cell' style='background-color:#F8F0E0;text-align:center'></td>";
    html += "</tr>";
    // ------------------------------------------------------------------------
    // 宝石栏
    // ------------------------------------------------------------------------
    html += "<tr style='display:none'>";
    html += "<td id='gem_list_cell' style='background-color:#F8F0E0;text-align:center'></td>";
    html += "</tr>";
    html += "</tbody>";
    html += "</table>";

    $("#gem_house_UI").html(html);

    doGenerateHiddenForm(page.credential);
    doBindReturnButton();
    doBindRefreshButton(page.credential);

    doRender(page);
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
    $("#hidden_form_cell").html(html);
}

function doBindReturnButton() {
    $("#return_button").on("click", function () {
        $("#return_submit").trigger("click");
    });
}

function doRefresh(credential: Credential) {
    document.getElementById("title_cell")?.scrollIntoView();
    $("#equipment_list_cell").parent().hide();
    $("#gem_list_cell").parent().hide();
    $(".dynamic_button_class").off("click");
    new TownGemHouse(credential).enter()
        .then(page => {
            const roleCash = page.roleCash!;
            $("#roleCash").text(roleCash + " GOLD");
            doRender(page);
        });
}

function doBindRefreshButton(credential: Credential) {
    $("#refresh_button").on("click", function () {
        $("#messageBoardManager").html(NpcLoader.randomNpcImageHtml());
        MessageBoard.resetMessageBoard("钻石恒久远，一颗永流传。");
        doRefresh(credential);
    });
}

function doRender(page: TownGemHousePage) {
    if (page.equipmentList!.length > 0) {
        let html = "";
        html += "<table style='border-width:0;background-color:#888888;margin:auto'>";
        html += "<tbody style='background-color:#F8F0E0;text-align:center'>";
        html += "<tr>";
        html += "<td style='background-color:darkred;color:wheat;font-weight:bold' colspan='9'>";
        html += "＜ 随 身 装 备 ＞";
        html += "</td>";
        html += "</tr>";
        html += "<tr>";
        html += "<th style='background-color:#E8E8D0'>选择</th>";
        html += "<th style='background-color:#EFE0C0'>装备</th>";
        html += "<th style='background-color:#E0D0B0'>名字</th>";
        html += "<th style='background-color:#EFE0C0'>种类</th>";
        html += "<th style='background-color:#E0D0B0'>威力</th>";
        html += "<th style='background-color:#EFE0C0'>重量</th>";
        html += "<th style='background-color:#EFE0C0'>耐久</th>";
        html += "<th style='background-color:#E0D0B0'>宝石</th>";
        html += "<th style='background-color:#E0D0B0'>销毁</th>";
        html += "</tr>";

        for (const equipment of page.equipmentList!) {
            const canFuse = equipment.selectable! && (!equipment.using! || (equipment.using! && equipment.name === "宠物蛋"));
            const canMelt = !equipment.using! && page.townGemMeltHousePage!.canMelt(equipment.index!);
            if (!canFuse && !canMelt) {
                continue;
            }

            html += "<tr>";
            html += "<td style='background-color:#E8E8D0'>";
            if (canFuse) {
                html += "<input type='radio' value='" + equipment.index + "' name='equipment_radio'>";
            }
            html += "</td>";
            html += "<td style='background-color:#EFE0C0'>" + equipment.usingHTML + "</td>";
            html += "<td style='background-color:#E0D0B0'>" + equipment.nameHTML + "</td>";
            html += "<td style='background-color:#EFE0C0'>" + equipment.category + "</td>";
            html += "<td style='background-color:#E0D0B0'>" + equipment.power + "</td>";
            html += "<td style='background-color:#EFE0C0'>" + equipment.weight + "</td>";
            html += "<td style='background-color:#EFE0C0'>" + equipment.endureHtml + "</td>";
            html += "<td style='background-color:#E0D0B0'>" + equipment.gemCountHtml + "</td>";
            html += "<td style='background-color:#E0D0B0'>";
            if (canMelt) {
                html += "销毁";
            }
            html += "</td>";
            html += "</tr>";
        }

        html += "</tbody>";
        html += "</table>";

        $("#equipment_list_cell")
            .html(html)
            .parent()
            .show();
    }

    if (page.gemList!.length > 0) {
        let html = "";
        html += "<table style='border-width:0;background-color:#888888;margin:auto'>";
        html += "<tbody style='background-color:#F8F0E0;text-align:center'>";
        html += "<tr>";
        html += "<td style='background-color:darkgreen;color:wheat;font-weight:bold' colspan='2'>";
        html += "＜ 可 用 宝 石 ＞";
        html += "</td>";
        html += "</tr>";
        html += "<tr>";
        html += "<th style='background-color:#E8E8D0'>宝石</th>";
        html += "<th style='background-color:#EFE0C0'>镶嵌</th>";
        html += "</tr>";

        const indexList: number[] = [];
        for (const gem of page.gemList!) {
            indexList.push(gem.index!);
            html += "<tr>";
            html += "<td style='background-color:#E8E8D0'>" + gem.nameHTML + "</td>";
            html += "<td style='background-color:#EFE0C0'>";
            html += "<img alt='镶嵌' id='fuse_" + gem.index + "' " +
                "class='dynamic_button_class' title='镶嵌' " +
                "src='" + (Constants.POCKET_DOMAIN + "/image/country/6.gif") + "'>";
            html += "</td>";
            html += "</tr>";
        }

        html += "</tbody>";
        html += "</table>";

        $("#gem_list_cell")
            .html(html)
            .parent()
            .show();

        doBindFuseButton(page, indexList);
    }
}

function doBindFuseButton(page: TownGemHousePage, indexList: number[]) {
    for (const index of indexList) {
        const buttonId = "fuse_" + index;
        $("#" + buttonId).on("click", function () {
            const checked = $("input:radio:checked").val();
            if (checked === undefined) {
                document.getElementById("title_cell")?.scrollIntoView();
                MessageBoard.publishWarning("没有选择要镶嵌的装备！");
                return;
            }

            const equipment = page.findEquipment(parseInt(checked as string));
            const gem = page.findGem(index);
            if (!confirm("确认为“" + equipment?.nameHTML + "”镶嵌“" + gem?.name + "”？")) {
                document.getElementById("title_cell")?.scrollIntoView();
                return;
            }

            const request = page.credential.asRequest();
            // @ts-ignore
            request.select = checked as string;
            // @ts-ignore
            request.baoshi = index;
            // @ts-ignore
            request.azukeru = "0";
            // @ts-ignore
            request.mode = "BAOSHI_MAKE";

            NetworkUtils.sendPostRequest("town.cgi", request, function (pageHtml) {
                MessageBoard.processResponseMessage(pageHtml);
                doRefresh(page.credential);
            });
        });
    }
}

export = TownGemHouseProcessor;