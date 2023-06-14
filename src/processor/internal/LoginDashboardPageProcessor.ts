import _ from "lodash";
import SetupLoader from "../../core/config/SetupLoader";
import LastLogin from "../../core/team/LastLogin";
import TeamMember from "../../core/team/TeamMember";
import TeamMemberLoader from "../../core/team/TeamMemberLoader";
import TeamStorages from "../../core/team/TeamStorages";
import ButtonUtils from "../../util/ButtonUtils";
import PageUtils from "../../util/PageUtils";
import PageProcessor from "../PageProcessor";

class LoginDashboardPageProcessor implements PageProcessor {

    process(): void {
        ButtonUtils.loadButtonStyle(10028);
        PageUtils.fixCurrentPageBrokenImages();
        PageUtils.removeUnusedHyperLinks();
        PageUtils.removeGoogleAnalyticsScript();

        $("table")
            .each((idx, table) => {
                const tableId = "t" + idx;
                $(table).attr("id", tableId);
            });

        $("img:first")
            .attr("width", "64")
            .attr("height", "48");

        const layout = SetupLoader.getLoginPageLayout();
        switch (layout) {
            case 1:
                $("#t0")
                    .find("td:first")
                    .css("vertical-align", "top");
                $("#t1")
                    .css("margin", "0px auto auto auto");
                break;
            case 2:
                $("#t0")
                    .find("td:first")
                    .css("vertical-align", "bottom");
                $("#t1")
                    .css("margin", "auto auto 0px auto");
                break;
            case 3:
                $("#t1")
                    .css("margin", "auto auto auto 0px");
                break;
            case 4:
                $("#t1")
                    .css("margin", "auto 0px auto auto");
                break;
            case 5:
                $("#t0")
                    .find("td:first")
                    .css("vertical-align", "top");
                $("#t1")
                    .css("margin", "0px auto auto 0px");
                break;
            case 6:
                $("#t0")
                    .find("td:first")
                    .css("vertical-align", "bottom");
                $("#t1")
                    .css("margin", "auto auto 0px 0px");
                break;
            case 7:
                $("#t0")
                    .find("td:first")
                    .css("vertical-align", "top");
                $("#t1")
                    .css("margin", "0px 0px auto auto");
                break;
            case 8:
                $("#t0")
                    .find("td:first")
                    .css("vertical-align", "bottom");
                $("#t1")
                    .css("margin", "auto 0px 0px auto");
                break;
        }

        doProcess();
    }

}

function doProcess() {
    const members = new Map<number, TeamMember>();
    TeamMemberLoader.loadTeamMembers().forEach(it => members.set(it.index!, it));
    if (members.size === 0) return;

    $("input:text[name='id']").attr("id", "loginId");
    $("input:password[name='pass']").attr("id", "loginPass");
    $("input:submit[value='登陆']").attr("id", "loginButton");
    $("form").attr("id", "loginForm");

    let html = "";
    html += "<tr>";
    html += "<td id='fastLogin' style='background-color:#E8E8D0;text-align:center' colspan='2'></td>"
    html += "</tr>";
    $("#loginButton")
        .closest("tr")
        .after($(html));

    TeamStorages.lastLoginStorage
        .load()
        .then(lastLogin => {
            doRender(members, lastLogin);
        });
}

