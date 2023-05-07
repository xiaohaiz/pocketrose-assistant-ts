import Processor from "../Processor";
import PageUtils from "../../util/PageUtils";
import Constants from "../../util/Constants";

/**
 * @deprecated
 */
class TownPetMapProcessor implements Processor {

    accept(cgi: string, pageText: string): boolean {
        if (cgi === "town.cgi") {
            return pageText.includes("* 宠物图鉴 *");
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
    let petIdText = "";             // 宠物图鉴编号及数量的文本
    $("td:parent").each(function (_i, element) {
        const img = $(element).children("img");
        const src = img.attr("src");
        if (src !== undefined && src.includes(Constants.POCKET_DOMAIN + "/image/386/")) {
            const code = img.attr("alt");
            const count = $(element).next();

            petIdText += code;
            petIdText += "/";
            petIdText += count.text();
            petIdText += "  ";
        }
    });
    if (petIdText !== "") {
        $("td:contains('可以在这里看到收集到的图鉴')")
            .filter(function () {
                return $(this).text().startsWith("可以在这里看到收集到的图鉴");
            })
            .attr("id", "messageBoard");
        $("#messageBoard").css("color", "white");

        let html = $("#messageBoard").html();
        html += "<br>" + petIdText;
        $("#messageBoard").html(html);
    }
}

export = TownPetMapProcessor;