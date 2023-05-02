import PageUtils from "../../util/PageUtils";
import RoleParser from "../../pocket/RoleParser";
import Role from "../../pocket/Role";
import SetupLoader from "../../pocket/SetupLoader";
import StringUtils from "../../util/StringUtils";
import Processor from "../Processor";

class PersonalStatusProcessor implements Processor {

    accept(cgi: string, pageText: string): boolean {
        if (cgi === "mydata.cgi") {
            return pageText.includes("仙人的宝物");
        }
        return false;
    }

    process() {
        PageUtils.removeUnusedHyperLinks();
        PageUtils.removeGoogleAnalyticsScript();
        doProcess();
    }
}

function doProcess() {
    const role = RoleParser.parseRole(document.documentElement.outerHTML);
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

    $("th:contains('分身类别')")
        .filter(function () {
            return $(this).text() === "分身类别";
        })
        .closest("table")
        .find("tr")
        .each(function (_idx, tr) {
            if (_idx > 0) {
                const td = $(tr).find("td:last");
                const exp = parseInt($(td).text());
                const level = Math.floor(exp / 100) + 1;
                if (level === 150) {
                    $(td).attr("style", "color: blue").text("MAX");
                } else {
                    const ratio = level / 150;
                    const progressBar = PageUtils.generateProgressBarHTML(ratio);
                    $(td).html("<span title='" + (exp + " EX") + "'>" + progressBar + "</span>");
                }
            }
        });

    $("td:contains('宠物名 ：')")
        .filter(function () {
            return $(this).text().startsWith("宠物名 ：");
        })
        .closest("table")
        .each(function (_idx, table) {
            let s = $(table).find("tr:eq(1) td:first").text();
            const level = parseInt(StringUtils.substringAfter(s, "Ｌｖ"));

            const td = $(table).find("tr:last td:eq(1)");
            if (level === 100) {
                $(td).attr("style", "color: blue").text("MAX");
            } else {
                s = $(td).text();
                const a = parseInt(StringUtils.substringBeforeSlash(s));
                const b = parseInt(StringUtils.substringAfterSlash(s));
                const ratio = a / b;
                const progressBar = PageUtils.generateProgressBarHTML(ratio);
                $(td).html("<span title='" + s + "'>" + progressBar + "</span>");
            }
        });
}

function doRenderHonor() {
    const td = $("table:eq(1) tr:eq(24) td:first");
    let html = $(td).html();
    html = html.replace(/<br>/g, '');
    $(td).attr("style", "word-break:break-all");
    $(td).html(html);
}

export = PersonalStatusProcessor;