import MonsterProfile from "../../core/monster/MonsterProfile";
import MonsterProfileDict from "../../core/monster/MonsterProfileDict";
import Credential from "../../util/Credential";
import PageProcessorContext from "../PageProcessorContext";
import PageProcessorCredentialSupport from "../PageProcessorCredentialSupport";

class TownPetRankHousePageProcessor extends PageProcessorCredentialSupport {

    async doProcess(credential: Credential, context?: PageProcessorContext): Promise<void> {
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
        .html("全新宠物排行榜，帮助您更好了解口袋的宠物。<br>" +
            "目前宠物初始值和族值的关系是我们推测的，不一定准确。等白猫如果有反馈再修正。")
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
    html += "<table style='margin:auto;border-width:0;text-align:center'>";
    html += "<tbody>";
    html += "<tr>";
    html += "<td>";
    html += "<input type='button' id='total_base_stats_rank' value='族值ＴＯＰ３０'>";
    html += "</td>";
    html += "<td>";
    html += "<input type='button' id='health_rank' value='生命ＴＯＰ３０'>";
    html += "</td>";
    html += "<td>";
    html += "<input type='button' id='attack_rank' value='攻击ＴＯＰ３０'>";
    html += "</td>";
    html += "<td>";
    html += "<input type='button' id='defense_rank' value='防御ＴＯＰ３０'>";
    html += "</td>";
    html += "</tr>";
    html += "<tr>";
    html += "<td>";
    html += "<input type='button' id='special_attack_rank' value='智力ＴＯＰ３０'>";
    html += "</td>";
    html += "<td>";
    html += "<input type='button' id='special_defense_rank' value='精神ＴＯＰ３０'>";
    html += "</td>";
    html += "<td>";
    html += "<input type='button' id='speed_rank' value='速度ＴＯＰ３０'>";
    html += "</td>";
    html += "<td>";
    html += "<input type='button' id='capacity_rank' value='能力ＴＯＰ３０'>";
    html += "</td>";
    html += "</tr>";
    html += "</tbody>";
    html += "</table>";
    html += "</td>";
    html += "</tr>";
    html += "<tr>";
    html += "<td style='background-color:#F8F0E0;text-align:center'>";
    html += "<table style='margin:auto;border-width:0;text-align:center'>";
    html += "<tbody>";
    html += "<tr>";
    html += "<td>";
    html += "<input type='button' id='r_total_base_stats_rank' value='族值垫底的３０'>";
    html += "</td>";
    html += "<td>";
    html += "<input type='button' id='r_health_rank' value='生命垫底的３０'>";
    html += "</td>";
    html += "<td>";
    html += "<input type='button' id='r_attack_rank' value='攻击垫底的３０'>";
    html += "</td>";
    html += "<td>";
    html += "<input type='button' id='r_defense_rank' value='防御垫底的３０'>";
    html += "</td>";
    html += "</tr>";
    html += "<tr>";
    html += "<td>";
    html += "<input type='button' id='r_special_attack_rank' value='智力垫底的３０'>";
    html += "</td>";
    html += "<td>";
    html += "<input type='button' id='r_special_defense_rank' value='精神垫底的３０'>";
    html += "</td>";
    html += "<td>";
    html += "<input type='button' id='r_speed_rank' value='速度垫底的３０'>";
    html += "</td>";
    html += "<td>";
    html += "<input type='button' id='r_capacity_rank' value='能力垫底的３０'>";
    html += "</td>";
    html += "</tr>";
    html += "</tbody>";
    html += "</table>";
    html += "</td>";
    html += "</tr>";
    html += "<tr>";
    html += "<td style='background-color:#F8F0E0;text-align:center'>";
    html += "<input type='text' id='spellName' value='' size='20' spellcheck='false'>";
    html += "<input type='button' id='searchSpellButton' value='根据技能查询宠物'>";
    html += "<input type='button' id='petDetailButton' value='查询宠物详情'>";
    html += "</td>";
    html += "</tr>";
    html += "<tr style='display:none'>";
    html += "<td id='pet_rank_cell'></td>";
    html += "</tr>";
    t0.find("tr:first").next().after($(html));

    doGenerateHiddenForm(credential);
    doBindReturnButton();
    doBindRankButton();
    doBindSearchButton();
    doBindPetDetailButton();
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
        let petList = MonsterProfileDict.loadAll();
        petList = sortByTotalBaseStats(petList);
        doRender("族 值 排 行 榜", petList);
    });
    $("#r_total_base_stats_rank").on("click", function () {
        let petList = MonsterProfileDict.loadAll();
        petList = sortByTotalBaseStats(petList, true);
        doRender("族 值 （垫 底） 排 行 榜", petList);
    });
    $("#health_rank").on("click", function () {
        let petList = MonsterProfileDict.loadAll();
        petList = sortByHealth(petList);
        doRender("生 命 排 行 榜", petList);
    });
    $("#r_health_rank").on("click", function () {
        let petList = MonsterProfileDict.loadAll();
        petList = sortByHealth(petList, true);
        doRender("生 命 （垫 底） 排 行 榜", petList);
    });
    $("#attack_rank").on("click", function () {
        let petList = MonsterProfileDict.loadAll();
        petList = sortByAttack(petList);
        doRender("攻 击 排 行 榜", petList);
    });
    $("#r_attack_rank").on("click", function () {
        let petList = MonsterProfileDict.loadAll();
        petList = sortByAttack(petList, true);
        doRender("攻 击 （垫 底） 排 行 榜", petList);
    });
    $("#defense_rank").on("click", function () {
        let petList = MonsterProfileDict.loadAll();
        petList = sortByDefense(petList);
        doRender("防 御 排 行 榜", petList);
    });
    $("#r_defense_rank").on("click", function () {
        let petList = MonsterProfileDict.loadAll();
        petList = sortByDefense(petList, true);
        doRender("防 御 （垫 底） 排 行 榜", petList);
    });
    $("#special_attack_rank").on("click", function () {
        let petList = MonsterProfileDict.loadAll();
        petList = sortBySpecialAttack(petList);
        doRender("智 力 排 行 榜", petList);
    });
    $("#r_special_attack_rank").on("click", function () {
        let petList = MonsterProfileDict.loadAll();
        petList = sortBySpecialAttack(petList, true);
        doRender("智 力 （垫 底） 排 行 榜", petList);
    });
    $("#special_defense_rank").on("click", function () {
        let petList = MonsterProfileDict.loadAll();
        petList = sortBySpecialDefense(petList);
        doRender("精 神 排 行 榜", petList);
    });
    $("#r_special_defense_rank").on("click", function () {
        let petList = MonsterProfileDict.loadAll();
        petList = sortBySpecialDefense(petList, true);
        doRender("精 神 （垫 底） 排 行 榜", petList);
    });
    $("#speed_rank").on("click", function () {
        let petList = MonsterProfileDict.loadAll();
        petList = sortBySpeed(petList);
        doRender("速 度 排 行 榜", petList);
    });
    $("#r_speed_rank").on("click", function () {
        let petList = MonsterProfileDict.loadAll();
        petList = sortBySpeed(petList, true);
        doRender("速 度 （垫 底） 排 行 榜", petList);
    });
    $("#capacity_rank").on("click", function () {
        let petList = MonsterProfileDict.loadAll();
        petList = sortByCapacity(petList);
        doRender("能 力 排 行 榜", petList);
    });
    $("#r_capacity_rank").on("click", function () {
        let petList = MonsterProfileDict.loadAll();
        petList = sortByCapacity(petList, true);
        doRender("能 力 （垫 底） 排 行 榜", petList);
    });
}

