import FastLoginLoader from "../../pocket/FastLoginLoader";
import Credential from "../../util/Credential";
import MessageBoard from "../../util/MessageBoard";
import StorageUtils from "../../util/StorageUtils";
import PageProcessorContext from "../PageProcessorContext";
import PageProcessorCredentialSupport from "../PageProcessorCredentialSupport";

class PersonalFastLoginPageProcessor extends PageProcessorCredentialSupport {

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
        .text("＜＜　 快 速 登 陆 设 置 　＞＞");

    $("table:eq(4)")
        .find("td:first")
        .attr("id", "messageBoard")
        .removeAttr("width")
        .removeAttr("bgcolor")
        .css("width", "100%")
        .css("background-color", "black")
        .css("color", "white")
        .html("可以在这里设置快速登陆，所有的登陆信息都只存储在你的浏览器本地，可以放心使用！");

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
    html += "<input type='button' id='returnButton' value='离开快速登陆设置'>";
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
    html += "<th style='background-color:#E8E8D0'>快速登陆</th>";
    html += "<th style='background-color:#EFE0C0'>角色名字</th>";
    html += "<th style='background-color:#E0D0B0'>登陆名</th>";
    html += "<th style='background-color:#EFE0C0'>密码</th>";
    html += "<th style='background-color:#E0D0B0'>重复密码</th>";
    html += "<th style='background-color:#EFE0C0'>设置</th>";
    html += "</tr>";

    for (let i = 0; i < 10; i++) {
        html += "<tr>";
        html += "<th style='background-color:#E8E8D0'>";
        html += "快速登陆 (" + (i + 1) + ")";
        html += "</th>";
        html += "<td style='background-color:#EFE0C0;text-align:left'>";
        html += "<input type='text' id='name_" + i + "' size='10' maxlength='10'>";
        html += "</td>";
        html += "<td style='background-color:#E0D0B0;text-align:left'>";
        html += "<input type='text' id='id_" + i + "' size='10' maxlength='10'>";
        html += "</td>";
        html += "<td style='background-color:#EFE0C0;text-align:left'>";
        html += "<input type='password' id='pass1_" + i + "' size='10' maxlength='10'>";
        html += "</td>";
        html += "<td style='background-color:#E0D0B0;text-align:left'>";
        html += "<input type='password' id='pass2_" + i + "' size='10' maxlength='10'>";
        html += "</td>";
        html += "<td style='background-color:#EFE0C0'>";
        html += "<input type='button' id='button_" + i + "' class='button_class' value='设置'>";
        html += "</td>";
        html += "</tr>";
    }

    html += "</tbody>";
    html += "</table>";

    $("#fastLoginSetup").html(html);

    for (let i = 0; i < 10; i++) {
        const config = FastLoginLoader.loadFastLoginConfig(i);
        // @ts-ignore
        let s = config.name;
        if (s !== undefined) {
            $("#name_" + i).val(s);
        }
        // @ts-ignore
        s = config.id;
        if (s !== undefined) {
            $("#id_" + i).val(s);
        }
        // @ts-ignore
        s = config.pass;
        if (s !== undefined) {
            $("#pass1_" + i).val(s);
            $("#pass2_" + i).val(s);
        }
    }

    doBindFastLoginButton();
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
            "pass": pass1
        };
        StorageUtils.set("_fl_" + code, JSON.stringify(value));
        MessageBoard.publishMessage("设置已经保存。");

        doRefresh();
    });
}

function doRefresh() {
    $("#fastLoginSetup").html("");
    $(".button_class").off("click");
    doRender();
}

export = PersonalFastLoginPageProcessor;