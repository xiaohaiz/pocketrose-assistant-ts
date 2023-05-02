import PageUtils from "../../util/PageUtils";
import PageProcessor from "../PageProcessor";

class PersonalStatusProcessor extends PageProcessor {

    process() {
        PageUtils.removeUnusedHyperLinks();
        PageUtils.removeGoogleAnalyticsScript();
        doProcess();
    }
}

function doProcess() {
    doRenderHonor();
}

function doRenderHonor() {
    const td = $("table:eq(1) tr:eq(24) td:first");
    let html = $(td).html();
    html = html.replace(/<br>/g, '');
    $(td).attr("style", "word-break:break-all");
    $(td).html(html);
}

export = PersonalStatusProcessor;