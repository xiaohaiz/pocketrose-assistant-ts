import Processor from "../Processor";
import PageUtils from "../../util/PageUtils";

class CastleEntranceProcessor implements Processor {

    accept(cgi: string, pageText: string): boolean {
        if (cgi === "status.cgi") {
            return pageText.includes("城堡") && pageText.includes("入口。");
        }
        if (cgi === "castle.cgi") {
            return pageText.includes("已经顺利存入您的账户！") ||
                pageText.includes("请善加利用，欢迎您再来！") ||
                pageText.includes("体力完全回复。");
        }
        return false;
    }

    process(): void {
        PageUtils.removeUnusedHyperLinks();
        PageUtils.removeGoogleAnalyticsScript();
        doProcess();
    }

}

function doProcess() {
    let submit = $("input:submit[value='进入城堡']");
    if (submit.length > 0) {
        submit.trigger("click");
    }
    submit = $("input:submit[value='返回城堡']");
    if (submit.length > 0) {
        submit.trigger("click");
    }
}

export = CastleEntranceProcessor;