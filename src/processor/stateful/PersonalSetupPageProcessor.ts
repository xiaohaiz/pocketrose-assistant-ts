import ButtonUtils from "../../util/ButtonUtils";
import Credential from "../../util/Credential";
import KeyboardShortcutBuilder from "../../util/KeyboardShortcutBuilder";
import LocationModeCastle from "../../core/location/LocationModeCastle";
import LocationModeTown from "../../core/location/LocationModeTown";
import MessageBoard from "../../util/MessageBoard";
import MouseClickEventBuilder from "../../util/MouseClickEventBuilder";
import NpcLoader from "../../core/role/NpcLoader";
import PageProcessorContext from "../PageProcessorContext";
import PageUtils from "../../util/PageUtils";
import SetupItem from "../../setup/SetupItem";
import SetupItemManager from "../../setup/SetupItemManager";
import StatefulPageProcessor from "../StatefulPageProcessor";
import StorageUtils from "../../util/StorageUtils";
import StringUtils from "../../util/StringUtils";
import TeamMemberLoader from "../../core/team/TeamMemberLoader";
import _ from "lodash";
import {ConfigManager} from "../../setup/ConfigManager";
import {PocketEvent} from "../../pocket/PocketEvent";
import {PocketFormGenerator, PocketPage} from "../../pocket/PocketPage";
import {PocketLogger} from "../../pocket/PocketLogger";
import {RoleManager} from "../../widget/RoleManager";
import {TeamSetupManager} from "../../widget/TeamSetupManager";

const logger = PocketLogger.getLogger("SETUP")

class PersonalSetupPageProcessor extends StatefulPageProcessor {

    private readonly location: LocationModeTown | LocationModeCastle;
    private readonly roleManager: RoleManager;
    private readonly teamSetupManager: TeamSetupManager;

    constructor(credential: Credential, context: PageProcessorContext) {
        super(credential, context);
        this.location = this.createLocationMode() as LocationModeTown | LocationModeCastle;
        this.roleManager = new RoleManager(credential, this.location);
        this.teamSetupManager = new TeamSetupManager(credential, this.location);
    }

    protected async doProcess(): Promise<void> {
        const buttonStyles = [10005, 10007, 10008, 10016, 10024, 10028, 10032, 10033, 10035, 10062, 10132];
        _.forEach(buttonStyles, it => ButtonUtils.loadButtonStyle(it));

        await this.generateHTML();
        await this.resetMessageBoard();
        this.roleManager.bindButtons();
        this.teamSetupManager.bindButtons();
        this.bindButtons();
        await this.roleManager.reload();
        await this.roleManager.render();
        await this.teamSetupManager.reload();
        await this.teamSetupManager.render();
        await this.render();
        KeyboardShortcutBuilder.newInstance()
            .onKeyPressed("r", () => PageUtils.triggerClick("refreshButton"))
            .onEscapePressed(() => PageUtils.triggerClick("returnButton"))
            .withDefaultPredicate()
            .doBind();
    }

