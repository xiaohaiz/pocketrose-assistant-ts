import ButtonUtils from "../../util/ButtonUtils";
import Credential from "../../util/Credential";
import KeyboardShortcutBuilder from "../../util/KeyboardShortcutBuilder";
import LocationModeTown from "../../core/location/LocationModeTown";
import MessageBoard from "../../util/MessageBoard";
import MouseClickEventBuilder from "../../util/MouseClickEventBuilder";
import PageProcessorContext from "../PageProcessorContext";
import PageUtils from "../../util/PageUtils";
import StatefulPageProcessor from "../StatefulPageProcessor";
import TownArmorHousePageParser from "../../core/store/TownArmorHousePageParser";
import {ArmorStoreManager} from "../../widget/ArmorStoreManager";
import {EquipmentManager} from "../../widget/EquipmentManager";
import {PocketEvent} from "../../pocket/PocketEvent";
import {PocketFormGenerator, PocketPage} from "../../pocket/PocketPage";
import {PocketLogger} from "../../pocket/PocketLogger";
import {RoleManager} from "../../widget/RoleManager";

const logger = PocketLogger.getLogger("ARMOR");

class TownArmorHousePageProcessor extends StatefulPageProcessor {

    private readonly location: LocationModeTown;
    private readonly roleManager: RoleManager;
    private readonly armorStoreManager: ArmorStoreManager;
    private readonly equipmentManager: EquipmentManager;

    constructor(credential: Credential, context: PageProcessorContext) {
        super(credential, context);
        this.location = this.createLocationMode() as LocationModeTown;
        this.roleManager = new RoleManager(credential, this.location);
        this.roleManager.feature.enableBankAccount = true;
        this.armorStoreManager = new ArmorStoreManager(credential, this.location);
        this.armorStoreManager.feature.enableAutoSellDragonBall = true;
        this.armorStoreManager.feature.onRefresh = async () => {
            await this.roleManager.reload();
            await this.roleManager.render();
            await this.render();
            await this.equipmentManager.reload();
            await this.equipmentManager.render();
            this.equipmentManager.renderRoleStatus(this.roleManager.role);
        };
        this.equipmentManager = new EquipmentManager(credential, this.location);
        this.equipmentManager.feature.enableRecoverItem = true;
        this.equipmentManager.feature.enableGemTransfer = true;
        this.equipmentManager.feature.onRefresh = async () => {
            await this.roleManager.reload();
            await this.roleManager.render();
            await this.armorStoreManager.reload();
            await this.armorStoreManager.render();
            await this.render();
            this.equipmentManager.renderRoleStatus(this.roleManager.role);
        };
    }

    protected async doProcess(): Promise<void> {
        this.armorStoreManager.armorPage = await new TownArmorHousePageParser().parse(PageUtils.currentPageHtml());
        if (this.armorStoreManager.armorPage.townId !== this.townId!) return;
        await this.generateHTML();
        await this.resetMessageBoard();
        await this.bindButtons();
        this.roleManager.bindButtons();
        this.armorStoreManager.bindButtons();
        this.equipmentManager.bindButtons();
        await this.roleManager.reload();
        await this.roleManager.render();
        await this.armorStoreManager.render();
        await this.render();
        await this.equipmentManager.reload();
        await this.equipmentManager.render();
        this.equipmentManager.renderRoleStatus(this.roleManager.role);
        KeyboardShortcutBuilder.newInstance()
            .onKeyPressed("r", () => PageUtils.triggerClick("refreshButton"))
            .onEscapePressed(() => PageUtils.triggerClick("returnButton"))
            .withDefaultPredicate()
            .doBind();
    }

    private async generateHTML() {
        const table = $("body:first > table:first > tbody:first")
            .find("> tr:first > td:first > table:first");
        table.find("> tbody:first > form:first").remove();

        table.find("> tbody:first > tr:first > td:first")
            .removeAttr("height")
            .html(() => {
                return PocketPage.generatePageHeaderHTML("＜＜  防 具 商 店  ＞＞", this.roleLocation);
            });
        $("#_pocket_page_command").html(() => {
            const refreshButtonTitle = ButtonUtils.createTitle("刷新", "r");
            const returnButtonTitle = ButtonUtils.createTitle("退出", "Esc");
            return "" +
                "<span> <button role='button' class='C_pocket_StatelessElement' id='refreshButton'>" + refreshButtonTitle + "</button></span>" +
                "<span> <button role='button' class='C_pocket_StatelessElement' id='returnButton'>" + returnButtonTitle + "</button></span>";
        });

        table.find("> tbody:first > tr:eq(1) > td:first")
            .find("> table:first > tbody:first > tr:first")
            .find("> td:first")
            .attr("id", "roleInformationManager")
            .css("width", "64")
            .css("height", "64")
            .css("white-space", "nowrap")
            .next()
            .removeAttr("width")
            .css("width", "100%")
            .html(() => {
                return this.roleManager.generateHTML();
            })
            .next().remove();

        table.find("> tbody:first > tr:eq(2) > td:first")
            .find("> table:first > tbody:first > tr:first")
            .find("> td:first")
            .attr("id", "messageBoard")
            .removeAttr("bgcolor")
            .css("background-color", "black")
            .css("color", "white")
            .closest("tr")
            .find("> td:last")
            .attr("id", "messageBoardManager")

        table.find("> tbody:first > tr:eq(3) > td:first")
            .html(() => {
                return this.armorStoreManager.generateHTML();
            })
            .parent()
            .after($("<tr><td>" + this.equipmentManager.generateHTML() + "</td></tr>"));
    }

    private async resetMessageBoard() {
        MessageBoard.initializeManager();
        MessageBoard.initializeWelcomeMessage();
        logger.info(
            "本店当前的折扣率是：<span style='background-color:red;color:white' id='discountRate'></span>"
        );
    }

    private async bindButtons() {
        $("#_pocket_page_extension_0").html(() => {
            return new PocketFormGenerator(this.credential, this.location).generateReturnFormHTML();
        });
        $("#returnButton").on("click", async () => {
            PageUtils.disablePageInteractiveElements();
            await this.dispose();
            PageUtils.triggerClick("_pocket_ReturnSubmit");
        });
        $("#refreshButton").on("click", async () => {
            PocketPage.disableStatelessElements();
            PocketPage.scrollIntoTitle();
            await this.resetMessageBoard();
            await this.refresh();
            PocketPage.enableStatelessElements();
            logger.info("防具商店刷新操作完成。");
        });
        const roleImageHandler = PocketEvent.newMouseClickHandler();
        MouseClickEventBuilder.newInstance()
            .onElementClicked("roleInformationManager", async () => {
                await roleImageHandler.onMouseClicked();
            })
            .onElementClicked("messageBoardManager", async () => {
                await this.resetMessageBoard();
                await this.render();
            })
            .doBind();
    }

    private async render() {
        $("#discountRate").html(() => {
            return this.armorStoreManager.armorPage!.discount!.toFixed(2);
        });
    }

    private async refresh() {
        await this.roleManager.reload();
        await this.roleManager.render();
        await this.armorStoreManager.reload();
        await this.armorStoreManager.render();
        await this.render();
        await this.equipmentManager.reload();
        await this.equipmentManager.render();
        this.equipmentManager.renderRoleStatus(this.roleManager.role);
    }

    private async dispose() {
        await this.roleManager.dispose();
        await this.armorStoreManager.dispose();
        await this.equipmentManager.dispose();
    }
}

export {TownArmorHousePageProcessor};