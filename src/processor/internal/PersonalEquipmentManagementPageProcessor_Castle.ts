import PersonalEquipmentManagement from "../../pocketrose/PersonalEquipmentManagement";
import PersonalEquipmentManagementPage from "../../pocketrose/PersonalEquipmentManagementPage";
import Credential from "../../util/Credential";
import PageUtils from "../../util/PageUtils";
import StringUtils from "../../util/StringUtils";
import PageProcessorContext from "../PageProcessorContext";
import PageProcessorCredentialSupport from "../PageProcessorCredentialSupport";

class PersonalEquipmentManagementPageProcessor_Castle extends PageProcessorCredentialSupport {

    doProcess(credential: Credential, context?: PageProcessorContext): void {
        const page = PersonalEquipmentManagement.parsePage(PageUtils.currentPageHtml());
        this.#renderImmutablePage(credential, page, context!.get("castleName")!);
    }

    #renderImmutablePage(credential: Credential, page: PersonalEquipmentManagementPage, castleName: string) {
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
            .text("＜＜  装 备 管 理 （ " + StringUtils.toTitleString(castleName) + " 城 堡 ）  ＞＞");
    }

}

export = PersonalEquipmentManagementPageProcessor_Castle;