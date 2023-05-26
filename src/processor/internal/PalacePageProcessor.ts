import _ from "lodash";
import NpcLoader from "../../core/NpcLoader";
import TownLoader from "../../core/TownLoader";
import PersonalStatus from "../../pocketrose/PersonalStatus";
import Credential from "../../util/Credential";
import MessageBoard from "../../util/MessageBoard";
import PageProcessorContext from "../PageProcessorContext";
import PageProcessorCredentialSupport from "../PageProcessorCredentialSupport";

class PalacePageProcessor extends PageProcessorCredentialSupport {

    doProcess(credential: Credential, context?: PageProcessorContext): void {
        $("table[height='100%']").removeAttr("height");

        const pageTitle = $("table:first")
            .find("> tbody:first")
            .find("> tr:first")
            .find("> td:first")
            .attr("id", "pageTitle")
            .text();

        $("#pageTitle")
            .removeAttr("bgcolor")
            .removeAttr("width")
            .removeAttr("height")
            .css("text-align", "center")
            .css("font-size", "150%")
            .css("font-weight", "bold")
            .css("background-color", "navy")
            .css("color", "yellowgreen")
            .text(_.trim(pageTitle));

        $("#pageTitle")
            .parent()
            .next()
            .find("> td:first")
            .find("> table:first")
            .find("> tbody:first")
            .find("> tr:first")
            .find("> td:last")
            .find("> table:first")
            .find("> tbody:first")
            .find("> tr:eq(1)")
            .find("> td:first")
            .each((i, td) => {
                new PersonalStatus(credential, context?.get("townId")).load().then(role => {
                    $(td).text(role.name!);
                });
            });

        $("#pageTitle")
            .parent()
            .next()
            .next()
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
            .find("> tr:last")
            .find("> td:first")
            .attr("id", "hidden-0")
            .parent()
            .hide()
            .each((i, tr) => {
                let html = "";
                html += "<tr style='display:none'>";
                html += "<td id='hidden-1'></td>"
                html += "</tr>";
                html += "<tr style='display:none'>";
                html += "<td id='hidden-2'></td>"
                html += "</tr>";
                html += "<tr style='display:none'>";
                html += "<td id='hidden-3'></td>"
                html += "</tr>";
                html += "<tr>";
                html += "<td id=''></td>"
                html += "</tr>";
                html += "<tr>";
                html += "<td id='hidden-3'></td>"
                html += "</tr>";
                html += "<tr>";
                html += "<td id='task' style='background-color:#F8F0E0;text-align:center'></td>"
                html += "</tr>";
                html += "<tr>";
                html += "<td id='menu' style='background-color:#F8F0E0;text-align:center'></td>"
                html += "</tr>";
                $(tr).after($(html));
            });

        renderMenu(context!);
        renderTask();
    }

    #welcomeMessageHtml() {
        return "<b style='color:whitesmoke;font-size:120%'>" +
            "秋风起兮白云飞，草木黄落兮雁南归。兰有秀兮菊有芳，怀佳人兮不能忘。<br>" +
            "泛楼船兮济汾河，横中流兮扬素波。萧鼓鸣兮发棹歌，欢乐极兮哀情多。<br>" +
            "少壮几时兮奈老何。" +
            "</b>";
    }


}

function renderMenu(context: PageProcessorContext) {
    $("#menu")
        .each((i, td) => {
            const town = TownLoader.getTownById(context!.get("townId")!)!;
            let html = "";
            html += "<table style='background-color:transparent;border-width:unset;border-spacing:unset;margin:auto'>";
            html += "<tbody>";
            html += "<tr>";
            html += "<td>";
            html += "<button role='button' id='returnButton'>返回" + town.name + "</button>";
            html += "</td>";
            html += "</tr>";
            html += "</tbody>";
            html += "</table>";
            $(td).html(html);
            $("#returnButton").on("click", () => {
                $("input:submit[value='返回城市']").trigger("click");
            });
        });
}

function renderTask() {
    let html = "";
    html += "<table style='background-color:#888888;margin:auto;text-align:center'>";
    html += "<tbody style='background-color:#F8F0E0'>";
    html += "<tr style='background-color:red;color:white'>";
    html += "<th>内阁</th>";
    html += "<th>官职</th>";
    html += "<th>任务</th>";
    html += "<th>接受</th>";
    html += "<th>完成</th>";
    html += "</tr>";

    $("#hidden-0")
        .find("> center:first")
        .find("> form:first")
        .find("> table:first")
        .find("> tbody:first")
        .find("> tr")
        .filter(i => i > 1)
        .each((i, tr) => {
            const c1 = $(tr).find("> td:first");
            const c2 = c1.next();
            const c3 = c2.next();
            const c4 = c3.next();

            const radio = c1.find("> input:radio");

            const index = _.parseInt(radio.val() as string);
            const title = c3.text();
            const task = c4.text();

            html += "<tr>";
            html += "<td style='width:64px;height:64px'>" + NpcLoader.getTaskNpcImageHtml(title) + "</td>";
            html += "<td>" + title + "</td>";
            html += "<td>" + task + "</td>";
            if (!radio.prop("disabled")) {
                html += "<td><button role='button' id='accept-" + index + "'>接受任务</button></td>";
                html += "<td><button role='button' id='finish-" + index + "'>完成任务</button></td>";
            } else {
                html += "<td><button role='button' id='accept-" + index + "' disabled>接受任务</button></td>";
                html += "<td><button role='button' id='finish-" + index + "' disabled>完成任务</button></td>";
            }
            html += "</tr>";

        });

    html += "<tr>";
    html += "<td colspan='5'>";
    html += "<button role='button' id='cancel' style='width:100%;background-color:red;color:white;font-weight:bold'>取 消 任 务</button>";
    html += "</td>";
    html += "</tr>";

    html += "</tbody>";
    html += "</table>";

    $("#task").html(html);
}

export = PalacePageProcessor;