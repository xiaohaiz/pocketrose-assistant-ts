import Processor from "../Processor";
import PageUtils from "../../util/PageUtils";
import Credential from "../../util/Credential";
import PetFutureLoader from "../../pocket/pet/PetFutureLoader";
import PetFuture from "../../common/PetFuture";

class TownPetRankHouseProcessor implements Processor {

    accept(cgi: string, pageText: string): boolean {
        if (cgi === "town.cgi") {
            return pageText.includes("＜＜ * 宠物资料馆 *＞＞");
        }
        return false;
    }

    process(): void {
        PageUtils.removeUnusedHyperLinks();
        PageUtils.removeGoogleAnalyticsScript();
        const credential = PageUtils.currentCredential();
        doProcess(credential);
    }

}

function doProcess(credential: Credential) {
    const t0 = $("table:first");
    const t1 = $("table:eq(1)");
    t1.find("td:first")
        .attr("id", "title_cell")
        .removeAttr("width")
        .removeAttr("height")
        .removeAttr("bgcolor")
        .css("text-align", "center")
        .css("font-size", "150%")
        .css("font-weight", "bold")
        .css("background-color", "navy")
        .css("color", "yellowgreen")
        .text("＜＜  宠 物 排 行 榜  ＞＞");

    t0.find("tr:first")
        .next()
        .find("table:first")
        .find("tr:first")
        .find("td:first")
        .attr("id", "messageBoard")
        .removeAttr("width")
        .removeAttr("bgcolor")
        .css("width", "100%")
        .css("background-color", "black")
        .css("color", "white")
        .text("全新宠物排行榜，帮助您更好了解口袋的宠物。")
        .next()
        .attr("id", "messageBoardManager");

    // 删除老页面的内容
    t0.next().remove();
    $("form").remove();

    // 绘制新的页面架构
    let html = "";
    html += "<tr style='display:none'>";
    html += "<td id='hidden_form_cell'></td>";
    html += "</tr>";
    html += "<tr>";
    html += "<td style='background-color:#F8F0E0;text-align:center'>";
    html += "<input type='button' id='return_button' value='离开宠物排行榜'>";
    html += "</td>";
    html += "</tr>";
    html += "<tr>";
    html += "<td style='background-color:#F8F0E0;text-align:center'>";
    html += "<input type='button' id='total_base_stats_rank' value='族值ＴＯＰ３０'>";
    html += "<input type='button' id='health_rank' value='生命ＴＯＰ３０'>";
    html += "<input type='button' id='attack_rank' value='攻击ＴＯＰ３０'>";
    html += "<input type='button' id='defense_rank' value='防御ＴＯＰ３０'>";
    html += "<input type='button' id='special_attack_rank' value='智力ＴＯＰ３０'>";
    html += "<input type='button' id='special_defense_rank' value='精神ＴＯＰ３０'>";
    html += "<input type='button' id='speed_rank' value='速度ＴＯＰ３０'>";
    html += "</td>";
    html += "</tr>";
    html += "<tr style='display:none'>";
    html += "<td id='pet_rank_cell'></td>";
    html += "</tr>";
    t0.find("tr:first").next().after($(html));

    doGenerateHiddenForm(credential);
    doBindReturnButton();
    doBindRankButton();

}

function doGenerateHiddenForm(credential: Credential) {
    let html = "";
    // noinspection HtmlUnknownTarget
    html += "<form action='status.cgi' method='post' id='return_form'>";
    html += "<input type='hidden' name='id' value='" + credential.id + "'>";
    html += "<input type='hidden' name='pass' value='" + credential.pass + "'>";
    html += "<input type='hidden' name='mode' value='STATUS'>";
    html += "<input type='submit' id='return_submit'>";
    html += "</form>";
    $("#hidden_form_cell").html(html);
}

function doBindReturnButton() {
    $("#return_button").on("click", function () {
        $("#return_submit").trigger("click");
    });
}

function doBindRankButton() {
    $("#total_base_stats_rank").on("click", function () {
        let petList = PetFutureLoader.loadAll();
        petList = doSortByTotalBaseStats(petList);
        doRender("族 值 排 行 榜", petList);
    });
}

