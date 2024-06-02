import StatefulPageProcessor from "../StatefulPageProcessor";
import Credential from "../../util/Credential";
import PageProcessorContext from "../PageProcessorContext";
import LocationModeTown from "../../core/location/LocationModeTown";
import {RoleManager} from "../../widget/RoleManager";
import {PocketFormGenerator, PocketPage} from "../../pocket/PocketPage";
import ButtonUtils from "../../util/ButtonUtils";
import PageUtils from "../../util/PageUtils";
import KeyboardShortcutBuilder from "../../util/KeyboardShortcutBuilder";
import MessageBoard from "../../util/MessageBoard";
import TownInn from "../../core/inn/TownInn";
import MapBuilder from "../../core/map/MapBuilder";
import CastleInformation from "../../core/dashboard/CastleInformation";
import StringUtils from "../../util/StringUtils";
import Coordinate from "../../util/Coordinate";
import TownLoader from "../../core/town/TownLoader";
import Castle from "../../core/castle/Castle";
import Town from "../../core/town/Town";
import TownBank from "../../core/bank/TownBank";
import TownEntrance from "../../core/town/TownEntrance";
import TravelPlanExecutor from "../../core/map/TravelPlanExecutor";
import CastleEntrance from "../../core/castle/CastleEntrance";
import LocationModeCastle from "../../core/location/LocationModeCastle";
import LocationModeMap from "../../core/location/LocationModeMap";
import MouseClickEventBuilder from "../../util/MouseClickEventBuilder";
import {PocketEvent} from "../../pocket/PocketEvent";
import NpcLoader from "../../core/role/NpcLoader";
import PocketPageRenderer from "../../util/PocketPageRenderer";
import TownForgeHouse from "../../core/forge/TownForgeHouse";

class TownPostHousePageProcessor extends StatefulPageProcessor {

    private readonly location: LocationModeTown;
    private readonly roleManager: RoleManager;

    constructor(credential: Credential, context: PageProcessorContext) {
        super(credential, context);
        this.location = this.createLocationMode() as LocationModeTown;
        this.roleManager = new RoleManager(credential, this.location);
    }