    private async generateHTML() {
        // 整个页面是放在一个大form里面，删除重组
        const lastDivHtml = $("div:last").html();
        $("form:first").remove();
        $("body:first").prepend($("<div id='SetupContainer'></div>" +
            "<hr style='height:0;width:100%'>" +
            "<div style='text-align:center'>" + lastDivHtml + "</div>"));
        const container = $("#SetupContainer");
        const html = "" +
            "<table style='background-color:#888888;width:100%;text-align:center;border-width:0;border-spacing:0'>" +
            "<tbody style='background-color:#F8F0E0'>" +
            "<tr>" +
            "<td>" + PocketPage.generatePageHeaderHTML("＜＜  口 袋 助 手 设 置  ＞＞", this.roleLocation) + "</td>" +
            "</tr>" +
            "<tr>" +
            "<td>" +
            "<table style='background-color:#888888;margin:0;width:100%;border-width:0'>" +
            "<tbody style='background-color:#F8F0E0'>" +
            "<tr>" +
            "<td style='width:64px;height:64px;white-space:nowrap' id='roleInformationManager'>" +
            NpcLoader.getNpcImageHtml("U_041") +
            "</td>" +
            "<td style='width:100%' id='RoleInformation'>" +
            this.roleManager.generateHTML() +
            "</td>" +
            "</tr>" +
            "</tbody>" +
            "</table>" +
            "</td>" +
            "</tr>" +
            "<tr>" +
            "<td id='MessageBoardPanel'></td>" +
            "</tr>" +
            "<tr style='display:none'>" +
            "<td id='TeamSetupPanel'>" +
            this.teamSetupManager.generateHTML() +
            "</td>" +
            "</tr>" +
            "<tr>" +
            "<td id='PersonalSetupPanel'></td>" +
            "</tr>" +
            "<tr>" +
            "<td id='OperationPanel'>" +
            "<table style='background-color:#888888;margin:0;width:100%;border-width:0'>" +
            "<tbody style='background-color:#F8F0E0'>" +
            "<tr>" +
            "<td style='text-align:center;background-color:red;color:white;font-weight:bold;font-size:150%'>" +
            "以下操作包含有账号登陆敏感信息，请自己保护好数据安全！" +
            "</td>" +
            "</tr>" +
            "<tr>" +
            "<td style='text-align:center'>" +
            "<button role='button' class='C_StatelessElement' id='exportButton'>导出所有设置</button>" +
            "<span> </span>" +
            "<button role='button' class='C_StatelessElement' id='importButton'>导入所有设置</button>" +
            "<span> </span>" +
            "<button role='button' class='C_StatelessElement' id='purgeButton'>清除所有设置</button>" +
            "</td>" +
            "</tr>" +
            "<tr>" +
            "<td style='text-align:center'>" +
            "<textarea id='allConfigs' " +
            "rows='15' " +
            "style=\"height:expression((this.scrollHeight>150)?'150px':(this.scrollHeight+5)+'px');overflow:auto;width:100%;word-break;break-all;\">" +
            "</textarea>" +
            "</td>" +
            "</tr>" +
            "</tbody>" +
            "</table>" +
            "</td>" +
            "</tr>" +
            "</tbody>" +
            "</table>" +
            "";
        container.html(html);
        $("#_pocket_page_command").html(() => {
            const refreshButtonTitle = ButtonUtils.createTitle("刷新", "r");
            const returnButtonTitle = ButtonUtils.createTitle("退出", "Esc");
            return "<span style='display:none'> <button role='button' class='C_pocket_StatelessElement' id='refreshSetupButton'>刷新设置</button></span>" +
                "<span> <button role='button' class='C_pocket_StatelessElement' id='refreshButton'>" + refreshButtonTitle + "</button></span>" +
                "<span> <button role='button' class='C_pocket_StatelessElement' id='returnButton'>" + returnButtonTitle + "</button></span>";
        });
        MessageBoard.createMessageBoardStyleB("MessageBoardPanel", NpcLoader.randomFemaleNpcImageHtml());
        $("#messageBoard")
            .css("background-color", "black")
            .css("color", "wheat");
    }

    private async resetMessageBoard() {
        MessageBoard.initializeManager();
        MessageBoard.initializeWelcomeMessage();
        MessageBoard.publishMessage("<span style='font-weight:bold;color:yellowgreen'>点击左上角角色头像可进入团队的配置中心。</span>");
    }

