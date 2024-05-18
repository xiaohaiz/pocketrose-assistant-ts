import ButtonUtils from "../../util/ButtonUtils";
import Credential from "../../util/Credential";
import KeyboardShortcutBuilder from "../../util/KeyboardShortcutBuilder";
import LocationModeTown from "../../core/location/LocationModeTown";
import MessageBoard from "../../util/MessageBoard";
import MouseClickEventBuilder from "../../util/MouseClickEventBuilder";
import PageProcessorContext from "../PageProcessorContext";
import PageUtils from "../../util/PageUtils";
import PersonalEquipmentManagementPage from "../../core/equipment/PersonalEquipmentManagementPage";
import StatefulPageProcessor from "../StatefulPageProcessor";
import {EquipmentManager} from "../../widget/EquipmentManager";
import {GemManager} from "../../widget/GemManager";
import {PocketEvent} from "../../pocket/PocketEvent";
import {PocketFormGenerator, PocketPage} from "../../pocket/PocketPage";
import {PocketLogger} from "../../pocket/PocketLogger";
import {RoleManager} from "../../widget/RoleManager";
import {TownGemHousePageParser} from "../../core/forge/TownGemHousePageParser";

const logger = PocketLogger.getLogger("GEM");

class TownGemHousePageProcessor extends StatefulPageProcessor {

    private readonly location: LocationModeTown;
    private readonly roleManager: RoleManager;
    private readonly equipmentManager: EquipmentManager;
    private readonly gemManager: GemManager;

    constructor(credential: Credential, context: PageProcessorContext) {
        super(credential, context);
        this.location = this.createLocationMode() as LocationModeTown;

        this.roleManager = new RoleManager(credential, this.location);
        this.roleManager.feature.enableBankAccount = true;

        this.equipmentManager = new EquipmentManager(credential, this.location);
        this.equipmentManager.feature.enableGemTransfer = true;
        this.equipmentManager.feature.enableGrowthTriggerOnDispose = true;
        this.equipmentManager.feature.enableSpaceTriggerOnDispose = true;
        this.equipmentManager.feature.enableStatusTriggerOnDispose = true;
        this.equipmentManager.feature.enableUsingTriggerOnDispose = true;
        this.equipmentManager.feature.onRefresh = () => {
            this.roleManager.reload().then(() => {
                this.roleManager.render().then(() => {
                    this.gemManager.reload().then(() => {
                        this.gemManager.render(this.equipmentManager.equipmentPage!).then();
                    });
                });
            });
        };

        this.gemManager = new GemManager(credential, this.location);
        this.gemManager.feature.onRefresh = async (message) => {
            await this.roleManager.reload();
            await this.roleManager.render();
            this.equipmentManager.equipmentPage = message.extensions.get("equipmentPage") as PersonalEquipmentManagementPage;
            await this.equipmentManager.render();
            this.equipmentManager.renderRoleStatus(this.roleManager.role);
        };
    }

    protected async doProcess(): Promise<void> {
        if (!(this.createLocationMode() instanceof LocationModeTown)) return;
        this.gemManager.gemPage = await new TownGemHousePageParser(this.credential, this.townId).parsePage(PageUtils.currentPageHtml());
        await this.generateHTML();
        await this.resetMessageBoard();
        this.bindButtons();
        this.roleManager.bindButtons();
        this.gemManager.bindButtons();
        this.equipmentManager.bindButtons();
        await this.roleManager.reload();
        await this.roleManager.render();
        await this.equipmentManager.reload();
        await this.equipmentManager.render();
        this.equipmentManager.renderRoleStatus(this.roleManager.role);
        await this.gemManager.render(this.equipmentManager.equipmentPage!);
        KeyboardShortcutBuilder.newInstance()
            .onKeyPressed("r", () => PageUtils.triggerClick("refreshButton"))
            .onEscapePressed(() => PageUtils.triggerClick("returnButton"))
            .withDefaultPredicate()
            .doBind();
    }

    private async generateHTML() {
        const container = $("body:first > table:first > tbody:first > tr:first > td:first");
        container.find("> hr:first").remove();
        const table = container.find("> table:first");
        table.find("> tbody:first > tr:first > td:first")
            .removeAttr("bgcolor")
            .removeAttr("height")
            .html(() => {
                return PocketPage.generatePageHeaderHTML("＜＜ 宝 石 屋 ＞＞", this.roleLocation);
            });
        $("#_pocket_page_command").html(() => {
            return "" +
                "<span> <button role='button' class='C_StatelessElement' id='refreshButton'>" + ButtonUtils.createTitle("刷新", "r") + "</button></span>" +
                "<span> <button role='button' class='C_StatelessElement' id='returnButton'>" + ButtonUtils.createTitle("退出", "Esc") + "</button></span>" +
                "";
        });

        table.find("> tbody:first > tr:eq(1) > td:first")
            .find("> table:first > tbody:first > tr:first > td:first")
            .attr("id", "roleInformationManager")
            .closest("tr")
            .find("> td:last")
            .find("> table:first > tbody:first > tr:first > td:first")
            .html(() => {
                return this.roleManager.generateHTML();
            });

        table.find("> tbody:first > tr:eq(2) > td:first")
            .find("> table:first > tbody:first > tr:first > td:first")
            .attr("id", "messageBoard")
            .css("color", "white")
            .next()
            .attr("id", "messageBoardManager");

        table.find("> tbody:first > tr:eq(3) > td:first")
            .attr("id", "_pocket_GemManagerPanel")
            .html(() => {
                return this.gemManager.generateHTML();
            });

        table.find("> tbody:first > tr:eq(4) > td:first")
            .attr("id", "_pocket_EquipmentManagerPanel")
            .html(() => {
                return this.equipmentManager.generateHTML();
            });
    }

    private bindButtons(): void {
        $("#_pocket_page_extension_0").html(() => {
            return new PocketFormGenerator(this.credential, this.location).generateReturnFormHTML();
        });
        $("#returnButton").on("click", () => {
            PageUtils.disablePageInteractiveElements();
            this.dispose().then(() => PageUtils.triggerClick("_pocket_ReturnSubmit"));
        });
        $("#refreshButton").on("click", async () => {
            PocketPage.scrollIntoTitle();
            PocketPage.disableStatelessElements();
            await this.resetMessageBoard();
            await this.refresh();
            logger.info("刷新操作执行完成。");
            PocketPage.enableStatelessElements();
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

    private async resetMessageBoard() {
        MessageBoard.initializeManager();
        MessageBoard.initializeWelcomeMessage();
    }

    private async refresh() {
        await this.roleManager.reload();
        await this.roleManager.render();
        await this.equipmentManager.reload();
        await this.equipmentManager.render();
        this.equipmentManager.renderRoleStatus(this.roleManager.role);
        await this.gemManager.reload();
        await this.gemManager.render(this.equipmentManager.equipmentPage!);
    }

    private async dispose() {
        await this.roleManager.dispose();
        await this.equipmentManager.dispose();
        await this.gemManager.dispose();
    }
}

export {TownGemHousePageProcessor};