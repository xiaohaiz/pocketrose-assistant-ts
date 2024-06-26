import _ from "lodash";
import TeamMemberLoader from "../../core/team/TeamMemberLoader";
import Constants from "../../util/Constants";
import Credential from "../../util/Credential";
import MessageBoard from "../../util/MessageBoard";
import PageUtils from "../../util/PageUtils";
import StorageUtils from "../../util/StorageUtils";
import StringUtils from "../../util/StringUtils";
import StatelessPageProcessorCredentialSupport from "../StatelessPageProcessorCredentialSupport";
import KeyboardShortcutBuilder from "../../util/KeyboardShortcutBuilder";
import {PocketLogger} from "../../pocket/PocketLogger";

const logger = PocketLogger.getLogger("TEAM");

class PersonalTeamManagementPageProcessor extends StatelessPageProcessorCredentialSupport {

    async doProcess(credential: Credential): Promise<void> {
        doProcess(credential);
        KeyboardShortcutBuilder.newInstance()
            .onEscapePressed(() => $("#returnButton").trigger("click"))
            .withDefaultPredicate()
            .doBind();
    }

}

function doProcess(credential: Credential) {
    $("td:first")
        .removeAttr("width")
        .removeAttr("bgcolor")
        .removeAttr("height")
        .css("text-align", "center")
        .css("font-size", "150%")
        .css("font-weight", "bold")
        .css("background-color", "navy")
        .css("color", "greenyellow")
        .attr("id", "title")
        .text("＜＜　 团 队 管 理 　＞＞");

    $("table:eq(4)")
        .find("td:first")
        .attr("id", "messageBoard")
        .removeAttr("width")
        .removeAttr("bgcolor")
        .css("width", "100%")
        .css("background-color", "black")
        .css("color", "white")
        .html("可以在这里管理团队，所有的登陆信息都只存储在你的浏览器本地，可以放心使用！");

    // 删除原有页面的所有表单
    $("form").remove();
    $("br:eq(3)").remove();
    $("br:eq(2)").remove();
    $("br:eq(1)").remove();
    $("br:eq(0)").remove();

    // 重新绘制页面内容
    let html = "";
    html += "<table style='width:100%;border-width:0;background-color:#888888'>";
    html += "<tbody>";
    html += "<tr style='display:none'>";
    html += "<td id='eden'></td>";
    html += "</tr>";
    html += "<tr>";
    html += "<td id='fastLoginSetup'></td>";
    html += "</tr>";
    html += "<tr>";
    html += "<td style='background-color:#F8F0E0;text-align:center'>";
    html += "<input type='button' id='returnButton' value='离开团队管理'>";
    html += "</td>";
    html += "</tr>";
    html += "</tbody>";
    html += "</table>";
    $("table:first").after($(html));

    doGenerateEdenForm(credential);
    doBindReturnButton();

    doRender();
}

function doGenerateEdenForm(credential: Credential) {
    let html = "";
    // noinspection HtmlUnknownTarget
    html += "<form action='status.cgi' method='post' id='returnForm'>";
    html += "<input type='hidden' name='id' value='" + credential.id + "'>";
    html += "<input type='hidden' name='pass' value='" + credential.pass + "'>";
    html += "<input type='hidden' name='mode' value='STATUS'>";
    html += "<input type='submit' id='returnSubmit'>";
    html += "</form>";
    $("#eden").html(html);
}

function doBindReturnButton() {
    $("#returnButton").on("click", function () {
        $("#returnSubmit").trigger("click");
    });
}

