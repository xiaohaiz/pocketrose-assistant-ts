import StatefulPageProcessor from "../StatefulPageProcessor";
import Credential from "../../util/Credential";
import PageProcessorContext from "../PageProcessorContext";
import {PetManager} from "../../widget/PetManager";
import LocationModeTown from "../../core/location/LocationModeTown";
import LocationModeCastle from "../../core/location/LocationModeCastle";
import PersonalPetManagementPageParser from "../../core/monster/PersonalPetManagementPageParser";
import PageUtils from "../../util/PageUtils";
import ButtonUtils from "../../util/ButtonUtils";
import KeyboardShortcutBuilder from "../../util/KeyboardShortcutBuilder";
import MessageBoard from "../../util/MessageBoard";
import NpcLoader from "../../core/role/NpcLoader";
import {EquipmentManager} from "../../widget/EquipmentManager";
import Role from "../../core/role/Role";
import {PersonalStatus} from "../../core/role/PersonalStatus";
import _ from "lodash";
import NetworkUtils from "../../util/NetworkUtils";
import {EvolutionManager} from "../../widget/EvolutionManager";
import PersonalPetManagementPage from "../../core/monster/PersonalPetManagementPage";
import PersonalEquipmentManagementPage from "../../core/equipment/PersonalEquipmentManagementPage";
import {PetMapFinder} from "../../widget/PetMapFinder";
import {PocketFormGenerator} from "../../pocket/PocketPage";
import BattleFieldTrigger from "../../core/trigger/BattleFieldTrigger";
import {SpecialPetManager} from "../../widget/SpecialPetManager";

class PersonalPetManagementPageProcessor extends StatefulPageProcessor {

    private readonly location: LocationModeTown | LocationModeCastle;
    private readonly equipmentManager: EquipmentManager;
    private readonly petManager: PetManager;
    private readonly evolutionManager: EvolutionManager;
    private readonly specialPetManager: SpecialPetManager;
    private readonly petMapFinder?: PetMapFinder;

    private role?: Role;
    private messageBoardContent?: string;

    constructor(credential: Credential, context: PageProcessorContext) {
        super(credential, context);
        this.location = this.createLocationMode() as LocationModeTown | LocationModeCastle;

        this.equipmentManager = new EquipmentManager(credential, this.location);
        this.petManager = new PetManager(credential, this.location);
        this.petManager.feature.leagueEnabled = true;
        this.petManager.feature.spellEnabled = true;
        this.petManager.feature.enableSpaceTriggerOnDispose = true;
        this.petManager.feature.enableStatusTriggerOnDispose = true;
        this.petManager.feature.enableUsingTriggerOnDispose = true;
        this.petManager.feature.enablePetTransfer = true;
        this.petManager.showProfile = (html) => {
            this.messageBoardContent = $("#messageBoard").html();
            MessageBoard.resetMessageBoard(html);
        };
        this.petManager.hideProfile = () => {
            if (this.messageBoardContent !== undefined) {
                MessageBoard.resetMessageBoard(this.messageBoardContent);
                this.messageBoardContent = undefined;
            } else {
                this.resetMessageBoard();
            }
        };
        this.petManager.feature.onRefresh = (message) => {
            if (message.extensions.get("mode") === "SPECIAL") {
                this.specialPetManager.reload().then(() => {
                    this.specialPetManager.render().then();
                });
            } else {
                this.equipmentManager.equipmentPage = message.extensions.get("equipmentPage") as PersonalEquipmentManagementPage;
                this.evolutionManager.reload().then(() => {
                    this.evolutionManager.render(this.petManager.petPage!).then(() => {
                        const mode = message.extensions.get("mode");
                        if (mode === "LEAGUE") {
                            this.renderPetLeague().then();
                        } else if (mode === "EVOLUTION" || mode === "DEGRADATION") {
                            this.petMapFinder?.reload().then();
                        }
                    });
                });
            }
        };
        this.evolutionManager = new EvolutionManager(credential, this.location);
        this.evolutionManager.feature.onRefresh = (message) => {
            this.equipmentManager.reload().then(() => {
                this.petManager.petPage = message.extensions.get("petPage") as PersonalPetManagementPage;
                this.petManager.render(this.equipmentManager.equipmentPage!).then();
            });
        };

        this.specialPetManager = new SpecialPetManager(credential, this.location);
        this.specialPetManager.feature.onRefresh = () => {
            this.petManager._renderCage().then();
            this.petManager._renderRanch().then();
        };

        if (this.location instanceof LocationModeTown) {
            this.petMapFinder = new PetMapFinder(this.credential, this.location);
            this.petMapFinder.onWarningMessage = (message) => {
                MessageBoard.publishWarning(message);
            };
        }
    }