function doBindSearchButton() {
    $("#searchSpellButton").on("click", () => {
        const t = $("#spellName").val();
        if (t === undefined) {
            return;
        }
        const spellName = (t as string).trim();
        if (spellName === "") {
            return;
        }
        const petList = MonsterProfileDict.findBySpellName(spellName);
        petList.sort((a, b) => a.code!.localeCompare(b.code!));
        doRender("技 能 （" + spellName + "）", petList, true);
    });
}

function doBindPetDetailButton() {
    $("#petDetailButton").on("click", () => {
        const t = $("#spellName").val();
        if (t === undefined) {
            return;
        }
        const petCode = (t as string).trim();
        if (petCode === "") {
            return;
        }
        const profile = MonsterProfileDict.load(petCode);
        if (profile === null) {
            return;
        }
        doRenderPetDetail(profile);
    });
}

function doRenderPetDetail(pet: MonsterProfile) {
    let html = "";
    html += "<table style='border-width:0;background-color:#888888;margin:auto;width:100%'>";
    html += "<tbody style='background-color:#F8F0E0;text-align:center'>";
    html += "<tr>";
    html += "<td style='background-color:darkred;color:wheat;font-weight:bold' colspan='20'>";
    html += "＜ " + pet.nameHtml + " ＞";
    html += "</td>";
    html += "<tr>";
    html += "<th style='background-color:#E8E8D0'>形象</th>";
    html += "<th style='background-color:#EFE0C0'>名字</th>";
    html += "<th style='background-color:#E0D0B0'>总族值</th>";
    html += "<th style='background-color:#EFE0C0'>生命族值</th>";
    html += "<th style='background-color:#E0D0B0'>攻击族值</th>";
    html += "<th style='background-color:#E0D0B0'>防御族值</th>";
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
    html += "<th style='background-color:#E8E8D0'>最大能力</th>";
    html += "</tr>";

    html += "<tr>";
    html += "<td style='background-color:#E8E8D0' rowspan='3'>";
    html += pet.imageHtml;
    html += "</td>";
    html += "<td style='background-color:#EFE0C0' rowspan='2'>" + pet.nameHtml + "</td>";
    html += "<td style='background-color:#E0D0B0;font-weight:bold;color:blue'  rowspan='2'>" + pet.totalBaseStats + "</td>";
    html += "<td style='background-color:#EFE0C0'>" + pet.healthBaseStats + "</td>";
    html += "<td style='background-color:#E0D0B0'>" + pet.attackBaseStats + "</td>";
    html += "<td style='background-color:#E0D0B0'>" + pet.defenseBaseStats + "</td>";
    html += "<td style='background-color:#EFE0C0'>" + pet.specialAttackBaseStats + "</td>";
    html += "<td style='background-color:#EFE0C0'>" + pet.specialDefenseBaseStats + "</td>";
    html += "<td style='background-color:#E0D0B0'>" + pet.speedBaseStats + "</td>";
    html += "<td style='background-color:#E0D0B0;font-weight:bold;color:green' rowspan='2'>" + pet.totalEffort + "</td>";
    html += "<td style='background-color:#EFE0C0' rowspan='2'>" + pet.healthEffort + "</td>";
    html += "<td style='background-color:#E0D0B0' rowspan='2'>" + pet.attackEffort + "</td>";
    html += "<td style='background-color:#E0D0B0' rowspan='2'>" + pet.defenseEffort + "</td>";
    html += "<td style='background-color:#EFE0C0' rowspan='2'>" + pet.specialAttackEffort + "</td>";
    html += "<td style='background-color:#EFE0C0' rowspan='2'>" + pet.specialDefenseEffort + "</td>";
    html += "<td style='background-color:#E0D0B0' rowspan='2'>" + pet.speedEffort + "</td>";
    html += "<td style='background-color:#EFE0C0' rowspan='2'>" + pet.catchRatio + "</td>";
    html += "<td style='background-color:#EFE0C0' rowspan='2'>" + pet.growExperience + "</td>";
    html += "<td style='background-color:#E8E8D0' rowspan='2'>" + pet.perfectCapacity + "</td>";
    html += "</tr>";
    html += "<tr>";
    html += "<td style='background-color:#EFE0C0'>" + pet.perfectHealth + "</td>";
    html += "<td style='background-color:#E0D0B0'>" + pet.perfectAttack + "</td>";
    html += "<td style='background-color:#E0D0B0'>" + pet.perfectDefense + "</td>";
    html += "<td style='background-color:#EFE0C0'>" + pet.perfectSpecialAttack + "</td>";
    html += "<td style='background-color:#EFE0C0'>" + pet.perfectSpecialDefense + "</td>";
    html += "<td style='background-color:#E0D0B0'>" + pet.perfectSpeed + "</td>";
    html += "</tr>";
    html += "<tr>";
    html += "<td style='background-color:#EFE0C0;text-align:left' colspan='18'>";
    html += pet.spellText;
    html += "</td>";
    html += "</tr>";

    html += "</tbody>";
    html += "</table>";
    $("#pet_rank_cell").html(html).parent().show();
}

