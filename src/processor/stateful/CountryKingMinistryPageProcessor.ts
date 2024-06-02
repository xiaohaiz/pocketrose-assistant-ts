import ButtonUtils from "../../util/ButtonUtils";
import Credential from "../../util/Credential";
import KeyboardShortcutBuilder from "../../util/KeyboardShortcutBuilder";
import LocationModeTown from "../../core/location/LocationModeTown";
import MessageBoard from "../../util/MessageBoard";
import MouseClickEventBuilder from "../../util/MouseClickEventBuilder";
import NpcLoader from "../../core/role/NpcLoader";
import PageProcessorContext from "../PageProcessorContext";
import PageUtils from "../../util/PageUtils";
import StatefulPageProcessor from "../StatefulPageProcessor";
import {PocketEvent} from "../../pocket/PocketEvent";
import {PocketFormGenerator, PocketPage} from "../../pocket/PocketPage";
import {RoleManager} from "../../widget/RoleManager";
import {CountryKingMinistryPage, CountryKingMinistryPageParser} from "../../core/country/CountryKingMinistryPage";
import {CountryKingMinistry} from "../../core/country/CountryKingMinistry";

class CountryKingMinistryPageProcessor extends StatefulPageProcessor {

    private readonly location: LocationModeTown;
    private readonly roleManager: RoleManager;

    constructor(credential: Credential, context: PageProcessorContext) {
        super(credential, context);
        this.location = this.createLocationMode() as LocationModeTown;
        this.roleManager = new RoleManager(credential, this.location);
    }

    private kingMinistryPage?: CountryKingMinistryPage;

    protected async doProcess(): Promise<void> {
        this.kingMinistryPage = CountryKingMinistryPageParser.parse(PageUtils.currentPageHtml());
        await this.generateHTML();
        await this.resetMessageBoard();
        await this.bindButtons();
        this.roleManager.bindButtons();
        await this.roleManager.reload();
        await this.roleManager.render();
        await this.render();
        KeyboardShortcutBuilder.newInstance()
            .onKeyPressed("r", () => PageUtils.triggerClick("refreshButton"))
            .onEscapePressed(() => PageUtils.triggerClick("returnButton"))
            .withDefaultPredicate()
            .doBind();
    }

    private async generateHTML() {
        const mainTable = $("body:first > table:first");
        mainTable.removeAttr("height");
        mainTable.find("> tbody:first")
            .find("> tr:first > td:first")
            .removeAttr("height")
            .html(() => {
                return PocketPage.generatePageHeaderHTML("＜＜  皇 帝 内 阁  ＞＞", this.roleLocation);
            });
        $("#_pocket_page_command").html(() => {
            const refreshButtonTitle = ButtonUtils.createTitle("刷新", "r");
            const returnButtonTitle = ButtonUtils.createTitle("退出", "Esc");
            return "<span> <button role='button' class='C_pocket_StableButton C_pocket_StatelessElement' id='refreshButton'>" + refreshButtonTitle + "</button></span>" +
                "<span> <button role='button' class='C_pocket_StableButton C_pocket_StatelessElement' id='returnButton'>" + returnButtonTitle + "</button></span>";
        });

        mainTable.find("> tbody:first")
            .find("> tr:eq(1) > td:first")
            .find("> table:first > tbody:first")
            .find("> tr:first > td:first")
            .attr("id", "roleInformationManager")
            .closest("tr")
            .find("> td:eq(1)")
            .html(() => {
                return this.roleManager.generateHTML();
            });

        mainTable.find("> tbody:first")
            .find("> tr:eq(2) > td:first")
            .removeAttr("height")
            .attr("id", "messageBoardContainer");
        MessageBoard.createMessageBoardStyleB("messageBoardContainer", NpcLoader.randomNpcImageHtml());
        MessageBoard.createMessageBoardStyleB("messageBoardContainer", NpcLoader.randomNpcImageHtml());
        $("#messageBoard").css("background-color", "black")
            .css("color", "white");

        mainTable.find("> tbody:first")
            .find("> tr:eq(3) > td:first")
            .find("> center:first")
            .attr("id", "traditional");
        mainTable.find("> tbody:first")
            .find("> tr:eq(3) > td:first")
            .find("> form:first")
            .remove();
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
            MessageBoard.publishMessage("刷新操作完成。");
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

    private async reload() {
        this.kingMinistryPage = await new CountryKingMinistry(this.credential, this.townId).open();
    }

    private async render() {
        const container = $("#traditional");
        container.html(this.kingMinistryPage!.traditionalHTML!);

        if (!this.kingMinistryPage!.isKing(this.roleManager.role)) {
            container.find("> form:first").hide();
            container.find("> form:eq(1)").hide();
        }

        const title = this.kingMinistryPage!.ministries.get(this.credential.id);
        if (title) {
            const radio = $("input:radio[value='" + this.credential.id + "']");
            if (radio.length > 0) {
                const tr = radio.closest("tr");
                tr.find("> td:eq(1)")
                    .css("color", "red")
                    .css("font-weight", "bold");
                tr.find("> td:eq(2)")
                    .css("color", "red")
                    .css("font-weight", "bold");
            }
        } else {
            $("input:radio").prop("disabled", true).hide();
            $("input:submit[value='内阁成员解任或辞职']").prop("disabled", true).hide();
        }
    }

    private async refresh() {
        await this.roleManager.reload();
        await this.roleManager.render();
        await this.reload();
        await this.render();
    }

    private async dispose() {
        await this.roleManager.dispose();
    }
}

export {CountryKingMinistryPageProcessor};