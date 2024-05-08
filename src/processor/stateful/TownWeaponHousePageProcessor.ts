import StatefulPageProcessor from "../StatefulPageProcessor";
import Credential from "../../util/Credential";
import PageProcessorContext from "../PageProcessorContext";
import LocationModeTown from "../../core/location/LocationModeTown";
import {RoleManager} from "../../widget/RoleManager";
import {WeaponStoreManager} from "../../widget/WeaponStoreManager";
import TownWeaponHousePageParser from "../../core/store/TownWeaponHousePageParser";
import PageUtils from "../../util/PageUtils";
import {PocketFormGenerator, PocketPage} from "../../pocket/PocketPage";
import ButtonUtils from "../../util/ButtonUtils";
import KeyboardShortcutBuilder from "../../util/KeyboardShortcutBuilder";
import MessageBoard from "../../util/MessageBoard";
import {EquipmentManager} from "../../widget/EquipmentManager";

class TownWeaponHousePageProcessor extends StatefulPageProcessor {

    private readonly location: LocationModeTown;
    private readonly roleManager: RoleManager;
    private readonly weaponStoreManager: WeaponStoreManager;
    private readonly equipmentManager: EquipmentManager;

    constructor(credential: Credential, context: PageProcessorContext) {
        super(credential, context);
        this.location = this.createLocationMode() as LocationModeTown;
        this.roleManager = new RoleManager(credential, this.location);
        this.roleManager.feature.enableBankAccount = true;
        this.weaponStoreManager = new WeaponStoreManager(credential, this.location);
        this.weaponStoreManager.feature.enableAutoSellDragonBall = true;
        this.weaponStoreManager.feature.onRefresh = async () => {
            await this.roleManager.reload();
            await this.roleManager.render();
            await this.renderDiscountRate();
            await this.equipmentManager.reload();
            await this.equipmentManager.render();
            this.equipmentManager.renderRoleStatus(this.roleManager.role);
        }
        this.equipmentManager = new EquipmentManager(credential, this.location);
        this.equipmentManager.feature.enableRecoverItem = true;
        this.equipmentManager.feature.onRefresh = async () => {
            await this.roleManager.reload();
            await this.roleManager.render();
            await this.weaponStoreManager.reload();
            await this.weaponStoreManager.render();
            await this.renderDiscountRate();
            this.equipmentManager.renderRoleStatus(this.roleManager.role);
        };
    }

    protected async doProcess(): Promise<void> {
        this.weaponStoreManager.weaponPage = await new TownWeaponHousePageParser().parse(PageUtils.currentPageHtml());
        if (this.weaponStoreManager.weaponPage.townId !== this.townId!) return;
        await this.generateHTML();
        await this.resetMessageBoard();
        await this.bindButtons();
        this.roleManager.bindButtons();
        this.weaponStoreManager.bindButtons();
        await this.roleManager.reload();
        await this.roleManager.render();
        await this.weaponStoreManager.render();
        await this.renderDiscountRate();
        await this.equipmentManager.reload();
        await this.equipmentManager.render();
        this.equipmentManager.renderRoleStatus(this.roleManager.role);
        KeyboardShortcutBuilder.newInstance()
            .onKeyPressed("r", () => PageUtils.triggerClick("refreshButton"))
            .onEscapePressed(() => PageUtils.triggerClick("returnButton"))
            .withDefaultPredicate()
            .bind();
    }

    private async generateHTML() {
        const table = $("body:first > table:first > tbody:first > tr:first > td:first > table:first");
        table.parent().find("> form:first").remove();

        table.find("> tbody:first > form:first").remove();

        table.find("> tbody:first > tr:first > td:first")
            .removeAttr("height")
            .html(() => {
                return PocketPage.generatePageHeaderHTML("＜＜  武 器 商 店  ＞＞", this.roleLocation);
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
            .css("color", "white");

        table.find("> tbody:first > tr:eq(3) > td:first")
            .html(() => {
                return this.weaponStoreManager.generateHTML();
            })
            .parent()
            .after($("<tr><td>" + this.equipmentManager.generateHTML() + "</td></tr>"));
    }

    private async resetMessageBoard() {
        const message = "" +
            "<span style='font-weight:bold;font-size:120%;color:wheat'>" +
            "来都来了，要么买点啥，要么卖点啥，这是一种美德。本店当前的折扣率是：" +
            "<span style='background-color:red;color:white' id='discountRate'></span>" +
            "</span>";
        MessageBoard.resetMessageBoard(message);
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
            MessageBoard.publishMessage("刷新操作完成。");
        })
    }

    private async refresh() {
        await this.roleManager.reload();
        await this.roleManager.render();
        await this.weaponStoreManager.reload();
        await this.weaponStoreManager.render();
        await this.renderDiscountRate();
        await this.equipmentManager.reload();
        await this.equipmentManager.render();
        this.equipmentManager.renderRoleStatus(this.roleManager.role);
    }

    private async dispose() {
        await this.roleManager.dispose();
        await this.weaponStoreManager.dispose();
        await this.equipmentManager.dispose();
    }

    private async renderDiscountRate() {
        $("#discountRate").html(() => {
            return this.weaponStoreManager.weaponPage!.discount!.toFixed(2);
        });
    }

}

export {TownWeaponHousePageProcessor};