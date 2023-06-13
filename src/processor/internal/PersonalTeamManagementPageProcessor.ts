import _ from "lodash";
import FastLoginLoader from "../../core/team/FastLoginLoader";
import Credential from "../../util/Credential";
import MessageBoard from "../../util/MessageBoard";
import PageUtils from "../../util/PageUtils";
import StorageUtils from "../../util/StorageUtils";
import StringUtils from "../../util/StringUtils";
import PageProcessorContext from "../PageProcessorContext";
import PageProcessorCredentialSupport from "../PageProcessorCredentialSupport";

class PersonalTeamManagementPageProcessor extends PageProcessorCredentialSupport {

    doProcess(credential: Credential, context?: PageProcessorContext): void {
        doProcess(credential);
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
    html += "<th style='background-color:skyblue'>角色名字</th>";
    html += "<th style='background-color:skyblue'>登陆名</th>";
    html += "<th style='background-color:skyblue'>密码</th>";
    html += "<th style='background-color:skyblue'>重复密码</th>";
    html += "<th style='background-color:skyblue'>设置</th>";
    html += "</tr>";

    for (let i = 0; i < 50; i++) {
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

    for (let i = 0; i < 50; i++) {
        const config = FastLoginLoader.loadFastLogin(i);
        if (!config) continue;

        $("#name_" + i).val(config.name!);
        $("#id_" + i).val(config.id!);
        $("#pass1_" + i).val(config.pass!);
        $("#pass2_" + i).val(config.pass!);

        if (config.external) $("#external_" + i).css("color", "blue");
    }

    const masterId = StorageUtils.getInt("_tm_", -1);
    if (masterId >= 0) {
        $("#master_" + masterId).css("color", "blue");

        $("#master_" + masterId)
            .parent()
            .parent()
            .find("> td")
            .css("background-color", "yellow");
        $("#master_" + masterId)
            .parent()
            .parent()
            .find("> th")
            .css("background-color", "yellow");
    }

    doBindFastLoginButton();
    doBindClearButton();
    doBindMasterButton();
    doBindExternalButton();
}

function doBindFastLoginButton() {
    $(".button_class").on("click", function () {
        const code = parseInt(($(this).attr("id") as string).split("_")[1]);
        let s = $("#name_" + code).val();
        if (s === undefined || (s as string).trim().length === 0) {
            MessageBoard.publishWarning("角色名字不能为空");
            return;
        }
        const name = (s as string).trim();

        s = $("#id_" + code).val();
        if (s === undefined || (s as string).trim().length === 0) {
            MessageBoard.publishWarning("登陆名不能为空");
            return;
        }
        const id = (s as string).trim();

        s = $("#pass1_" + code).val();
        if (s === undefined || (s as string).trim().length === 0) {
            MessageBoard.publishWarning("密码不能为空");
            return;
        }
        const pass1 = (s as string).trim();

        s = $("#pass2_" + code).val();
        if (s === undefined || (s as string).trim().length === 0) {
            MessageBoard.publishWarning("密码不能为空");
            return;
        }
        const pass2 = (s as string).trim();

        if (pass1 !== pass2) {
            MessageBoard.publishWarning("两次输入的密码不匹配");
            return;
        }

        const value = {
            "name": name,
            "id": id,
            "pass": pass1,
        };

        const externalId = "external_" + code;
        if (PageUtils.isColorBlue(externalId)) {
            // @ts-ignore
            value.external = true;
        }

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
        const code = _.parseInt(_.split(buttonId, "_")[1]);
        if (PageUtils.isColorBlue(buttonId)) {
            StorageUtils.remove("_tm_");
            MessageBoard.publishMessage("队长已经取消。");
        } else if (PageUtils.isColorGrey(buttonId)) {
            StorageUtils.set("_tm_", code.toString());
            MessageBoard.publishMessage((code + 1) + "号位设置为队长。");
        }

        doRefresh();
    });
}

function doBindExternalButton() {
    $(".external-button").on("click", event => {
        const buttonId = $(event.target).attr("id")!;
        const code = _.parseInt(_.split(buttonId, "_")[1]);
        const config = FastLoginLoader.loadFastLogin(code);
        if (!config) return;

        if (PageUtils.isColorBlue(buttonId)) {
            config.external = false;
            StorageUtils.set("_fl_" + code, JSON.stringify(config.asObject()));
            MessageBoard.publishMessage("编制已经修改。");
        } else if (PageUtils.isColorGrey(buttonId)) {
            config.external = true;
            StorageUtils.set("_fl_" + code, JSON.stringify(config.asObject()));
            MessageBoard.publishMessage("编制已经修改。");
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