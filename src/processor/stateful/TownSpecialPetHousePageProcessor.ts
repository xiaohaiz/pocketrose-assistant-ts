import ButtonUtils from "../../util/ButtonUtils";
import Credential from "../../util/Credential";
import KeyboardShortcutBuilder from "../../util/KeyboardShortcutBuilder";
import LocationModeTown from "../../core/location/LocationModeTown";
import MessageBoard from "../../util/MessageBoard";
import NpcLoader from "../../core/role/NpcLoader";
import PageProcessorContext from "../PageProcessorContext";
import PageUtils from "../../util/PageUtils";
import StatefulPageProcessor from "../StatefulPageProcessor";
import {PocketFormGenerator, PocketPage} from "../../pocket/PocketPage";
import {RoleManager} from "../../widget/RoleManager";
import {SpecialPetManager} from "../../widget/SpecialPetManager";

class TownSpecialPetHousePageProcessor extends StatefulPageProcessor {

    private readonly location: LocationModeTown;
    private readonly roleManager: RoleManager;
    private readonly specialPetManager: SpecialPetManager;

    constructor(credential: Credential, context: PageProcessorContext) {
        super(credential, context);
        this.location = this.createLocationMode() as LocationModeTown;
        this.roleManager = new RoleManager(credential, this.location);
        this.specialPetManager = new SpecialPetManager(credential, this.location);
    }

    protected async doProcess(): Promise<void> {
        await this.generateHTML();
        this.resetMessageBoard();
        await this.bindButtons();
        this.roleManager.bindButtons();
        this.specialPetManager.bindButtons();
        await this.roleManager.reload();
        await this.roleManager.render();
        await this.specialPetManager.reload();
        await this.specialPetManager.render();
        KeyboardShortcutBuilder.newInstance()
            .onKeyPressed("r", () => PageUtils.triggerClick("refreshButton"))
            .onEscapePressed(() => PageUtils.triggerClick("returnButton"))
            .withDefaultPredicate()
            .bind();
    }

    private async generateHTML() {
        const table = $("body:first > table:first > tbody:first > tr:first > td:first > table:first");
        table.find("> tbody:first > tr:first > td:first")
            .removeAttr("bgcolor")
            .removeAttr("height")
            .html(() => {
                return PocketPage.generatePageHeaderHTML("＜＜ 特 殊 宠 物 管 理 ＞＞", this.roleLocation);
            });
        $("#_pocket_page_command").html(() => {
            const refreshButtonTitle = ButtonUtils.createTitle("刷新", "r");
            const returnButtonTitle = ButtonUtils.createTitle("退出", "Esc");
            return "" +
                "<span> <button role='button' class='C_pocket_StatelessElement' id='refreshButton'>" + refreshButtonTitle + "</button></span>" +
                "<span> <button role='button' class='C_pocket_StatelessElement' id='returnButton'>" + returnButtonTitle + "</button></span>" +
                "";
        });
        table.find("> tbody:first > tr:eq(1) > td:first")
            .find("> table:first > tbody:first > tr:first > td:eq(1)")
            .html(() => {
                return this.roleManager.generateHTML();
            });
        table.find("> tbody:first > tr:eq(2) > td:first")
            .removeAttr("height")
            .attr("id", "messageBoardContainer");
        MessageBoard.createMessageBoardStyleB("messageBoardContainer", NpcLoader.randomNpcImageHtml());
        const messageBoard = $("#messageBoard");
        messageBoard.css("background-color", "black")
            .css("color", "white");

        table.find("> tbody:first > tr:eq(3) > td:first").html(() => {
            return this.specialPetManager.generateHTML();
        });
    }

    private resetMessageBoard() {
        MessageBoard.resetMessageBoard("" +
            "<span style='color:wheat;font-weight:bold;font-size:120%'>" +
            "管理特殊宠物，一时改名一时爽，只有你自己才知道那些稀奇古怪的名字对应的是什么宠物。" +
            "</span><br>" +
            "<span style='color:yellow;font-weight:bold;font-size:120%'>" +
            "自制屋不见了？这年代谁还玩那玩意。自制武器就是个从开站起就没有任何用处的玩意。" +
            "</span>" +
            "");
    }

    private async bindButtons() {
        $("#_pocket_page_extension_0").html(() => {
            return new PocketFormGenerator(this.credential, this.location).generateReturnFormHTML();
        });
        $("#returnButton").on("click", () => {
            PageUtils.disablePageInteractiveElements();
            this.dispose().then(() => {
                PageUtils.triggerClick("_pocket_ReturnSubmit");
            })
        });
        $("#refreshButton").on("click", () => {
            PocketPage.scrollIntoTitle();
            PocketPage.disableStatelessElements();
            this.resetMessageBoard();
            this.refresh().then(() => {
                MessageBoard.publishMessage("刷新操作完成！");
                PocketPage.enableStatelessElements();
            });
        });
    }

    private async refresh() {
        await this.roleManager.reload();
        await this.roleManager.render();
        await this.specialPetManager.reload();
        await this.specialPetManager.render();
    }

    private async dispose() {
        await this.roleManager.dispose();
        await this.specialPetManager.dispose();
    }
}

export {TownSpecialPetHousePageProcessor};