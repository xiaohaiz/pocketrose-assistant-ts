import PageProcessor from "../PageProcessor";
import PageUtils from "../../util/PageUtils";
import CareerParser from "../../pocket/CareerParser";
import Credential from "../../util/Credential";
import NpcLoader from "../../pocket/NpcLoader";
import CommentBoard from "../../util/CommentBoard";
import Role from "../../pocket/Role";
import RoleLoader from "../../pocket/RoleLoader";

class PersonalCareerManagementProcessor extends PageProcessor {

    process() {
        PageUtils.removeUnusedHyperLinks();
        PageUtils.removeGoogleAnalyticsScript();
        const credential = PageUtils.currentCredential();
        const candidateList = CareerParser.parseCareerTransferCandidateList(this.pageHtml);
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

export = PersonalCareerManagementProcessor;