function doRender(title: string, petList: PetFuture[]) {
    let html = "";
    html += "<table style='border-width:0;background-color:#888888;margin:auto;width:100%'>";
    html += "<tbody style='background-color:#F8F0E0;text-align:center'>";
    html += "<tr>";
    html += "<td style='background-color:darkred;color:wheat;font-weight:bold' colspan='18'>";
    html += "＜ " + title + " ＞";
    html += "</td>";
    html += "<tr>";
    html += "<th style='background-color:#E8E8D0'>排名</th>";
    html += "<th style='background-color:#E8E8D0'>形象</th>";
    html += "<th style='background-color:#EFE0C0'>名字</th>";
    html += "<th style='background-color:#E0D0B0'>总族值</th>";
    html += "<th style='background-color:#EFE0C0'>生命族值</th>";
    html += "<th style='background-color:#E0D0B0'>攻击族值</th>";
    html += "<th style='background-color:#EFE0C0'>智力族值</th>";
    html += "<th style='background-color:#EFE0C0'>精神族值</th>";
    html += "<th style='background-color:#E0D0B0'>速度族值</th>";
    html += "<th style='background-color:#E0D0B0'>总努力</th>";
    html += "<th style='background-color:#EFE0C0'>生命努力</th>";
    html += "<th style='background-color:#E0D0B0'>攻击努力</th>";
    html += "<th style='background-color:#E0D0B0'>防御努力</th>";
    html += "<th style='background-color:#EFE0C0'>智力努力</th>";
    html += "<th style='background-color:#EFE0C0'>精神努力</th>";
    html += "<th style='background-color:#E0D0B0'>速度努力</th>";
    html += "<th style='background-color:#EFE0C0'>捕获率</th>";
    html += "<th style='background-color:#EFE0C0'>成长经验</th>";
    html += "</tr>";

    for (let i = 0; i < 30; i++) {
        const pet = petList[i];
        html += "<tr>";
        html += "<th style='background-color:#E8E8D0'>" + (i + 1) + "</th>";
        html += "<td style='background-color:#E8E8D0'>";
        html += pet.imageHtml;
        html += "</td>";
        html += "<td style='background-color:#EFE0C0'>" + pet.name + "</td>";
        html += "<td style='background-color:#E0D0B0;font-weight:bold;color:blue'>" + pet.totalBaseStats + "</td>";
        html += "<td style='background-color:#EFE0C0'>" + pet.healthBaseStats + "</td>";
        html += "<td style='background-color:#E0D0B0'>" + pet.attackBaseStats + "</td>";
        html += "<td style='background-color:#EFE0C0'>" + pet.specialAttackBaseStats + "</td>";
        html += "<td style='background-color:#EFE0C0'>" + pet.specialDefenseBaseStats + "</td>";
        html += "<td style='background-color:#E0D0B0'>" + pet.speedBaseStats + "</td>";
        html += "<td style='background-color:#E0D0B0;font-weight:bold;color:green'>" + pet.totalEffort + "</td>";
        html += "<td style='background-color:#EFE0C0'>" + pet.healthEffort + "</td>";
        html += "<td style='background-color:#E0D0B0'>" + pet.attackEffort + "</td>";
        html += "<td style='background-color:#E0D0B0'>" + pet.defenseEffort + "</td>";
        html += "<td style='background-color:#EFE0C0'>" + pet.specialAttackEffort + "</td>";
        html += "<td style='background-color:#EFE0C0'>" + pet.specialDefenseEffort + "</td>";
        html += "<td style='background-color:#E0D0B0'>" + pet.speedEffort + "</td>";
        html += "<td style='background-color:#EFE0C0'>" + pet.catchRatio + "</td>";
        html += "<td style='background-color:#EFE0C0'>" + pet.growExperience + "</td>";
        html += "</tr>";
    }

    html += "</tbody>";
    html += "</table>";
    $("#pet_rank_cell").html(html).parent().show();
}

function doSortByTotalBaseStats(petList: PetFuture[]): PetFuture[] {
    const result: PetFuture[] = [];
    result.push(...petList);
    result.sort((a, b) => {
        let ret = b.totalBaseStats - a.totalBaseStats;
        if (ret !== 0) {
            return ret;
        }
        ret = b.totalEffort - a.totalEffort;
        if (ret !== 0) {
            return ret;
        }
        return a.name!.localeCompare(b.name!);
    });
    return result;
}

export = TownPetRankHouseProcessor;