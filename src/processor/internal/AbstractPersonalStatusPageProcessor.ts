import Role from "../../common/Role";
import PersonalStatus from "../../pocketrose/PersonalStatus";
import SetupLoader from "../../setup/SetupLoader";
import Credential from "../../util/Credential";
import PageUtils from "../../util/PageUtils";
import StringUtils from "../../util/StringUtils";
import PageProcessorContext from "../PageProcessorContext";
import PageProcessorCredentialSupport from "../PageProcessorCredentialSupport";

abstract class AbstractPersonalStatusPageProcessor extends PageProcessorCredentialSupport {

    protected constructor() {
        super();
    }

    doProcess(credential: Credential, context?: PageProcessorContext) {
        const page = PersonalStatus.parsePage(PageUtils.currentPageHtml());

        this.#renderPage(page.role!);

        // 页面渲染完成，现在可以添加内容
        let html = "";
        html += "<tr style='display:none'>";
        html += "<td id='hiddenFormContainer'></td>";
        html += "</tr>";
        $("#t0")
            .find("tr:first")
            .before($(html));
        this.doGenerateHiddenForm(credential, "hiddenFormContainer");

        // 删除旧的表单并且新建全新的智能返回按钮
        $("form:last").remove();
        $("p:last").attr("id", "returnButtonContainer");
        this.doGenerateReturnButton(page.role!, "returnButtonContainer");
        this.doBindReturnButton();
    }

    abstract doGenerateHiddenForm(credential: Credential, containerId: string): void;

    abstract doGenerateReturnButton(role: Role, containerId: string): void;

    abstract doBindReturnButton(): void;

    #renderPage(role: Role) {
        // 调整表格的宽度
        $("table:first")
            .attr("id", "t0")
            .css("width", "100%");

        // Render experience
        if (SetupLoader.isExperienceProgressBarEnabled()) {
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

        // Render honor
        let td = $("table:eq(1) tr:eq(24) td:first");
        let html = $(td).html();
        html = html.replace(/<br>/g, '');
        $(td).attr("style", "word-break:break-all");
        $(td).html(html);
    }

}

export = AbstractPersonalStatusPageProcessor;