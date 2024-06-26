import _ from "lodash";
import NpcLoader from "../../core/role/NpcLoader";
import {PersonalStatus} from "../../core/role/PersonalStatus";
import TownLoader from "../../core/town/TownLoader";
import Credential from "../../util/Credential";
import KeyboardShortcutBuilder from "../../util/KeyboardShortcutBuilder";
import MessageBoard from "../../util/MessageBoard";
import PageUtils from "../../util/PageUtils";
import PageProcessorContext from "../PageProcessorContext";
import StatelessPageProcessorCredentialSupport from "../StatelessPageProcessorCredentialSupport";
import {PocketNetwork} from "../../pocket/PocketNetwork";
import {PocketLogger} from "../../pocket/PocketLogger";

const logger = PocketLogger.getLogger("COUNTRY");

class CountryTownStrengthenPageProcessor extends StatelessPageProcessorCredentialSupport {

    async doProcess(credential: Credential, context?: PageProcessorContext): Promise<void> {
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
                const town = TownLoader.load(context?.get("townId"));
                let html = "";
                html += "<tr>";
                html += "<td id='instruction' style='text-align:center'></td>";
                html += "</tr>";
                html += "<tr>";
                html += "<td id='menu' style='text-align:center'>";
                html += "<button role='button' id='returnButton'>返回" + town?.name + "</button>";
                html += "</td>";
                html += "</tr>";

                $(tr).after($(html));
                $("#returnButton").on("click", () => {
                    $("input:submit[value='返回城市']").trigger("click");
                });
            });

        let html = "";
        html += "<table style='background-color:#888888;margin:auto'>";
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
            "<input type='text' id='m1' size='40'>" +
            "</td>";
        html += "<td style='background-color:#E8E8D0'>" +
            "<button role='button' id='p1'>下达</button>" +
            "</td>";
        html += "<tr>";
        html += "<tr>";
        html += "<td style='background-color:#E8E8D0'>" +
            NpcLoader.getTaskNpcImageHtml("司马懿") +
            "</td>";
        html += "<td style='background-color:#E8E8D0'>在野招募告示</td>";
        html += "<td style='background-color:#E8E8D0'>" +
            "<input type='text' id='m2' size='40'>" +
            "</td>";
        html += "<td style='background-color:#E8E8D0'>" +
            "<button role='button' id='p2'>发布</button>" +
            "</td>";
        html += "<tr>";
        html += "</tbody>";
        html += "</table>";
        $("#instruction").html(html);

        doBindPublishButton(credential);

        KeyboardShortcutBuilder.newInstance()
            .onEscapePressed(() => $("#returnButton").trigger("click"))
            .withDefaultPredicate()
            .doBind();
    }

    #welcomeMessageHtml() {
        return "<b style='color:whitesmoke;font-size:120%'>" +
            "军民团结如一人，试看天下谁能敌！" +
            "</b>";
    }
}

function doBindPublishButton(credential: Credential) {
    $("#p1").on("click", () => {
        PageUtils.scrollIntoView("pageTitle");
        const msg = $("#m1").val();
        if (msg === undefined || _.trim(msg as string) === "") {
            logger.warn("没有输入指令内容！");
            return;
        }
        const msgForPublish = _.trim(msg as string);
        const request = credential.asRequest();
        request.set("m_0", "1");
        request.set("azukeru", "1");
        // noinspection JSDeprecatedSymbols
        request.set("ins", escape(msgForPublish));
        request.set("ins2", "");
        request.set("mode", "COUNTRY_STR");
        PocketNetwork.post("country.cgi", request).then(response => {
            MessageBoard.processResponseMessage(response.html);
        });
    });
    $("#p2").on("click", () => {
        PageUtils.scrollIntoView("pageTitle");
        const msg = $("#m2").val();
        if (msg === undefined || _.trim(msg as string) === "") {
            logger.warn("没有输入指令内容！");
            return;
        }
        const msgForPublish = _.trim(msg as string);
        const request = credential.asRequest();
        request.set("m_0", "1");
        request.set("azukeru", "1");
        request.set("ins", "");
        // noinspection JSDeprecatedSymbols
        request.set("ins2", escape(msgForPublish));
        request.set("mode", "COUNTRY_STR");
        PocketNetwork.post("country.cgi", request).then(response => {
            MessageBoard.processResponseMessage(response.html);
        });
    });
}

export = CountryTownStrengthenPageProcessor;