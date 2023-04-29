import PageProcessor from "../PageProcessor";
import PageUtils from "../../util/PageUtils";
import EquipmentParser from "../../pocket/EquipmentParser";
import Credential from "../../util/Credential";
import Equipment from "../../pocket/Equipment";
import MessageBoard from "../../util/MessageBoard";

class PersonalEquipmentManagementProcessor extends PageProcessor {

    process() {
        PageUtils.removeUnusedHyperLinks();
        PageUtils.removeGoogleAnalyticsScript();
        const credential = PageUtils.currentCredential();
        const equipmentList = EquipmentParser.parsePersonalItemList(this.pageHtml);
        doProcess(credential, equipmentList);
    }

}

function doProcess(credential: Credential, equipmentList: Equipment[]) {
    const userImage = PageUtils.findFirstUserImageHtml();

    // 修改标题
    $("table:first").removeAttr("height");
    $("table:first td:first").css("text-align", "center");
    $("table:first td:first").css("font-size", "150%");
    $("table:first td:first").css("font-weight", "bold");
    $("table:first td:first").css("background-color", "navy");
    $("table:first td:first").css("color", "greenyellow");
    $("table:first td:first").text("＜＜　 装 备 管 理 　＞＞");

    // 创建消息面板
    $("table:first tr:first").after($("<tr><td style='background-color:#E8E8D0' id='message_board_container'></td></tr>"));
    MessageBoard.createMessageBoard("message_board_container", userImage!);
    MessageBoard.resetMessageBoard("全新的装备管理界面为您带来全新的体验。");

    // 删除旧的页面组件，并且预留新的刷新的位置
    // 预留了两个div，ItemUI用于页面刷新，Eden隐藏用于放置表单以便可以转移到其他的页面
    $("table:first tr:first").next().next()
        .html("<td style='background-color:#F8F0E0'>" +
            "<div id='ItemUI'></div><div id='Eden' style='display:none'></div>" +
            "</td>");
    // 在Eden里面添加预制的表单
    $("#Eden").html("" +
        "<form action='' method='post' id='eden_form'>" +
        "        <input type='hidden' name='id' value='" + credential.id + "'>" +
        "        <input type='hidden' name='pass' value='" + credential.pass + "'>" +
        "        <div id='eden_form_payload' style='display:none'></div>" +
        "        <input type='submit' id='eden_form_submit'>" +
        "</form>");

    // 将返回按钮调整到页面中间，并且删除不需要的内容
    $("table:first tr:first").next().next().next()
        .html("<td style='background-color:#F8F0E0;text-align:center'>" +
            "    <input type='button' id='returnButton' value='返回上个画面'>" +
            "</td>");
    $("#returnButton").on("click", function () {
        $("#eden_form").attr("action", "status.cgi");
        $("#eden_form_payload").html("<input type='hidden' name='mode' value='STATUS'>");
        $("#eden_form_submit").trigger("click");
    });

    doRender(credential, equipmentList);
}

function doRender(credential: Credential, equipmentList: Equipment[]) {

}

export = PersonalEquipmentManagementProcessor;