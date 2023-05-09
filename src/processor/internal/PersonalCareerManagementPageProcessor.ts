import Role from "../../common/Role";
import NpcLoader from "../../core/NpcLoader";
import SetupLoader from "../../core/SetupLoader";
import CareerLoader from "../../pocket/CareerLoader";
import CareerParser from "../../pocket/CareerParser";
import RoleLoader from "../../pocket/RoleLoader";
import Spell from "../../pocket/Spell";
import SpellLoader from "../../pocket/SpellLoader";
import CommentBoard from "../../util/CommentBoard";
import Credential from "../../util/Credential";
import MessageBoard from "../../util/MessageBoard";
import NetworkUtils from "../../util/NetworkUtils";
import PageProcessorContext from "../PageProcessorContext";
import PageProcessorCredentialSupport from "../PageProcessorCredentialSupport";

class PersonalCareerManagementPageProcessor extends PageProcessorCredentialSupport {

    doProcess(credential: Credential, context?: PageProcessorContext): void {
        const pageHtml = document.documentElement.outerHTML;
        const candidateList = CareerParser.parseCareerTransferCandidateList(pageHtml);
        doProcess(credential, candidateList);
    }

}

function doProcess(credential: Credential, candidateList: string[]) {
    $("table:first td:first").removeAttr("bgcolor");
    $("table:first td:first").removeAttr("height");
    $("table:first td:first").css("text-align", "center");
    $("table:first td:first").css("font-size", "150%");
    $("table:first td:first").css("font-weight", "bold");
    $("table:first td:first").css("background-color", "navy");
    $("table:first td:first").css("color", "greenyellow");
    $("table:first td:first").text("＜＜　 职 业 管 理 　＞＞");

    $("table:first tr:first").next().find("table:first td:first")
        .next().next().next().attr("id", "roleStatus");

    $("img[alt='神官']").parent().prev().attr("id", "messageBoard");
    $("img[alt='神官']").parent().prev().css("color", "white");

    $("table:first").removeAttr("height");
    $("table:first tr:first")
        .next().next().next()
        .html("<td style='background-color:#F8F0E0'>" +
            "<div id='CareerUI'></div><div id='Eden' style='display:none'></div>" +
            "</td>");

    $("#Eden").html("" +
        "<form action='' method='post' id='edenForm'>" +
        "        <input type='hidden' name='id' value='" + credential.id + "'>" +
        "        <input type='hidden' name='pass' value='" + credential.pass + "'>" +
        "        <div id='edenFormPayload' style='display:none'></div>" +
        "        <input type='submit' id='edenSubmit'>" +
        "</form>");

    $("table:first tr:first")
        .next().next().next()
        .after($("<tr><td style='background-color:#F8F0E0;text-align:center'>" +
            "<input type='button' value='返回城市' id='returnButton'>" +
            "<input type='button' value='装备管理' id='itemManagementButton'>" +
            "</td></tr>"));

    $("#returnButton").on("click", function () {
        $("#edenForm").attr("action", "status.cgi");
        $("#edenFormPayload").html("<input type='hidden' name='mode' value='STATUS'>");
        $("#edenSubmit").trigger("click");
    });
    $("#itemManagementButton").on("click", function () {
        $("#edenForm").attr("action", "mydata.cgi");
        $("#edenFormPayload").html("<input type='hidden' name='mode' value='USE_ITEM'>");
        $("#edenSubmit").trigger("click");
    });

    const imageHtml = NpcLoader.getNpcImageHtml("白皇");
    CommentBoard.createCommentBoard(imageHtml!);
    CommentBoard.writeMessage("是的，你没有看错，换人了，某幕后黑手不愿意出镜。不过请放心，转职方面我是专业的，毕竟我一直制霸钉耙榜。<br>");
    CommentBoard.writeMessage("蓝色的职业代表你已经掌握了。我会把为你推荐的职业红色加深标识出来，当然，前提是如果有能推荐的。<br>");

    doRender(credential, candidateList);
}