    protected async doProcess(): Promise<void> {
        ButtonUtils.loadButtonStyle(10028);
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
            .removeAttr("bgcolor")
            .removeAttr("height")
            .html(() => {
                return PocketPage.generatePageHeaderHTML("＜＜  口 袋 驿 站  ＞＞", this.roleLocation);
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
            .css("background-color", "black")
            .css("color", "white")
            .closest("tr")
            .find("> td:last")
            .attr("id", "messageBoardManager");

        table.find("> tbody:first > tr:eq(3) > td:first")
            .attr("id", "mapPanel");

        if (this.townId === "12") {
            // 当前城市是枫丹
            $("#mapPanel").closest("tr")
                .before($("<tr><td style='background-color:#F8F0E0' id='metroStation'></td></tr>"));
            $("#metroStation").html(() => {
                return "<table style='background-color:#888888;margin:auto;border-width:0'>" +
                    "<tbody style='background-color:#F8F0E0;text-align:center'>" +
                    "<tr>" +
                    "<td style='width:64px;height:64px' rowspan='2'>" + NpcLoader.getTaskNpcImageHtml("东方不败") + "</td>" +
                    "<th style='background-color:skyblue;font-size:120%'>" +
                    "欢迎您的到来，勇敢的冒险者，这里是枫丹地铁站9¾站台。<br>" +
                    "放心选择以下车次，出发前我们会帮您把所有现金存入银行，并回复您所有的体力。" +
                    "</th>" +
                    "</tr>" +
                    "<tr>" +
                    "<td>" +
                    "<button role='button' class='button-10028' id='disneyButton'>　白雪公主号（终点迪士尼）　</button>" +
                    PocketPageRenderer.OR() +
                    "<button role='button' class='button-10028' id='tangButton'>　贞观盛世号（终点唐朝）　</button>" +
                    "</td>" +
                    "</tr>" +
                    "</tbody>" +
                    "</table>";
            });
        }
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

        if (this.townId === "12") {
            // 当前城市是枫丹
            // 提供直接去迪士尼和唐朝的表单
            $("#_pocket_page_extension_2").html(() => {
                let form = "";
                // noinspection HtmlUnknownTarget
                form += "<form action='map.cgi' method='post'>";
                form += "<input type='hidden' name='id' value='" + this.credential.id + "'>";
                form += "<input type='hidden' name='pass' value='" + this.credential.pass + "'>";
                form += "<input type='hidden' name='select' value='0'>";
                form += "<input type='hidden' name='out' value='underway'>";
                form += "<input type='hidden' name='mode' value='MAP_MOVE'>";
                form += "<input type='submit' id='_pocket_DisneySubmit'>";
                form += "</form>";
                return form;
            });
            $("#disneyButton").on("click", async () => {
                await new TownBank(this.credential, this.townId).depositAll();
                await new TownInn(this.credential, this.townId).recovery();
                await new TownForgeHouse(this.credential, this.townId).repairAll();
                await this.dispose();
                PageUtils.triggerClick("_pocket_DisneySubmit");
            });
            $("#_pocket_page_extension_3").html(() => {
                let form = "";
                // noinspection HtmlUnknownTarget
                form += "<form action='town.cgi' method='post'>";
                form += "<input type='hidden' name='id' value='" + this.credential.id + "'>";
                form += "<input type='hidden' name='pass' value='" + this.credential.pass + "'>";
                form += "<input type='hidden' name='select' value='1'>";
                form += "<input type='hidden' name='mode' value='FLYMOVE'>";
                form += "<input type='submit' id='_pocket_TangSubmit'>";
                form += "</form>";
                return form;
            });
            $("#tangButton").on("click", async () => {
                if (!confirm("不推荐去唐朝，那里还没有完工，乱七八糟的。您确定要去？")) return;
                if (!confirm("真的，好多人去了唐朝都不知道怎么回来。您依然坚持要去？")) return;
                await new TownBank(this.credential, this.townId).depositAll();
                await new TownInn(this.credential, this.townId).recovery();
                await this.dispose();
                PageUtils.triggerClick("_pocket_TangSubmit");
            });
        }

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
        $(".location_button_class").off("click").off("mouseenter").off("mouseleave");
        const panel = $("#mapPanel");
        panel.html(() => {
            return MapBuilder.buildMapTable();
        });
        MapBuilder.updateTownBackgroundColor();

        const town = this.town!;
        const buttonId = "location_" + town.coordinate.x + "_" + town.coordinate.y;
        const currentLocation = $("#" + buttonId);
        currentLocation
            .closest("td")
            .css("background-color", "black")
            .css("color", "yellow")
            .css("text-align", "center")
            .html(currentLocation.val() as string);

        await this._bindMapButtons();

        new CastleInformation().open().then(castlePage => {
            const castle = castlePage.findByRoleName(this.roleManager.role!.name!);
            if (castle) {
                const coordinate = castle.coordinate!;
                const buttonId = "location_" + coordinate.x + "_" + coordinate.y;
                $("#" + buttonId)
                    .attr("value", "堡")
                    .css("background-color", "fuchsia")
                    .parent()
                    .attr("title", "城堡" + coordinate.asText() + " " + castle.name)
                    .attr("class", "color_fuchsia");
            }
        });
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
                let castleName = "";
                let confirmation;
                if (title.startsWith("城市")) {
                    townName = StringUtils.substringAfterLast(title, " ");
                    confirmation = confirm("确认移动到" + townName + "？");
                } else if (title.startsWith("城堡")) {
                    castleName = StringUtils.substringAfterLast(title, " ");
                    confirmation = confirm("确认回到" + castleName + "？");
                } else {
                    confirmation = confirm("确认移动到坐标" + coordinate.asText() + "？");
                }
                if (!confirmation) {
                    return;
                }

                PageUtils.disableElement("disneyButton");
                PageUtils.disableElement("tangButton");

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
                } else if (castleName !== "") {
                    const castle = new Castle();
                    castle.name = castleName;
                    castle.coordinate = coordinate;
                    await instance._travelToCastle(castle);
                } else {
                    await instance._travelToLocation(coordinate);
                }
            });
    }

    private async _restoreRole() {
        const role = this.roleManager.role;
        if (role) {
            if (role.health! !== role.maxHealth! || role.mana! !== role.maxMana!) {
                await new TownInn(this.credential, this.townId).recovery();
                return true;
            }
        }
        return false;
    }

    private async _travelToTown(town: Town) {
        MessageBoard.publishMessage("目的地城市：<span style='color:greenyellow'>" + town.name + "</span>");
        MessageBoard.publishMessage("目的地坐标：<span style='color:greenyellow'>" + town.coordinate.asText() + "</span>");

        await this._restoreRole();
        await new TownBank(this.credential, this.townId).withdraw(10);
        await this.roleManager.reload();
        await this.roleManager.render();
        const plan = await new TownEntrance(this.credential).leave();
        plan.destination = town.coordinate;
        await new TravelPlanExecutor(plan).execute();
        await new TownEntrance(this.credential).enter(town.id);
        await new TownBank(this.credential, town.id).deposit();
        await this.roleManager.reload();
        await this.roleManager.render();
        MessageBoard.publishMessage("<span style='color:yellow;font-size:120%;font-weight:bold'>旅途愉快，下次再见。</span>");
        const returnButton = $("#returnButton");
        returnButton.prop("disabled", false).parent().show();
        returnButton.trigger("click");
    }

    private async _travelToCastle(castle: Castle) {
        MessageBoard.publishMessage("目的地城堡：<span style='color:greenyellow'>" + castle.name + "</span>");
        MessageBoard.publishMessage("目的地坐标：<span style='color:greenyellow'>" + castle.coordinate!.asText() + "</span>");

        await this._restoreRole();
        await this.roleManager.reload();
        await this.roleManager.render();
        const plan = await new TownEntrance(this.credential).leave();
        plan.destination = castle.coordinate;
        await new TravelPlanExecutor(plan).execute();
        await new CastleEntrance(this.credential).enter();
        $("#_pocket_page_extension_0").html(() => {
            return new PocketFormGenerator(this.credential, new LocationModeCastle(castle.name!)).generateReturnFormHTML();
        });
        MessageBoard.publishMessage("" +
            "<span style='color:yellow;font-size:120%;font-weight:bold'>" +
            "伟大的<span style='color:wheat'>" + this.roleManager.role!.name! + "</span>回到了忠诚的“" + castle.name! + "”。" +
            "</span>");
        const returnButton = $("#returnButton");
        returnButton.prop("disabled", false).parent().show();
        returnButton.trigger("click");
    }

    private async _travelToLocation(location: Coordinate) {
        MessageBoard.publishMessage("目的地坐标：<span style='color:greenyellow'>" + location.asText() + "</span>");

        await this._restoreRole();
        await this.roleManager.reload();
        await this.roleManager.render();
        const plan = await new TownEntrance(this.credential).leave();
        plan.destination = location;
        await new TravelPlanExecutor(plan).execute();
        $("#_pocket_page_extension_0").html(() => {
            return new PocketFormGenerator(this.credential, new LocationModeMap(location)).generateReturnFormHTML();
        });
        MessageBoard.publishMessage("<span style='color:yellow;font-size:120%;font-weight:bold'>旅途愉快，下次再见。</span>");
        $("#returnButton").prop("disabled", false).parent().show();
    }
}

export {TownPostHousePageProcessor};