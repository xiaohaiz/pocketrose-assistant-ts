import ButtonUtils from "../../util/ButtonUtils";
import CastleBank from "../../core/bank/CastleBank";
import CastleEntrance from "../../core/castle/CastleEntrance";
import CastleInn from "../../core/inn/CastleInn";
import Coordinate from "../../util/Coordinate";
import Credential from "../../util/Credential";
import KeyboardShortcutBuilder from "../../util/KeyboardShortcutBuilder";
import LocationModeCastle from "../../core/location/LocationModeCastle";
import LocationModeTown from "../../core/location/LocationModeTown";
import MapBuilder from "../../core/map/MapBuilder";
import MessageBoard from "../../util/MessageBoard";
import PageProcessorContext from "../PageProcessorContext";
import PageUtils from "../../util/PageUtils";
import StatefulPageProcessor from "../StatefulPageProcessor";
import StringUtils from "../../util/StringUtils";
import Town from "../../core/town/Town";
import TownBank from "../../core/bank/TownBank";
import TownEntrance from "../../core/town/TownEntrance";
import TownLoader from "../../core/town/TownLoader";
import TravelPlanExecutor from "../../core/map/TravelPlanExecutor";
import {PocketFormGenerator, PocketPage} from "../../pocket/PocketPage";
import {RoleManager} from "../../widget/RoleManager";

class CastlePostHousePageProcessor extends StatefulPageProcessor {

    private readonly location: LocationModeCastle;
    private readonly roleManager: RoleManager;

    constructor(credential: Credential, context: PageProcessorContext) {
        super(credential, context);
        this.location = this.createLocationMode() as LocationModeCastle;
        this.roleManager = new RoleManager(credential, this.location);
    }

    protected async doProcess(): Promise<void> {
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
        const table = $("body:first > table:first > tbody:first > tr:first > td:first > table:first");
        table.find("> tbody:first > tr:first > td:first")
            .removeAttr("height")
            .html(() => {
                return PocketPage.generatePageHeaderHTML("＜＜  城 堡 驿 站  ＞＞", this.roleLocation);
            });
        $("#_pocket_page_command").html(() => {
            const refreshButtonTitle = ButtonUtils.createTitle("刷新", "r");
            const returnButtonTitle = ButtonUtils.createTitle("退出", "Esc");
            return "" +
                "<span> <button role='button' class='C_pocket_StatelessElement' id='leaveButton'>出城</button></span>" +
                "<span> <button role='button' class='C_pocket_StatelessElement' id='lodgeButton'>住宿</button></span>" +
                "<span> <button role='button' class='C_pocket_StatelessElement' id='refreshButton'>" + refreshButtonTitle + "</button></span>" +
                "<span> <button role='button' class='C_pocket_StatelessElement' id='returnButton'>" + returnButtonTitle + "</button></span>";
        });

        table.find("> tbody:first > tr:eq(1) > td:first")
            .find("> table:first > tbody:first > tr:first > td:last")
            .html(() => {
                return this.roleManager.generateHTML();
            });

        table.find("> tbody:first > tr:eq(2) > td:first")
            .find("> table:first > tbody:first > tr:first > td:first")
            .removeAttr("bgcolor")
            .attr("id", "messageBoard")
            .css("background-color", "black")
            .css("color", "white");

        table.find("> tbody:first > tr:eq(3) > td:first")
            .attr("id", "mapPanel");
    }

    private async resetMessageBoard() {
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
        $("#_pocket_page_extension_1").html(() => {
            return new PocketFormGenerator(this.credential, this.location).generateLeaveForm() ?? "";
        });
        $("#leaveButton").on("click", async () => {
            PageUtils.disablePageInteractiveElements();
            await this.dispose();
            PageUtils.triggerClick("_pocket_LeaveSubmit");
        });
        $("#lodgeButton").on("click", async () => {
            PocketPage.disableStatelessElements();
            if (await this._restoreRole()) {
                MessageBoard.publishMessage("完全恢复了体力和魔力。");
            }
            PocketPage.enableStatelessElements();
        });
    }

    private async render() {
        $(".location_button_class").off("click").off("mouseenter").off("mouseleave");
        const panel = $("#mapPanel");
        panel.html(() => {
            return MapBuilder.buildMapTable();
        });
        MapBuilder.updateTownBackgroundColor();

        const castle = this.roleManager.role!.castle!;
        const buttonId = "location_" + castle.coordinate!.x + "_" + castle.coordinate!.y;
        $("#" + buttonId)
            .closest("td")
            .css("background-color", "black")
            .css("color", "yellow")
            .css("text-align", "center")
            .html("堡");

        await this._bindMapButtons();
    }

