import ButtonUtils from "../../util/ButtonUtils";
import Castle from "../../core/castle/Castle";
import CastleInformation from "../../core/dashboard/CastleInformation";
import CastleRanch from "../../core/monster/CastleRanch";
import CastleRanchPage from "../../core/monster/CastleRanchPage";
import CastleWarehouse from "../../core/equipment/CastleWarehouse";
import CastleWarehousePage from "../../core/equipment/CastleWarehousePage";
import Credential from "../../util/Credential";
import KeyboardShortcutBuilder from "../../util/KeyboardShortcutBuilder";
import LocationModeTown from "../../core/location/LocationModeTown";
import MessageBoard from "../../util/MessageBoard";
import MonsterPageUtils from "../../core/monster/MonsterPageUtils";
import MouseClickEventBuilder from "../../util/MouseClickEventBuilder";
import PageProcessorContext from "../PageProcessorContext";
import PageUtils from "../../util/PageUtils";
import StatefulPageProcessor from "../StatefulPageProcessor";
import StringUtils from "../../util/StringUtils";
import _ from "lodash";
import {PocketEvent} from "../../pocket/PocketEvent";
import {PocketFormGenerator, PocketPage} from "../../pocket/PocketPage";
import {RoleEquipmentStatusManager} from "../../core/equipment/RoleEquipmentStatusManager";
import {RoleManager} from "../../widget/RoleManager";
import {RolePetStatusManager} from "../../core/monster/RolePetStatusManager";
import {SpecialPet, SpecialPetStorage} from "../../core/monster/SpecialPet";
import {SpecialPetManager} from "../../widget/SpecialPetManager";
import {TownCastleHousekeeperPageParser} from "../../core/castle/TownCastleHousekeeperPageParser";
import {TownCastleHousekeeperPage} from "../../core/castle/TownCastleHousekeeperPage";
import NpcLoader from "../../core/role/NpcLoader";
import PetMap from "../../core/monster/PetMap";
import MonsterProfileLoader from "../../core/monster/MonsterProfileLoader";

class TownCastleHousekeeperPageProcessor extends StatefulPageProcessor {

    private readonly location: LocationModeTown;
    private readonly roleManager: RoleManager;
    private readonly specialPetManager: SpecialPetManager;

    constructor(credential: Credential, context: PageProcessorContext) {
        super(credential, context);
        this.location = this.createLocationMode() as LocationModeTown;
        this.roleManager = new RoleManager(credential, this.location);
        this.specialPetManager = new SpecialPetManager(credential, this.location);
        this.specialPetManager.feature.onRefresh = async () => {
            if (this.castle) {
                await this.renderCastleRanch();
            }
        };
    }

    private housekeeperPage?: TownCastleHousekeeperPage;
    private castle?: Castle;
    private warehousePage?: CastleWarehousePage;
    private ranchPage?: CastleRanchPage;

    protected async doProcess(): Promise<void> {
        this.housekeeperPage = TownCastleHousekeeperPageParser.parsePage(PageUtils.currentPageHtml());

        await this.generateHTML();
        await this.resetMessageBoard();
        await this.bindButtons();
        this.roleManager.bindButtons();
        this.specialPetManager.bindButtons();

        await this.initializeCastle();
        if (this.castle === undefined) {
            // No castle found.
            MessageBoard.resetMessageBoard("<span style='font-weight:bold;color:yellow;font-size:120%'>" +
                "你说你连座城堡都没有的人，是谁给了你勇气来进入这个页面？是梁静茹么？麻利儿哪凉快哪歇着去，少来裹乱！</span>");
        } else {
            $("#ID_castleInformation")
                .html(this.createCastleInformationHTML())
                .parent().show();
            $("#ID_castleWarehouse")
                .html(this.createCastleWarehouseHTML())
                .parent().show();
            $("#ID_castleRanch")
                .html(this.createCastleRanchHTML())
                .parent().show();

            await Promise.all([this.reloadCastleWarehouse(), this.reloadCastleRanch()]);
            await Promise.all([this.renderCastleWarehouse(), this.renderCastleRanch()]);
        }

        await this.roleManager.reload();
        await this.roleManager.render();
        await this.specialPetManager.reload();
        await this.specialPetManager.render();

        if (this.castle) {
            $("#castleOwner").html(() => {
                return this.roleManager.role!.imageHTML;
            });
            MouseClickEventBuilder.newInstance()
                .onElementClicked("castleOwner", async () => {
                    if ($("#renderRanchPetStatistics").length > 0) {
                        $("#ID_ranchPetStatistics").html("").parent().hide();
                    } else {
                        await this.renderRanchPetStatistics();
                    }
                })
                .doBind();
        }

        KeyboardShortcutBuilder.newInstance()
            .onKeyPressed("r", () => PageUtils.triggerClick("refreshButton"))
            .onEscapePressed(() => PageUtils.triggerClick("returnButton"))
            .withDefaultPredicate()
            .doBind();
    }

