import NpcLoader from "../../core/NpcLoader";
import PersonalPetManagement from "../../pocketrose/PersonalPetManagement";
import PersonalPetManagementPage from "../../pocketrose/PersonalPetManagementPage";
import Credential from "../../util/Credential";
import MessageBoard from "../../util/MessageBoard";
import PageUtils from "../../util/PageUtils";
import StringUtils from "../../util/StringUtils";
import PageProcessorContext from "../PageProcessorContext";
import PageProcessorCredentialSupport from "../PageProcessorCredentialSupport";

abstract class AbstractPersonalPetManagementPageProcessor extends PageProcessorCredentialSupport {

    doProcess(credential: Credential, context?: PageProcessorContext) {
        const page = PersonalPetManagement.parsePage(PageUtils.currentPageHtml());
        this.#renderImmutablePage(credential, page, context);
    }

    #renderImmutablePage(credential: Credential, page: PersonalPetManagementPage, context?: PageProcessorContext) {
        $("input:submit[value='返回城市']").attr("id", "returnButton");

        // noinspection HtmlDeprecatedTag,XmlDeprecatedElement
        let html = "<center>";
        html += "<table style='background-color:#888888;width:100%;text-align:center'>";
        html += "<tbody style='background-color:#F8F0E0'>";
        html += "<tr>";
        html += "<td style='background-color:navy;color:yellowgreen;font-size:150%;font-weight:bold'>" +
            "＜＜  宠 物 管 理  ＞＞" +
            "</td>";
        html += "</tr>";
        html += "<tr style='display:none'>";
        html += "<td id='eden'></td>";
        html += "</tr>";
        html += "<tr style='display:none'>";
        html += "<td id='goldenCageIndex'>none</td>";
        html += "</tr>";
        html += "<tr style='display:none'>";
        html += "<td id='goldenCageStatus'>off</td>";
        html += "</tr>";
        html += "<tr style='display:none'>";
        html += "<td id='hasGoldenCage'>false</td>";
        html += "</tr>";
        html += "<tr style='display:none'>";
        html += "<td id='roleLocation'></td>";
        html += "</tr>";
        html += "<tr>";
        html += "<td id='message_board_container'></td>";
        html += "</tr>";
        html += "<tr>";
        html += "<td id='pet_management_container'></td>";
        html += "</tr>";
        html += "<tr style='display:none'>";
        html += "<td id='ranchList'></td>";
        html += "</tr>";
        html += "</tody>";
        html += "</table>";
        // noinspection HtmlDeprecatedTag,XmlDeprecatedElement
        html += "<center>已登陆宠物联赛的宠物一览";

        // noinspection HtmlDeprecatedTag,XmlDeprecatedElement
        const leftHtml = StringUtils.substringAfter($("body:first").html(), "<center>已登陆宠物联赛的宠物一览");

        $("body:first").html(html + leftHtml);

        MessageBoard.createMessageBoard("message_board_container", NpcLoader.randomFemaleNpcImageHtml());
        $("#messageBoard")
            .css("background-color", "black")
            .css("color", "white")
            .css("height", "96");
        MessageBoard.resetMessageBoard("全新的宠物管理UI为您带来不一样的感受，试试把鼠标停留在宠物图片上有惊喜。<br>" +
            "手机用户请试试单击宠物名字那一栏。");

        this.doProcessWithPageParsed(credential, page, context);
    }

    abstract doProcessWithPageParsed(credential: Credential, page: PersonalPetManagementPage, context?: PageProcessorContext): void;
}

export = AbstractPersonalPetManagementPageProcessor;