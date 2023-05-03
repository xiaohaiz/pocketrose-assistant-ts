import PageUtils from "../../util/PageUtils";
import Processor from "../Processor";
import StringUtils from "../../util/StringUtils";
import SetupLoader from "../../pocket/SetupLoader";
import EventHandler from "../../pocket/EventHandler";

class CastleDashboardProcessor implements Processor {

    accept(cgi: string, pageText: string): boolean {
        if (cgi === "castle.cgi" || cgi === "castlestatus.cgi") {
            return pageText.includes("城堡的情報");
        }
        return false;
    }

    process() {
        PageUtils.removeUnusedHyperLinks();
        PageUtils.removeGoogleAnalyticsScript();
        PageUtils.fixCurrentPageBrokerImages();
        doProcess();
    }
}

function doProcess() {
    doRenderPostHouseMenu();
    doRenderSetupMenu();
    doRenderEquipmentManagementMenu();
    doRenderPetManagementMenu();
    doRenderCareerManagementMenu();

    doRenderExperienceProgressBar();
    doRenderEventBoard();
}

function doRenderPostHouseMenu() {
    $("option[value='CASTLE_BUILDMACHINE']")
        .css("background-color", "yellow")
        .text("城堡驿站");
}

function doRenderSetupMenu() {
    $("option[value='LETTER']")
        .css("background-color", "yellow")
        .text("口袋助手设置");
}

function doRenderEquipmentManagementMenu() {
    if (SetupLoader.isEquipmentManagementUIEnabled()) {
        $("option[value='USE_ITEM']")
            .css("background-color", "yellow")
            .text("装备管理");
        $("option[value='CASTLE_SENDITEM']").remove();
    }
}

function doRenderPetManagementMenu() {
    if (SetupLoader.isPetManagementUIEnabled()) {
        $("option[value='PETSTATUS']")
            .css("background-color", "yellow")
            .text("宠物管理");
        $("option[value='CASTLE_SENDPET']").remove();
    }
}

function doRenderCareerManagementMenu() {
    if (SetupLoader.isCareerManagementUIEnabled()) {
        $("option[value='CHANGE_OCCUPATION']")
            .css("background-color", "yellow")
            .text("职业管理");
        $("option[value='MAGIC']").remove();
    }
}

function doRenderExperienceProgressBar() {
    if (!SetupLoader.isExperienceProgressBarEnabled()) {
        return;
    }
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

function doRenderEventBoard() {
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
            const header = "<font color=\"navy\">●</font>";
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

export = CastleDashboardProcessor;