    private async refresh() {
        await this.roleManager.reload();
        await this.roleManager.render();
        await this.render();
    }

    private async dispose() {
        await this._restoreRole();
        await this.roleManager.dispose();
    }

    private async _restoreRole() {
        const role = this.roleManager.role;
        if (role) {
            if (role.health! !== role.maxHealth! || role.mana! !== role.maxMana!) {
                await new CastleInn(this.credential).recovery();
                return true;
            }
        }
        return false;
    }

    private async _bindMapButtons() {
        const instance = this;
        $(".location_button_class")
            .on("mouseenter", function () {
                $(this).css("background-color", "red");
            })
            .on("mouseleave", function () {
                const s = $(this).parent().attr("class")!;
                const c = StringUtils.substringAfter(s, "_");
                if (c !== "none") {
                    $(this).css("background-color", c);
                } else {
                    $(this).removeAttr("style");
                }
            })
            .on("click", async function () {
                const title = $(this).parent().attr("title")!;
                const ss = ($(this).attr("id") as string).split("_");
                const x = parseInt(ss[1]);
                const y = parseInt(ss[2]);
                const coordinate = new Coordinate(x, y);

                let townName = "";
                let confirmation = false;
                if (title.startsWith("城市")) {
                    townName = StringUtils.substringAfterLast(title, " ");
                    confirmation = confirm("确认移动到" + townName + "？");
                } else if (title.startsWith("坐标")) {
                    confirmation = confirm("确认移动到坐标" + coordinate.asText() + "？");
                }
                if (!confirmation) {
                    return;
                }

                // 准备切换到移动模式
                PocketPage.scrollIntoTitle();
                MessageBoard.publishMessage("准备进入移动模式。");
                $("#leaveButton").prop("disabled", true).parent().hide();
                $("#lodgeButton").prop("disabled", true).parent().hide();
                $("#refreshButton").prop("disabled", true).parent().hide();
                $("#returnButton").prop("disabled", true).parent().hide();
                $(".location_button_class")
                    .prop("disabled", true)
                    .off("mouseenter")
                    .off("mouseleave");

                if (townName !== "") {
                    const town = TownLoader.load(coordinate)!;
                    await instance._travelToTown(town);
                } else {
                    await instance._travelToLocation(coordinate);
                }
            });
    }

    private async _travelToTown(town: Town) {
        MessageBoard.publishMessage("目的地城市：<span style='color:greenyellow'>" + town.name + "</span>");
        MessageBoard.publishMessage("目的地坐标：<span style='color:greenyellow'>" + town.coordinate.asText() + "</span>");

        await this._restoreRole();
        await new CastleBank(this.credential).withdraw(10);
        await this.roleManager.reload();
        await this.roleManager.render();
        const plan = await new CastleEntrance(this.credential).leave();
        plan.destination = town.coordinate;
        await new TravelPlanExecutor(plan).execute();
        await new TownEntrance(this.credential).enter(town.id);
        await new TownBank(this.credential, town.id).deposit();
        await this.roleManager.reload();
        await this.roleManager.render();
        $("#_pocket_page_extension_0").html(() => {
            return new PocketFormGenerator(this.credential, new LocationModeTown(town.id)).generateReturnFormHTML();
        });
        MessageBoard.publishMessage("<span style='color:yellow;font-size:120%;font-weight:bold'>旅途愉快，下次再见。</span>");
        const returnButton = $("#returnButton");
        returnButton.prop("disabled", false).parent().show();
        returnButton.trigger("click");
    }

    private async _travelToLocation(location: Coordinate) {
        MessageBoard.publishMessage("目的地坐标：<span style='color:greenyellow'>" + location.asText() + "</span>");

        await this._restoreRole();
        await this.roleManager.reload();
        await this.roleManager.render();
        const plan = await new CastleEntrance(this.credential).leave();
        plan.destination = location;
        await new TravelPlanExecutor(plan).execute();
        MessageBoard.publishMessage("<span style='color:yellow;font-size:120%;font-weight:bold'>旅途愉快，下次再见。</span>");
        $("#returnButton").prop("disabled", false).parent().show();
    }
}

export {CastlePostHousePageProcessor};