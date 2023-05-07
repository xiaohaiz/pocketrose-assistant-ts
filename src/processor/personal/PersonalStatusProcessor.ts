import PageUtils from "../../util/PageUtils";
import Role from "../../pocket/Role";
import SetupLoader from "../../pocket/SetupLoader";
import StringUtils from "../../util/StringUtils";
import Processor from "../Processor";
import PersonalStatus from "../../pocket/PersonalStatus";
import Credential from "../../util/Credential";
import LocationStateMachine from "../../core/LocationStateMachine";

class PersonalStatusProcessor implements Processor {

    accept(cgi: string, pageText: string): boolean {
        if (cgi === "mydata.cgi") {
            return pageText.includes("仙人的宝物");
        }
        return false;
    }

    process() {
        LocationStateMachine.currentLocationStateMachine()
            .load()
            .whenInTown(() => {
                doProcess();
            })
            .whenInCastle(() => {
                doProcess();
            })
            .fork();
    }
}

function doProcess() {
    PageUtils.removeUnusedHyperLinks();
    PageUtils.removeGoogleAnalyticsScript();
    const id = $("input:hidden[name='id']:last").val();
    const pass = $("input:hidden[name='pass']:last").val();
    const credential = new Credential(id!.toString(), pass!.toString());

    const page = PersonalStatus.parsePage(PageUtils.currentPageHtml());

    // 调整表格的宽度
    $("table:first")
        .attr("id", "t0")
        .css("width", "100%");

    doRenderExperience(page.role!);
    doRenderHonor();

    // 页面渲染完成，现在可以添加内容
    let html = "";
    html += "<tr style='display:none'>";
    html += "<td id='hiddenForm'></td>";
    html += "</tr>";
    html += "<tr style='display:none'>";
    html += "<td id='roleLocation'>none</td>";      // 如果当前位于城市内，设置此字段。
    html += "</tr>";
    $("#t0")
        .find("tr:first")
        .before($(html));

    html = "";
    html += PageUtils.generateReturnTownForm(credential);
    html += PageUtils.generateReturnCastleForm(credential);
    $("#hiddenForm").html(html);
    $("#roleLocation").text(page.role!.location!);

    // 删除旧的表单并且新建全新的智能返回按钮
    $("form:last").remove();
    let returnButtonValue;
    if (page.role!.location === "TOWN") {
        returnButtonValue = "返回" + page.role!.town!.name;
    } else if (page.role!.location === "CASTLE") {
        returnButtonValue = "返回" + page.role!.castle!.name;
    } else {
        returnButtonValue = "返回";
    }
    html = "";
    html += "<input type='button' id='returnButton' value='" + returnButtonValue + "'>";
    $("p:last").html(html);
    doBindReturnButton();
}

function doBindReturnButton() {
    $("#returnButton").on("click", function () {
        if ($("#roleLocation").text() === "CASTLE") {
            $("#returnCastle").trigger("click");
        } else {
            $("#returnTown").trigger("click");
        }
    });
}

function doRenderExperience(role: Role) {
    if (!SetupLoader.isExperienceProgressBarEnabled()) {
        return;
    }
    const t1 = $("table:eq(1)");
    let tr = $(t1).find("tr:eq(16)");
    let td = $(tr).find("td:eq(2)");
    if (role.level === 150) {
        $(td).attr("style", "color: blue").text("MAX");
    } else {
        const ratio = role.level! / 150;
        const progressBar = PageUtils.generateProgressBarHTML(ratio);
        const exp = $(td).text() + " EX";
        $(td).html("<span title='" + exp + "'>" + progressBar + "</span>");
    }

    $("th:contains('分身类别')")
        .filter(function () {
            return $(this).text() === "分身类别";
        })
        .closest("table")
        .find("tr")
        .each(function (_idx, tr) {
            if (_idx > 0) {
                const td = $(tr).find("td:last");
                const exp = parseInt($(td).text());
                const level = Math.floor(exp / 100) + 1;
                if (level === 150) {
                    $(td).attr("style", "color: blue").text("MAX");
                } else {
                    const ratio = level / 150;
                    const progressBar = PageUtils.generateProgressBarHTML(ratio);
                    $(td).html("<span title='" + (exp + " EX") + "'>" + progressBar + "</span>");
                }
            }
        });

    $("td:contains('宠物名 ：')")
        .filter(function () {
            return $(this).text().startsWith("宠物名 ：");
        })
        .closest("table")
        .each(function (_idx, table) {
            let s = $(table).find("tr:eq(1) td:first").text();
            const level = parseInt(StringUtils.substringAfter(s, "Ｌｖ"));

            const td = $(table).find("tr:last td:eq(1)");
            if (level === 100) {
                $(td).attr("style", "color: blue").text("MAX");
            } else {
                s = $(td).text();
                const a = parseInt(StringUtils.substringBeforeSlash(s));
                const b = parseInt(StringUtils.substringAfterSlash(s));
                const ratio = a / b;
                const progressBar = PageUtils.generateProgressBarHTML(ratio);
                $(td).html("<span title='" + s + "'>" + progressBar + "</span>");
            }
        });
}

function doRenderHonor() {
    const td = $("table:eq(1) tr:eq(24) td:first");
    let html = $(td).html();
    html = html.replace(/<br>/g, '');
    $(td).attr("style", "word-break:break-all");
    $(td).html(html);
}

export = PersonalStatusProcessor;