function doRender(credential: Credential, candidateList: string[]) {
    let html = "";
    html += "<table style='background-color:#888888;width:100%;text-align:center'>";
    html += "<tbody style='background-color:#F8F0E0'>";
    html += "<tr>";
    html += "<td id='spellCell'>";
    html += "</td>";
    html += "</tr>";
    html += "<tr>";
    html += "<td id='careerCell'>";
    html += "</td>";
    html += "</tr>";
    html += "</toby>";
    html += "</table>";
    $("#CareerUI").html(html);

    new RoleLoader(credential).load()
        .then(role => {
            doRenderRoleStatus(role);

            if (role.level! > 50) {
                doRenderCareer(credential, role, candidateList);
                doBindCareerButton(credential);
            }

            new SpellLoader(credential).load()
                .then(spellList => {
                    doRenderSpell(credential, role, spellList);
                    doBindSpellButton(credential, spellList);
                });
        });
}

function doRenderRoleStatus(role: Role) {
    let html = "";
    html += "<table style='background-color:#888888;border-width:0'>";
    html += "<tbody>";
    html += "<tr>";
    html += "<th style='background-color:#E8E8D0'>姓名</th>"
    html += "<th style='background-color:#E0D0B0'>ＬＶ</th>"
    html += "<th style='background-color:#EFE0C0'>ＨＰ</th>"
    html += "<th style='background-color:#E8E8D0'>ＭＰ</th>"
    html += "<th style='background-color:#EFE0C0'>攻击</th>"
    html += "<th style='background-color:#EFE0C0'>防御</th>"
    html += "<th style='background-color:#EFE0C0'>智力</th>"
    html += "<th style='background-color:#EFE0C0'>精神</th>"
    html += "<th style='background-color:#EFE0C0'>速度</th>"
    html += "<th style='background-color:#E0D0B0'>属性</th>"
    html += "<th style='background-color:#E8E8D0'>职业</th>"
    html += "</tr>";
    html += "<tr>";
    html += "<td style='background-color:#E8E8D0'>" + role.name + "</td>"
    html += "<td style='background-color:#E0D0B0'>" + role.level + "</td>"
    html += "<td style='background-color:#EFE0C0'>" + role.health + "/" + role.maxHealth + "</td>"
    html += "<td style='background-color:#E8E8D0'>" + role.mana + "/" + role.maxMana + "</td>"
    html += "<td style='background-color:#EFE0C0'>" + role.attack + "</td>"
    html += "<td style='background-color:#EFE0C0'>" + role.defense + "</td>"
    html += "<td style='background-color:#EFE0C0'>" + role.specialAttack + "</td>"
    html += "<td style='background-color:#EFE0C0'>" + role.specialDefense + "</td>"
    html += "<td style='background-color:#EFE0C0'>" + role.speed + "</td>"
    html += "<td style='background-color:#E0D0B0'>" + role.attribute + "</td>"
    html += "<td style='background-color:#E8E8D0'>" + role.career + "</td>"
    html += "</tr>";
    html += "</tbody>";
    html += "</table>";

    $("#roleStatus").html(html);
}

