import PageUtils from "../../../util/PageUtils";
import PersonalEquipmentManagement from "../../../pocket/PersonalEquipmentManagement";
import MessageBoard from "../../../util/MessageBoard";
import NpcLoader from "../../../pocket/NpcLoader";
import Coordinate from "../../../util/Coordinate";
import PersonalEquipmentManagementPage from "../../../pocket/PersonalEquipmentManagementPage";
import Credential from "../../../util/Credential";

class MapPersonalEquipmentManagementProcessor {

    process(coordinate: Coordinate) {
        doProcess(coordinate);
    }

}

const welcomeMessage = "<b style='font-size:120%;color:yellow'>真是难为您了，在野外还不忘捯饬您这些破烂。</b>";

function doProcess(coordinate: Coordinate) {
    // 解析原始的页面信息
    const page = PersonalEquipmentManagement.parsePage(PageUtils.currentPageHtml());

    // 重组旧的页面
    PageUtils.removeUnusedHyperLinks();
    PageUtils.removeGoogleAnalyticsScript();
    $("table[height='100%']").removeAttr("height");

    $("td:first")
        .attr("id", "pageTitle")
        .removeAttr("width")
        .removeAttr("height")
        .removeAttr("bgcolor")
        .css("text-align", "center")
        .css("font-size", "150%")
        .css("font-weight", "bold")
        .css("background-color", "navy")
        .css("color", "yellowgreen")
        .text("＜＜  装 备 管 理 （ 地 图 模 式 ）  ＞＞")
        .parent()
        .attr("id", "tr0")
        .next()
        .attr("id", "tr1")
        .find("td:first")
        .find("table:first")
        .find("tr:first")
        .find("td:first")
        .attr("id", "roleImage")
        .next()
        .removeAttr("width")
        .css("width", "100%")
        .next().remove();

    $("#roleImage")
        .next()
        .find("table:first")
        .find("tr:first")
        .next()
        .next()
        .after($("" +
            "<tr>" +
            "<td style='background-color:#E0D0B0'>坐标点</td>" +
            "<td style='background-color:#E8E8D0;text-align:right;font-weight:bold;color:red' " +
            "colspan='5'>" + coordinate.asText() + "</td>" +
            "</tr>" +
            ""));

    // ------------------------------------------------------------------------
    // 消息面板栏
    // ------------------------------------------------------------------------
    $("#tr1")
        .next()
        .attr("id", "tr2")
        .find("td:first")
        .attr("id", "messageBoardContainer")
        .removeAttr("height");
    MessageBoard.createMessageBoardStyleB("messageBoardContainer", NpcLoader.randomNpcImageHtml());
    $("#messageBoard")
        .css("background-color", "black")
        .css("color", "wheat");
    MessageBoard.resetMessageBoard(welcomeMessage);

    // ------------------------------------------------------------------------
    // 隐藏表单栏
    // ------------------------------------------------------------------------
    let html = "";
    html += "<tr id='tr3' style='display:none'>";
    html += "<td>";
    html += PageUtils.generateReturnMapForm(page.credential);
    html += "</td>";
    html += "</tr>"
    $("#tr2").after($(html));

    // ------------------------------------------------------------------------
    // 主菜单栏
    // ------------------------------------------------------------------------
    html = "";
    html += "<tr id='tr4'>";
    html += "<td style='background-color:#F8F0E0;text-align:center'>";
    html += "<input type='button' id='refreshButton' value='刷新装备管理'>";
    html += "<input type='button' id='returnButton' value='退出装备管理'>";
    html += "</td>";
    html += "</tr>"
    $("#tr3").after($(html));
    $("#refreshButton").on("click", function () {
        $("#messageBoardManager").html(NpcLoader.randomNpcImageHtml);
        MessageBoard.resetMessageBoard(welcomeMessage);
        doRefresh(page.credential);
    });
    $("#returnButton").on("click", function () {
        $("#returnMap").trigger("click");
    });

    // ------------------------------------------------------------------------
    // 用于保存百宝袋的状态
    // none - 没有发现百宝袋
    // index/on|off - 百宝袋下标/状态
    // ------------------------------------------------------------------------
    html = "";
    html += "<tr id='tr5' style='display:none'>";
    html += "<td id='treasureBag'></td>";
    html += "</tr>"
    $("#tr4").after($(html));
    const treasureBag = page.findTreasureBag();
    if (treasureBag === null) {
        $("#treasureBag").text("none");
    } else {
        $("#treasureBag").text(treasureBag.index + "/off");
    }

    // ------------------------------------------------------------------------
    // 装备栏目
    // ------------------------------------------------------------------------
    html = "";
    html += "<tr id='tr6' style='display:none'>";
    html += "<td id='equipmentList'></td>";
    html += "</tr>"
    $("#tr5").after($(html));

    // 渲染装备栏
    doRender(page);
}

function doRefresh(credential: Credential) {
    PageUtils.scrollIntoView("pageTitle");
    $(".mutableElement").off("click");
    $("#equipmentList").html("").parent().hide();
    new PersonalEquipmentManagement(credential)
        .open()
        .then(page => {
            doRender(page);
        });
}

function doRender(page: PersonalEquipmentManagementPage) {

}

export = MapPersonalEquipmentManagementProcessor;