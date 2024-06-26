import ButtonUtils from "../../util/ButtonUtils";
import Credential from "../../util/Credential";
import KeyboardShortcutBuilder from "../../util/KeyboardShortcutBuilder";
import LocationModeTown from "../../core/location/LocationModeTown";
import MessageBoard from "../../util/MessageBoard";
import PageProcessorContext from "../PageProcessorContext";
import PageUtils from "../../util/PageUtils";
import PersonalMirrorPageParser from "../../core/role/PersonalMirrorPageParser";
import Role from "../../core/role/Role";
import StatefulPageProcessor from "../StatefulPageProcessor";
import _ from "lodash";
import {BankManager} from "../../widget/BankManager";
import {EquipmentManager} from "../../widget/EquipmentManager";
import {MirrorManager} from "../../widget/MirrorManager";
import {PocketFormGenerator, PocketPage} from "../../pocket/PocketPage";
import {RoleManager} from "../../widget/RoleManager";
import {RoleStatusManager} from "../../core/role/RoleStatus";
import {PocketEvent} from "../../pocket/PocketEvent";
import MouseClickEventBuilder from "../../util/MouseClickEventBuilder";

class PersonalMirrorPageProcessor extends StatefulPageProcessor {

    private readonly location: LocationModeTown;
    private readonly roleManager: RoleManager;
    private readonly mirrorManager: MirrorManager;
    private readonly equipmentManager: EquipmentManager;
    private readonly bankManager: BankManager;

    constructor(credential: Credential, context: PageProcessorContext) {
        super(credential, context);
        this.location = this.createLocationMode() as LocationModeTown;

        this.roleManager = new RoleManager(credential, this.location);

        this.mirrorManager = new MirrorManager(credential, this.location);
        this.mirrorManager.feature.onRefresh = async (message) => {
            this.roleManager.role = message.extensions.get("role") as Role;
            await this.roleManager.render();
            await this.equipmentManager.reload();
            await this.equipmentManager.render();
            this.equipmentManager.renderRoleStatus(this.roleManager.role);
        };

        this.equipmentManager = new EquipmentManager(credential, this.location);
        this.equipmentManager.feature.enableStatusTriggerOnDispose = true;
        this.equipmentManager.feature.enableSpaceTriggerOnDispose = true;
        this.equipmentManager.feature.enableStatusTriggerOnDispose = true;
        this.equipmentManager.feature.enableUsingTriggerOnDispose = true;
        this.equipmentManager.feature.onRefresh = () => {
            this.roleManager.reload().then(() => {
                this.roleManager.render().then(() => {
                    this.equipmentManager.renderRoleStatus(this.roleManager.role);
                });
            });
        };

        this.bankManager = new BankManager(credential, this.location);
        this.bankManager.feature.onRefresh = () => {
            this.roleManager.reload().then(() => {
                this.roleManager.render().then();
            });
        };
    }

    protected async doProcess(): Promise<void> {
        this.mirrorManager.mirrorPage = PersonalMirrorPageParser.parsePage(PageUtils.currentPageHtml());

        await this.generateHTML();
        await this.resetMessageBoard();
        await this.bindButtons();
        this.roleManager.bindButtons();
        this.mirrorManager.bindButtons();
        this.equipmentManager.bindButtons();
        this.bankManager.bindButtons();

        await this.roleManager.reload();
        await this.roleManager.render();
        await this.mirrorManager.reload();
        await this.mirrorManager.render(this.roleManager.role!);
        await this.equipmentManager.reload();
        await this.equipmentManager.render();
        this.equipmentManager.renderRoleStatus(this.roleManager.role!);
        await this.bankManager.reload();
        await this.bankManager.render();

        KeyboardShortcutBuilder.newInstance()
            .onKeyPressed("r", () => PageUtils.triggerClick("refreshButton"))
            .onEscapePressed(() => PageUtils.triggerClick("returnButton"))
            .withDefaultPredicate()
            .doBind();
    }

