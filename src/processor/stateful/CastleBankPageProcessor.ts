import StatefulPageProcessor from "../StatefulPageProcessor";
import Credential from "../../util/Credential";
import PageProcessorContext from "../PageProcessorContext";
import LocationModeCastle from "../../core/location/LocationModeCastle";
import {BankManager} from "../../widget/BankManager";
import MessageBoard from "../../util/MessageBoard";
import {CastleBankPageParser} from "../../core/bank/BankPageParser";
import PageUtils from "../../util/PageUtils";
import KeyboardShortcutBuilder from "../../util/KeyboardShortcutBuilder";
import {PocketPage} from "../../pocket/PocketPage";
import ButtonUtils from "../../util/ButtonUtils";

class CastleBankPageProcessor extends StatefulPageProcessor {

    private readonly bankManager: BankManager;

    constructor(credential: Credential, context: PageProcessorContext) {
        super(credential, context);

        const locationMode = this.createLocationMode() as LocationModeCastle;
        this.bankManager = new BankManager(credential, locationMode);
        this.bankManager.feature.enableWriteRecordOnDispose = true;
        this.bankManager.feature.enableSalaryDistribution = true;
        this.bankManager.feature.onMessage = s => {
            MessageBoard.publishMessage(s);
        };
        this.bankManager.feature.onWarning = s => {
            MessageBoard.publishWarning(s);
        };
        this.bankManager.feature.onRefresh = () => {
            this.renderRole();
        };
    }

    protected async doProcess(): Promise<void> {
        this.bankManager.bankPage = CastleBankPageParser.parsePage(PageUtils.currentPageHtml());
        await this.createPage();
        this.bindButtons();
        this.bankManager.bindButtons();
        await this.bankManager.render();
        KeyboardShortcutBuilder.newInstance()
            .onKeyPressed("r", () => PageUtils.triggerClick("refreshButton"))
            .onEscapePressed(() => PageUtils.triggerClick("returnButton"))
            .withDefaultPredicate()
            .bind();
    }

    private async createPage() {
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
            .find("> table:first > tbody:first > tr:first > td:eq(3)")
            .find("> table:first > tbody:first > tr:first > td:first")
            .find("> table:first > tbody:first > tr:eq(2) > td:eq(1)")
            .attr("id", "_pocket_RoleCash");

        table.find("> tbody:first > tr:eq(2) > td:first")
            .find("> table:first > tbody:first > tr:first > td:first")
            .attr("id", "messageBoard")
            .css("color", "wheat")
            .next()
            .attr("id", "messageBoardManager");

        table.find("> tbody:first > tr:eq(3) > td:first")
            .attr("id", "_pocket_BankManagerPanel")
            .html(() => {
                return this.bankManager.generateHTML();
            });
    }

    private bindButtons(): void {
        $("#_pocket_page_extension_0").html(() => {
            return PageUtils.generateReturnCastleForm(this.credential);
        });
        $("#returnButton").on("click", () => {
            PageUtils.disablePageInteractiveElements();
            this.beforeReturn().then(() => {
                PageUtils.triggerClick("returnCastle");
            });
        });
        $("#refreshButton").on("click", () => {
            PocketPage.disableStatelessElements();
            PocketPage.scrollIntoTitle();
            MessageBoard.resetMessageBoard(this.bankManager.bankPage!.welcomeMessage!);
            this.refresh().then(() => {
                MessageBoard.publishMessage("刷新操作完成。");
                PocketPage.enableStatelessElements();
            });
        });
    }

    private async beforeReturn() {
        await this.bankManager.dispose();
    }

    private async refresh() {
        await this.bankManager.reload();
        await this.bankManager.render();
        this.renderRole();
    }

    private renderRole() {
        const cash = this.bankManager.bankPage!.account!.cash;
        $("#_pocket_RoleCash").html(() => {
            return cash + " GOLD";
        });
    }
}

export {CastleBankPageProcessor};