function doRender(title: string, petList: MonsterProfile[], allPet?: boolean) {
    let html = "";
    html += "<table style='border-width:0;background-color:#888888;margin:auto;width:100%'>";
    html += "<tbody style='background-color:#F8F0E0;text-align:center'>";
    html += "<tr>";
    html += "<td style='background-color:darkred;color:wheat;font-weight:bold' colspan='20'>";
    html += "＜ " + title + " ＞";
    html += "</td>";
    html += "<tr>";
    html += "<th style='background-color:#E8E8D0'>排名</th>";
    html += "<th style='background-color:#E8E8D0'>形象</th>";
    html += "<th style='background-color:#EFE0C0'>名字</th>";
    html += "<th style='background-color:#E0D0B0'>总族值</th>";
    html += "<th style='background-color:#EFE0C0'>生命族值</th>";
    html += "<th style='background-color:#E0D0B0'>攻击族值</th>";
    html += "<th style='background-color:#E0D0B0'>防御族值</th>";
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
    html += "<th style='background-color:#E8E8D0'>最大能力</th>";
    html += "</tr>";

    let max = 30;
    if (allPet !== undefined) {
        max = petList.length;
    }
    for (let i = 0; i < max; i++) {
        const pet = petList[i];
        html += "<tr>";
        html += "<th style='background-color:#E8E8D0' rowspan='2'>" + (i + 1) + "</th>";
        html += "<td style='background-color:#E8E8D0' rowspan='2'>";
        html += pet.imageHtml;
        html += "</td>";
        html += "<td style='background-color:#EFE0C0'>" + pet.nameHtml + "</td>";
        html += "<td style='background-color:#E0D0B0;font-weight:bold;color:blue'>" + pet.totalBaseStats + "</td>";
        html += "<td style='background-color:#EFE0C0'>" + pet.healthBaseStats + "</td>";
        html += "<td style='background-color:#E0D0B0'>" + pet.attackBaseStats + "</td>";
        html += "<td style='background-color:#E0D0B0'>" + pet.defenseBaseStats + "</td>";
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
        html += "<td style='background-color:#E8E8D0'>" + pet.perfectCapacity + "</td>";
        html += "</tr>";

        html += "<tr>";
        html += "<td style='background-color:#EFE0C0;text-align:left' colspan='18'>";
        html += pet.spellText;
        html += "</td>";
        html += "</tr>";
    }

    html += "</tbody>";
    html += "</table>";
    $("#pet_rank_cell").html(html).parent().show();
}