function doRenderCareer(credential: Credential, role: Role, careerCandidateList: string[]) {
    let html = "";
    html += "<table style='background-color:#888888;width:100%;text-align:center'>";
    html += "<tbody style='background-color:#F8F0E0'>";
    html += "<tr>";
    html += "<th colspan='7' style='background-color:#E8E8D0;color:navy;text-align:center;font-weight:bold;font-size:120%'>＜＜ 选 择 新 的 职 业 ＞＞</th>";
    html += "</tr>";

    html += "<tr>";
    html += "<th style='background-color:#E8E8D0'>战士系</th>";
    html += "<td style='background-color:#EFE0C0;text-align:left'>" +
        "<input type='button' class='CareerUIButton' id='career_0' value='兵士'>" +
        "<input type='button' class='CareerUIButton' id='career_1' value='武士'>" +
        "<input type='button' class='CareerUIButton' id='career_2' value='剑客'>" +
        "<input type='button' class='CareerUIButton' id='career_3' value='剑侠'>" +
        "<input type='button' class='CareerUIButton' id='career_4' value='魔法剑士'>" +
        "<input type='button' class='CareerUIButton' id='career_5' value='暗黑剑士'>" +
        "<input type='button' class='CareerUIButton' id='career_6' value='奥法剑士'>" +
        "<input type='button' class='CareerUIButton' id='career_7' value='魔导剑士'>" +
        "<input type='button' class='CareerUIButton' id='career_8' value='神圣剑士'>" +
        "<input type='button' class='CareerUIButton' id='career_9' value='圣殿武士'>" +
        "<input type='button' class='CareerUIButton' id='career_10' value='剑圣'>" +
        "</td>";
    html += "</tr>";

    html += "<tr>";
    html += "<th style='background-color:#E8E8D0'>枪系</th>";
    html += "<td style='background-color:#EFE0C0;text-align:left'>" +
        "<input type='button' class='CareerUIButton' id='career_11' value='枪战士'>" +
        "<input type='button' class='CareerUIButton' id='career_12' value='重战士'>" +
        "<input type='button' class='CareerUIButton' id='career_13' value='狂战士'>" +
        "<input type='button' class='CareerUIButton' id='career_14' value='龙战士'>" +
        "</td>";
    html += "</tr>";

    html += "<tr>";
    html += "<th style='background-color:#E8E8D0'>格斗系</th>";
    html += "<td style='background-color:#EFE0C0;text-align:left'>" +
        "<input type='button' class='CareerUIButton' id='career_15' value='武僧'>" +
        "<input type='button' class='CareerUIButton' id='career_16' value='决斗家'>" +
        "<input type='button' class='CareerUIButton' id='career_17' value='拳王'>" +
        "</td>";
    html += "</tr>";

    html += "<tr>";
    html += "<th style='background-color:#E8E8D0'>魔术系</th>";
    html += "<td style='background-color:#EFE0C0;text-align:left'>" +
        "<input type='button' class='CareerUIButton' id='career_18' value='术士'>" +
        "<input type='button' class='CareerUIButton' id='career_19' value='魔法师'>" +
        "<input type='button' class='CareerUIButton' id='career_20' value='咒灵师'>" +
        "<input type='button' class='CareerUIButton' id='career_21' value='大魔导士'>" +
        "</td>";
    html += "</tr>";

    html += "<tr>";
    html += "<th style='background-color:#E8E8D0'>祭司系</th>";
    html += "<td style='background-color:#EFE0C0;text-align:left'>" +
        "<input type='button' class='CareerUIButton' id='career_22' value='牧师'>" +
        "<input type='button' class='CareerUIButton' id='career_23' value='德鲁伊'>" +
        "<input type='button' class='CareerUIButton' id='career_24' value='贤者'>" +
        "</td>";
    html += "</tr>";

    html += "<tr>";
    html += "<th style='background-color:#E8E8D0'>弓矢系</th>";
    html += "<td style='background-color:#EFE0C0;text-align:left'>" +
        "<input type='button' class='CareerUIButton' id='career_25' value='弓箭士'>" +
        "<input type='button' class='CareerUIButton' id='career_26' value='魔弓手'>" +
        "<input type='button' class='CareerUIButton' id='career_27' value='狙击手'>" +
        "</td>";
    html += "</tr>";

    html += "<tr>";
    html += "<th style='background-color:#E8E8D0'>游侠系</th>";
    html += "<td style='background-color:#EFE0C0;text-align:left'>" +
        "<input type='button' class='CareerUIButton' id='career_28' value='游侠'>" +
        "<input type='button' class='CareerUIButton' id='career_29' value='巡林客'>" +
        "<input type='button' class='CareerUIButton' id='career_30' value='吟游诗人'>" +
        "</td>";
    html += "</tr>";

    html += "<tr>";
    html += "<th style='background-color:#E8E8D0'>天位系</th>";
    html += "<td style='background-color:#EFE0C0;text-align:left'>" +
        "<input type='button' class='CareerUIButton' id='career_31' value='小天位'>" +
        "<input type='button' class='CareerUIButton' id='career_32' value='强天位'>" +
        "<input type='button' class='CareerUIButton' id='career_33' value='斋天位'>" +
        "<input type='button' class='CareerUIButton' id='career_34' value='太天位'>" +
        "<input type='button' class='CareerUIButton' id='career_35' value='终极'>" +
        "</td>";
    html += "</tr>";

    html += "</toby>";
    html += "</table>";

    $("#careerCell").html(html);

    // 已经掌握的职业用蓝色标记
    // 没有掌握的职业用红色标记（满级的情况下）
    // 不在转职列表中的按钮删除
    // 当前职业绿色显示
    if (role.masterCareerList!.includes("小天位")) {
        $("#career_32").css("color", "blue");
        $("#career_33").css("color", "blue");
        $("#career_34").css("color", "blue");
        $("#career_35").css("color", "blue");
    }
    const careerNames = Object.keys(CareerLoader.loadCareers());
    for (let i = 0; i < careerNames.length; i++) {
        const careerName = careerNames[i];
        // @ts-ignore
        const careerId = CareerLoader.loadCareers()[careerName]["id"];
        const buttonId = "career_" + careerId;
        if (role.masterCareerList!.includes(careerName)) {
            $("#" + buttonId).css("color", "blue");
        } else {
            if (role.level! >= 150) {
                if (careerName === role.career) {
                    $("#" + buttonId).css("color", "green");
                    $("#" + buttonId).css("font-weight", "bold");
                } else {
                    $("#" + buttonId).css("color", "red");
                    $("#" + buttonId).css("font-weight", "bold");
                }
            }
        }
        if (!careerCandidateList.includes(careerName)) {
            $("#" + buttonId).prop("disabled", true);
            $("#" + buttonId).css("color", "grey");
            $("#" + buttonId).css("font-weight", "normal");
        }
    }

    // 推荐计算
    const recommendations = doCalculateRecommendationCareers(role, careerCandidateList);
    if (recommendations.length > 0) {
        for (const recommendation of recommendations) {
            // @ts-ignore
            const careerId = CareerLoader.loadCareers()[recommendation]["id"];
            const buttonId = "career_" + careerId;
            if (recommendation === role.career) {
                $("#" + buttonId).css("color", "green");
                $("#" + buttonId).css("font-weight", "bold");
            } else {
                $("#" + buttonId).css("color", "red");
                $("#" + buttonId).css("font-weight", "bold");
            }
        }
    }

    if (SetupLoader.isCareerTransferEntranceDisabled(credential.id)) {
        // 转职入口被关闭了，那就禁止所有的转职按钮。
        for (let i = 0; i < careerNames.length; i++) {
            const careerName = careerNames[i];
            // @ts-ignore
            const careerId = CareerLoader.loadCareers()[careerName]["id"];
            const buttonId = "career_" + careerId;
            $("#" + buttonId).prop("disabled", true);
            $("#" + buttonId).css("color", "grey");
            $("#" + buttonId).css("font-weight", "normal");
        }
    }
}

