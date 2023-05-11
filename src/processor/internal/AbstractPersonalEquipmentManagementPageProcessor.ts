import NpcLoader from "../../core/NpcLoader";
import PersonalEquipmentManagement from "../../pocketrose/PersonalEquipmentManagement";
import PersonalEquipmentManagementPage from "../../pocketrose/PersonalEquipmentManagementPage";
import Credential from "../../util/Credential";
import MessageBoard from "../../util/MessageBoard";
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
        t0.find("tr:first")
            .attr("id", "tr0")
            .find("td:first")
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

        $("#tr0")
            .next()
            .attr("id", "tr1")
            .find("td:first")
            .find("table:first")
            .find("tr:first")
            .find("td:first")
            .attr("id", "roleImage")
            .next()
            .removeAttr("width")
            .css("width", "100%")
            .next().remove();

        $("#roleImage")
            .next()
            .find("table:first")
            .find("tr:first")
            .next()
            .find("td:eq(2)")
            .attr("id", "roleHealth")
            .next()
            .attr("id", "roleMana")
            .parent()
            .next()
            .find("td:last")
            .attr("id", "roleCash")
            .parent()
            .after($("" +
                "<tr>" +
                "<td style='background-color:#E0D0B0'>坐标点</td>" +
                "<td style='background-color:#E8E8D0;text-align:right;font-weight:bold;color:red' " +
                "colspan='5' id='roleLocation'>" + this.doGenerateRoleLocationHtml(context) + "</td>" +
                "</tr>" +
                ""));

        // ------------------------------------------------------------------------
        // 消息面板栏
        // ------------------------------------------------------------------------
        $("#tr1")
            .next()
            .attr("id", "tr2")
            .find("td:first")
            .attr("id", "messageBoardContainer")
            .removeAttr("height");
        MessageBoard.createMessageBoardStyleB("messageBoardContainer", NpcLoader.randomNpcImageHtml());
        $("#messageBoard")
            .css("background-color", "black")
            .css("color", "wheat");
        MessageBoard.resetMessageBoard(this.doGenerateWelcomeMessageHtml());
    }

    abstract doGeneratePageTitleHtml(context?: PageProcessorContext): string;

    abstract doGenerateRoleLocationHtml(context?: PageProcessorContext): string;

    abstract doGenerateWelcomeMessageHtml(): string;
}

export = AbstractPersonalEquipmentManagementPageProcessor;