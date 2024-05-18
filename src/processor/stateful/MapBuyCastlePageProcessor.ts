import StatefulPageProcessor from "../StatefulPageProcessor";
import Credential from "../../util/Credential";
import PageProcessorContext from "../PageProcessorContext";
import LocationModeMap from "../../core/location/LocationModeMap";
import {PocketFormGenerator, PocketPage} from "../../pocket/PocketPage";
import PageUtils from "../../util/PageUtils";
import KeyboardShortcutBuilder from "../../util/KeyboardShortcutBuilder";
import MessageBoard from "../../util/MessageBoard";
import {PocketEvent} from "../../pocket/PocketEvent";
import MouseClickEventBuilder from "../../util/MouseClickEventBuilder";
import {PocketLogger} from "../../pocket/PocketLogger";
import _ from "lodash";
import MapBuilder from "../../core/map/MapBuilder";
import Coordinate from "../../util/Coordinate";
import {CastleDashboard} from "../../core/dashboard/CastleDashboard";
import CastleInformation from "../../core/dashboard/CastleInformation";
import CastleEntrance from "../../core/castle/CastleEntrance";

const logger = PocketLogger.getLogger("CASTLE");

class MapBuyCastlePageProcessor extends StatefulPageProcessor {

    private readonly location: LocationModeMap;

    constructor(credential: Credential, context: PageProcessorContext) {
        super(credential, context);
        this.location = this.createLocationMode() as LocationModeMap;
    }

    protected async doProcess(): Promise<void> {
        await this.generateHTML();
        await this.resetMessageBoard();
        await this.bindButtons();
        await this.render();
        KeyboardShortcutBuilder.newInstance()
            .onEscapePressed(() => PageUtils.triggerClick("returnButton"))
            .doBind();
    }

    private async generateHTML() {
        const mainTable = $("body:first > table:first > tbody:first")
            .find("> tr:first > td:first")
            .find("> table:first");

        mainTable.find("> tbody:first")
            .find("> tr:first > td:first")
            .html(() => {
                return PocketPage.generatePageHeaderHTML("＜＜  购 买 城 堡  ＞＞", this.roleLocation);
            });
        $("#_pocket_page_command").html(() => {
            return "<span> <button role='button' " +
                "class='C_pocket_StableButton C_pocket_StatelessElement' " +
                "id='returnButton'>退出</button></span>";
        });

        mainTable.find("> tbody:first")
            .find("> tr:eq(1) > td:first")
            .find("> table:first")
            .css("background-color", "#888888")
            .find("> tbody:first")
            .css("background-color", "#F8F0E0")
            .find("> tr:first > td:first")
            .attr("id", "roleInformationManager");

        mainTable.find("> tbody:first")
            .find("> tr:eq(2) > td:first")
            .find("> table:first > tbody:first")
            .find("> tr:first > td:first")
            .attr("id", "messageBoard")
            .css("color", "white")
            .closest("tr")
            .find("> td:eq(1)")
            .attr("id", "messageBoardManager");

        const td = mainTable.find("> tbody:first")
            .find("> tr:eq(3) > td:first")
            .css("background-color", "#F8F0E0");
        td.find("> center:first > form:eq(1)").remove();
        const form = td.find("> center:first > form:first");
        form.find("> font:first")
            .removeAttr("color")
            .css("color", "blue")
            .css("font-weight", "bold");
        form.find("> input:text:first")
            .attr("spellcheck", "false");
        form.find("> input:submit:first").prop("disabled", true).hide();
        form.after($("<button role='button' " +
            "class='C_pocket_StableButton C_pocket_StatelessElement' " +
            "id='buyButton'>购买城堡</button>"));

        mainTable.find("> tbody:first")
            .append($("<tr><td id='mapPanel' style='background-color:#F8F0E0'></td></tr>"));

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
            $("#_pocket_ReturnSubmit").trigger("click");
        });
        $("#_pocket_page_extension_1").html(() => {
            // noinspection HtmlUnknownTarget
            let html = "<form action='castlestatus.cgi' method='post'>";
            html += "<input type='hidden' name='id' value='" + this.credential.id + "'>";
            html += "<input type='hidden' name='pass' value='" + this.credential.pass + "'>"
            html += "<input type='hidden' name='mode' value='CASTLESTATUS'>";
            html += "<input type='submit' id='returnCastleSubmit'>";
            html += "</form>";
            return html;
        });
        $("#buyButton").on("click", async () => {
            const castleName = _.trim($("input:text[name='castlename']").val() as string);
            if (castleName === "") {
                logger.warn("城堡名不能为空！");
                return;
            }
            if (castleName.length > 20) {
                logger.warn("城堡名最长不能超过20个字！");
                return;
            }
            const message = await new CastleDashboard(this.credential).buy(castleName);
            if (message.success) {
                await new CastleInformation().evictCache();             // 购买成功清除缓存
                await new CastleEntrance(this.credential).enter();      // 进入城堡
                $("#returnCastleSubmit").trigger("click");
            }
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
        const panel = $("#mapPanel");
        panel.html(() => {
            return MapBuilder.buildMapTable();
        });
        MapBuilder.updateTownBackgroundColor();

        const coordinate = Coordinate.parse(this.context.get("coordinate")!);
        const buttonId = "location_" + coordinate.x + "_" + coordinate.y;
        $("#" + buttonId).closest("td")
            .css("background-color", "black")
            .css("color", "yellow")
            .css("text-align", "center")
            .html("你");
    }

    private async dispose() {
    }
}

export {MapBuyCastlePageProcessor};