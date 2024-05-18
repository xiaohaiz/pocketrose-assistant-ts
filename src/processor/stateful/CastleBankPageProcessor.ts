import ButtonUtils from "../../util/ButtonUtils";
import Credential from "../../util/Credential";
import KeyboardShortcutBuilder from "../../util/KeyboardShortcutBuilder";
import LocationModeCastle from "../../core/location/LocationModeCastle";
import MessageBoard from "../../util/MessageBoard";
import MouseClickEventBuilder from "../../util/MouseClickEventBuilder";
import PageProcessorContext from "../PageProcessorContext";
import PageUtils from "../../util/PageUtils";
import StatefulPageProcessor from "../StatefulPageProcessor";
import {BankManager} from "../../widget/BankManager";
import {CastleBankPageParser} from "../../core/bank/BankPageParser";
import {PocketEvent} from "../../pocket/PocketEvent";
import {PocketFormGenerator, PocketPage} from "../../pocket/PocketPage";
import {PocketLogger} from "../../pocket/PocketLogger";
import {RoleManager} from "../../widget/RoleManager";

const logger = PocketLogger.getLogger("BANK");

class CastleBankPageProcessor extends StatefulPageProcessor {

    private readonly location: LocationModeCastle;
    private readonly roleManager: RoleManager;
    private readonly bankManager: BankManager;

    constructor(credential: Credential, context: PageProcessorContext) {
        super(credential, context);
        this.location = this.createLocationMode() as LocationModeCastle;
        this.roleManager = new RoleManager(credential, this.location);
        this.bankManager = new BankManager(credential, this.location);
        this.bankManager.feature.enableSalaryDistribution = true;
        this.bankManager.feature.onRefresh = async () => {
            await this.roleManager.reload();
            await this.roleManager.render();
        };
    }

    protected async doProcess(): Promise<void> {
        this.bankManager.bankPage = CastleBankPageParser.parsePage(PageUtils.currentPageHtml());
        await this.generateHTML();
        await this.bindButtons();
        this.roleManager.bindButtons();
        this.bankManager.bindButtons();
        await this.roleManager.reload();
        await this.roleManager.render();
        await this.bankManager.render();
        KeyboardShortcutBuilder.newInstance()
            .onKeyPressed("r", () => PageUtils.triggerClick("refreshButton"))
            .onEscapePressed(() => PageUtils.triggerClick("returnButton"))
            .withDefaultPredicate()
            .doBind();
    }

    private async generateHTML() {
        const table = $("body:first > table:first > tbody:first > tr:first > td:first > table:first");

        table.find("> tbody:first > tr:first > td:first")
            .html(() => {
                return PocketPage.generatePageHeaderHTML("＜＜ 雷 姆 力 亚 银 行 ☆ 城 堡 分 行 ＞＞", this.roleLocation);
            });
        $("#_pocket_page_command").html(() => {
            return "" +
                "<span> <button role='button' class='C_pocket_StatelessElement' id='refreshButton'>" + ButtonUtils.createTitle("刷新", "r") + "</button></span>" +
                "<span> <button role='button' class='C_pocket_StatelessElement' id='returnButton'>" + ButtonUtils.createTitle("退出", "Esc") + "</button></span>" +
                "";
        });

        table.find("> tbody:first > tr:eq(1) > td:first")
            .find("> table:first > tbody:first > tr:first > td:first")
            .attr("id", "roleInformationManager")
            .closest("tr")
            .find("> td:last")
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
            .attr("id", "_pocket_BankManagerPanel")
            .html(() => {
                return this.bankManager.generateHTML();
            });
    }

    private async resetMessageBoard() {
        MessageBoard.initializeManager();
        MessageBoard.initializeWelcomeMessage();
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
            PocketPage.scrollIntoTitle();
            PocketPage.disableStatelessElements();
            await this.resetMessageBoard();
            await this.refresh();
            logger.info("城堡银行刷新操作完成。");
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

    private async refresh() {
        await this.roleManager.reload();
        await this.roleManager.render();
        await this.bankManager.reload();
        await this.bankManager.render();
    }

    private async dispose() {
        await this.roleManager.dispose();
        await this.bankManager.dispose();
    }

}

export {CastleBankPageProcessor};