function doRender() {
    let html = "";
    html += "<table style='border-width:0;width:100%;background-color:#888888'>";
    html += "<tbody style='background-color:#F8F0E0;text-align:center'>";
    html += "<tr>";
    html += "<th style='background-color:skyblue'>序号</th>";
    html += "<th style='background-color:skyblue'>队长</th>";
    html += "<th style='background-color:skyblue'>编制</th>";
    html += "<th style='background-color:skyblue'>仓储</th>";
    html += "<th style='background-color:skyblue'>角色名字</th>";
    html += "<th style='background-color:skyblue'>登陆名</th>";
    html += "<th style='background-color:skyblue'>密码</th>";
    html += "<th style='background-color:skyblue'>重复密码</th>";
    html += "<th style='background-color:skyblue'>设置</th>";
    html += "</tr>";

    for (let i = 0; i < Constants.MAX_TEAM_MEMBER_COUNT; i++) {
        html += "<tr>";
        html += "<th style='background-color:#E8E8D0'>";
        html += "#" + (i + 1);
        html += "</th>";
        html += "<td style='background-color:#E8E8D0'>";
        html += "<button role='button' id='master_" + i + "' class='master-button' style='color:grey'>队长</button>";
        html += "</td>";
        html += "<td style='background-color:#E8E8D0'>";
        html += "<button role='button' id='external_" + i + "' class='external-button' style='color:grey'>编外</button>";
        html += "</td>";
        html += "<td style='background-color:#E8E8D0'>";
        html += "<button role='button' id='warehouse_" + i + "' class='warehouse-button' style='color:grey'>仓储</button>";
        html += "</td>";
        html += "<td style='background-color:#EFE0C0;text-align:left'>";
        html += "<input type='text' id='name_" + i + "' size='10' maxlength='10' spellcheck='false'>";
        html += "</td>";
        html += "<td style='background-color:#E0D0B0;text-align:left'>";
        html += "<input type='text' id='id_" + i + "' size='10' maxlength='10' spellcheck='false'>";
        html += "</td>";
        html += "<td style='background-color:#EFE0C0;text-align:left'>";
        html += "<input type='password' id='pass1_" + i + "' size='10' maxlength='10' spellcheck='false'>";
        html += "</td>";
        html += "<td style='background-color:#E0D0B0;text-align:left'>";
        html += "<input type='password' id='pass2_" + i + "' size='10' maxlength='10' spellcheck='false'>";
        html += "</td>";
        html += "<td style='background-color:#EFE0C0'>";
        html += "<input type='button' id='button_" + i + "' class='button_class' value='设置'>";
        html += "<input type='button' id='clear_" + i + "' class='clear_class' value='清除'>";
        html += "</td>";
        html += "</tr>";
    }

    html += "</tbody>";
    html += "</table>";

    $("#fastLoginSetup").html(html);

    for (let i = 0; i < Constants.MAX_TEAM_MEMBER_COUNT; i++) {
        const config = TeamMemberLoader.loadTeamMember(i);
        if (!config) continue;

        $("#name_" + i).val(config.name!);
        $("#id_" + i).val(config.id!);
        $("#pass1_" + i).val(config.pass!);
        $("#pass2_" + i).val(config.pass!);

        if (config.master) {
            $("#master_" + i).css("color", "blue");
            $("#master_" + i)
                .parent()
                .parent()
                .find("> td")
                .css("background-color", "yellow");
            $("#master_" + i)
                .parent()
                .parent()
                .find("> th")
                .css("background-color", "yellow");
        }
        if (config.external) $("#external_" + i).css("color", "blue");
        if (config.warehouse) $("#warehouse_" + i).css("color", "blue");
    }

    doBindFastLoginButton();
    doBindClearButton();
    doBindMasterButton();
    doBindExternalButton();
    doBindWarehouseButton();
}

function doBindFastLoginButton() {
    $(".button_class").on("click", function () {
        const code = parseInt(($(this).attr("id") as string).split("_")[1]);
        let s = $("#name_" + code).val();
        if (s === undefined || (s as string).trim().length === 0) {
            logger.warn("角色名字不能为空");
            return;
        }
        const name = (s as string).trim();

        s = $("#id_" + code).val();
        if (s === undefined || (s as string).trim().length === 0) {
            logger.warn("登陆名不能为空");
            return;
        }
        const id = (s as string).trim();

        s = $("#pass1_" + code).val();
        if (s === undefined || (s as string).trim().length === 0) {
            logger.warn("密码不能为空");
            return;
        }
        const pass1 = (s as string).trim();

        s = $("#pass2_" + code).val();
        if (s === undefined || (s as string).trim().length === 0) {
            logger.warn("密码不能为空");
            return;
        }
        const pass2 = (s as string).trim();

        if (pass1 !== pass2) {
            logger.warn("两次输入的密码不匹配");
            return;
        }

        const value = {
            "name": name,
            "id": id,
            "pass": pass1,
        };

        StorageUtils.set("_fl_" + code, JSON.stringify(value));
        MessageBoard.publishMessage("设置已经保存。");

        doRefresh();
    });
}

