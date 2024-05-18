import StatefulPageProcessor from "../StatefulPageProcessor";
import Credential from "../../util/Credential";
import PageProcessorContext from "../PageProcessorContext";
import {PocketLogger} from "../../pocket/PocketLogger";
import LocationModeTown from "../../core/location/LocationModeTown";
import {RoleManager} from "../../widget/RoleManager";
import {EquipmentManager} from "../../widget/EquipmentManager";
import {AccessoryStoreManager} from "../../widget/AccessoryStoreManager";
import MessageBoard from "../../util/MessageBoard";
import PageUtils from "../../util/PageUtils";
import KeyboardShortcutBuilder from "../../util/KeyboardShortcutBuilder";
import TownAccessoryHousePageParser from "../../core/store/TownAccessoryHousePageParser";
import {PocketFormGenerator, PocketPage} from "../../pocket/PocketPage";
import ButtonUtils from "../../util/ButtonUtils";

const logger = PocketLogger.getLogger("ACCESSORY");

class TownAccessoryHousePageProcessor extends StatefulPageProcessor {

    private readonly location: LocationModeTown;
    private readonly roleManager: RoleManager;
    private readonly accessoryStoreManager: AccessoryStoreManager;
    private readonly equipmentManager: EquipmentManager;

    constructor(credential: Credential, context: PageProcessorContext) {
        super(credential, context);
        this.location = this.createLocationMode() as LocationModeTown;
        this.roleManager = new RoleManager(credential, this.location);
        this.roleManager.feature.enableBankAccount = true;
        this.accessoryStoreManager = new AccessoryStoreManager(credential, this.location);
        this.accessoryStoreManager.feature.enableAutoSellDragonBall = true;
        this.accessoryStoreManager.feature.onRefresh = async () => {
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
            await this.accessoryStoreManager.reload();
            await this.accessoryStoreManager.render();
            await this.render();
            this.equipmentManager.renderRoleStatus(this.roleManager.role);
        };
    }

    protected async doProcess(): Promise<void> {
        this.accessoryStoreManager.accessoryPage = await new TownAccessoryHousePageParser().parse(PageUtils.currentPageHtml());
        if (this.accessoryStoreManager.accessoryPage.townId !== this.townId!) return;
        await this.generateHTML();
        await this.resetMessageBoard();
        await this.bindButtons();
        this.roleManager.bindButtons();
        this.accessoryStoreManager.bindButtons();
        this.equipmentManager.bindButtons();
        await this.roleManager.reload();
        await this.roleManager.render();
        await this.accessoryStoreManager.render();
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
                return PocketPage.generatePageHeaderHTML("＜＜  饰 品 商 店  ＞＞", this.roleLocation);
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
            .css("width", "64")
            .css("height", "64")
            .css("white-space", "nowrap")
            .next().next().next()
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
            .css("color", "white");

        table.find("> tbody:first > tr:eq(3) > td:first")
            .html(() => {
                return this.accessoryStoreManager.generateHTML();
            })
            .parent()
            .after($("<tr><td>" + this.equipmentManager.generateHTML() + "</td></tr>"));
    }

    private async resetMessageBoard() {
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
            logger.info("饰品商店刷新操作完成。");
        });
    }

    private async render() {
        $("#discountRate").html(() => {
            return this.accessoryStoreManager.accessoryPage!.discount!.toFixed(2);
        });
    }

    private async refresh() {
        await this.roleManager.reload();
        await this.roleManager.render();
        await this.accessoryStoreManager.reload();
        await this.accessoryStoreManager.render();
        await this.render();
        await this.equipmentManager.reload();
        await this.equipmentManager.render();
        this.equipmentManager.renderRoleStatus(this.roleManager.role);
    }

    private async dispose() {
        await this.roleManager.dispose();
        await this.accessoryStoreManager.dispose();
        await this.equipmentManager.dispose();
    }
}

export {TownAccessoryHousePageProcessor};