function doRender(members: Map<number, TeamMember>, lastLogin: LastLogin | null) {
    const fastLoginCounts: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    let html = "";
    html += "<table style='border-width:0;margin:auto;text-align:center;width:100%'>";
    html += "<tbody>";
    html += "</tbody>";
    html += "<tr>";
    html += "<td colspan='5' style='color:navy;font-weight:bold'>快速登陆时请自行输入图形验证码</td>";
    html += "</tr>";
    html += "<tr id='tr1'>";
    for (let i = 0; i < 5; i++) {
        html += doGenerateCell(lastLogin, members, i, () => {
            fastLoginCounts[0]++;
        });
    }
    html += "</tr>";
    html += "<tr id='tr2'>";
    for (let i = 5; i < 10; i++) {
        html += doGenerateCell(lastLogin, members, i, () => {
            fastLoginCounts[1]++;
        });
    }
    html += "</tr>";

    html += "<tr id='tr3'>";
    for (let i = 10; i < 15; i++) {
        html += doGenerateCell(lastLogin, members, i, () => {
            fastLoginCounts[2]++;
        });
    }
    html += "</tr>";
    html += "<tr id='tr4'>";
    for (let i = 15; i < 20; i++) {
        html += doGenerateCell(lastLogin, members, i, () => {
            fastLoginCounts[3]++;
        });
    }
    html += "</tr>";

    html += "<tr id='tr5'>";
    for (let i = 20; i < 25; i++) {
        html += doGenerateCell(lastLogin, members, i, () => {
            fastLoginCounts[4]++;
        });
    }
    html += "</tr>";
    html += "<tr id='tr6'>";
    for (let i = 25; i < 30; i++) {
        html += doGenerateCell(lastLogin, members, i, () => {
            fastLoginCounts[5]++;
        });
    }
    html += "</tr>";

    html += "<tr id='tr7'>";
    for (let i = 30; i < 35; i++) {
        html += doGenerateCell(lastLogin, members, i, () => {
            fastLoginCounts[6]++;
        });
    }
    html += "</tr>";
    html += "<tr id='tr8'>";
    for (let i = 35; i < 40; i++) {
        html += doGenerateCell(lastLogin, members, i, () => {
            fastLoginCounts[7]++;
        });
    }
    html += "</tr>";

    html += "<tr id='tr9'>";
    for (let i = 40; i < 45; i++) {
        html += doGenerateCell(lastLogin, members, i, () => {
            fastLoginCounts[8]++;
        });
    }
    html += "</tr>";
    html += "<tr id='tr10'>";
    for (let i = 45; i < 50; i++) {
        html += doGenerateCell(lastLogin, members, i, () => {
            fastLoginCounts[9]++;
        });
    }
    html += "</tr>";


    html += "</table>";

    $("#fastLogin").html(html);

    for (let i = 0; i < fastLoginCounts.length; i++) {
        const fastLoginCount = fastLoginCounts[i];
        if (fastLoginCount === 0) {
            $("#tr" + (i + 1)).hide();
        }
    }

    doBindFastLoginButton();
}

function doGenerateCell(lastLogin: LastLogin | null, members: Map<number, TeamMember>, code: number, handler?: () => void) {
    let count = 0;
    let html = "";

    let lastRoleId = "";
    if (lastLogin !== null) {
        lastRoleId = lastLogin.roleId!;
    }
    html += "<td style='background-color:#E8E8D0;width:20%;height:32px'>";
    let member = members.get(code);
    if (member) {
        count++;
        const name = member.name!;
        if (lastRoleId === member.id) {
            html += "<input type='button' class='fastLoginButton button-10028' " +
                "id='fastLogin_" + code + "' value='" + name + "' " +
                "style='color:red;width:100%'>";
        } else {
            html += "<input type='button' class='fastLoginButton button-10028' " +
                "id='fastLogin_" + code + "' value='" + name + "' " +
                "style='width:100%'>";
        }
    }
    html += "</td>";
    if (count > 0 && handler !== undefined) {
        handler();
    }
    return html;
}

function doBindFastLoginButton() {
    $(".fastLoginButton").on("click", event => {
        const s = _.split($(event.target).attr("id") as string, "_");
        const index = _.parseInt(s[1]);
        const member = TeamMemberLoader.loadTeamMember(index);
        if (!member) return;

        // 记录最后一次使用快速登陆的id
        const lastRoleId = member.id!;
        TeamStorages.lastLoginStorage
            .write(lastRoleId)
            .then(() => {
                $("#loginId").val(member.id!);
                $("#loginPass").val(member.pass!);

                $("#loginForm").removeAttr("onsubmit");
                $("#loginButton").trigger("click");
            });
    });
}

export = LoginDashboardPageProcessor;