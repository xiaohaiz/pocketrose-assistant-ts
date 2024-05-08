import BattleFieldTrigger from "../../core/trigger/BattleFieldTrigger";
import ButtonUtils from "../../util/ButtonUtils";
import Credential from "../../util/Credential";
import KeyboardShortcutBuilder from "../../util/KeyboardShortcutBuilder";
import LocationModeCastle from "../../core/location/LocationModeCastle";
import LocationModeTown from "../../core/location/LocationModeTown";
import MessageBoard from "../../util/MessageBoard";
import NpcLoader from "../../core/role/NpcLoader";
import PageProcessorContext from "../PageProcessorContext";
import PageUtils from "../../util/PageUtils";
import PersonalEquipmentManagementPage from "../../core/equipment/PersonalEquipmentManagementPage";
import PersonalPetManagementPage from "../../core/monster/PersonalPetManagementPage";
import PersonalPetManagementPageParser from "../../core/monster/PersonalPetManagementPageParser";
import StatefulPageProcessor from "../StatefulPageProcessor";
import _ from "lodash";
import {EquipmentManager} from "../../widget/EquipmentManager";
import {EvolutionManager} from "../../widget/EvolutionManager";
import {PetManager} from "../../widget/PetManager";
import {PetMapFinder} from "../../widget/PetMapFinder";
import {PocketFormGenerator, PocketPage} from "../../pocket/PocketPage";
import {RoleManager} from "../../widget/RoleManager";
import {SpecialPetManager} from "../../widget/SpecialPetManager";
import {PocketNetwork} from "../../pocket/PocketNetwork";

class PersonalPetManagementPageProcessor extends StatefulPageProcessor {

    private readonly location: LocationModeTown | LocationModeCastle;
    private readonly roleManager: RoleManager;
    private readonly equipmentManager: EquipmentManager;
    private readonly petManager: PetManager;
    private readonly evolutionManager: EvolutionManager;
    private readonly specialPetManager: SpecialPetManager;
    private readonly petMapFinder?: PetMapFinder;

    constructor(credential: Credential, context: PageProcessorContext) {
        super(credential, context);
        this.location = this.createLocationMode() as LocationModeTown | LocationModeCastle;
        this.roleManager = new RoleManager(credential, this.location);
        this.equipmentManager = new EquipmentManager(credential, this.location);
        this.petManager = new PetManager(credential, this.location);
        this.petManager.feature.leagueEnabled = true;
        this.petManager.feature.spellEnabled = true;
        this.petManager.feature.enableSpaceTriggerOnDispose = true;
        this.petManager.feature.enableStatusTriggerOnDispose = true;
        this.petManager.feature.enableUsingTriggerOnDispose = true;
        this.petManager.feature.enablePetTransfer = true;
        this.petManager.feature.onRefresh = (message) => {
            this.roleManager.reload().then(() => {
                this.roleManager.render().then();
            });
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
            this.roleManager.reload().then(() => {
                this.roleManager.render().then();
            });
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
        }
    }