function doBindClearButton() {
    $(".clear_class").on("click", event => {
        const buttonId = $(event.target).attr("id")!;
        const code = parseInt(StringUtils.substringAfterLast(buttonId, "_"));
        StorageUtils.remove("_fl_" + code);

        doRefresh();
    });
}

function doBindMasterButton() {
    $(".master-button").on("click", event => {
        const buttonId = $(event.target).attr("id")!;
        const index = _.parseInt(_.split(buttonId, "_")[1]);
        const member = TeamMemberLoader.loadTeamMember(index);
        if (!member) return;

        if (member.external) {
            logger.warn("编制外人员<b style='color:yellow'>" + member.name + "</b>不能被设置为队长！");
            return;
        }

        if (PageUtils.isColorBlue(buttonId)) {
            member.master = false;
            StorageUtils.set("_fl_" + index, JSON.stringify(member.asDocument()));
            MessageBoard.publishMessage("<b style='color:yellow'>" + member.name + "</b>已经被取消队长身份。");
        } else if (PageUtils.isColorGrey(buttonId)) {
            TeamMemberLoader.loadTeamMembers()
                .filter(it => it.master)
                .forEach(it => {
                    it.master = false;
                    StorageUtils.set("_fl_" + it.index, JSON.stringify(it.asDocument()));
                    MessageBoard.publishMessage("<b style='color:yellow'>" + it.name + "</b>已经被取消队长身份。");
                });

            member.master = true;
            StorageUtils.set("_fl_" + index, JSON.stringify(member.asDocument()));
            MessageBoard.publishMessage("<b style='color:yellow'>" + member.name + "</b>被设置为队长。");
        }

        doRefresh();
    });
}

function doBindExternalButton() {
    $(".external-button").on("click", event => {
        const buttonId = $(event.target).attr("id")!;
        const index = _.parseInt(_.split(buttonId, "_")[1]);
        const member = TeamMemberLoader.loadTeamMember(index);
        if (!member) return;

        if (PageUtils.isColorBlue(buttonId)) {
            member.external = false;
            StorageUtils.set("_fl_" + index, JSON.stringify(member.asDocument()));
            MessageBoard.publishMessage("<b style='color:yellow'>" + member.name + "</b>被纳入编制内。");
        } else if (PageUtils.isColorGrey(buttonId)) {
            member.external = true;
            member.master = false;
            StorageUtils.set("_fl_" + index, JSON.stringify(member.asDocument()));
            MessageBoard.publishMessage("<b style='color:yellow'>" + member.name + "</b>被踢出编制，如果有队长身份也同时被取消。");
        }

        doRefresh();
    });
}

function doBindWarehouseButton() {
    $(".warehouse-button").on("click", event => {
        const buttonId = $(event.target).attr("id")!;
        const index = _.parseInt(_.split(buttonId, "_")[1]);
        const member = TeamMemberLoader.loadTeamMember(index);
        if (!member) return;

        if (PageUtils.isColorBlue(buttonId)) {
            member.warehouse = false;
            StorageUtils.set("_fl_" + index, JSON.stringify(member.asDocument()));
            MessageBoard.publishMessage("<b style='color:yellow'>" + member.name + "</b>取消仓储账号。");
        } else if (PageUtils.isColorGrey(buttonId)) {
            member.warehouse = true;
            StorageUtils.set("_fl_" + index, JSON.stringify(member.asDocument()));
            MessageBoard.publishMessage("<b style='color:yellow'>" + member.name + "</b>设置为仓储账号。");
        }

        doRefresh();
    });
}

function doRefresh() {
    $("#fastLoginSetup").html("");
    $(".button_class").off("click");
    $(".clear_class").off("click");
    $(".master-button").off("click");
    doRender();
}

export = PersonalTeamManagementPageProcessor;