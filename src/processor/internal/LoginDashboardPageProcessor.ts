import FastLoginLoader from "../../core/FastLoginLoader";
import PageUtils from "../../util/PageUtils";
import PageProcessor from "../PageProcessor";

class LoginDashboardPageProcessor implements PageProcessor {

    process(): void {
        PageUtils.loadButtonStyle(8);
        PageUtils.fixCurrentPageBrokenImages();
        PageUtils.removeUnusedHyperLinks();
        PageUtils.removeGoogleAnalyticsScript();
        doProcess();
    }

}

function doProcess() {
    const configs = new Map<number, {}>();
    for (let i = 0; i < 10; i++) {
        const config = FastLoginLoader.loadFastLoginConfig(i);
        if (doCheckConfigAvailability(config)) {
            configs.set(i, config);
        }
    }
    if (configs.size === 0) {
        return;
    }

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

    doRender(configs);
}

function doCheckConfigAvailability(config: {}): boolean {
    // @ts-ignore
    return config.name !== undefined && config.id !== undefined && config.pass !== undefined;
}

function doRender(configs: Map<number, {}>) {
    let html = "";
    html += "<table style='border-width:0;margin:auto;text-align:center;width:100%'>";
    html += "<tbody>";
    html += "</tbody>";
    html += "<tr>";
    html += "<td colspan='5' style='color:navy;font-weight:bold'>快速登陆时请自行输入图形验证码</td>";
    html += "</tr>";
    html += "<tr>";
    for (let i = 0; i < 5; i++) {
        html += doGenerateCell(configs, i);
    }
    html += "</tr>";
    html += "<tr>";
    for (let i = 5; i < 10; i++) {
        html += doGenerateCell(configs, i);
    }
    html += "</tr>";
    html += "</table>";

    $("#fastLogin").html(html);

    doBindFastLoginButton();
}

function doGenerateCell(configs: Map<number, {}>, code: number) {
    let html = "";
    html += "<td style='background-color:#E8E8D0'>";
    let config = configs.get(code);
    if (config !== undefined) {
        // @ts-ignore
        const name = config.name;
        html += "<input type='button' class='fastLoginButton button-8' " +
            "id='fastLogin_" + code + "' value='" + name + "'>";
    } else {
        html += PageUtils.generateInvisibleButton("#E8E8D0");
    }
    html += "</td>";
    return html;
}

function doBindFastLoginButton() {
    for (let i = 0; i < 10; i++) {
        const buttonId = "fastLogin_" + i;
        if ($("#" + buttonId).length === 0) {
            continue;
        }
        $("#" + buttonId).on("click", function () {
            const code = parseInt(($(this).attr("id") as string).split("_")[1]);
            const config = FastLoginLoader.loadFastLoginConfig(code);
            if (!doCheckConfigAvailability(config)) {
                return;
            }
            // @ts-ignore
            $("#loginId").val(config.id);
            // @ts-ignore
            $("#loginPass").val(config.pass);

            $("#loginForm").removeAttr("onsubmit");
            $("#loginButton").trigger("click");
        });
    }
}

export = LoginDashboardPageProcessor;