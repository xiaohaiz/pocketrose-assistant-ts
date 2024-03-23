import PersonalPetManagementPage from "../../core/monster/PersonalPetManagementPage";
import NpcLoader from "../../core/role/NpcLoader";
import Credential from "../../util/Credential";
import MessageBoard from "../../util/MessageBoard";
import PageUtils from "../../util/PageUtils";
import StringUtils from "../../util/StringUtils";
import PageProcessorContext from "../PageProcessorContext";
import PageProcessorCredentialSupport from "../PageProcessorCredentialSupport";
import KeyboardShortcutBuilder from "../../util/KeyboardShortcutBuilder";
import PersonalPetManagementPageParser from "../../core/monster/PersonalPetManagementPageParser";

abstract class PersonalPetManagementPageProcessor extends PageProcessorCredentialSupport {

    async doProcess(credential: Credential, context?: PageProcessorContext): Promise<void> {
        const petPage = PersonalPetManagementPageParser.parsePage(PageUtils.currentPageHtml());
        this.#renderImmutablePage(credential, petPage, context);
        this.doBindKeyboardShortcut(credential);
    }

    async #reformatPage(credential: Credential,
                        petPage: PersonalPetManagementPage,
                        context?: PageProcessorContext) {
    }

    doBindKeyboardShortcut(credential: Credential) {
        KeyboardShortcutBuilder.newInstance()
            .onKeyPressed("e", () => PageUtils.triggerClick("equipmentButton"))
            .onEscapePressed(() => PageUtils.triggerClick("exitButton"))
            .withDefaultPredicate()
            .bind();
    }

    #renderImmutablePage(credential: Credential, page: PersonalPetManagementPage, context?: PageProcessorContext) {
        $("input:submit[value='返回城市']").attr("id", "returnButton");

        // noinspection HtmlDeprecatedTag,XmlDeprecatedElement
        let html = "<center>";
        html += "<table style='background-color:#888888;width:100%;text-align:center'>";
        html += "<tbody style='background-color:#F8F0E0'>";
        html += "<tr>";
        html += "<td style='background-color:navy;color:yellowgreen;font-size:150%;font-weight:bold' id='pageTitle'>" +
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
        html += "<tr style='display:none'>";
        html += "<td id='ranchState'></td>";
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
            .css("height", "176");
        MessageBoard.resetMessageBoard("全新的宠物管理UI为您带来不一样的感受，试试把鼠标停留在宠物图片上有惊喜。<br>" +
            "手机用户请试试单击宠物名字那一栏。");

        html = "";
        html += "<table style='background-color:#888888;width:100%;text-align:center;display:none' id='PET_BORN'>";
        html += "<tbody style='background-color:#F8F0E0'>";
        html += "<tr style='display:none'>";
        html += "<td id='propagateCell'></td>";
        html += "</tr>";
        html += "<tr style='display:none'>";
        html += "<td id='evolutionCell'></td>";
        html += "</tr>";
        html += "<tr style='display:none'>";
        html += "<td id='degradationCell'></td>";
        html += "</tr>";
        html += "<tr style='display:none'>";
        html += "<td id='consecrateCell'></td>";
        html += "</tr>";
        html += "</tody>";
        html += "</table>";

        $("#returnButton").parent().before($(html));

        html = "";
        html += "<table style='background-color:#888888;width:100%;text-align:center'>";
        html += "<tbody style='background-color:#F8F0E0'>";
        html += "<tr>";
        html += "<td id='commandCell'>";
        html += "<button role='button' id='exitButton'>退出宠物管理(Esc)</button>";
        html += "<button role='button' id='equipmentButton'>转入装备管理(e)</button>";
        html += "</td>";
        html += "</tr>";
        html += "<tr style='display:none'>";
        html += "<td id='extensionCell_1'></td>";
        html += "</tr>";
        html += "</tody>";
        html += "</table>";

        $("#returnButton").parent().after($(html));
        $("#returnButton").parent().hide();

        $("#extensionCell_1").html(PageUtils.generateEquipmentManagementForm(credential));

        $("#exitButton").on("click", () => {
            this.doBeforeExit(credential).then(() => PageUtils.triggerClick("returnButton"));
        });
        $("#equipmentButton").on("click", () => {
            this.doBeforeExit(credential).then(() => PageUtils.triggerClick("openEquipmentManagement"));
        });

        this.doProcessWithPageParsed(credential, page, context);
    }

    async doBeforeExit(credential: Credential) {
        PageUtils.disableButtons();
    }

    abstract doProcessWithPageParsed(credential: Credential, page: PersonalPetManagementPage, context?: PageProcessorContext): void;
}


export = PersonalPetManagementPageProcessor;