    private bindButtons() {
        $("#_pocket_page_extension_0").html(() => {
            return new PocketFormGenerator(this.credential, this.location).generateReturnFormHTML();
        });
        $("#returnButton").on("click", () => {
            PageUtils.disablePageInteractiveElements();
            this.dispose().then(() => PageUtils.triggerClick("_pocket_ReturnSubmit"));
        });
        $("#refreshButton").on("click", () => {
            PocketPage.disableStatelessElements();
            this.refresh().then(() => {
                PocketPage.enableStatelessElements();
            });
        });
        $("#refreshSetupButton").on("click", async () => {
            PocketPage.disableStatelessElements();
            await this.teamSetupManager.reload();
            await this.teamSetupManager.render();
            await this.render();
            PocketPage.enableStatelessElements();
        });
        $("#exportButton").on("click", () => {
            const allConfigs = ConfigManager.exportAsJson();
            $("#allConfigs").val(allConfigs);
        });
        $("#importButton").on("click", () => {
            if (!confirm("请确认要导入助手的所有设置？")) {
                return;
            }
            const json = $("#allConfigs").val() as string;
            ConfigManager.importFromJson(json);
            MessageBoard.publishMessage("助手设置信息已经导入！");
            PageUtils.scrollIntoView("pageTitle");
            $("#refreshButton").trigger("click");

        });
        $("#purgeButton").on("click", () => {
            if (!confirm("请再次确认要清除助手的所有设置？")) {
                return;
            }
            ConfigManager.purge();
            MessageBoard.publishMessage("所有助手设置信息已经清除！");
            PageUtils.scrollIntoView("pageTitle");
            $("#refreshButton").trigger("click");
        });
        const roleImageHandler = PocketEvent.newMouseClickHandler();
        roleImageHandler.threshold = 1;
        roleImageHandler.handler = async () => {
            if (!TeamMemberLoader.loadTeamMembersAsMap(true).has(this.credential.id)) {
                logger.warn("你不是团队成员，无法进入团队设置。");
                return;
            }
            $("#TeamSetupPanel").parent().toggle();
        };
        MouseClickEventBuilder.newInstance()
            .onElementClicked("roleInformationManager", async () => {
                await roleImageHandler.onMouseClicked();
            })
            .onElementClicked("messageBoardManager", async () => {
                await this.resetMessageBoard();
            })
            .doBind();
    }

    private async render() {
        $("#roleInformationManager").html(() => {
            return this.roleManager.role!.imageHtml;
        });

        const member = TeamMemberLoader.findTeamMemberById(this.credential.id);
        if (member !== null && !member.external!) {
            $("#exportButton").prop("disabled", false);
            $("#purgeButton").prop("disabled", false);
        } else {
            $("#exportButton").prop("disabled", true);
            $("#purgeButton").prop("disabled", true);
        }

        $(".C_setupItemName").off("click").off("dblclick");
        const categories = ["置顶", "界面", "战斗", "其他"];
        const allSetupItems = SetupItemManager.getInstance().getSetupItem();
        let html = "";
        html += "<table style='background-color:#888888;width:100%;text-align:center'>";
        html += "<tbody style='background-color:#F8F0E0' id='setup_item_table'>";
        html += "</tbody>";
        html += "</table>";
        $("#PersonalSetupPanel").html(html);

        for (const category of categories) {
            const itemList = _.forEach(allSetupItems)
                .filter(it => this.determineSetupCategories(it) === category)
                .filter(it => it.accept(this.credential.id));
            if (itemList.length === 0) {
                continue;
            }
            html = "";
            html += "<tr style='background-color:skyblue'>";
            html += "<th rowspan='" + (itemList.length + 1) + "' style='background-color:black;color:white;vertical-align:center;white-space:nowrap'>" + category + "</th>";
            html += "<th>名字</th>";
            html += "<th>专属</th>";
            html += "<th>设置</th>";
            html += "<th>选择</th>";
            html += "<th>说明</th>";
            html += "</tr>";
            $("#setup_item_table").append($(html));
            _.forEach(itemList, it => it.render(this.credential.id));
        }

        this.bindSetupCategories();
    }

    private async refresh() {
        await this.roleManager.reload();
        await this.roleManager.render();
        await this.teamSetupManager.reload();
        await this.teamSetupManager.render();
        await this.render();
    }

    private async dispose() {
        await this.roleManager.dispose();
        await this.teamSetupManager.dispose();
    }

    private determineSetupCategories(item: SetupItem) {
        const c = item.category();
        if (c === "置顶") {
            return c;
        }
        if (StorageUtils.getBoolean("_st_" + item.code())) {
            return "置顶";
        } else {
            return c;
        }
    }

    private bindSetupCategories() {
        $(".C_setupItemName").on("click", event => {
            const s = $(event.target).attr("id") as string;
            const code = StringUtils.substringAfter(s, "_s_");
            if (StorageUtils.getBoolean("_st_" + code)) {
                StorageUtils.remove("_st_" + code);
            } else {
                StorageUtils.set("_st_" + code, "1");
            }
            PageUtils.triggerClick("refreshButton");
        });
    }
}

export {PersonalSetupPageProcessor};