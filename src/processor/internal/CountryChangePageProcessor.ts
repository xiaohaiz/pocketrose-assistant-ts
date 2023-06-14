import _ from "lodash";
import SetupLoader from "../../config/SetupLoader";
import NpcLoader from "../../core/role/NpcLoader";
import RankTitleLoader from "../../core/role/RankTitleLoader";
import PersonalStatus from "../../pocketrose/PersonalStatus";
import Credential from "../../util/Credential";
import MessageBoard from "../../util/MessageBoard";
import StringUtils from "../../util/StringUtils";
import PageProcessorContext from "../PageProcessorContext";
import PageProcessorCredentialSupport from "../PageProcessorCredentialSupport";

class CountryChangePageProcessor extends PageProcessorCredentialSupport {

    doProcess(credential: Credential, context?: PageProcessorContext): void {
        $("table:first")
            .find("> tbody:first")
            .find("> tr:first")
            .find("> td:first")
            .attr("id", "pageTitle")
            .each((idx, td) => {
                const text = $(td).text();
                $(td)
                    .removeAttr("bgcolor")
                    .removeAttr("width")
                    .removeAttr("height")
                    .css("text-align", "center")
                    .css("font-size", "150%")
                    .css("font-weight", "bold")
                    .css("background-color", "navy")
                    .css("color", "yellowgreen")
                    .text(_.trim(text));
            })
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
            .each((idx, td) => {
                new PersonalStatus(credential, context?.get("townId")).load().then(role => {
                    $(td).text(role.name!);
                });
            });

        $("table:first")
            .find("> tbody:first")
            .find("> tr:eq(2)")
            .find("> td:first")
            .attr("id", "messageBoardContainer")
            .each((idx, td) => {
                const html = $(td).html();
                const imageHtml = NpcLoader.randomNpcImageHtml();
                MessageBoard.createMessageBoardStyleB("messageBoardContainer", imageHtml);
                $("#messageBoard")
                    .css("background-color", "black")
                    .css("color", "white")
                    .html(html);
            });

        $("table:first")
            .find("> tbody:first")
            .find("> tr:eq(3)")
            .find("> td:first")
            .css("text-align", "center")
            .find("> p:first")
            .find("> table:first")
            .css("margin", "auto")
            .find("> tbody:first")
            .find("> tr")
            .filter(idx => idx > 0)
            .each((idx, tr) => {
                const country = $(tr)
                    .find("> td:first")
                    .find("> font:first")
                    .text();
                if (country === "在野") {
                    $(tr).hide();
                } else {
                    const font = $(tr)
                        .find("> td:eq(1)")
                        .find("> font:first");
                    if (SetupLoader.isQiHanTitleEnabled()) {
                        const text = font.text();
                        let a1 = StringUtils.substringAfterLast(text, "(");
                        let a0 = StringUtils.substringBefore(text, "(" + a1);
                        a1 = StringUtils.substringBefore(a1, ")");
                        let r0 = "";
                        let r1 = "";
                        for (const it of RankTitleLoader.getAllRankTitles()) {
                            r0 = " " + it + " ";
                            if (a1.includes(r0)) {
                                r1 = " " + RankTitleLoader.transformTitle(it) + " ";
                                break;
                            }
                        }
                        if (r1 !== "") {
                            a1 = _.replace(a1, r0, r1);
                            font.text(a0 + "(" + a1 + ")");
                        }
                    }
                }
            });
    }

}

export = CountryChangePageProcessor;