import StatefulPageProcessor from "../StatefulPageProcessor";
import Credential from "../../util/Credential";
import PageProcessorContext from "../PageProcessorContext";
import LocationModeTown from "../../core/location/LocationModeTown";
import {TownGemHousePageParser} from "../../core/forge/TownGemHousePageParser";
import PageUtils from "../../util/PageUtils";
import {GemManager} from "../../widget/GemManager";
import {EquipmentManager} from "../../widget/EquipmentManager";
import PersonalEquipmentManagementPage from "../../core/equipment/PersonalEquipmentManagementPage";
import KeyboardShortcutBuilder from "../../util/KeyboardShortcutBuilder";
import {PocketFormGenerator, PocketPage} from "../../pocket/PocketPage";
import ButtonUtils from "../../util/ButtonUtils";
import MessageBoard from "../../util/MessageBoard";
import {RoleManager} from "../../widget/RoleManager";

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
        this.resetMessageBoard();
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
            .bind();
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
            .find("> table:first > tbody:first > tr:first > td:eq(1)")
            .find("> table:first > tbody:first > tr:first > td:first")
            .html(() => {
                return this.roleManager.generateHTML();
            });

        table.find("> tbody:first > tr:eq(2) > td:first")
            .find("> table:first > tbody:first > tr:first > td:first")
            .attr("id", "messageBoard")
            .css("color", "wheat")
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
        $("#refreshButton").on("click", () => {
            PocketPage.scrollIntoTitle();
            PocketPage.disableStatelessElements();
            this.resetMessageBoard();
            this.refresh().then(() => {
                MessageBoard.publishMessage("刷新操作执行完成。");
                PocketPage.enableStatelessElements();
            });
        });
    }

    private resetMessageBoard() {
        MessageBoard.resetMessageBoard("" +
            "<b style='color:yellow'>宝石屋改造的一些说明：</b><br>" +
            "正在使用中的装备除了宠物蛋之外不允许镶嵌。<br>" +
            "自动砸宝石功能持续进行，会自动结束，无需干涉。<br>" +
            "威力负数、武器威力100、防具威力100、饰品威力50时会自动中断。" +
            "");
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