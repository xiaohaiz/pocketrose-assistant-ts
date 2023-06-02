import NpcLoader from "../../core/NpcLoader";
import Credential from "../../util/Credential";
import MessageBoard from "../../util/MessageBoard";
import PageProcessorContext from "../PageProcessorContext";
import PageProcessorCredentialSupport from "../PageProcessorCredentialSupport";

class PersonalStatisticsPageProcessor extends PageProcessorCredentialSupport {

    doProcess(credential: Credential, context?: PageProcessorContext): void {
        // 点名的页面也是令人无语，全部在一个大form里面。
        let lastDivHtml = "";
        $("form:first")
            .attr("id", "rollCallForm")
            .find("> center:last")
            .find("> div:last")
            .html((idx, html) => {
                lastDivHtml = html;
                return html;
            })
            .addClass("remove-candidate")
            .prev().hide()
            .prev().hide()
            .prev().hide();

        $(".remove-candidate").remove();

        // 恢复之前的div
        $("#rollCallForm")
            .after($("" +
                "<hr style='height:0;width:100%'>" +
                "<div style='text-align:center'>" + lastDivHtml + "</div>" +
                ""));

        // 在表单前插入统计页面
        let html = "";
        html += "<table style='width:100%;background-color:#888888'>";
        html += "<tbody>";
        html += "<tr>";
        html += "<td id='pageTitle'></td>";
        html += "</tr>";
        html += "<tr>";
        html += "<td id='messageBoardContainer'></td>";
        html += "</tr>";
        html += "<tr style='display:none'>";
        html += "<td id='hidden-1'></td>";
        html += "</tr>";
        html += "<tr style='display:none'>";
        html += "<td id='hidden-2'></td>";
        html += "</tr>";
        html += "<tr style='display:none'>";
        html += "<td id='hidden-3'></td>";
        html += "</tr>";
        html += "<tr style='display:none'>";
        html += "<td id='hidden-4'></td>";
        html += "</tr>";
        html += "<tr style='display:none'>";
        html += "<td id='hidden-5'></td>";
        html += "</tr>";
        html += "<tr>";
        html += "<td id='menuContainer' style='text-align:center;background-color:#F8F0E0'>";
        html += "<button role='button' id='returnButton'>返回城市</button>";
        html += "</td>";
        html += "</tr>";
        html += "</tbody>";
        html += "</table>";

        $("#rollCallForm")
            .hide()
            .before($(html));

        $("#pageTitle")
            .css("text-align", "center")
            .css("font-size", "150%")
            .css("font-weight", "bold")
            .css("background-color", "navy")
            .css("color", "yellowgreen")
            .text("＜＜  团 队 统 计  ＞＞");

        MessageBoard.createMessageBoardStyleB("messageBoardContainer", NpcLoader.randomNpcImageHtml());
        $("#messageBoard")
            .css("background-color", "black")
            .css("color", "white")
            .html(this.#welcomeMessageHtml());
        $("#messageBoardManager").on("click", () => {
            $("#rollCallForm").toggle();
        });

        $("#returnButton").on("click", () => {
            $("input:submit[value='返回城市']").trigger("click");
        });
    }

    #welcomeMessageHtml() {
        return "<b style='font-size:120%;color:wheat'>想不想对自己的团队有更深层次的了解？</b><br>" +
            "<b style='font-size:120%;color:yellow'>什么，你是想要点名？单击我的头像即可。</b>";
    }
}

export = PersonalStatisticsPageProcessor;