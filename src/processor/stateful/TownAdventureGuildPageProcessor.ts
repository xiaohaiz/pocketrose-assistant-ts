import StatefulPageProcessor from "../StatefulPageProcessor";
import Credential from "../../util/Credential";
import PageProcessorContext from "../PageProcessorContext";
import LocationModeTown from "../../core/location/LocationModeTown";
import {RoleManager} from "../../widget/RoleManager";
import {PocketFormGenerator, PocketPage} from "../../pocket/PocketPage";
import ButtonUtils from "../../util/ButtonUtils";
import PageUtils from "../../util/PageUtils";
import MessageBoard from "../../util/MessageBoard";
import KeyboardShortcutBuilder from "../../util/KeyboardShortcutBuilder";
import NpcLoader from "../../core/role/NpcLoader";
import TreasureHint from "../../core/equipment/TreasureHint";
import TreasureHintParser from "../../core/adventure/TreasureHintParser";
import {TownAdventureGuild} from "../../core/adventure/TownAdventureGuild";
import MapBuilder from "../../core/map/MapBuilder";
import StringUtils from "../../util/StringUtils";
import _ from "lodash";
import TownBank from "../../core/bank/TownBank";
import Coordinate from "../../util/Coordinate";
import Town from "../../core/town/Town";
import TownEntrance from "../../core/town/TownEntrance";
import MapExplorer from "../../core/map/MapExplorer";
import TravelPlan from "../../core/map/TravelPlan";
import TravelPlanExecutor from "../../core/map/TravelPlanExecutor";

class TownAdventureGuildPageProcessor extends StatefulPageProcessor {

    private readonly location: LocationModeTown;
    private readonly roleManager: RoleManager;

    constructor(credential: Credential, context: PageProcessorContext) {
        super(credential, context);
        this.location = this.createLocationMode() as LocationModeTown;
        this.roleManager = new RoleManager(credential, this.location);
        this.roleManager.feature.enableBankAccount = true;
    }

    treasureHints?: TreasureHint[];

    protected async doProcess(): Promise<void> {
        this.treasureHints = TreasureHintParser.parseTreasureHintList(PageUtils.currentPageHtml());
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
            .bind();
    }

    private async generateHTML() {
        const table = $("body:first > table:first > tbody:first > tr:first > td:first > table:first");

        table.find("> tbody:first > tr:first > td:first")
            .removeAttr("height")
            .html(() => {
                return PocketPage.generatePageHeaderHTML("＜＜  冒 险 家 公 会  ＞＞", this.roleLocation);
            });
        $("#_pocket_page_command").html(() => {
            const refreshButtonTitle = ButtonUtils.createTitle("刷新", "r");
            const returnButtonTitle = ButtonUtils.createTitle("退出", "Esc");
            return "" +
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
            .removeAttr("width")
            .removeAttr("bgcolor")
            .css("width", "100%")
            .css("background-color", "black")
            .css("color", "white")
            .attr("id", "messageBoard")
            .next()
            .html(NpcLoader.getNpcImageHtml("花子")!);

        table.find("> tbody:first > tr:eq(3) > td:first")
            .attr("id", "treasureHint")
            .html("");
    }

    private async resetMessageBoard() {
        MessageBoard.resetMessageBoard("" +
            "<span style='color:wheat;font-weight:bold;font-size:120%'>" +
            "S、S、SHIT，隔壁驿站推出了新的业务，抢、抢走了我的生意，幸亏挖宝的还得来我这儿！" +
            "</span>");
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
            MessageBoard.publishMessage("Refresh operation finished successfully.");
            PocketPage.enableStatelessElements();
        });
    }

    private async reload() {
        this.treasureHints = (await new TownAdventureGuild(this.credential).open()).treasureHints;
    }