function doRenderSpell(credential: Credential, role: Role, spellList: Spell[]) {
    let html = "";
    html += "<table style='background-color:#888888;width:100%;text-align:center'>";
    html += "<tbody style='background-color:#F8F0E0'>";
    html += "<tr>";
    html += "<th colspan='7' style='background-color:#E8E8D0;color:navy;text-align:center;font-weight:bold;font-size:120%'>＜＜ 设 置 技 能 ＞＞</th>";
    html += "</tr>";
    html += "<tr>";
    html += "<th style='background-color:#E8E8D0'>使用</th>";
    html += "<th style='background-color:#EFE0C0'>技能</th>";
    html += "<th style='background-color:#E0D0B0'>威力</th>";
    html += "<th style='background-color:#EFE0C0'>确率</th>";
    html += "<th style='background-color:#E0D0B0'>ＰＰ</th>";
    html += "<th style='background-color:#EFE0C0'>评分</th>";
    html += "<th style='background-color:#E0D0B0'>设置</th>";
    html += "</tr>";
    for (const spell of spellList) {
        const using = spell.name === role.spell;
        html += "<tr>";
        html += "<td style='background-color:#E8E8D0'>" + (using ? "★" : "") + "</td>";
        html += "<td style='background-color:#EFE0C0'>" + spell.name + "</td>";
        html += "<td style='background-color:#E0D0B0'>" + spell.power + "</td>";
        html += "<td style='background-color:#EFE0C0'>" + spell.accuracy + "</td>";
        html += "<td style='background-color:#E0D0B0'>" + spell.pp + "</td>";
        html += "<td style='background-color:#EFE0C0'>" + spell.score + "</td>";
        html += "<td style='background-color:#E0D0B0'>" +
            "<input type='button' class='CareerUIButton' id='set_spell_" + spell.id + "' value='选择'>" +
            "</td>";
        html += "</tr>";
    }
    html += "</toby>";
    html += "</table>";

    $("#spellCell").html(html);

    for (const spell of spellList) {
        const using = spell.name === role.spell;
        if (using) {
            const buttonId = "set_spell_" + spell.id;
            $("#" + buttonId).prop("disabled", true);
        }
    }
}

