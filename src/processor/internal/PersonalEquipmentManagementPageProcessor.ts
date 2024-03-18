import PersonalEquipmentManagement from "../../core/equipment/PersonalEquipmentManagement";
import PersonalEquipmentManagementPage from "../../core/equipment/PersonalEquipmentManagementPage";
import NpcLoader from "../../core/role/NpcLoader";
import Role from "../../core/role/Role";
import Credential from "../../util/Credential";
import KeyboardShortcutBuilder from "../../util/KeyboardShortcutBuilder";
import MessageBoard from "../../util/MessageBoard";
import PageUtils from "../../util/PageUtils";
import PageProcessorContext from "../PageProcessorContext";
import PageProcessorCredentialSupport from "../PageProcessorCredentialSupport";

abstract class PersonalEquipmentManagementPageProcessor extends PageProcessorCredentialSupport {

    async doProcess(credential: Credential, context?: PageProcessorContext): Promise<void> {
        const page = PersonalEquipmentManagement.parsePage(PageUtils.currentPageHtml());
        this.#renderImmutablePage(credential, page, context);
        this.doBindKeyboardShortcut(credential);
    }

    doBindKeyboardShortcut(credential: Credential) {
        new KeyboardShortcutBuilder()
            .onEscapePressed(() => $("#returnButton").trigger("click"))
            .onKeyPressed("r", () => $("#refreshButton").trigger("click"))
            .withDefaultPredicate()
            .bind();
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

        // ------------------------------------------------------------------------
        // 隐藏表单栏
        // ------------------------------------------------------------------------
        let html = "";
        html += "<tr id='tr3' style='display:none'>";
        html += "<td>";
        html += "<div id='hiddenFormContainer'></div>"
        html += "<div id='hiddenFormContainer1'></div>"
        html += "<div id='hiddenFormContainer2'></div>"
        html += "<div id='hiddenFormContainer3'></div>"
        html += "</td>";
        html += "</tr>"
        $("#tr2").after($(html));

        // ------------------------------------------------------------------------
        // 主菜单栏
        // ------------------------------------------------------------------------
        html = "";
        html += "<tr id='tr4'>";
        html += "<td style='background-color:#F8F0E0;text-align:center'>";
        html += this.doGenerateImmutableButtons();
        html += "</td>";
        html += "</tr>"
        $("#tr3").after($(html));

        // ------------------------------------------------------------------------
        // 用于保存百宝袋和仓库的状态
        // ------------------------------------------------------------------------
        html = "";
        html += "<tr id='tr5' style='display:none'>";
        html += "<td>";
        html += "<div id='bagIndex'>-99</div>";
        html += "<div id='bagState'>off</div>";             // 仅限有百宝袋
        html += "<div id='warehouseState'>off</div>";       // 仅限城堡
        html += "</td>"
        html += "</tr>"
        $("#tr4").after($(html));

        // ------------------------------------------------------------------------
        // 装备栏目
        // ------------------------------------------------------------------------
        html = "";
        html += "<tr id='tr6' style='display:none'>";
        html += "<td id='equipmentList'></td>";
        html += "</tr>"
        $("#tr5").after($(html));

        // ------------------------------------------------------------------------
        // 百宝袋栏目（仅限有百宝袋）
        // ------------------------------------------------------------------------
        html = "";
        html += "<tr id='tr7' style='display:none'>";
        html += "<td id='bagList'></td>";
        html += "</tr>"
        $("#tr6").after($(html));

        // ------------------------------------------------------------------------
        // 仓库栏目（仅限城堡）
        // ------------------------------------------------------------------------
        html = "";
        html += "<tr id='tr8' style='display:none'>";
        html += "<td id='warehouseList'></td>";
        html += "</tr>"
        $("#tr7").after($(html));

        html = "";
        html += "<tr id='tr9' style='display:none'>";
        html += "<td id='consecrateFormContainer'></td>";
        html += "</tr>"
        $("#tr8").after($(html));

        this.doBindImmutableButtons(credential, context);

        this.doBeforeRenderMutablePage(credential, context);

        this.doRenderMutablePage(credential, page, context);
    }

    doGenerateImmutableButtons() {
        let html = "";
        html += "<input type='button' id='refreshButton' value='刷新装备管理(r)'>";
        html += "<input type='button' id='returnButton' value='退出装备管理(Esc)'>";
        return html;
    }

    doBindImmutableButtons(credential: Credential, context?: PageProcessorContext) {
        this.doBindReturnButton(credential);
        $("#refreshButton").on("click", () => {
            this.doScrollToPageTitle();
            $("#messageBoardManager").html(NpcLoader.randomNpcImageHtml());
            MessageBoard.resetMessageBoard(this.doGenerateWelcomeMessageHtml());
            this.doRefreshMutablePage(credential, context);
        });
    }

    doRefreshMutablePage(credential: Credential, context?: PageProcessorContext) {
        PageUtils.unbindEventBySpecifiedClass("mutableButton-1");
        PageUtils.unbindEventBySpecifiedClass("mutableButton-2");
        PageUtils.unbindEventBySpecifiedClass("mutableButton-3");

        $("#equipmentList").html("").parent().hide();
        $("#bagList").html("").parent().hide();
        $("#warehouseList").html("").parent().hide();

        let townId: string | undefined = undefined;
        if (context !== undefined) {
            townId = context.get("townId");
        }
        new PersonalEquipmentManagement(credential, townId).open().then(page => {
            this.doRenderRole(page.role);
            this.doRenderMutablePage(credential, page, context);
        });
    }

    doScrollToPageTitle() {
        PageUtils.scrollIntoView("pageTitle");
    }

    doRenderRole(role: Role | undefined) {
        if (role !== undefined) {
            $("#roleHealth").text(role.health + "/" + role.maxHealth);
            $("#roleMana").text(role.mana + "/" + role.maxMana);
            $("#roleCash").text(role.cash + " GOLD");
        }
    }

    doBindSelectButtons(className: string) {
        $("." + className).on("click", event => {
            const buttonId = $(event.target).attr("id")!;
            if (PageUtils.isColorGrey(buttonId)) {
                $(event.target).css("color", "blue");
            } else if (PageUtils.isColorBlue(buttonId)) {
                $(event.target).css("color", "grey");
            }
        });
    }

    doCheckSetConfiguration(config: {} | null) {
        if (config === null) {
            return false;
        }
        // @ts-ignore
        const a = config["weaponName"];
        // @ts-ignore
        const b = config["armorName"];
        // @ts-ignore
        const c = config["accessoryName"];
        return (a !== undefined && a !== "NONE") || (b !== undefined && b !== "NONE") || (c !== undefined && c !== "NONE");
    }

    doBeforeRenderMutablePage(credential: Credential, context?: PageProcessorContext) {
    }

    abstract doGeneratePageTitleHtml(context?: PageProcessorContext): string;

    abstract doGenerateRoleLocationHtml(context?: PageProcessorContext): string;

    abstract doGenerateWelcomeMessageHtml(): string;

    abstract doBindReturnButton(credential: Credential): void;

    abstract doRenderMutablePage(credential: Credential, page: PersonalEquipmentManagementPage, context?: PageProcessorContext): void;
}

export = PersonalEquipmentManagementPageProcessor;