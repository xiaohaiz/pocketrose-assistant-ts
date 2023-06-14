import _ from "lodash";
import SetupLoader from "../../core/config/SetupLoader";
import RankTitleLoader from "../../core/role/RankTitleLoader";
import PageUtils from "../../util/PageUtils";
import StringUtils from "../../util/StringUtils";
import PageProcessor from "../PageProcessor";
import PageProcessorContext from "../PageProcessorContext";

class RoleInformationPageProcessor implements PageProcessor {

    process(context?: PageProcessorContext): void {
        PageUtils.fixCurrentPageBrokenImages();
        PageUtils.removeUnusedHyperLinks();
        PageUtils.removeGoogleAnalyticsScript();

        $("a")
            .filter((idx, a) => {
                const href = $(a).attr("href");
                return _.startsWith(href, "cgi/ranking");
            })
            .each((idx, a) => {
                let href = $(a).attr("href")!;
                href = href.substring(4);
                $(a).attr("href", href);
            });

        if (SetupLoader.isQiHanTitleEnabled()) {
            $("th:contains('姓名')")
                .filter((i, th) => $(th).text() === "姓名")
                .closest("tbody")
                .find("> tr")
                .filter(i => i !== 0)
                .each((i, tr) => {
                    const td = $(tr).find("td:first");
                    if (td.attr("colspan") !== undefined) {
                        let c = td.html();
                        for (const it of RankTitleLoader.getAllRankTitles()) {
                            while (true) {
                                if (!c.includes("(" + it + ")")) {
                                    break;
                                }
                                c = _.replace(c, "(" + it + ")", "(" + RankTitleLoader.transformTitle(it) + ")");
                            }
                        }
                        $(td).html(c);
                    } else {
                        let c = td.html();
                        if (c !== undefined && c.includes("<br>")) {
                            let a = StringUtils.substringBefore(c, "<br>");
                            let b = StringUtils.substringAfter(c, "<br>");
                            b = b.substring(1, b.length - 1);

                            let b2 = StringUtils.substringAfterLast(b, " ");
                            let b1 = StringUtils.substringBefore(b, " " + b2);

                            let h = a + "<br>(" + b1 + " " + RankTitleLoader.transformTitle(b2) + ")";
                            $(td).html(h);
                        }
                    }
                });
        }
    }

}

export = RoleInformationPageProcessor;