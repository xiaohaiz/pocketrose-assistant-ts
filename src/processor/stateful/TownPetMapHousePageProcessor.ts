import ButtonUtils from "../../util/ButtonUtils";
import Credential from "../../util/Credential";
import KeyboardShortcutBuilder from "../../util/KeyboardShortcutBuilder";
import LocationModeTown from "../../core/location/LocationModeTown";
import MessageBoard from "../../util/MessageBoard";
import MonsterProfileLoader from "../../core/monster/MonsterProfileLoader";
import PageProcessorContext from "../PageProcessorContext";
import PageUtils from "../../util/PageUtils";
import PetMap from "../../core/monster/PetMap";
import StatefulPageProcessor from "../StatefulPageProcessor";
import {PetMapFinder} from "../../widget/PetMapFinder";
import {TownPetMapHousePageParser} from "../../core/monster/TownPetMapHousePageParser";

class TownPetMapHousePageProcessor extends StatefulPageProcessor {

    private readonly petMapFinder: PetMapFinder;

    constructor(credential: Credential, context: PageProcessorContext) {
        super(credential, context);
        const locationMode = this.createLocationMode() as LocationModeTown;
        this.petMapFinder = new PetMapFinder(this.credential, locationMode);
        this.petMapFinder.onWarningMessage = (msg) => {
            MessageBoard.publishWarning(msg);
        };
    }

    protected async doProcess(): Promise<void> {
        await this.petMapFinder.initialize(TownPetMapHousePageParser.parsePage(PageUtils.currentPageHtml()));

        await this.createPage();
        this.resetMessageBoard();

        this.bindButtons();
        this.petMapFinder.bindButtons();

        await this.renderPage();

        KeyboardShortcutBuilder.newInstance()
            .onKeyPressed("r", () => PageUtils.triggerClick("refreshButton"))
            .onEscapePressed(() => PageUtils.triggerClick("returnButton"))
            .withDefaultPredicate()
            .bind();
    }

    private async createPage() {
        $("body:first").html((_idx, html) => {
            return html.replace("\n\n\n收集图鉴一览：\n", "");
        });

        $("body:first > table:first > tbody:first > form").remove();
        $("body:first > table:first > tbody:first > tr:last").remove();
        $("body:first > input").remove();
        $("body:first > center:first > form:first").remove();

        $("body:first > table:first > tbody:first > tr:first > td:first > table:first > tbody:first > tr:first > td:first")
            .attr("id", "ID_pageTitle")
            .removeAttr("bgcolor")
            .removeAttr("width")
            .removeAttr("height")
            .css("background-color", "navy")
            .html(() => {
                return "" +
                    "<table style='background-color:transparent;margin:0;width:100%;border-spacing:0;border-width:0'>" +
                    "<tbody>" +
                    "<tr>" +
                    "<td style='text-align:left;width:100%;color:yellowgreen;font-weight:bold;font-size:150%'>" +
                    "＜＜　宠 物 图 鉴 ＞＞ <span style='background-color:red;color:white;font-size:80%'>" + this.roleLocation + "</span>" +
                    "</td>" +
                    "<td style='text-align:right;white-space:nowrap'>" +
                    "<span> <button role='button' id='refreshButton' class='C_statelessElement'>" + ButtonUtils.createTitle("刷新", "r") + "</button></span>" +
                    "<span> <button role='button' id='returnButton' class='C_statelessElement'>" + ButtonUtils.createTitle("退出", "Esc") + "</button></span>" +
                    "</td>" +
                    "</tr>" +
                    "<tr style='display:none'>" +
                    "<td colspan='2'>" +
                    "<div id='ID_extension_1'></div>" +
                    "<div id='ID_extension_2'></div>" +
                    "<div id='ID_extension_3'></div>" +
                    "<div id='ID_extension_4'></div>" +
                    "<div id='ID_extension_5'></div>" +
                    "</td>" +
                    "</tr>" +
                    "</tbody>" +
                    "</table>" +
                    "";
            });
        $("body:first > table:first > tbody:first > tr:eq(1) > td:first > table:first > tbody:first > tr:first > td:first")
            .attr("id", "messageBoard")
            .css("color", "white");


        $("body:first > table:eq(1)")
            .removeAttr("cellspacing")
            .removeAttr("border")
            .css("width", "100%")
            .css("border-spacing", "0")
            .css("border-width", "0")
            .find("> tbody:first")
            .removeAttr("bgcolor")
            .css("background-color", "#F8F0E0")
            .html(() => {
                return "" +
                    "<tr>" +
                    "<td>" + this.petMapFinder.generateHTML() + "</td>" +
                    "</tr>" +
                    "<tr>" +
                    "<td id='ID_petMapPanel'></td>" +
                    "</tr>" +
                    "";
            });
    }

