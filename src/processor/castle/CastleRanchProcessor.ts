import Processor from "../Processor";
import Credential from "../../util/Credential";
import PageUtils from "../../util/PageUtils";
import CastleRanch from "../../pocket/CastleRanch";
import MessageBoard from "../../util/MessageBoard";
import NpcLoader from "../../pocket/NpcLoader";
import CastleRanchStatus from "../../pocket/CastleRanchStatus";

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
    const ranchStatus = CastleRanch.parseCastleRanchStatus(pageHtml);

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
    doRender(credential, ranchStatus);
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
        $("#personal_pet_list_cell").parent().hide();
        $("#ranch_pet_list_cell").parent().hide();
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

function doRender(credential: Credential, ranchStatus: CastleRanchStatus) {

    if (ranchStatus.personalPetList.length > 0) {
        let html = "";
        html += "<table style='border-width:0;width:100%;background-color:#888888'>";
        html += "<tbody style='background-color:#F8F0E0;text-align:center'>";
        html += "<tr>";
        html += "<td style='background-color:darkred;color:wheat;font-weight:bold' colspan='12'>";
        html += "＜ 随 身 宠 物 ＞";
        html += "</td>";
        html += "</tr>";
        html += "<tr>";
        html += "<th style='background-color:#E8E8D0'>操作</th>";
        html += "<th style='background-color:#EFE0C0'>使用</th>";
        html += "<th style='background-color:#E0D0B0'>名字</th>";
        html += "<th style='background-color:#EFE0C0'>等级</th>";
        html += "<th style='background-color:#E0D0B0'>生命</th>";
        html += "<th style='background-color:#EFE0C0'>攻击</th>";
        html += "<th style='background-color:#EFE0C0'>防御</th>";
        html += "<th style='background-color:#E0D0B0'>智力</th>";
        html += "<th style='background-color:#E0D0B0'>精神</th>";
        html += "<th style='background-color:#E0D0B0'>速度</th>";
        html += "<th style='background-color:#E0D0B0'>经验</th>";
        html += "<th style='background-color:#E0D0B0'>性别</th>";
        html += "</tr>";

        for (const pet of ranchStatus.personalPetList) {
            html += "<tr>";
            html += "<td style='background-color:#E8E8D0'>操作</td>";
            html += "<td style='background-color:#EFE0C0'>" + pet.usingHtml + "</td>";
            html += "<td style='background-color:#E0D0B0'>" + pet.name + "</td>";
            html += "<td style='background-color:#EFE0C0'>" + pet.levelHtml + "</td>";
            html += "<td style='background-color:#E0D0B0'>" + pet.healthHtml + "</td>";
            html += "<td style='background-color:#EFE0C0'>" + pet.attackHtml + "</td>";
            html += "<td style='background-color:#EFE0C0'>" + pet.defenseHtml + "</td>";
            html += "<td style='background-color:#E0D0B0'>" + pet.specialAttackHtml + "</td>";
            html += "<td style='background-color:#E0D0B0'>" + pet.specialDefenseHtml + "</td>";
            html += "<td style='background-color:#E0D0B0'>" + pet.speedHtml + "</td>";
            html += "<td style='background-color:#E0D0B0'>" + pet.experienceHtml + "</td>";
            html += "<td style='background-color:#E0D0B0'>" + pet.gender + "</td>";
            html += "</tr>";
        }

        html += "</tbody>";
        html += "</table>";

        $("#personal_pet_list_cell")
            .html(html)
            .parent()
            .show();
    }
}

export = CastleRanchProcessor;