import PageUtils from "../../util/PageUtils";
import PageProcessor from "../PageProcessor";
import RoleParser from "../../pocket/RoleParser";
import Role from "../../pocket/Role";
import SetupLoader from "../../pocket/SetupLoader";

class PersonalStatusProcessor extends PageProcessor {

    process() {
        PageUtils.removeUnusedHyperLinks();
        PageUtils.removeGoogleAnalyticsScript();
        doProcess(this.pageHtml);
    }
}

function doProcess(pageHtml: string) {
    const role = RoleParser.parseRole(pageHtml);

    doRenderExperience(role);
    doRenderHonor();
}

function doRenderExperience(role: Role) {
    if (!SetupLoader.isExperienceProgressBarEnabled()) {
        return;
    }
    const t1 = $("table:eq(1)");
    let tr = $(t1).find("tr:eq(16)");
    let td = $(tr).find("td:eq(2)");
    if (role.level === 150) {
        $(td).attr("style", "color: blue").text("MAX");
    } else {
        const ratio = role.level! / 150;
        const progressBar = PageUtils.generateProgressBarHTML(ratio);
        const exp = $(td).text() + " EX";
        $(td).html("<span title='" + exp + "'>" + progressBar + "</span>");
    }

}

function doRenderHonor() {
    const td = $("table:eq(1) tr:eq(24) td:first");
    let html = $(td).html();
    html = html.replace(/<br>/g, '');
    $(td).attr("style", "word-break:break-all");
    $(td).html(html);
}

export = PersonalStatusProcessor;