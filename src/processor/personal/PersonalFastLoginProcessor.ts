import Processor from "../Processor";
import PageUtils from "../../util/PageUtils";
import Credential from "../../util/Credential";

class PersonalFastLoginProcessor implements Processor {

    accept(cgi: string, pageText: string): boolean {
        if (cgi === "mydata.cgi") {
            return pageText.includes("* 出家 *");
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
        .text("＜＜　 快 速 登 陆 　＞＞");

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

    doRender(credential);

    console.log(PageUtils.currentPageHtml());
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

function doRender(credential: Credential) {
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

}

export = PersonalFastLoginProcessor;