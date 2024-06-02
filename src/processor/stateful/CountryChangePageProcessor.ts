import StatefulPageProcessor from "../StatefulPageProcessor";
import Credential from "../../util/Credential";
import PageProcessorContext from "../PageProcessorContext";
import LocationModeTown from "../../core/location/LocationModeTown";
import {RoleManager} from "../../widget/RoleManager";
import KeyboardShortcutBuilder from "../../util/KeyboardShortcutBuilder";
import PageUtils from "../../util/PageUtils";
import {PocketFormGenerator, PocketPage} from "../../pocket/PocketPage";
import ButtonUtils from "../../util/ButtonUtils";
import MessageBoard from "../../util/MessageBoard";
import {PocketEvent} from "../../pocket/PocketEvent";
import MouseClickEventBuilder from "../../util/MouseClickEventBuilder";
import {PocketLogger} from "../../pocket/PocketLogger";
import NpcLoader from "../../core/role/NpcLoader";
import {CountryKingMinistryPage} from "../../core/country/CountryKingMinistryPage";
import {CountryKingMinistry} from "../../core/country/CountryKingMinistry";
import {CountryChangePage, CountryChangePageParser} from "../../core/country/CountryChangePage";
import {CountryChange} from "../../core/country/CountryChange";

const logger = PocketLogger.getLogger("COUNTRY");

class CountryChangePageProcessor extends StatefulPageProcessor {

    private readonly location: LocationModeTown;
    private readonly roleManager: RoleManager;

    constructor(credential: Credential, context: PageProcessorContext) {
        super(credential, context);
        this.location = this.createLocationMode() as LocationModeTown;
        this.roleManager = new RoleManager(credential, this.location);
    }

    private changePage?: CountryChangePage;
    private kingMinistryPage?: CountryKingMinistryPage;

    protected async doProcess(): Promise<void> {
        await this.initializeProcessor();
        await this.generateHTML();
        await this.resetMessageBoard();
        this.roleManager.bindButtons();
        await this.bindButtons();
        await this.roleManager.reload();
        await this.roleManager.render();
        if (this.roleManager.role?.country === "在野") {
            this.kingMinistryPage = new CountryKingMinistryPage("在野", "");
        } else {
            this.kingMinistryPage = await new CountryKingMinistry(this.credential, this.townId).open();
        }
        await this.render();
        KeyboardShortcutBuilder.newInstance()
            .onKeyPressed("r", () => PageUtils.triggerClick("refreshButton"))
            .onEscapePressed(() => PageUtils.triggerClick("returnButton"))
            .withDefaultPredicate()
            .doBind();
    }

    private async initializeProcessor() {
        this.changePage = CountryChangePageParser.parse(PageUtils.currentPageHtml());
    }

    private async generateHTML() {
        const mainTable = $("body:first > table:first");
        mainTable.removeAttr("height");
        mainTable.find("> tbody:first")
            .find("> tr:first > td:first")
            .removeAttr("height")
            .html(() => {
                return PocketPage.generatePageHeaderHTML("＜＜  仕 官 下 野  ＞＞", this.roleLocation);
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
        $("#messageBoard").css("background-color", "black")
            .css("color", "white");

        mainTable.find("> tbody:first")
            .find("> tr:eq(3) > td:first")
            .removeAttr("height")
            .css("text-align", "center")
            .attr("id", "countryChangePanel")
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

    private async reload() {
        this.changePage = await new CountryChange(this.credential, this.townId).open();
    }

    private async render() {
        const panel = $("#countryChangePanel");
        panel.find("> p:first").html(() => {
            return this.changePage!.pHTML!;
        });
        panel.find("> center:first").html(() => {
            if (this.kingMinistryPage!.isKing(this.roleManager.role)) {
                return "<span style='color:red;font-weight:bold;font-size:300%'>" +
                    "陛下请三思，这个国家还有希望啊！<br>（当然如果没有你希望可能会更大...）" +
                    "</span>";
            }
            const title = this.kingMinistryPage!.ministries.get(this.credential.id);
            if (title) {
                return "<span style='color:red;font-weight:bold;font-size:300%'>" +
                    "请您自重，" + title + "阁下！<br>" +
                    "身为内阁重臣，出现在这里并不合适。" +
                    "</span>";
            }
            return this.changePage!.centerHTML!;
        });
    }

    private async refresh() {
        await this.roleManager.reload();
        await this.roleManager.render();
        if (this.roleManager.role?.country === "在野") {
            this.kingMinistryPage = new CountryKingMinistryPage("在野", "");
        } else {
            this.kingMinistryPage = await new CountryKingMinistry(this.credential, this.townId).open();
        }
        await this.reload();
        await this.render();
    }

    private async dispose() {
        await this.roleManager.dispose();
    }
}

export {CountryChangePageProcessor};