    protected async doProcess(): Promise<void> {
        this.petManager.petPage = PersonalPetManagementPageParser.parsePage(PageUtils.currentPageHtml());
        await this.generateHTML();

        await this.bindButtons();
        this.roleManager.bindButtons();
        this.petManager.bindButtons();
        this.evolutionManager.bindButtons();
        this.specialPetManager.bindButtons();
        this.petMapFinder?.bindButtons();

        await this.roleManager.reload();
        $("#currentRoleImage").html(this.roleManager.role!.imageHtml);
        await this.roleManager.render();
        await this.equipmentManager.reload();
        await this.petManager.render(this.equipmentManager.equipmentPage!);
        await this.renderPetLeague();
        await this.evolutionManager.reload();
        await this.evolutionManager.render(this.petManager.petPage);
        await this.specialPetManager.reload();
        await this.specialPetManager.render();
        await this.petMapFinder?.reload();

        KeyboardShortcutBuilder.newInstance()
            .onKeyPressed("e", () => PageUtils.triggerClick("equipmentButton"))
            .onKeyPressed("r", () => PageUtils.triggerClick("refreshButton"))
            .onEscapePressed(() => PageUtils.triggerClick("returnButton"))
            .withDefaultPredicate()
            .bind();
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
        html += "<td>";
        html += PocketPage.generatePageHeaderHTML("＜＜  宠 物 管 理  ＞＞", this.roleLocation);
        html += "</td>";
        html += "</tr>";
        html += "<tr>";
        html += "<td style='border-spacing:0' id='_pocket_roleStatusPanel'>" +
            "<table style='background-color:#888888;margin:auto;width:100%;border-width:0'>" +
            "<tbody style='background-color:#E8E8D0'>" +
            "<tr>" +
            "<td style='white-space:nowrap;width:64px;height:64px' id='currentRoleImage'>" + NpcLoader.getNpcImageHtml("U_041") + "</td>" +
            "<td style='width:100%;text-align:center'>" + this.roleManager.generateHTML() + "</td>" +
            "</tr>" +
            "</tbody>" +
            "</table>" +
            "</td>";
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

        $("#_pocket_page_command").html(() => {
            return "" +
                "<span> <button role='button' class='C_pocket_StatelessElement' id='equipmentButton'>" + ButtonUtils.createTitle("装备", "e") + "</button></span>" +
                "<span> <button role='button' class='C_pocket_StatelessElement' id='refreshButton'>" + ButtonUtils.createTitle("刷新", "r") + "</button></span>" +
                "<span> <button role='button' class='C_pocket_StatelessElement' id='returnButton'>" + ButtonUtils.createTitle("退出", "Esc") + "</button></span>";
        });

        MessageBoard.createMessageBoardStyleB("_pocket_messageBoardPanel", NpcLoader.randomFemaleNpcImageHtml());
        $("#messageBoard")
            .css("background-color", "black")
            .css("color", "white");
        this.resetMessageBoard();
    }

    private resetMessageBoard() {
        MessageBoard.resetMessageBoard("" +
            "<span style='color:wheat;font-weight:bold;font-size:120%'>" +
            "昨夜雨疏风骤，浓睡不消残酒。" +
            "试问卷帘人，却道海棠依旧。" +
            "知否？知否？应是绿肥红瘦。" +
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
            });
        });
        $("#refreshButton").on("click", async () => {
            PocketPage.scrollIntoTitle();
            this.resetMessageBoard();
            PocketPage.disableStatelessElements();
            await this.refresh();
            PocketPage.enableStatelessElements();
            MessageBoard.publishMessage("宠物管理刷新完成。");
        });
        $("#_pocket_page_extension_1").html(() => {
            return new PocketFormGenerator(this.credential, this.location).generateEquipmentForm();
        });
        $("#equipmentButton").on("click", async () => {
            PageUtils.disablePageInteractiveElements();
            await this.dispose();
            PageUtils.triggerClick("_pocket_EquipmentSubmit");
        });
        $("#_pocket_setPetLeague").on("click", async () => {
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
            const response = await PocketNetwork.post("mydata.cgi", request);
            MessageBoard.processResponseMessage(response.html);
            await this.petManager.reload();
            await this.renderPetLeague();
        });
    }

    private async refresh() {
        await this.roleManager.reload();
        await this.roleManager.render();
        await this.equipmentManager.reload();
        await this.petManager.reload();
        await this.petManager.render(this.equipmentManager.equipmentPage!);
        await this.renderPetLeague();
        await this.evolutionManager.reload();
        await this.evolutionManager.render(this.petManager.petPage!);
        await this.specialPetManager.reload();
        await this.specialPetManager.render();
    }

    private async dispose() {
        await this.roleManager.dispose();
        await this.petManager.dispose();
        await this.specialPetManager.dispose();
        if (this.createLocationMode() instanceof LocationModeTown) {
            await new BattleFieldTrigger(this.credential)
                .withRole(this.roleManager.role)
                .withPetPage(this.petManager.petPage)
                .triggerUpdate();
        }
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