function sortByTotalBaseStats(petList: MonsterProfile[], reverse?: boolean): MonsterProfile[] {
    const result: MonsterProfile[] = [];
    result.push(...petList);
    if (reverse) {
        result.sort((a, b) => {
            let ret = a.totalBaseStats - b.totalBaseStats;
            if (ret !== 0) {
                return ret;
            }
            ret = a.totalEffort - b.totalEffort;
            if (ret !== 0) {
                return ret;
            }
            return a.code!.localeCompare(b.code!);
        });
    } else {
        result.sort((a, b) => {
            let ret = b.totalBaseStats - a.totalBaseStats;
            if (ret !== 0) {
                return ret;
            }
            ret = b.totalEffort - a.totalEffort;
            if (ret !== 0) {
                return ret;
            }
            return a.code!.localeCompare(b.code!);
        });
    }
    return result;
}

function sortByHealth(petList: MonsterProfile[], reverse?: boolean): MonsterProfile[] {
    const result: MonsterProfile[] = [];
    result.push(...petList);
    if (reverse) {
        result.sort((a, b) => {
            let ret = a.perfectHealth - b.perfectHealth;
            if (ret !== 0) {
                return ret;
            }
            ret = a.totalBaseStats - b.totalBaseStats;
            if (ret !== 0) {
                return ret;
            }
            return a.code!.localeCompare(b.code!);
        });
    } else {
        result.sort((a, b) => {
            let ret = b.perfectHealth - a.perfectHealth;
            if (ret !== 0) {
                return ret;
            }
            ret = b.totalBaseStats - a.totalBaseStats;
            if (ret !== 0) {
                return ret;
            }
            return a.code!.localeCompare(b.code!);
        });
    }
    return result;
}

function sortByAttack(petList: MonsterProfile[], reverse?: boolean): MonsterProfile[] {
    const result: MonsterProfile[] = [];
    result.push(...petList);
    if (reverse) {
        result.sort((a, b) => {
            let ret = a.perfectAttack - b.perfectAttack;
            if (ret !== 0) {
                return ret;
            }
            ret = a.totalBaseStats - b.totalBaseStats;
            if (ret !== 0) {
                return ret;
            }
            return a.code!.localeCompare(b.code!);
        });
    } else {
        result.sort((a, b) => {
            let ret = b.perfectAttack - a.perfectAttack;
            if (ret !== 0) {
                return ret;
            }
            ret = b.totalBaseStats - a.totalBaseStats;
            if (ret !== 0) {
                return ret;
            }
            return a.code!.localeCompare(b.code!);
        });
    }
    return result;
}