    protected async doProcess(): Promise<void> {
        this.petManager.petPage = PersonalPetManagementPageParser.parsePage(PageUtils.currentPageHtml());
        await this.generateHTML();

        await this.doBindReturnButton();
        await this.bindRefreshButton();
        await this.bindLeagueButton();
        this.petManager.bindButtons();
        this.evolutionManager.bindButtons();
        this.specialPetManager.bindButtons();
        this.petMapFinder?.bindButtons();

        await this.reloadRole();
        await this.equipmentManager.reload();
        await this.petManager.render(this.equipmentManager.equipmentPage!);
        await this.renderPetLeague();
        await this.evolutionManager.reload();
        await this.evolutionManager.render(this.petManager.petPage);
        await this.specialPetManager.reload();
        await this.specialPetManager.render();
        await this.petMapFinder?.reload();

        KeyboardShortcutBuilder.newInstance()
            .onKeyPressed("r", () => PageUtils.triggerClick("refreshButton"))
            .onEscapePressed(() => PageUtils.triggerClick("returnButton"))
            .withDefaultPredicate()
            .bind();
    }

    private async reloadRole() {
        this.role = await new PersonalStatus(this.credential).load();
    }

    private async refresh() {
        await this.reloadRole();
        await this.equipmentManager.reload();
        await this.petManager.reload();
        await this.petManager.render(this.equipmentManager.equipmentPage!);
        await this.renderPetLeague();
        await this.evolutionManager.reload();
        await this.evolutionManager.render(this.petManager.petPage!);
        await this.specialPetManager.reload();
        await this.specialPetManager.render();
    }

    private resetMessageBoard() {
        MessageBoard.resetMessageBoard("" +
            "<span style='color:wheat;font-weight:bold'>又来管理您的宠物了？说句实话，" +
            "来来回回也就这么几只，折腾个什么劲儿啊，洗洗睡了不好么？</span>" +
            "");
    }

