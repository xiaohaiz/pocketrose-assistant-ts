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
import {CacheManager} from "../../widget/CacheManager";
import {PocketEvent} from "../../pocket/PocketEvent";
import {PocketFormGenerator, PocketPage} from "../../pocket/PocketPage";
import {RoleManager} from "../../widget/RoleManager";

class CountryCacheManagementPageProcessor extends StatefulPageProcessor {

    private readonly location: LocationModeTown;
    private readonly roleManager: RoleManager;
    private readonly cacheManager: CacheManager;

    constructor(credential: Credential, context: PageProcessorContext) {
        super(credential, context);
        this.location = this.createLocationMode() as LocationModeTown;
        this.roleManager = new RoleManager(credential, this.location);
        this.cacheManager = new CacheManager(credential, this.location);
    }


    protected async doProcess(): Promise<void> {
        await this.generateHTML();
        await this.resetMessageBoard();
        await this.bindButtons();
        this.roleManager.bindButtons();
        this.cacheManager.bindButtons();
        await this.roleManager.reload();
        $("#roleInformationManager").html(() => {
            return this.roleManager.role!.imageHTML;
        });
        await this.roleManager.render();
        await this.cacheManager.reload();
        await this.cacheManager.render();
        await this.render();
        KeyboardShortcutBuilder.newInstance()
            .onKeyPressed("r", () => PageUtils.triggerClick("refreshButton"))
            .onEscapePressed(() => PageUtils.triggerClick("returnButton"))
            .withDefaultPredicate()
            .doBind();
    }

    private async generateHTML() {
        const mainTable = $("body:first > table:first");
        mainTable.find("> tbody:first")
            .find("> tr:first > td:first")
            .removeAttr("height")
            .html(() => {
                return PocketPage.generatePageHeaderHTML("＜＜  缓 存 管 理  ＞＞", this.roleLocation);
            });
        $("#_pocket_page_command").html(() => {
            const refreshButtonTitle = ButtonUtils.createTitle("刷新", "r");
            const returnButtonTitle = ButtonUtils.createTitle("退出", "Esc");
            return "<span> <button role='button' class='C_pocket_StableButton C_pocket_StatelessElement' id='refreshButton'>" + refreshButtonTitle + "</button></span>" +
                "<span> <button role='button' class='C_pocket_StableButton C_pocket_StatelessElement' id='returnButton'>" + returnButtonTitle + "</button></span>";
        });

        mainTable.find("> tbody:first")
            .find("> tr:eq(1) > td:first")
            .removeAttr("height")
            .find("> table:first > tbody:first")
            .find("> tr:first > td:first")
            .attr("id", "roleInformationManager")
            .html(() => {
                return NpcLoader.getNpcImageHtml("U_041")!;
            })
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
            .html(() => {
                return this.cacheManager.generateHTML();
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

    private async render() {
    }

    private async refresh() {
        await this.roleManager.reload();
        $("#roleInformationManager").html(() => {
            return this.roleManager.role!.imageHTML;
        });
        await this.roleManager.render();
        await this.cacheManager.reload();
        await this.cacheManager.render();
        await this.render();
    }

    private async dispose() {
        await this.roleManager.dispose();
        await this.cacheManager.dispose();
    }
}

export {CountryCacheManagementPageProcessor};