function sortByDefense(petList: MonsterProfile[], reverse?: boolean): MonsterProfile[] {
    const result: MonsterProfile[] = [];
    result.push(...petList);
    if (reverse) {
        result.sort((a, b) => {
            let ret = a.perfectDefense - b.perfectDefense;
            if (ret !== 0) {
                return ret;
            }
            ret = a.totalBaseStats - b.totalBaseStats;
            if (ret !== 0) {
                return ret;
            }
            return a.code!.localeCompare(b.code!);
        });
    } else {
        result.sort((a, b) => {
            let ret = b.perfectDefense - a.perfectDefense;
            if (ret !== 0) {
                return ret;
            }
            ret = b.totalBaseStats - a.totalBaseStats;
            if (ret !== 0) {
                return ret;
            }
            return a.code!.localeCompare(b.code!);
        });
    }
    return result;
}

function sortBySpecialAttack(petList: MonsterProfile[], reverse?: boolean): MonsterProfile[] {
    const result: MonsterProfile[] = [];
    result.push(...petList);
    if (reverse) {
        result.sort((a, b) => {
            let ret = a.perfectSpecialAttack - b.perfectSpecialAttack;
            if (ret !== 0) {
                return ret;
            }
            ret = a.totalBaseStats - b.totalBaseStats;
            if (ret !== 0) {
                return ret;
            }
            return a.code!.localeCompare(b.code!);
        });
    } else {
        result.sort((a, b) => {
            let ret = b.perfectSpecialAttack - a.perfectSpecialAttack;
            if (ret !== 0) {
                return ret;
            }
            ret = b.totalBaseStats - a.totalBaseStats;
            if (ret !== 0) {
                return ret;
            }
            return a.code!.localeCompare(b.code!);
        });
    }
    return result;
}

function sortBySpecialDefense(petList: MonsterProfile[], reverse?: boolean): MonsterProfile[] {
    const result: MonsterProfile[] = [];
    result.push(...petList);
    if (reverse) {
        result.sort((a, b) => {
            let ret = a.perfectSpecialDefense - b.perfectSpecialDefense;
            if (ret !== 0) {
                return ret;
            }
            ret = a.totalBaseStats - b.totalBaseStats;
            if (ret !== 0) {
                return ret;
            }
            return a.code!.localeCompare(b.code!);
        });
    } else {
        result.sort((a, b) => {
            let ret = b.perfectSpecialDefense - a.perfectSpecialDefense;
            if (ret !== 0) {
                return ret;
            }
            ret = b.totalBaseStats - a.totalBaseStats;
            if (ret !== 0) {
                return ret;
            }
            return a.code!.localeCompare(b.code!);
        });
    }
    return result;
}

function sortBySpeed(petList: MonsterProfile[], reverse?: boolean): MonsterProfile[] {
    const result: MonsterProfile[] = [];
    result.push(...petList);
    if (reverse) {
        result.sort((a, b) => {
            let ret = a.perfectSpeed - b.perfectSpeed;
            if (ret !== 0) {
                return ret;
            }
            ret = a.totalBaseStats - b.totalBaseStats;
            if (ret !== 0) {
                return ret;
            }
            return a.code!.localeCompare(b.code!);
        });
    } else {
        result.sort((a, b) => {
            let ret = b.perfectSpeed - a.perfectSpeed;
            if (ret !== 0) {
                return ret;
            }
            ret = b.totalBaseStats - a.totalBaseStats;
            if (ret !== 0) {
                return ret;
            }
            return a.code!.localeCompare(b.code!);
        });
    }
    return result;
}

function sortByCapacity(petList: MonsterProfile[], reverse?: boolean): MonsterProfile[] {
    const result: MonsterProfile[] = [];
    result.push(...petList);
    if (reverse) {
        result.sort((a, b) => {
            let ret = a.perfectCapacity - b.perfectCapacity;
            if (ret !== 0) {
                return ret;
            }
            ret = a.totalBaseStats - b.totalBaseStats;
            if (ret !== 0) {
                return ret;
            }
            return a.code!.localeCompare(b.code!);
        });
    } else {
        result.sort((a, b) => {
            let ret = b.perfectCapacity - a.perfectCapacity;
            if (ret !== 0) {
                return ret;
            }
            ret = b.totalBaseStats - a.totalBaseStats;
            if (ret !== 0) {
                return ret;
            }
            return a.code!.localeCompare(b.code!);
        });
    }
    return result;
}

export = TownPetRankHousePageProcessor;