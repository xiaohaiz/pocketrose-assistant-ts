import _ from "lodash";
import PageUtils from "../../util/PageUtils";
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
            })
    }

}

export = RoleInformationPageProcessor;