    private async generateHTML(): Promise<void> {
        const container = $("center:first");
        container.find("> table").remove();
        container.find("> p").remove();
        container.find("> font").remove();
        container.find("> br").remove();
        container.find("> input").remove();
        container.find("> select").remove();
        container.find("> form").remove();
        container.find("> center").remove();

        let html = "";
        html += "<table style='background-color:#888888;width:100%;text-align:center;border-width:0;border-spacing:0'>";
        html += "<tbody style='background-color:#F8F0E0'>";
        html += "<tr>";
        html += "<td style='background-color:navy' id='pageTitle'>";
        html += "<table style='background-color:transparent;width:100%;margin:auto;border-width:0'>" +
            "<tbody>" +
            "<tr>" +
            "<td style='text-align:left;width:100%;color:yellowgreen;font-size:150%;font-weight:bold'>" +
            "＜＜  宠 物 管 理  ＞＞" +
            "</td>" +
            "<td style='text-align:right;white-space:nowrap'>" +
            "<span> <button role='button' id='refreshButton'>" + ButtonUtils.createTitle("刷新", "r") + "</button></span>" +
            "<span> <button role='button' id='returnButton'>" + ButtonUtils.createTitle("退出", "Esc") + "</button></span>" +
            "</td>" +
            "</tr>" +
            "<tr style='display:none'>" +
            "<td colspan='2'>" +
            "<div id='_pocket_extension_1'></div>" +
            "<div id='_pocket_extension_2'></div>" +
            "<div id='_pocket_extension_3'></div>" +
            "<div id='_pocket_extension_4'></div>" +
            "<div id='_pocket_extension_5'></div>" +
            "</td>" +
            "</tr>" +
            "</tbody>" +
            "</table>";
        html += "</td>";
        html += "</tr>";
        html += "<tr>";
        html += "<td style='border-spacing:0' id='_pocket_messageBoardPanel'></td>";
        html += "</tr>";
        html += "<tr>";
        html += "<td style='border-spacing:0' id='_pocket_petManagerPanel'>";
        html += this.petManager.generateHTML();
        html += "</td>";
        html += "</tr>";
        html += "<tr style='display:none'>";
        html += "<td style='border-spacing:0;background-color:#E8E8D0' id='_pocket_petLeaguePanel'>";
        html += "<table style='background-color:#888888;margin:auto;border-width:0'>" +
            "<tbody>" +
            "<tr>" +
            "<th style='background-color:skyblue;font-size:120%;text-align:center'>" +
            "＜ 宠 物 联 赛 参 赛 选 手 一 览 ＞" +
            "</th>" +
            "</tr>" +
            "<tr>" +
            "<td style='border-spacing:0'>" +
            "<table style='margin:auto;border-width:0'>" +
            "<tbody id='_pocket_petLeaguePlayerTable'>" +
            "<tr style='background-color:wheat'>" +
            "<th>参赛</th>" +
            "<th>主力</th>" +
            "<th>名字</th>" +
            "<th>生命</th>" +
            "<th>攻击</th>" +
            "<th>防御</th>" +
            "<th>智力</th>" +
            "<th>精神</th>" +
            "<th>速度</th>" +
            "</tr>" +
            "</tbody>" +
            "</table>" +
            "</td>" +
            "</tr>" +
            "<tr>" +
            "<td style='background-color:wheat;text-align:center'>" +
            "<button role='button' id='_pocket_setPetLeague'>设定宠物参赛情况</button>" +
            "</td>" +
            "</tr>" +
            "</tbody>" +
            "</table>";
        html += "</td>";
        html += "</tr>";
        html += "<tr style='display:none'>";
        html += "<td style='border-spacing:0;background-color:#E8E8D0' id='_pocket_evolutionPanel'>";
        html += this.evolutionManager.generateHTML();
        html += "</td>";
        html += "</tr>";
        if (this.petMapFinder !== undefined) {
            html += "<tr>";
            html += "<td style='border-spacing:0;background-color:#E8E8D0' id='_pocket_petMapFinderPanel'>";
            html += this.petMapFinder.generateHTML();
            html += "</td>";
            html += "</tr>";
        }
        html += "<tr>";
        html += "<td style='border-spacing:0;background-color:#E8E8D0' id='_pocket_specialPetPanel'>";
        html += this.specialPetManager.generateHTML();
        html += "</td>";
        html += "</tr>";
        html += "</tody>";
        html += "</table>";
        container.prepend($(html));

        MessageBoard.createMessageBoardStyleB("_pocket_messageBoardPanel", NpcLoader.randomFemaleNpcImageHtml());
        $("#messageBoard")
            .css("background-color", "black")
            .css("color", "white")
            .css("height", "176");
        this.resetMessageBoard();
    }

    private async dispose() {
        await this.petManager.dispose();
        await this.specialPetManager.dispose();
        if (this.createLocationMode() instanceof LocationModeTown) {
            await new BattleFieldTrigger(this.credential)
                .withRole(this.role)
                .withPetPage(this.petManager.petPage)
                .triggerUpdate();
        }
    }