    private async generateHTML() {
        $("body:first > center:first").remove();

        $("body:first > table:first")
            .removeAttr("height")
            .find("> tbody:first > tr:first > td:first")
            .removeAttr("bgcolor")
            .removeAttr("width")
            .removeAttr("height")
            .css("background-color", "navy")
            .html(() => {
                return PocketPage.generatePageHeaderHTML("＜＜ 城 堡 管 家 ＞＞", this.roleLocation);
            });
        $("#_pocket_page_command").html(() => {
            return "" +
                "<span> <button role='button' id='refreshButton'>" + ButtonUtils.createTitle("刷新", "r") + "</button></span>" +
                "<span> <button role='button' id='returnButton'>" + ButtonUtils.createTitle("退出", "Esc") + "</button></span>" +
                "";
        });

        $("body:first > table:first > tbody:first > tr:eq(1) > td:first")
            .removeAttr("height")
            .find("> table:first > tbody:first > tr:first")
            .find("> td:first")
            .attr("id", "roleInformationManager")
            .css("white-space", "nowrap")
            .next()
            .attr("id", "ID_roleStatus")
            .removeAttr("width")
            .removeAttr("align")
            .css("text-align", "center")
            .css("width", "100%")
            .next().remove();

        $("#ID_roleStatus").html(() => {
            return this.roleManager.generateHTML();
        });

        $("body:first > table:first > tbody:first > tr:eq(2) > td:first")
            .removeAttr("height")
            .find("> table:first > tbody:first > tr:first > td:first")
            .attr("id", "messageBoard")
            .css("color", "white")
            .closest("tr")
            .find("> td:last")
            .attr("id", "messageBoardManager");

        $("body:first > table:first > tbody:first")
            .append($("" +
                "<tr style='display:none'>" +
                "<td id='ID_castleInformation' style='border-spacing:0'></td>" +
                "</tr>" +
                "<tr style='display:none'>" +
                "<td id='ID_ranchPetStatistics' style='border-spacing:0'></td>" +
                "</tr>" +
                "<tr style='display:none'>" +
                "<td id='ID_castleWarehouse' style='border-spacing:0'></td>" +
                "</tr>" +
                "<tr style='display:none'>" +
                "<td id='ID_castleRanch' style='border-spacing:0'></td>" +
                "</tr>" +
                "<tr>" +
                "<td id='ID_specialPetManager' style='border-spacing:0'></td>" +
                "</tr>" +
                ""));

        $("#ID_specialPetManager").html(() => {
            return this.specialPetManager.generateHTML();
        });
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
            if (this.castle === undefined) return;
            await this.resetMessageBoard();
            this.refresh().then(() => {
                MessageBoard.publishMessage("城堡管家刷新完成。");
            });
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

    private async resetMessageBoard() {
        MessageBoard.initializeManager();
        MessageBoard.initializeWelcomeMessage();
    }

    private async refresh() {
        await this.roleManager.reload();
        await this.roleManager.render();
        await Promise.all([this.reloadCastleWarehouse(), this.reloadCastleRanch()]);
        await Promise.all([this.renderCastleWarehouse(), this.renderCastleRanch()]);
    }

    private async dispose(): Promise<void> {
        await this.roleManager.dispose();
        await this.specialPetManager.dispose();
        const equipmentStatusManager = new RoleEquipmentStatusManager(this.credential);
        const petStatusManager = new RolePetStatusManager(this.credential);
        await Promise.all([
            equipmentStatusManager.updateCastleWarehouseEquipmentStatus(this.warehousePage),
            petStatusManager.updateCastleRanchPetStatus(this.ranchPage)
        ]);
    }

    private async initializeCastle() {
        const castlePage = await new CastleInformation().openWithCache();
        const castle = castlePage.findByRoleName(this.housekeeperPage!.role!.name!);
        if (castle !== null) this.castle = castle;
    }

    private createCastleInformationHTML() {
        return "<table style='background-color:#888888;margin:auto;text-align:center'>" +
            "<tbody style='text-align:center'>" +
            "<tr style='background-color:skyblue'>" +
            "<th rowspan='2' style='width:64px;height:64px' id='castleOwner'>" + NpcLoader.getNpcImageHtml("U_041") + "</th>" +
            "<th>名字</th>" +
            "<th>坐标</th>" +
            "<th>属性</th>" +
            "<th>开发</th>" +
            "<th>商业</th>" +
            "<th>工业</th>" +
            "<th>矿产</th>" +
            "<th>防御</th>" +
            "</tr>" +
            "<tr style='background-color:#F8F0E0'>" +
            "<td>" + (this.castle?.name ?? "") + "</td>" +
            "<td>" + (this.castle?.coordinate?.coordinateText ?? "") + "</td>" +
            "<td>" + (this.castle?.attribute ?? "") + "</td>" +
            "<td>" + (this.castle?.development ?? "0") + "</td>" +
            "<td>" + (this.castle?.commerce ?? "0") + "</td>" +
            "<td>" + (this.castle?.industry ?? "0") + "</td>" +
            "<td>" + (this.castle?.mineral ?? "0") + "</td>" +
            "<td>" + (this.castle?.defense ?? "0") + "</td>" +
            "</tr>" +
            "</tbody>" +
            "</table>";
    }

    private createCastleWarehouseHTML(): string {
        return "" +
            "<table style='background-color:#888888;margin:auto;width:100%;text-align:center'>" +
            "<thead>" +
            "<tr style='background-color:skyblue'>" +
            "<th colspan='17'>城 堡 仓 库</th>" +
            "</tr>" +
            "<tr style='background-color:wheat'>" +
            "<th>序号</th>" +
            "<th>名字</th>" +
            "<th>种类</th>" +
            "<th>效果</th>" +
            "<th>重量</th>" +
            "<th>耐久</th>" +
            "<th>职业</th>" +
            "<th>攻需</th>" +
            "<th>防需</th>" +
            "<th>智需</th>" +
            "<th>精需</th>" +
            "<th>速需</th>" +
            "<th>威＋</th>" +
            "<th>重＋</th>" +
            "<th>幸＋</th>" +
            "<th>经验</th>" +
            "<th>属性</th>" +
            "</tr>" +
            "</thead>" +
            "<tbody id='ID_castleWarehouseList'>" +
            "</tbody>" +
            "</table>" +
            "";
    }

    private createCastleRanchHTML(): string {
        return "" +
            "<table style='background-color:#888888;margin:auto;width:100%;text-align:center'>" +
            "<thead>" +
            "<tr style='background-color:skyblue'>" +
            "<th colspan='14'>城 堡 牧 场</th>" +
            "</tr>" +
            "<tr style='background-color:wheat'>" +
            "<th>序号</th>" +
            "<th style='width:64px'>图鉴</th>" +
            "<th>名字</th>" +
            "<th>性别</th>" +
            "<th>等级</th>" +
            "<th>生命</th>" +
            "<th>攻击</th>" +
            "<th>防御</th>" +
            "<th>智力</th>" +
            "<th>精神</th>" +
            "<th>速度</th>" +
            "<th>经验</th>" +
            "<th>成长</th>" +
            "<th>特殊</th>" +
            "</tr>" +
            "</thead>" +
            "<tbody id='ID_castleRanchList'>" +
            "</tbody>" +
            "</table>" +
            "";
    }

    private async reloadCastleWarehouse() {
        this.warehousePage = await new CastleWarehouse(this.credential).open();
    }

    private async reloadCastleRanch() {
        this.ranchPage = await new CastleRanch(this.credential).open();
    }

    private async renderCastleWarehouse() {
        const table = $("#ID_castleWarehouseList");
        table.html("");

        const equipments = this.warehousePage!.sortStorageEquipmentList!;
        let sequence = 0;
        for (const equipment of equipments) {
            let html = "";
            html += "<tr style='background-color:#E8E8D0'>";
            html += "<th>" + (++sequence) + "</th>";
            html += "<td>" + equipment.nameHTML + "</td>";
            html += "<td>" + equipment.category + "</td>";
            html += "<td>" + equipment.power + "</td>";
            html += "<td>" + equipment.weight + "</td>";
            html += "<td>" + equipment.endureHtml + "</td>";
            html += "<td>" + equipment.requiredCareerHtml + "</td>";
            html += "<td>" + equipment.requiredAttackHtml + "</td>";
            html += "<td>" + equipment.requiredDefenseHtml + "</td>";
            html += "<td>" + equipment.requiredSpecialAttackHtml + "</td>";
            html += "<td>" + equipment.requiredSpecialDefenseHtml + "</td>";
            html += "<td>" + equipment.requiredSpeedHtml + "</td>";
            html += "<td>" + equipment.additionalPowerHtml + "</td>";
            html += "<td>" + equipment.additionalWeightHtml + "</td>";
            html += "<td>" + equipment.additionalLuckHtml + "</td>";
            html += "<td>" + equipment.experienceHTML + "</td>";
            html += "<td>" + equipment.attributeHtml + "</td>";
            html += "</tr>";
            table.append($(html));
        }
    }

    private async renderCastleRanch() {
        $(".C_SpecialPetButton").off("click").off("dblclick");
        const table = $("#ID_castleRanchList");
        table.html("");

        const pets = this.ranchPage!.sortedRanchPetList!;
        let sequence = 0;
        for (const pet of pets) {
            let html = "";
            html += "<tr style='background-color:#E8E8D0'>";
            html += "<th>" + (++sequence) + "</th>";
            html += "<td style='width:64px;height:64px'>" + ((await pet.lookupProfile())?.imageHtml ?? "") + "</td>";
            html += "<td>" + pet.nameHtml + "</td>";
            html += "<td>" + pet.gender + "</td>";
            html += "<td>" + pet.levelHtml + "</td>";
            html += "<td>" + pet.healthHtml + "</td>";
            html += "<td>" + pet.attackHtml + "</td>";
            html += "<td>" + pet.defenseHtml + "</td>";
            html += "<td>" + pet.specialAttackHtml + "</td>";
            html += "<td>" + pet.specialDefenseHtml + "</td>";
            html += "<td>" + pet.speedHtml + "</td>";
            html += "<td>" + pet.experienceHtml + "</td>";
            html += "<td>" + ((await pet.lookupProfile())?.growExperience ?? "") + "</td>";
            html += "<td>";
            if (pet.lookupCode === undefined && pet.isMaxLevel) {
                const special = new SpecialPet();
                special.gender = pet.gender;
                special.level = pet.level;
                special.health = pet.maxHealth;
                special.attack = pet.attack;
                special.defense = pet.defense;
                special.specialAttack = pet.specialAttack;
                special.specialDefense = pet.specialDefense;
                special.speed = pet.speed;
                special.generateId();
                const color: string = ((await SpecialPetStorage.load(special.id!)) !== null) ? "blue" : "grey";
                html += "<button role='button' " +
                    "class='C_pocket_StatelessElement C_SpecialPetButton C_SPB' " +
                    "style='color:" + color + "' " +
                    "id='specialPetButton_" + pet.index + "'>特殊</button>";
            }
            html += "</td>";
            html += "</tr>";
            table.append($(html));
        }

        table.find("> tr").each((_idx, tr) => {
            const img = $(tr).find("> td:first > img:first");
            if (img.length > 0) {
                img.addClass("C_SpecialPetButton");
                const code = img.attr("alt") as string;
                new MouseClickEventBuilder()
                    .bind(img, () => {
                        const next = $(tr).next();
                        if (next.hasClass("C_PetProfile")) {
                            next.remove();
                        } else {
                            const profileHTML = MonsterPageUtils.generateMonsterProfileHtml(code);
                            if (profileHTML !== "") {
                                $(tr).after($("" +
                                    "<tr style='background-color:#E8E8D0' class='C_PetProfile'>" +
                                    "<td colspan='14'>" + profileHTML + "</td>" +
                                    "</tr>" +
                                    ""));
                                const pt = $(tr).next().find("> td:first > table:first");
                                pt.css("background-color", "#888888");
                                pt.find("> tbody:first").css("background-color", "#E8E8D0");
                            }
                        }
                    });
            }
        });

        $(".C_SPB").on("click", event => {
            const btnId = $(event.target).attr("id") as string;
            const index = _.parseInt(StringUtils.substringAfter(btnId, "specialPetButton_"));
            const pet = this.ranchPage!.findRanchPet(index);
            if (pet === null) return;
            const special = new SpecialPet();
            special.name = pet.name;
            special.gender = pet.gender;
            special.level = pet.level;
            special.health = pet.maxHealth;
            special.attack = pet.attack;
            special.defense = pet.defense;
            special.specialAttack = pet.specialAttack;
            special.specialDefense = pet.specialDefense;
            special.speed = pet.speed;
            special.generateId();
            PageUtils.toggleColor(
                btnId,
                () => {
                    SpecialPetStorage.upsert(special).then(() => {
                        this.onSpecialPetModified().then();
                    });
                },
                () => {
                    SpecialPetStorage.remove(special.id!).then(() => {
                        this.onSpecialPetModified().then();
                    });
                }
            );
        });
    }

    private async renderRanchPetStatistics() {
        let html = "";
        html += "<table style='background-color:#888888;text-align:center;margin:auto' id='renderRanchPetStatistics'>";
        html += "<tbody>";

        const mm = new Map<string, PetMap>();
        for (const pet of this.ranchPage!.ranchPetList!) {
            const profile = await pet.lookupProfile();
            if (profile === null) continue;
            if (mm.has(profile.code!)) continue;
            const mock = new PetMap();
            mock.code = profile.code;
            mock.picture = profile.picture;
            mock.count = 1;
            mm.set(mock.code!, mock);
        }

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
            html += "</tr>";

            if (notFound) {
                break;
            }
            row++;
        }
        html += "</tbody>";
        html += "</table>";

        $("#ID_ranchPetStatistics").html(html).parent().show();
    }

    private async onSpecialPetModified() {
        await this.specialPetManager.reload();
        await this.specialPetManager.render();
        if (this.castle) {
            await this.renderCastleRanch();
        }
    }
}

export {TownCastleHousekeeperPageProcessor};