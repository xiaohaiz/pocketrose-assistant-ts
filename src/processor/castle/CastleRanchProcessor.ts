import Processor from "../Processor";
import Credential from "../../util/Credential";
import PageUtils from "../../util/PageUtils";
import CastleRanch from "../../pocket/CastleRanch";
import MessageBoard from "../../util/MessageBoard";
import NpcLoader from "../../pocket/NpcLoader";
import CastleRanchPets from "../../pocket/CastleRanchPets";

class CastleRanchProcessor implements Processor {

    accept(cgi: string, pageText: string): boolean {
        if (cgi === "castle.cgi") {
            return pageText.includes("＜＜　|||　城堡牧场　|||　＞＞");
        }
        return false;
    }

    process(): void {
        PageUtils.removeUnusedHyperLinks();
        PageUtils.removeGoogleAnalyticsScript();
        const credential = PageUtils.currentCredential();
        doProcess(credential);
    }

}

function doProcess(credential: Credential) {
    // 解析原有页面的宠物列表
    const pageHtml = PageUtils.currentPageHtml();
    const pets = CastleRanch.parsePets(pageHtml);

    // 重组页面的基础结构
    // 标题(id: title_cell)
    $("td:first")
        .attr("id", "title_cell")
        .removeAttr("width")
        .removeAttr("height")
        .removeAttr("bgcolor")
        .css("text-align", "center")
        .css("font-size", "150%")
        .css("font-weight", "bold")
        .css("background-color", "navy")
        .css("color", "yellowgreen")
        .text("＜＜  城 堡 牧 场  ＞＞");

    // 删除原有的所有表单，及其包括的页面的内容
    $("form").remove();
    $("h3").remove();
    $("hr:eq(2)").remove();
    $("hr:eq(1)").remove();
    $("hr:eq(0)").remove();

    // 绘制新的表格
    let html = "";
    html += "<table style='width:100%;border-width:0;background-color:#888888'>";
    html += "<tbody>";
    // ------------------------------------------------------------------------
    // 隐藏的表单
    // ------------------------------------------------------------------------
    html += "<tr style='display:none'>";
    html += "<td id='hidden_form_cell'></td>";
    html += "</tr>";
    // ------------------------------------------------------------------------
    // 消息面板
    // ------------------------------------------------------------------------
    html += "<tr>";
    html += "<td id='message_board_cell'></td>";
    html += "</tr>";
    // ------------------------------------------------------------------------
    // 主菜单
    // ------------------------------------------------------------------------
    html += "<tr>";
    html += "<td style='background-color:#F8F0E0;text-align:center'>";
    html += "<input type='button' id='refresh_button' value='刷新城堡牧场'>";
    html += "<input type='button' id='return_button' value='离开城堡牧场'>";
    html += "</td>";
    // ------------------------------------------------------------------------
    // 个人宠物栏
    // ------------------------------------------------------------------------
    html += "<tr style='display:none'>";
    html += "<td id='personal_pet_list_cell'></td>";
    html += "</tr>";
    // ------------------------------------------------------------------------
    // 牧场宠物栏
    // ------------------------------------------------------------------------
    html += "<tr style='display:none'>";
    html += "<td id='ranch_pet_list_cell'></td>";
    html += "</tr>";
    html += "</tbody>";
    html += "</table>";
    $("table:first").after($(html));

    doGenerateHiddenForm(credential);
    doBindReturnButton();
    doBindRefreshButton(credential);
    doCreateMessageBoard();

    // 渲染动态页面
    doRender(credential, pets);
}

function doGenerateHiddenForm(credential: Credential) {
    let html = "";
    // noinspection HtmlUnknownTarget
    html += "<form action='castlestatus.cgi' method='post' id='return_form'>";
    html += "<input type='hidden' name='id' value='" + credential.id + "'>";
    html += "<input type='hidden' name='pass' value='" + credential.pass + "'>";
    html += "<input type='hidden' name='mode' value='CASTLESTATUS'>";
    html += "<input type='submit' id='return_submit'>";
    html += "</form>";
    $("#hidden_form_cell").html(html);
}

function doBindReturnButton() {
    $("#return_button").on("click", function () {
        $("#return_submit").trigger("click");
    });
}

function doBindRefreshButton(credential: Credential) {
    $("#refresh_button").on("click", function () {
        const imageHtml = NpcLoader.randomNpcImageHtml();
        $("#messageBoardManager").html(imageHtml);
        MessageBoard.resetMessageBoard("开心牧场，纯天然放养空间，富含大自然灵动因子，好心情成就健康。");
        new CastleRanch(credential).enter()
            .then(pets => {
                doRender(credential, pets);
            });
    });
}

function doCreateMessageBoard() {
    const imageHtml = NpcLoader.randomNpcImageHtml();
    MessageBoard.createMessageBoardStyleB("message_board_cell", imageHtml);
    $("#messageBoard")
        .css("background-color", "black")
        .css("color", "white");
    MessageBoard.resetMessageBoard("开心牧场，纯天然放养空间，富含大自然灵动因子，好心情成就健康。")
}

function doRender(credential: Credential, pets: CastleRanchPets) {
}

export = CastleRanchProcessor;