    protected async doBindReturnButton() {
        $("#_pocket_extension_1").html(() => {
            return new PocketFormGenerator(this.credential, this.location).generateReturnFormHTML();
        });
        $("#returnButton").on("click", () => {
            PageUtils.disablePageInteractiveElements();
            this.dispose().then(() => {
                PageUtils.triggerClick("_pocket_ReturnSubmit");
            });
        });
    }

    private async bindRefreshButton() {
        $("#refreshButton").on("click", () => {
            PageUtils.scrollIntoView("pageTitle");
            this.resetMessageBoard();
            this.refresh().then(() => {
                MessageBoard.publishMessage("宠物管理刷新完成。");
            });
        });
    }

    private async bindLeagueButton() {
        $("#_pocket_setPetLeague").on("click", () => {
            const players = this.petManager.petPage!.petLeaguePlayerList!;
            if (players.length === 0) return;
            const request = this.credential.asRequestMap();
            request.set("mode", "PETGAMECHOOSE");

            for (const player of players) {
                const index = player.index!;
                const id1 = "_pocket_PL_player_online_" + index;
                if (PageUtils.isColorBlue(id1)) {
                    request.set("choose" + index, _.toString(index));
                }
                const id2 = "_pocket_PL_player_mainForce_" + index;
                if (PageUtils.isColorBlue(id2)) {
                    request.set("matchtype" + index, _.toString(index));
                }
            }
            NetworkUtils.post("mydata.cgi", request).then(response => {
                MessageBoard.processResponseMessage(response);
                this.petManager.reload().then(() => {
                    this.renderPetLeague().then();
                });
            });
        });
    }

    private async renderPetLeague() {
        const panel = $("#_pocket_petLeaguePanel");
        $(".C_pocket_PL_button").off("click");
        $(".C_pocket_PL_player").remove();

        const players = this.petManager.petPage!.petLeaguePlayerList!;
        if (players.length === 0) {
            /// 没有宠物参加宠物联赛
            panel.parent().hide();
            return;
        }
        panel.parent().show();

        const table = $("#_pocket_petLeaguePlayerTable");
        for (const player of players) {
            let html = "";
            html += "<tr style='text-align:center;background-color:#E8E8D0' " +
                "class='C_pocket_PL_player' id='_pocket_PL_player_" + player.index + "'>";
            html += "<td>";
            html += "<button role='button' class='C_pocket_PL_button C_pocket_PL_onlineButton' " +
                "style='color:grey' " +
                "id='_pocket_PL_player_online_" + player.index + "'>参赛</button>";
            html += "</td>";
            html += "<td>";
            html += "<button role='button' class='C_pocket_PL_button C_pocket_PL_mainForceButton' " +
                "style='color:grey' " +
                "id='_pocket_PL_player_mainForce_" + player.index + "'>主力</button>";
            html += "</td>";
            html += "<td>" + player.name + "</td>";
            html += "<td>" + player.healthHtml + "</td>";
            html += "<td>" + player.attackHtml + "</td>";
            html += "<td>" + player.defenseHtml + "</td>";
            html += "<td>" + player.specialAttackHtml + "</td>";
            html += "<td>" + player.specialDefenseHtml + "</td>";
            html += "<td>" + player.speedHtml + "</td>";
            html += "</tr>";
            table.append($(html));
        }
        for (const player of players) {
            if (player.online) {
                const btnId = "_pocket_PL_player_online_" + player.index;
                PageUtils.changeColorBlue(btnId);
            }
            if (player.mainForce) {
                const btnId = "_pocket_PL_player_mainForce_" + player.index;
                PageUtils.changeColorBlue(btnId);
            }
        }

        $(".C_pocket_PL_onlineButton").on("click", event => {
            const btnId = $(event.target).attr("id") as string;
            PageUtils.toggleColor(btnId, undefined, undefined);
        });
        $(".C_pocket_PL_mainForceButton").on("click", event => {
            const btnId = $(event.target).attr("id") as string;
            PageUtils.toggleColor(btnId, undefined, undefined);
        });
    }

}

export = PersonalPetManagementPageProcessor;