function doRefresh(credential: Credential) {
    const request = credential.asRequest();
    // @ts-ignore
    request["mode"] = "CHANGE_OCCUPATION";
    NetworkUtils.sendPostRequest("mydata.cgi", request, function (html) {
        const careerCandidateList = CareerParser.parseCareerTransferCandidateList(html);
        $(".CareerUIButton").off("click");
        $("#CareerUI").html("");
        doRender(credential, careerCandidateList);
    });
}

function doBindCareerButton(credential: Credential) {
    const careerNames = Object.keys(CareerLoader.loadCareers());
    for (let i = 0; i < careerNames.length; i++) {
        const careerName = careerNames[i];
        // @ts-ignore
        const careerId = CareerLoader.loadCareers()[careerName]["id"];
        const buttonId = "career_" + careerId;
        if ($("#" + buttonId).length > 0 && !$("#" + buttonId).prop("disabled")) {
            $("#" + buttonId).on("click", function () {
                const careerId = parseInt(($(this).attr("id") as string).split("_")[1]);
                const careerName = CareerLoader.findCareerById(careerId);
                if (!confirm("请确认要转职到" + careerName + "？")) {
                    return;
                }
                const request = credential.asRequest();
                // @ts-ignore
                request["chara"] = "1";
                // @ts-ignore
                request["mode"] = "JOB_CHANGE";
                // @ts-ignore
                request["syoku_no"] = careerId;
                NetworkUtils.sendPostRequest("mydata.cgi", request, function (html) {
                    MessageBoard.processResponseMessage(html);
                    doRefresh(credential);
                });
            });
        }
    }
}

function doBindSpellButton(credential: Credential, spellList: Spell[]) {
    for (const spell of spellList) {
        const buttonId = "set_spell_" + spell.id;
        if ($("#" + buttonId).length > 0 && !$("#" + buttonId).prop("disabled")) {
            $("#" + buttonId).on("click", function () {
                const spellId = ($(this).attr("id") as string).split("_")[2];
                const request = credential.asRequest();
                // @ts-ignore
                request["mode"] = "MAGIC_SET";
                // @ts-ignore
                request["ktec_no"] = spellId;
                NetworkUtils.sendPostRequest("mydata.cgi", request, function (html) {
                    MessageBoard.processResponseMessage(html);
                    doRefresh(credential);
                });
            });
        }
    }
}

function doCalculateRecommendationCareers(role: Role, careerCandidateList: string[]) {
    // 没有满级，不推荐
    if (role.level! < 150) {
        return [];
    }
    // 没有掌握全部职业，不推荐
    if (role.masterCareerList!.length !== 32) {
        return [];
    }
    const recommendations: string[] = [];
    const targetCareerNames = Object.keys(CareerLoader.loadCareerTransferRequirements());
    for (let i = 0; i < targetCareerNames.length; i++) {
        const name = targetCareerNames[i];
        // @ts-ignore
        const requirement = CareerLoader.loadCareerTransferRequirements()[name];
        if (role.maxMana! >= requirement[0] &&
            role.attack! >= requirement[1] &&
            role.defense! >= requirement[2] &&
            role.specialAttack! >= requirement[3] &&
            role.specialDefense! >= requirement[4] &&
            role.speed! >= requirement[5]) {
            // 发现了可以推荐的职业
            recommendations.push(name);
        }
    }
    if (recommendations.length === 0) {
        // 没有推荐出来，那么就推荐转职列表中的最后一个吧
        recommendations.push(careerCandidateList[careerCandidateList.length - 1]);
    }
    return recommendations;
}

export = PersonalCareerManagementPageProcessor;
