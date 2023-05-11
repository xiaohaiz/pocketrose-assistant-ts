import PersonalEquipmentManagement from "../../pocketrose/PersonalEquipmentManagement";
import PersonalEquipmentManagementPage from "../../pocketrose/PersonalEquipmentManagementPage";
import Credential from "../../util/Credential";
import PageUtils from "../../util/PageUtils";
import PageProcessorContext from "../PageProcessorContext";
import PageProcessorCredentialSupport from "../PageProcessorCredentialSupport";

abstract class AbstractPersonalEquipmentManagementPageProcessor extends PageProcessorCredentialSupport {

    doProcess(credential: Credential, context?: PageProcessorContext) {
        const page = PersonalEquipmentManagement.parsePage(PageUtils.currentPageHtml());
        this.#renderImmutablePage(credential, page, context);
    }

    #renderImmutablePage(credential: Credential, page: PersonalEquipmentManagementPage, context?: PageProcessorContext) {
        // 删除不必要的属性，可能会造成显示格式混乱。
        $("table[height='100%']").removeAttr("height");

        // 定位第一个表格
        const t0 = $("table:first")
            .attr("id", "t0");

        // 标题栏 : pageTitle
        t0.find("td:first")
            .attr("id", "pageTitle")
            .removeAttr("width")
            .removeAttr("height")
            .removeAttr("bgcolor")
            .css("text-align", "center")
            .css("font-size", "150%")
            .css("font-weight", "bold")
            .css("background-color", "navy")
            .css("color", "yellowgreen")
            .html(this.doGeneratePageTitleHtml(context));
    }

    abstract doGeneratePageTitleHtml(context?: PageProcessorContext): string;
}

export = AbstractPersonalEquipmentManagementPageProcessor;