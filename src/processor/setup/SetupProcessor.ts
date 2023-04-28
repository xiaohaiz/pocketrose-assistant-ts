import PocketroseProcessor from "../PocketroseProcessor";
import PageUtils from "../../util/PageUtils";
import Credential from "../../util/Credential";

class SetupProcessor extends PocketroseProcessor {

    process() {
        const credential = PageUtils.currentCredential();
        doInitialize(credential);
    }

}

function doInitialize(credential: Credential) {
    // 整个页面是放在一个大form里面，删除重组
    $("form:first").remove();
    $("body:first").prepend($("<div id='top_container'></div>"));

    // 绘制新的页面
    let html = "";
    html += "<div id='eden' style='display:none'>";
    html += "<form action='' method='post' id='eden_form'>";
    html += "<input type='hidden' name='id' value='" + credential.id + "'>";
    html += "<input type='hidden' name='pass' value='" + credential.pass + "'>";
    html += "<div style='display:none' id='eden_form_payload'></div>";
    html += "<input type='submit' id='eden_form_submit'>";
    html += "</form>";
    html += "</div>";
    $("#top_container").append($(html));

    html = "";
    html += "<table style='background-color:#888888;width:100%;text-align:center'>";
    html += "<tbody style='background-color:#F8F0E0'>";
    html += "<tr>";
    html += "<td style='background-color:navy;color:yellowgreen;font-size:200%;font-weight:bold'>" +
        "＜＜ 口 袋 助 手 设 置 ＞＞" +
        "</td>";
    html += "</tr>";
    html += "<tr>";
    html += "<td id='message_board_container'></td>";
    html += "</tr>";
    html += "<tr>";
    html += "<td id='setup_container'></td>";
    html += "</tr>";
    html += "<tr>";
    html += "<td style='text-align:center'>" +
        "<input type='button' id='returnButton' value='返回城市'>" +
        "</td>";
    html += "</tr>";
    html += "</tody>";
    html += "</table>";
    $("#top_container").append($(html));

    __bindReturnButton();
}

function __bindReturnButton() {
    $("#returnButton").on("click", function () {
        $("#eden_form").attr("action", "status.cgi");
        $("#eden_form_payload").html("<input type='hidden' name='mode' value='STATUS'>");
        $("#eden_form_submit").trigger("click");
    });
}

export = SetupProcessor;