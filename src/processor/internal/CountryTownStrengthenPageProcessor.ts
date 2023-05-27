import _ from "lodash";
import NpcLoader from "../../core/NpcLoader";
import TownLoader from "../../core/TownLoader";
import PersonalStatus from "../../pocketrose/PersonalStatus";
import Credential from "../../util/Credential";
import MessageBoard from "../../util/MessageBoard";
import PageProcessorContext from "../PageProcessorContext";
import PageProcessorCredentialSupport from "../PageProcessorCredentialSupport";

class CountryTownStrengthenPageProcessor extends PageProcessorCredentialSupport {

    doProcess(credential: Credential, context?: PageProcessorContext): void {
        $("table[height='100%']").removeAttr("height");
        $("form[action='status.cgi']").hide();

        $("table:first")
            .find("> tbody:first")
            .find("> tr:first")
            .find("> td:first")
            .attr("id", "pageTitle")
            .removeAttr("bgcolor")
            .removeAttr("width")
            .removeAttr("height")
            .css("text-align", "center")
            .css("font-size", "150%")
            .css("font-weight", "bold")
            .css("background-color", "navy")
            .css("color", "yellowgreen")
            .each((i, td) => {
                const pageTitle = $(td).text();
                $(td).text(_.trim(pageTitle));
            })
            .parent()
            .next()
            .find("> td:first")
            .find("> table:first")
            .find("> tbody:first")
            .find("> tr:first")
            .find("> td:eq(1)")
            .find("> table:first")
            .find("> tbody:first")
            .find("> tr:eq(1)")
            .find("> td:first")
            .each((i, td) => {
                new PersonalStatus(credential, context?.get("townId")).load().then(role => {
                    $(td).text(role.name!);
                });
            });

        $("table:first")
            .find("> tbody:first")
            .find("> tr:eq(2)")
            .find("> td:first")
            .attr("id", "messageBoardContainer")
            .html("")
            .each((i, td) => {
                const containerId = $(td).attr("id")!;
                const imageHtml = NpcLoader.randomNpcImageHtml();
                MessageBoard.createMessageBoardStyleB(containerId, imageHtml);
                $("#messageBoard")
                    .css("background-color", "black")
                    .css("color", "white")
                    .html(this.#welcomeMessageHtml());
            });

        $("table:first")
            .find("> tbody:first")
            .find("> tr:eq(3)")
            .find("> td:first")
            .find("> center:first")
            .find("> p:first")
            .hide()
            .next()
            .find("> p:first")
            .hide()
            .next()
            .hide();

        $("table:first")
            .find("> tbody:first")
            .find("> tr:eq(3)")
            .each((i, tr) => {
                const town = TownLoader.getTownById(context?.get("townId")!)!;
                let html = "";
                html += "<tr>";
                html += "<td id='instruction' style='text-align:center'></td>";
                html += "</tr>";
                html += "<tr>";
                html += "<td id='menu' style='text-align:center'>";
                html += "<button role='button' id='returnButton'>返回" + town.name + "</button>";
                html += "</td>";
                html += "</tr>";

                $(tr).after($(html));
                $("#returnButton").on("click", () => {
                    $("input:submit[value='返回城市']").trigger("click");
                });
            });

        let html = "";
        html += "<table style='background-color:#888888'>";
        html += "<tbody>";
        html += "<tr style='background-color:red;color:white'>";
        html += "<th>内阁</th>";
        html += "<th>指令</th>";
        html += "<th>内容</th>";
        html += "<th>发布</th>";
        html += "<tr>";
        html += "<tr>";
        html += "<td style='background-color:#E8E8D0'>" +
            NpcLoader.getTaskNpcImageHtml("诸葛亮") +
            "</td>";
        html += "<td style='background-color:#E8E8D0'>国家动员指令</td>";
        html += "<td style='background-color:#E8E8D0'>" +
            "<input type='text' name='m1' size='40'>" +
            "</td>";
        html += "<td style='background-color:#E8E8D0'>" +
            "<button role='button' id='p1'>下达</button>" +
            "</td>";
        html += "<tr>";
        html += "<tr>";
        html += "<td style='background-color:#E8E8D0'>" +
            NpcLoader.getTaskNpcImageHtml("司马懿") +
            "</td>";
        html += "<td style='background-color:#E8E8D0'>在野武将招募告示</td>";
        html += "<td style='background-color:#E8E8D0'>" +
            "<input type='text' name='m2' size='40'>" +
            "</td>";
        html += "<td style='background-color:#E8E8D0'>" +
            "<button role='button' id='p2'>发布</button>" +
            "</td>";
        html += "<tr>";
        html += "</tbody>";
        html += "</table>";
        $("#instruction").html(html);
    }

    #welcomeMessageHtml() {
        return "<b style='color:whitesmoke;font-size:120%'>" +
            "军民团结如一人，试看天下谁能敌！" +
            "</b>";
    }
}

export = CountryTownStrengthenPageProcessor;