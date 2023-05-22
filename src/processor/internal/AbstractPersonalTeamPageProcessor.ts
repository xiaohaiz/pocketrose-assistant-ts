import NpcLoader from "../../core/NpcLoader";
import Credential from "../../util/Credential";
import MessageBoard from "../../util/MessageBoard";
import PageUtils from "../../util/PageUtils";
import PageProcessorContext from "../PageProcessorContext";
import PageProcessorCredentialSupport from "../PageProcessorCredentialSupport";

abstract class AbstractPersonalTeamPageProcessor extends PageProcessorCredentialSupport {

    doLoadButtonStyles(): number[] {
        return [35];
    }

    doProcess(credential: Credential, context?: PageProcessorContext) {
        $("table[height='100%']").removeAttr("height");
        $("form[action='status.cgi']").remove();

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
            .text("＜＜  团 队 面 板  ＞＞");

        $("table:first")
            .find("tbody:first")
            .find("> tr:eq(2)")
            .find("td:first")
            .attr("id", "messageBoardContainer")
            .html("");
        const imageHtml = NpcLoader.randomNpcImageHtml();
        MessageBoard.createMessageBoardStyleB("messageBoardContainer", imageHtml);
        $("#messageBoard")
            .css("background-color", "black")
            .css("color", "white")
            .html(this.#welcomeMessageHtml());

        let html = "";
        html += "<tr style='display:none'>";
        html += "<td id='hidden-1'></td>";
        html += "</tr>";
        html += "<tr style='display:none'>";
        html += "<td id='hidden-2'></td>";
        html += "</tr>";
        html += "<tr style='display:none'>";
        html += "<td id='hidden-3'></td>";
        html += "</tr>";
        html += "<tr>";
        html += "<td id='menu' style='background-color:#F8F0E0;text-align:center'>";
        html += "<table style='background-color:transparent;margin:auto;border-spacing:0;border-width:0'>";
        html += "<tbody>";
        html += "<tr>";
        html += "<td>";
        html += "<button role='button' class='button-35' id='refreshButton'>刷新团队面板</button>";
        html += "</td>";
        html += "<td>";
        html += "<button role='button' class='button-35' id='returnButton'>离开团队面板</button>";
        html += "</td>";
        html += "<td>";
        html += "<button role='button' class='button-35' id='updateEquipmentButton'>更新装备数据</button>";
        html += "</td>";
        html += "<td>";
        html += "<button role='button' class='button-35' id='updatePetButton'>更新宠物数据</button>";
        html += "</td>";
        html += "<td>";
        html += "<button role='button' class='button-35' id='listEquipmentButton'>团队装备列表</button>";
        html += "</td>";
        html += "<td>";
        html += "<button role='button' class='button-35' id='listPetButton'>团队宠物列表</button>";
        html += "</td>";
        html += "</tr>";
        html += "</tbody>";
        html += "</table>";
        html += "</td>";
        html += "</tr>";
        html += "<tr style='display:none'>";
        html += "<td id='information' style='background-color:#F8F0E0'></td>";
        html += "</tr>";
        $("#messageBoardContainer")
            .parent()
            .after($(html));

        this.#bindRefreshButton();
        this.bindReturnButton(credential);
    }

    #welcomeMessageHtml() {
        return "<b style='font-size:120%;color:wheat'>什么是团队？在我看来，共同配置在快速登陆里面的才能称为团队。</b>";
    }

    #bindRefreshButton() {
        $("#refreshButton").on("click", () => {
            PageUtils.scrollIntoView("pageTitle");
            const imageHtml = NpcLoader.randomNpcImageHtml();
            $("#messageBoardManager").html(imageHtml);
            $("#messageBoard").html(this.#welcomeMessageHtml());
            $("#information").html("").parent().hide();
        });
    }

    abstract bindReturnButton(credential: Credential): void;
}


export = AbstractPersonalTeamPageProcessor;