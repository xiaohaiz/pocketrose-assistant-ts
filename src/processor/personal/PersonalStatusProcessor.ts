import PageUtils from "../../util/PageUtils";
import PocketroseProcessor from "../PocketroseProcessor";

export = PersonalStatusProcessor;

class PersonalStatusProcessor extends PocketroseProcessor {

    process() {
        PageUtils.removeUnusedHyperLinks();
        PageUtils.removeGoogleAnalyticsScript();

        reRenderHonor();
    }
}

function reRenderHonor() {
    const td = $("table:eq(1) tr:eq(24) td:first");
    let html = $(td).html();
    html = html.replace(/<br>/g, '');
    $(td).attr("style", "word-break:break-all");
    $(td).html(html);
}