    private async generateHTML() {
        $("table[height='100%']").removeAttr("height");
        $("td:first")
            .removeAttr("width")
            .removeAttr("height")
            .removeAttr("bgcolor")
            .html(() => {
                return PocketPage.generatePageHeaderHTML("＜＜  分 身 试 管  ＞＞", this.roleLocation);
            });
        $("#_pocket_page_command").html(() => {
            return "" +
                "<span> <button role='button' class='C_StatelessElement' id='refreshButton'>" + ButtonUtils.createTitle("刷新", "r") + "</button></span>" +
                "<span> <button role='button' class='C_StatelessElement' id='returnButton'>" + ButtonUtils.createTitle("退出", "Esc") + "</button></span>";
        });

        const table = $("table:first");

        table.find("> tbody:first")
            .find("> tr:eq(1) > td:first")
            .find("> table:first > tbody:first")
            .find("> tr:first > td:first")
            .attr("id", "roleInformationManager")
            .closest("tr")
            .find("> td:eq(3)")
            .html(() => {
                return this.roleManager.generateHTML();
            });

        table.find("> tbody:first")
            .find("> tr:eq(2)")
            .find("> td:first")
            .find("> table:first")
            .find("> tbody:first")
            .find("> tr:first")
            .find("> td:first")
            .attr("id", "messageBoard")
            .css("color", "white")
            .closest("tr")
            .find("> td:eq(1)")
            .attr("id", "messageBoardManager");

        const mirrorPanel = table.find("> tbody:first")
            .find("> tr:eq(3)")
            .find("> td:first")
            .attr("id", "mirrorPanel")
            .css("background-color", "#888888");

        if (_.includes(mirrorPanel.html(), "消耗5kw Gold(请带在身上，获取时直接从身上扣除)")) {
            // New mirror available
            const noticeHTML = mirrorPanel.find("> center:first")
                .find("> font:first")
                .html();
            mirrorPanel.parent()
                .after($("" +
                    "<tr>" +
                    "<td style='background-color:#F8F0E0;color:red;text-align:center'>" +
                    noticeHTML +
                    "</td>" +
                    "</tr>" +
                    "<tr style='background-color:#F8F0E0;text-align:center'>" +
                    "<td>" +
                    "<form action='mydata.cgi' method='post'>" +
                    "<input type='hidden' name='id' value='" + this.credential.id + "'>" +
                    "<input type='hidden' name='pass' value='" + this.credential.pass + "'>" +
                    "<input type='hidden' name='mode' value='FENSHENGETNEW'>" +
                    "<input type='submit' value='获取新分身'>" +
                    "</form>" +
                    "</td>" +
                    "</tr>" +
                    "<tr>" +
                    "<td style='background-color:#F8F0E0;text-align:center' id='equipmentPanel'></td>" +
                    "</tr>" +
                    "<tr>" +
                    "<td style='background-color:#F8F0E0;text-align:center' id='bankPanel'></td>" +
                    "</tr>" +
                    ""));
        }
        mirrorPanel.html(this.mirrorManager.generateHTML());
        $("#equipmentPanel").html(this.equipmentManager.generateHTML());
        $("#bankPanel").html(this.bankManager.generateHTML());

        const obtainMirrorBtn = $("input:submit[value='获取新分身']");
        if (obtainMirrorBtn.length > 0) {
            obtainMirrorBtn
                .attr("id", "_pocket_ObtainMirrorSubmit")
                .parent().hide()
                .after($("" +
                    "<button role='button' class='C_StatelessElement' id='_pocket_ObtainMirrorButton'>获取新分身</button>" +
                    ""));
        }
    }

    private async resetMessageBoard() {
        MessageBoard.initializeManager();
        MessageBoard.initializeWelcomeMessage();
    }

    private async bindButtons() {
        $("#_pocket_page_extension_0").html(() => {
            return new PocketFormGenerator(this.credential, this.location).generateReturnFormHTML();
        });
        $("#returnButton").on("click", () => {
            PageUtils.disablePageInteractiveElements();
            this.dispose().then(() => {
                PageUtils.triggerClick("_pocket_ReturnSubmit");
            });
        });
        $("#refreshButton").on("click", async () => {
            PocketPage.disableStatelessElements();
            PocketPage.scrollIntoTitle();
            await this.resetMessageBoard();
            await this.refresh();
            PocketPage.enableStatelessElements();
            MessageBoard.publishMessage("分身管理页面刷新完成。");
        });
        $("#_pocket_ObtainMirrorButton").on("click", async () => {
            const statusManager = new RoleStatusManager(this.credential);
            await statusManager.unsetMirror();
            PageUtils.triggerClick("_pocket_ObtainMirrorSubmit");
        });
        const roleImageHandler = PocketEvent.newMouseClickHandler();
        MouseClickEventBuilder.newInstance()
            .onElementClicked("roleInformationManager", async () => {
                await roleImageHandler.onMouseClicked();
            })
            .onElementClicked("messageBoardManager", async () => {
                await this.resetMessageBoard();
            })
            .doBind();
    }


    private async refresh() {
        await this.roleManager.reload();
        await this.roleManager.render();
        await this.mirrorManager.reload();
        await this.mirrorManager.render(this.roleManager.role!);
        await this.equipmentManager.reload();
        await this.equipmentManager.render();
        this.equipmentManager.renderRoleStatus(this.roleManager.role);
        await this.bankManager.reload();
        await this.bankManager.render();
    }

    private async dispose() {
        await this.equipmentManager.dispose();
        await this.bankManager.dispose();
    }

}

export = PersonalMirrorPageProcessor;