    private async render() {
        $(".C_TreasureHintButton").off("click");
        $(".C_TreasureHint").off("mouseenter").off("mouseleave");

        const container = $("#treasureHint");
        if (this.treasureHints!.length === 0) {
            container.html(() => {
                return "<span style='font-weight:bold;font-size:200%;color:red'>没有藏宝图就不要来裹乱了，烦人！</span>";
            });
            return;
        }

        let html = "";
        html += "<table style='border-width:0;text-align:center'>";
        html += "<tbody>";
        html += "<tr>";
        html += "<td style='width:100%'>";
        html += "<table style='background-color:#888888;margin:auto;border-width:0;text-align:center'>";
        html += "<tbody style='background-color:#F8F0E0'>";
        html += "<tr style='background-color:skyblue'>";
        html += "<th>选择</th>";
        html += "<th>物品</th>";
        html += "<th>X坐标</th>";
        html += "<th>Y坐标</th>";
        html += "<th>备注</th>";
        html += "</tr>";
        let rowIndex = 0;
        const sorted = this.treasureHints!.sort((a, b) => {
            let ret = a.coordinate!.x - b.coordinate!.x;
            if (ret === 0) {
                ret = a.coordinate!.y - b.coordinate!.y;
            }
            return ret;
        })
        for (const treasureHint of sorted) {
            html += "<tr class='C_TreasureHint C_TreasureHint_Row' id='row_" + (rowIndex++) + "'>";
            html += "<td><button role='button' " +
                "class='C_TreasureHintButton C_TreasureHintSelectButton C_pocket_StatelessElement' " +
                "id='select_treasureHint_" + treasureHint.index + "' " +
                "style='color:grey'>选择</button></td>";
            html += "<td>" + treasureHint.name + "</td>";
            html += "<td>" + treasureHint.coordinate?.x + "</td>";
            html += "<td>" + treasureHint.coordinate?.y + "</td>";
            html += "<td>" + treasureHint.commentHtml + "</td>";
            html += "</tr>";
        }
        html += "<tr>";
        html += "<td colspan='5'>";
        html += "<span style='color:red;font-weight:bold;font-size:200%'>" +
            "吉 星 高 照<br>" +
            "好 运 连 连<br>" +
            "万 事 如 意<br>" +
            "心 想 事 成" +
            "</span>";
        html += "</td>";
        html += "</tr>";
        html += "<tr>";
        html += "<td colspan='5'>";
        html += "<input type='button' value='全部选择' class='C_TreasureHintButton C_pocket_StatelessElement' id='selectAllButton'>";
        html += "</td>";
        html += "</tr>";
        html += "<tr>";
        html += "<td colspan='5'>";
        html += "<input type='button' value='更换藏宝图' class='C_TreasureHintButton C_pocket_StatelessElement' id='exchangeButton'>";
        html += "<input type='button' value='藏宝图探险' class='C_TreasureHintButton C_pocket_StatelessElement' id='treasureButton'>";
        html += "</td>";
        html += "</tr>";
        html += "</tbody>";
        html += "</table>";
        html += "</td>";
        html += "<td>";
        html += MapBuilder.buildMapTable();
        html += "</td>";
        html += "</tr>";
        html += "</tbody>";
        html += "</table>";

        container.html(html);

        MapBuilder.updateTownBackgroundColor();

        $(".C_TreasureHintSelectButton").on("click", event => {
            const btnId = $(event.target).attr("id") as string;
            PageUtils.toggleColor(btnId, undefined, undefined);
        })

        $(".C_TreasureHint_Row")
            .on("mouseenter", function () {
                const x = parseInt($(this).find("td:eq(2)").text());
                const y = parseInt($(this).find("td:eq(3)").text());
                const mapId = "location_" + x + "_" + y;
                $("#" + mapId).css("background-color", "blue");
            })
            .on("mouseleave", function () {
                const x = parseInt($(this).find("td:eq(2)").text());
                const y = parseInt($(this).find("td:eq(3)").text());
                const mapId = "location_" + x + "_" + y;
                const cell = $("#" + mapId);
                const s = cell.parent().attr("class")!;
                const c = StringUtils.substringAfter(s, "_");
                if (c !== "none") {
                    cell.css("background-color", c);
                } else {
                    cell.removeAttr("style");
                }
            });

        $("#selectAllButton").on("click", async () => {
            $(".C_TreasureHintSelectButton").each((_idx, it) => {
                const btn = $(it);
                const btnId = btn.attr("id") as string;
                if (PageUtils.isColorGrey(btnId)) {
                    PageUtils.changeColorBlue(btnId);
                }
            });
        });

        $("#exchangeButton").on("click", async () => {
            await this._exchangeTreasureHints();
            await this.refresh();
        });
        $("#treasureButton").on("click", async () => {
            await this._explorerTreasureHints();
        });
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

    private _calculateSelectedTreasureHints(): number[] {
        const indexList: number[] = [];
        $(".C_TreasureHintSelectButton")
            .each((_idx, it) => {
                const btn = $(it);
                const btnId = btn.attr("id") as string;
                if (PageUtils.isColorBlue(btnId)) {
                    const index = _.parseInt(StringUtils.substringAfter(btnId, "select_treasureHint_"));
                    indexList.push(index);
                }
            });
        return indexList;
    }

    private async _exchangeTreasureHints() {
        const indexList = this._calculateSelectedTreasureHints();
        if (indexList.length === 0) {
            MessageBoard.publishWarning("No treasure hint(s) selected, ignore.");
            return;
        }
        await new TownBank(this.credential, this.townId).withdraw(10);
        await new TownAdventureGuild(this.credential).exchange(indexList);
        await new TownBank(this.credential, this.townId).deposit();
    }

    private async _explorerTreasureHints() {
        const candidates: Coordinate[] = [];
        $(".C_TreasureHintSelectButton").each((_idx, it) => {
            const btn = $(it);
            const btnId = btn.attr("id") as string;
            if (PageUtils.isColorBlue(btnId)) {
                const c0 = btn.parent();
                const c1 = $(c0).next();
                const c2 = $(c1).next();
                const c3 = $(c2).next();
                const c4 = $(c3).next();
                if ($(c4).text() === "-") {
                    const x = parseInt($(c2).text());
                    const y = parseInt($(c3).text());
                    candidates.push(new Coordinate(x, y));
                }
            }
        });
        if (candidates.length === 0) {
            MessageBoard.publishWarning("No available treasure hint(s) selected, ignore.");
            return;
        }

        const refreshButton = $("#refreshButton");
        const returnButton = $("#returnButton");
        PocketPage.scrollIntoTitle();
        refreshButton.parent().hide();
        returnButton.parent().hide();
        PocketPage.disableStatelessElements();
        $(".location_button_class").prop("disabled", true);

        await new TownBank(this.credential, this.townId).withdraw(110);
        await this.roleManager.reload();
        await this.roleManager.render();
        const town = this.roleManager.role!.town!;

        for (const it of candidates) {
            const mapId = "location_" + it.x + "_" + it.y;
            $("#" + mapId)
                .css("background-color", "blue")
                .css("color", "yellow")
                .attr("value", "宝")
                .parent()
                .attr("class", "color_blue");
        }
        candidates.sort((a, b) => {
            let ret = a.x - b.x;
            if (ret === 0) {
                ret = a.y - b.y;
            }
            return ret;
        });
        MessageBoard.publishMessage("藏宝图整理完毕。");

        // 这个是要探索的完整路线，从本城开始，回到本城。
        const locationList: Coordinate[] = [];
        locationList.push(town.coordinate);
        locationList.push(...candidates);
        locationList.push(town.coordinate);
        if (locationList.length !== 0) {
            let msg = "探险顺序：";
            for (let i = 0; i < locationList.length; i++) {
                const it = locationList[i];
                msg += it.asText();
                if (i !== locationList.length - 1) {
                    msg += "=>";
                }
            }
            MessageBoard.publishMessage(msg);
        }

        const foundList: string[] = [];
        const plan = await new TownEntrance(this.credential).leave();
        await this._seekTreasures(town, plan.scope!, plan.mode!, locationList, 0, foundList);
        await this.roleManager.reload();
        await this.roleManager.render();
        returnButton.parent().show();
        returnButton.prop("disabled", false);
    }

    private async _seekTreasures(town: Town,
                                 scope: number,
                                 mode: string,
                                 locationList: Coordinate[],
                                 locationIndex: number,
                                 foundList: string[]) {
        const from = locationList[locationIndex];
        const to = locationList[locationIndex + 1];
        if (locationIndex !== locationList.length - 2) {
            if (from.x === to.x && from.y === to.y) {
                // 下一张图在原地
                MessageBoard.publishMessage("运气真好，原地可以继续探险。");
                const found = await new MapExplorer(this.credential).explore();
                foundList.push(found);
                await this._seekTreasures(town, scope, mode, locationList, locationIndex + 1, foundList);
            } else {
                const plan = new TravelPlan();
                plan.credential = this.credential;
                plan.source = from;
                plan.destination = to;
                plan.scope = scope;
                plan.mode = mode;
                await new TravelPlanExecutor(plan).execute();
                const found = await new MapExplorer(this.credential).explore();
                foundList.push(found);
                await this._seekTreasures(town, scope, mode, locationList, locationIndex + 1, foundList);
            }
        } else {
            // 最后一个坐标已经完成了探险。现在可以回城了
            MessageBoard.publishMessage("藏宝图已经用完，准备回城。");
            const plan = new TravelPlan();
            plan.credential = this.credential;
            plan.source = from;
            plan.destination = to;
            plan.scope = scope;
            plan.mode = mode;
            await new TravelPlanExecutor(plan).execute();
            await new TownEntrance(this.credential).enter(town.id);
            await new TownBank(this.credential).deposit();
            MessageBoard.publishMessage("探险完成。");
            if (foundList.length > 0) {
                MessageBoard.publishMessage("在无人处，悄悄检视了下探险的收入：");
                for (let i = 0; i < foundList.length; i++) {
                    MessageBoard.publishMessage("<b style='color:yellow;font-size:150%'>" + foundList[i] + "</b>");
                }
            }
        }
    }
}

export {TownAdventureGuildPageProcessor};