import NpcLoader from "../../core/NpcLoader";
import PersonalStatus from "../../pocketrose/PersonalStatus";
import Credential from "../../util/Credential";
import MessageBoard from "../../util/MessageBoard";
import PageProcessorContext from "../PageProcessorContext";
import PageProcessorCredentialSupport from "../PageProcessorCredentialSupport";

abstract class AbstractPersonalProfilePageProcessor extends PageProcessorCredentialSupport {

    doProcess(credential: Credential, context?: PageProcessorContext) {
        // 删除老页面的所有元素
        $("center:first").html("").hide();

        // 老页面没有什么有价值的数据，直接渲染新页面
        this.#renderImmutablePage(credential, context);
    }

    #renderImmutablePage(credential: Credential, context?: PageProcessorContext) {
        let html = "";
        html += "<table style='width:100%;border-width:0;background-color:#888888'>";
        html += "<tbody>";
        html += "<tr>";
        html += "<td id='pageTitleCell'></td>"
        html += "</tr>";
        html += "<tr>";
        html += "<td id='messageBoardCell'></td>"
        html += "</tr>";
        html += "<tr style='display:none'>";
        html += "<td id='hiddenCell-1'></td>"       // 预留给返回城市/城堡功能
        html += "</tr>";
        html += "<tr style='display:none'>";
        html += "<td id='hiddenCell-2'></td>"
        html += "</tr>";
        html += "<tr style='display:none'>";
        html += "<td id='hiddenCell-3'></td>"
        html += "</tr>";
        html += "<tr style='display:none'>";
        html += "<td id='hiddenCell-4'></td>"
        html += "</tr>";
        html += "<tr style='display:none'>";
        html += "<td id='hiddenCell-5'></td>"
        html += "</tr>";
        html += "<tr>";
        html += "<td id='personalStatus'></td>"
        html += "</tr>";
        html += "<tr>";
        html += "<td id='menuCell' style='background-color:#F8F0E0;text-align:center'>";
        html += "<button role='button' id='returnButton'>返回</button>";
        html += "</td>";
        html += "</tr>";
        html += "</tbody>";
        html += "</table>";

        $("center:first").after($(html));

        $("#pageTitleCell")
            .css("text-align", "center")
            .css("font-size", "180%")
            .css("font-weight", "bold")
            .css("background-color", "navy")
            .css("color", "yellowgreen")
            .text("＜＜  个 人 面 板  ＞＞");

        MessageBoard.createMessageBoardStyleB("messageBoardCell", NpcLoader.randomNpcImageHtml());
        $("#messageBoard")
            .css("background-color", "black")
            .css("color", "wheat")
            .html(this.#welcomeMessageHtml());

        this.doBindReturnButton(credential, context);

        this.#renderPersonalStatus(credential, context);
    }

    #welcomeMessageHtml() {
        return "<b style='font-size:120%'>见贤思齐焉，见不贤而内自省也。</b>";
    }

    abstract doBindReturnButton(credential: Credential, context?: PageProcessorContext): void;


    #renderPersonalStatus(credential: Credential, context?: PageProcessorContext) {
        new PersonalStatus(credential, context?.get("townId")).open().then(page => {
            const role = page.role!;
            let html = "";
            html += "<table style='text-align:center;border-width:0;margin:auto;width:100%'>";
            html += "<tbody>";
            html += "<tr>";
            html += "<td style='background-color:#E8E8D0;font-size:150%;font-weight:bold;color:navy' colspan='2'>" + role.name + "</td>";
            html += "</tr>";
            html += "<tr>";
            html += "<td style='width:80px;background-color:#E8E8D0' rowspan='2'>" + role.imageHtml + "</td>"
            html += "<td style='width:100%'></td>";
            html += "</tr>";
            html += "<tr>";
            html += "<td style='width:100%'></td>";
            html += "</tr>";
            html += "</tbody>";
            html += "</table>";

            $("#personalStatus").html(html);
        });
    }
}

export = AbstractPersonalProfilePageProcessor;