    private resetMessageBoard() {
        MessageBoard.resetMessageBoard(
            "<span style='color:wheat;font-weight:bold;font-size:120%'>这里提供团队宠物图鉴的查询功能。</span>" +
            "<br>" +
            "宠物编号<span style='background-color:wheat;color:green'>绿色</span>初森，" +
            "<span style='background-color:wheat;color:blue'>蓝色</span>中塔，" +
            "<span style='background-color:wheat;color:red'>红色</span>上洞。");
    }

    private bindButtons(): void {
        $("#ID_extension_1").html(() => {
            return PageUtils.generateReturnTownForm(this.credential);
        });
        $("#returnButton").on("click", () => {
            PageUtils.disablePageInteractiveElements();
            PageUtils.triggerClick("returnTown");
        });
        $("#refreshButton").on("click", () => {
            PageUtils.scrollIntoView("ID_pageTitle");
            $(".C_statelessElement").prop("disabled", true);
            this.resetMessageBoard();
            this.petMapFinder.reload().then(() => {
                this.petMapFinder.disposeSearchResult();
                this.renderPage().then(() => {
                    $(".C_statelessElement").prop("disabled", false);
                    MessageBoard.publishMessage("宠物图鉴刷新完成。");
                });
            });
        });
    }

    private async renderPage() {
        let html = "";
        html += "<table style='background-color:#888888;text-align:center;margin:auto'>";
        html += "<tbody>";

        const mm = new Map<string, PetMap>();
        this.petMapFinder.petMapPage!.petMapList!.forEach(it => {
            mm.set(it.code!, it);
        });

        let row = 0;
        while (true) {
            const currentRowPetMaps: PetMap[] = [];
            let notFound = false;
            for (let i = 0; i < 10; i++) {
                const index = i + row * 10;
                if (index >= 493) {
                    notFound = true;
                    const placeHolder = new PetMap();
                    currentRowPetMaps.push(placeHolder);
                } else {
                    const m = MonsterProfileLoader.load(index + 1)!;
                    const pm = mm.get(m.code!);
                    if (pm) {
                        currentRowPetMaps.push(pm);
                    } else {
                        const placeHolder = new PetMap();
                        placeHolder.code = m.code;
                        currentRowPetMaps.push(placeHolder);
                    }
                }
            }

            html += "<tr>";
            for (const pm of currentRowPetMaps) {
                if (pm.count !== undefined) {
                    const monster = MonsterProfileLoader.load(pm.code)!;
                    html += "<td style='background-color:#E8E8D0;width:64px;height:64px'>" + monster.imageHtml + "</td>"
                } else {
                    html += "<td style='background-color:#E8E8D0;width:64px;height:64px'></td>"
                }
            }
            html += "</tr>";
            html += "<tr>";
            for (const pm of currentRowPetMaps) {
                if (pm.count !== undefined) {
                    const monster = MonsterProfileLoader.load(pm.code)!;
                    if (monster.location === 1) {
                        html += "<td style='background-color:wheat;width:64px;color:green'>" + pm.code + " / " + pm.count + "</td>"
                    } else if (monster.location === 2) {
                        html += "<td style='background-color:wheat;width:64px;color:blue'>" + pm.code + " / " + pm.count + "</td>"
                    } else if (monster.location === 3) {
                        html += "<td style='background-color:wheat;width:64px;color:red'>" + pm.code + " / " + pm.count + "</td>"
                    } else {
                        html += "<td style='background-color:wheat;width:64px'>" + pm.code + " / " + pm.count + "</td>"
                    }
                } else {
                    if (pm.code !== undefined) {
                        const monster = MonsterProfileLoader.load(pm.code)!;
                        if (monster.location === 1) {
                            html += "<td style='background-color:wheat;width:64px;color:green'>" + pm.code + "</td>"
                        } else if (monster.location === 2) {
                            html += "<td style='background-color:wheat;width:64px;color:blue'>" + pm.code + "</td>"
                        } else if (monster.location === 3) {
                            html += "<td style='background-color:wheat;width:64px;color:red'>" + pm.code + "</td>"
                        } else {
                            html += "<td style='background-color:wheat;width:64px'>" + pm.code + "</td>"
                        }
                    } else {
                        html += "<td style='background-color:wheat;width:64px'></td>"
                    }
                }
            }
            html += "</tr>";

            if (notFound) {
                break;
            }
            row++;
        }
        html += "</tbody>";
        html += "</table>";

        $("#ID_petMapPanel").html(html);
    }
}

export {TownPetMapHousePageProcessor};