import SetupLoader from "../../core/config/SetupLoader";
import EventHandler from "../../core/event/EventHandler";
import RankTitleLoader from "../../core/role/RankTitleLoader";
import KeyboardShortcutBuilder from "../../util/KeyboardShortcutBuilder";
import PageUtils from "../../util/PageUtils";
import StringUtils from "../../util/StringUtils";
import PageProcessor from "../PageProcessor";

class CastleDashboardPageProcessor implements PageProcessor {

    process(): void {
        PageUtils.fixCurrentPageBrokenImages();
        PageUtils.removeUnusedHyperLinks();
        PageUtils.removeGoogleAnalyticsScript();

        this.#renderMenu();
        this.#renderRankTitle();
        this.#renderExperience();
        this.#renderEventBoard();

        KeyboardShortcutBuilder.newInstance()
            .onKeyPressed("b", () => {
                $("option[value='CASTLE_BANK']").prop("selected", true);
                PageUtils.triggerClick("castleButton");
            })
            .onKeyPressed("e", () => {
                $("option[value='USE_ITEM']").prop("selected", true);
                PageUtils.triggerClick("personalButton");
            })
            .onKeyPressed("j", () => {
                $("option[value='DIANMING']").prop("selected", true);
                PageUtils.triggerClick("personalButton");
            })
            .onKeyPressed("u", () => {
                $("option[value='PETSTATUS']").prop("selected", true);
                PageUtils.triggerClick("personalButton");
            })
            .onKeyPressed("x", () => {
                $("option[value='LETTER']").prop("selected", true);
                PageUtils.triggerClick("personalButton");
            })
            .onKeyPressed("z", () => {
                $("option[value='CHANGE_OCCUPATION']").prop("selected", true);
                PageUtils.triggerClick("personalButton");
            })
            .onEscapePressed(() => {
                $("option[value='CASTLE_BUILDMACHINE']").prop("selected", true);
                PageUtils.triggerClick("castleButton");
            })
            .withDefaultPredicate()
            .bind();
    }

    #renderMenu() {
        $("option[value='CASTLE_BANK']")
            .text("口袋银行城堡支行");
        $("option[value='CASTLE_SENDMONEY']").remove();
        $("option[value='SALARY']").remove();

        $("option[value='CASTLE_BUILDMACHINE']")
            .text("城堡驿站");
        $("option[value='LETTER']")
            .text("口袋助手设置");

        $("option[value='USE_ITEM']").text("装备管理");
        $("option[value='CASTLE_ITEM']").remove();
        $("option[value='CASTLE_SENDITEM']").remove();

        $("option[value='PETSTATUS']").text("宠物管理");
        $("option[value='CASTLE_PET']").remove();
        $("option[value='CASTLE_SENDPET']").remove();
        $("option[value='PETBORN']").remove();

        $("option[value='CHANGE_OCCUPATION']").text("职业管理");
        $("option[value='MAGIC']").remove();

        $("option[value='DIANMING']").text("统计报告");

        $("option[value='CASTLE_BUILDMACHINE']")
            .closest("td")
            .next()
            .find("> input:submit")
            .attr("id", "castleButton");
        $("option[value='USE_ITEM']")
            .closest("td")
            .next()
            .find("> input:submit")
            .attr("id", "personalButton");
    }

    #renderRankTitle() {
        if (!SetupLoader.isQiHanTitleEnabled()) {
            return;
        }
        $("td:contains('身份')")
            .filter((idx, td) => $(td).text() === "身份")
            .next()
            .each((idx, th) => {
                let c = $(th).text();
                c = StringUtils.substringAfterLast(c, " ");
                c = RankTitleLoader.transformTitle(c);
                $(th).text(c);
            });
    }

    #renderExperience() {
        if (SetupLoader.isExperienceProgressBarEnabled()) {
            $("td:contains('经验值')")
                .filter(function () {
                    return $(this).text() === "经验值";
                })
                .next()
                .each(function (_idx, th) {
                    const expText = $(th).text();
                    const experience = parseInt(StringUtils.substringBefore(expText, " EX"));
                    if (experience >= 14900) {
                        $(th).css("color", "blue").text("MAX");
                    } else {
                        const level = Math.ceil(experience / 100) + 1;
                        const ratio = level / 150;
                        const progressBar = PageUtils.generateProgressBarHTML(ratio);
                        $(th).html("<span title='" + expText + "'>" + progressBar + "</span>");
                    }
                });
        }
    }

    #renderEventBoard() {
        $("td:contains('最近发生的事件')")
            .filter(function () {
                return $(this).text() === "最近发生的事件";
            })
            .parent()
            .next()
            .find("td:first")
            .attr("id", "eventBoard");

        const eventHtmlList: string[] = [];
        $("#eventBoard").html()
            .split("<br>")
            .filter(it => it.endsWith(")"))
            .map(function (it) {
                // noinspection HtmlDeprecatedTag,XmlDeprecatedElement,HtmlDeprecatedAttribute
                const header: string = "<font color=\"navy\">●</font>";
                return StringUtils.substringAfter(it, header);
            })
            .map(function (it) {
                return EventHandler.handleWithEventHtml(it);
            })
            .forEach(it => eventHtmlList.push(it));

        let html = "";
        html += "<table style='border-width:0;width:100%;height:100%;margin:auto'>";
        html += "<tbody>";
        eventHtmlList.forEach(it => {
            html += "<tr>";
            html += "<th style='color:navy;vertical-align:top'>●</th>";
            html += "<td style='width:100%'>";
            html += it;
            html += "</td>";
            html += "</tr>";
        });
        html += "</tbody>";
        html += "</table>";

        $("#eventBoard").html(html);
    }

}

export = CastleDashboardPageProcessor;