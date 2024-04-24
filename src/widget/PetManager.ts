import CastleBank from "../core/bank/CastleBank";
import CastlePetExpressHouse from "../core/monster/CastlePetExpressHouse";
import CastleRanch from "../core/monster/CastleRanch";
import CastleRanchPage from "../core/monster/CastleRanchPage";
import Credential from "../util/Credential";
import GoldenCage from "../core/monster/GoldenCage";
import GoldenCagePage from "../core/monster/GoldenCagePage";
import LocationModeCastle from "../core/location/LocationModeCastle";
import LocationModeTown from "../core/location/LocationModeTown";
import MonsterProfileLoader from "../core/monster/MonsterProfileLoader";
import MonsterRelationLoader from "../core/monster/MonsterRelationLoader";
import NetworkUtils from "../util/NetworkUtils";
import OperationMessage from "../util/OperationMessage";
import PageUtils from "../util/PageUtils";
import PeopleFinder from "./PeopleFinder";
import PersonalEquipmentManagement from "../core/equipment/PersonalEquipmentManagement";
import PersonalEquipmentManagementPage from "../core/equipment/PersonalEquipmentManagementPage";
import PersonalPetEvolution from "../core/monster/PersonalPetEvolution";
import PersonalPetManagement from "../core/monster/PersonalPetManagement";
import PersonalPetManagementPage from "../core/monster/PersonalPetManagementPage";
import Pet from "../core/monster/Pet";
import PetSpaceTrigger from "../core/trigger/PetSpaceTrigger";
import PocketPageRenderer from "../util/PocketPageRenderer";
import RandomUtils from "../util/RandomUtils";
import StorageUtils from "../util/StorageUtils";
import StringUtils from "../util/StringUtils";
import TownBank from "../core/bank/TownBank";
import TownDashboardLayoutManager from "../core/dashboard/TownDashboardLayoutManager";
import ZodiacPartner from "../core/monster/ZodiacPartner";
import ZodiacPartnerLoader from "../core/monster/ZodiacPartnerLoader";
import _ from "lodash";
import {CommonWidget, CommonWidgetFeature} from "./support/CommonWidget";
import {RolePetStatusManager} from "../core/monster/RolePetStatusManager";
import MessageBoard from "../util/MessageBoard";
import {RoleStatusManager} from "../core/role/RoleStatus";
import {PetUsingTrigger} from "../core/trigger/PetUsingTrigger";
import {SpecialPet, SpecialPetStorage} from "../core/monster/SpecialPet";
import MouseClickEventBuilder from "../util/MouseClickEventBuilder";
import MonsterPageUtils from "../core/monster/MonsterPageUtils";

class PetManager extends CommonWidget {

    private readonly __personalPetTableId = RandomUtils.randomElementId();
    private readonly __cagePetTableId = RandomUtils.randomElementId();
    private readonly __ranchPetTableId = RandomUtils.randomElementId();
    private readonly __peopleFinderBuffer = new Map<number, PeopleFinder>();

    readonly feature = new PetManagerFeature();

    private _equipmentPage?: PersonalEquipmentManagementPage;
    private _cagePage?: GoldenCagePage;
    private _ranchPage?: CastleRanchPage;
    private _cageOpened = false;
    private _ranchOpened = false;

    private lastCagePage?: GoldenCagePage;
    private lastRanchPage?: CastleRanchPage;

    petPage?: PersonalPetManagementPage;
    showProfile?: (html: string) => void;
    hideProfile?: () => void;

    private petTransferPeopleFinder?: PeopleFinder;
    private sendTimer?: any;
    private cageTimer?: any;
    private ranchTimer?: any;

    constructor(credential: Credential, locationMode: LocationModeCastle | LocationModeTown) {
        super(credential, locationMode);
    }

    generateHTML(): string {
        return "" +
            "<table style='background-color:#888888;margin:auto;width:100%;border-width:0'>" +
            "<tbody>" +
            "<tr>" +
            "<th style='writing-mode:vertical-rl;text-orientation:mixed;" +
            "background-color:navy;color:white;font-size:120%;text-align:left'>" +
            "宠 物" +
            "</th>" +
            "<td style='border-spacing:0;width:100%'>" +
            this._generateHTML() +
            "</td>" +
            "</tr>" +
            "</tbody>" +
            "</table>" +
            "";
    }

    private _generateHTML(): string {
        return "" +
            "<table style='background-color:#888888;width:100%;border-spacing:0;border-width:0;margin:auto'>" +
            "<tbody>" +
            "<tr id='_pocket_petManager_personalPetPanel'>" +
            "<td>" + this._createPersonalPetPanelHTML() + "</td>" +
            "</tr>" +
            "<tr id='_pocket_petManager_commandPanel'>" +
            "<td>" + this._createCommandPanelHTML() + "</td>" +
            "</tr>" +
            "<tr id='_pocket_petManager_cagePetPanel' style='display:none'>" +
            "<td>" + this._createCagePetPanelHTML() + "</td>" +
            "</tr>" +
            "<tr id='_pocket_petManager_ranchPetPanel' style='display:none'>" +
            "<td>" + this._createRanchPetPanelHTML() + "</td>" +
            "</tr>" +
            "</tbody>" +
            "</table>" +
            "";
    }

    bindButtons() {
        $("#_pocket_petManager_blindCage").on("click", () => {
            // Try to take out first pet from golden cage.
            new GoldenCage(this.credential).takeOut(0).then(() => {
                const message = OperationMessage.success();
                this._triggerRefresh(message).then();
            });
        });
        $("#_pocket_petManager_openCage").on("click", () => {
            this._executeOpenGoldenCage().then(() => {
                this._reloadCage().then(() => {
                    this._renderCage().then();
                });
            });
        });
        $("#_pocket_petManager_closeCage").on("click", () => {
            this._executeCloseGoldenCage().then();
        });
        $("#_pocket_petManager_openRanch").on("click", () => {
            this._executeOpenCastleRanch().then(() => {
                this._reloadRanch().then(() => {
                    this._renderRanch().then();
                });
            });
        });
        $("#_pocket_petManager_closeRanch").on("click", () => {
            this._executeCloseCastleRanch().then();
        });
        if (this.feature.spellEnabled) {
            $(".C_pocket_PTM_spellLearnButton").on("click", event => {
                const btnId = $(event.target).attr("id") as string;
                PageUtils.toggleColor(btnId,
                    () => {
                        $(".C_pocket_PTM_spellLearnButton").css("color", "grey");
                        PageUtils.changeColorBlue(btnId);
                    },
                    undefined);
                const request = this.credential.asRequestMap();
                request.set("mode", "STUDY_SET");
                const codes: number[] = [1, 2, 3, 4];
                for (const code of codes) {
                    if (PageUtils.isColorBlue("_pocket_PTM_spellLearn_" + code)) {
                        request.set("study" + code, _.toString(code));
                    }
                }
                NetworkUtils.post("mydata.cgi", request).then(response => {
                    MessageBoard.processResponseMessage(response);
                    const message = OperationMessage.success();
                    this._triggerRefresh(message).then();
                });
            });
        }
        $("#summonZodiacPartner").on("click", () => {
            const partnerLoader = new ZodiacPartnerLoader(this.credential);
            if (!partnerLoader.available()) return;
            partnerLoader.load(this.petPage).then(() => {
                this._triggerRefresh(OperationMessage.success()).then();
            });
        });

        this.petTransferPeopleFinder?.bindButtons();

        if (this.feature.enablePetTransfer && this.isCastleMode) {
            $("#autoSendPetButton").on("click", () => {
                const target = this.petTransferPeopleFinder?.targetPeople;
                if (target === undefined) {
                    this.feature.publishWarning("没有选择发送对象，忽略！");
                    return;
                }
                if (target === this.credential.id) {
                    this.feature.publishWarning("不能发送给自己，忽略！");
                    return;
                }
                PageUtils.toggleColor(
                    "autoSendPetButton",
                    () => {
                        this.cancelDaemonButtons("autoSendPetButton");
                        this.feature.publishMessage("启动自动发送宠物守护进程。");
                        this.sendTimer = setInterval(() => {
                            this.autoSendPet(target).then();
                        }, 3000);
                    },
                    () => {
                        if (this.sendTimer !== undefined) {
                            clearInterval(this.sendTimer);
                            this.sendTimer = undefined;
                        }
                        this.feature.publishMessage("自动发送宠物守护进程结束。");
                    }
                );
            });

            $("#autoCagePetButton").on("click", () => {
                PageUtils.toggleColor(
                    "autoCagePetButton",
                    () => {
                        this.cancelDaemonButtons("autoCagePetButton");
                        this.feature.publishMessage("启动宠物自动入笼守护进程。");
                        this.cageTimer = setInterval(() => {
                            this.autoCagePet().then();
                        }, 3000);
                    },
                    () => {
                        if (this.cageTimer !== undefined) {
                            clearInterval(this.cageTimer);
                            this.cageTimer = undefined;
                        }
                        this.feature.publishMessage("宠物入笼自动守护进程结束。");
                    }
                );
            });

            $("#autoRanchPetButton").on("click", () => {
                PageUtils.toggleColor(
                    "autoRanchPetButton",
                    () => {
                        this.cancelDaemonButtons("autoRanchPetButton");
                        this.feature.publishMessage("启动宠物自动放牧守护进程。");
                        this.ranchTimer = setInterval(() => {
                            this.autoRanchPet().then();
                        }, 3000);
                    },
                    () => {
                        if (this.ranchTimer !== undefined) {
                            clearInterval(this.ranchTimer);
                            this.ranchTimer = undefined;
                        }
                        this.feature.publishMessage("宠物放牧自动守护进程结束。");
                    }
                );
            });
        }
    }

    async reload() {
        this.petPage = await new PersonalPetManagement(this.credential, this.townId).open();
    }

    async render(equipmentPage: PersonalEquipmentManagementPage) {
        this._equipmentPage = equipmentPage;

        await this._resetButtons();

        // Dispose all people finder
        this.__peopleFinderBuffer.forEach(it => it.dispose());
        this.__peopleFinderBuffer.clear();

        $(".C_pocket_petManager_personalPetButton")
            .off("click").off("dblclick")
            .off("mouseenter").off("mouseleave");
        $(".C_pocket_petManager_personalPet").remove();

        const partnerLoader = new ZodiacPartnerLoader(this.credential);
        if (partnerLoader.available()) {
            $("#ZodiacPartnerPanel").show();
        } else {
            $("#ZodiacPartnerPanel").hide();
        }

        if (this._hasGoldenCage || this.isCastleMode) {
            $("#CageRanchDaemonPanel").show();
        } else {
            $("#CageRanchDaemonPanel").hide();
        }
        if (this._hasGoldenCage) {
            $("#autoCagePetButton").show();
        } else {
            $("#autoCagePetButton").hide();
        }
        if (this.isCastleMode) {
            $("#autoRanchPetButton").show();
        } else {
            $("#autoRanchPetButton").hide();
        }

        const personalPetTable = $("#" + this.__personalPetTableId);
        for (const pet of this.petPage!.petList!) {
            let backgroundColor = "#E8E8D0";
            let html = "";
            html += "<tr class='C_pocket_petManager_personalPet' style='background-color:" + backgroundColor + "'>";
            const imageId = "_pocket_PTM_pet_image_" + pet.code;
            html += "<td rowspan='5' style='vertical-align:center;width:64px'>" +
                pet.createImageHtml(imageId, "C_pocket_petManager_personalPetButton C_pocket_pet_imageButton") +
                "</td>";
            html += "<td rowspan='5' style='vertical-align:center'>" + pet.usingHtml + "</td>";
            html += "<td>" + pet.nameHtml + "</td>";
            html += "<td>" + pet.gender + "</td>";
            html += "<td>" + pet.levelHtml + "</td>";
            html += "<td>" + pet.healthHtml + "</td>";
            if (partnerLoader.isZodiacPartner(pet)) {
                html += "<td style='background-color:black;color:white;font-weight:bold'>" + pet.attackHtml + "</td>";
                html += "<td style='background-color:black;color:white;font-weight:bold'>" + pet.defenseHtml + "</td>";
                html += "<td style='background-color:black;color:white;font-weight:bold'>" + pet.specialAttackHtml + "</td>";
                html += "<td style='background-color:black;color:white;font-weight:bold'>" + pet.specialDefenseHtml + "</td>";
                html += "<td style='background-color:black;color:white;font-weight:bold'>" + pet.speedHtml + "</td>";
            } else {
                html += "<td>" + pet.attackHtml + "</td>";
                html += "<td>" + pet.defenseHtml + "</td>";
                html += "<td>" + pet.specialAttackHtml + "</td>";
                html += "<td>" + pet.specialDefenseHtml + "</td>";
                html += "<td>" + pet.speedHtml + "</td>";
            }
            html += "<td>" + pet.love + "</td>";
            html += "<td>" + pet.raceHtml + "</td>";
            html += "<td>" + pet.growExperience + "</td>";
            html += "<td>" + _.join(pet.attributeList, "/") + "</td>";
            html += "</tr>";
            html += "<tr class='C_pocket_petManager_personalPet' style='background-color:" + backgroundColor + "'>";
            html += "<td colspan='13'>";
            let color = pet.usingSpell1 ? "blue" : "grey";
            html += "<button role='button' " +
                "title='" + pet.spell1Description + "' " +
                "class='C_pocket_petManager_personalPetButton C_pocket_petManager_spellButton' " +
                "id='_pocket_petManager_spell1_" + pet.index + "' " +
                "style='color:" + color + "'>" + pet.spell1 + "</button><span> </span>";
            color = pet.usingSpell2 ? "blue" : "grey";
            html += "<button role='button' " +
                "title='" + pet.spell2Description + "' " +
                "class='C_pocket_petManager_personalPetButton C_pocket_petManager_spellButton' " +
                "id='_pocket_petManager_spell2_" + pet.index + "' " +
                "style='color:" + color + "'>" + pet.spell2 + "</button><span> </span>";
            color = pet.usingSpell3 ? "blue" : "grey";
            html += "<button role='button' " +
                "title='" + pet.spell3Description + "' " +
                "class='C_pocket_petManager_personalPetButton C_pocket_petManager_spellButton' " +
                "id='_pocket_petManager_spell3_" + pet.index + "' " +
                "style='color:" + color + "'>" + pet.spell3 + "</button><span> </span>";
            color = pet.usingSpell4 ? "blue" : "grey";
            html += "<button role='button' " +
                "title='" + pet.spell4Description + "' " +
                "class='C_pocket_petManager_personalPetButton C_pocket_petManager_spellButton' " +
                "id='_pocket_petManager_spell4_" + pet.index + "' " +
                "style='color:" + color + "'>" + pet.spell4 + "</button>";
            html += "</td>";
            html += "</tr>";
            html += "<tr class='C_pocket_petManager_personalPet' style='background-color:" + backgroundColor + "'>";
            html += "<td colspan='13'>";
            html += "<table style='background-color:transparent;width:100%;border-spacing:0;border-width:0;margin:auto'>";
            html += "<tbody>";
            html += "<tr>";
            html += "<td style='text-align:left;width:100%'>";
            html += "<span><button role='button' " +
                "class='C_pocket_petManager_personalPetButton C_pocket_petManager_useButton' " +
                "id='_pocket_petManager_use_" + pet.index + "'>" + (pet.using! ? "卸下" : "使用") + "</button> </span>";
            if (this._hasGoldenCage) {
                if (pet.using) {
                    html += "<span><button role='button' disabled>入笼</button> </span>";
                } else {
                    html += "<span><button role='button' " +
                        "class='C_pocket_petManager_personalPetButton C_pocket_petManager_cageButton' " +
                        "id='_pocket_petManager_cage_" + pet.index + "'>入笼</button> </span>";
                }
            }
            if (this.isCastleMode) {
                if (pet.using) {
                    html += "<span><button role='button' disabled>放牧</button> </span>";
                } else {
                    html += "<span><button role='button' " +
                        "class='C_pocket_petManager_personalPetButton C_pocket_petManager_ranchButton' " +
                        "id='_pocket_petManager_ranch_" + pet.index + "'>放牧</button> </span>";
                }
            }
            if (pet.love !== undefined && pet.love < 100) {
                html += "<span><button role='button' " +
                    "class='C_pocket_petManager_personalPetButton C_pocket_petManager_loveButton' " +
                    "id='_pocket_petManager_love_" + pet.index + "'>亲密</button> </span>";
            } else {
                html += "<span><button role='button' disabled>亲密</button> </span>";
            }
            if (this.feature.leagueEnabled) {
                if (pet.level === 100) {
                    html += "<span><button role='button' " +
                        "class='C_pocket_petManager_personalPetButton C_pocket_PTM_PP_leagueButton' " +
                        "id='_pocket_PTM_PP_league_" + pet.index + "'>参赛</button> </span>";
                } else {
                    html += "<span><button role='button' disabled>参赛</button> </span>";
                }
            }
            html += "</td>";
            html += "<td style='text-align:right;white-space:nowrap'>";
            if (pet.level === 100) {
                const title: string = partnerLoader.isZodiacPartner(pet) ? "取消战宠" : "设置战宠";
                html += "<button role='button' " +
                    "class='C_pocket_petManager_personalPetButton C_pocket_petManager_setPersonalPetPartner' " +
                    "id='_pocket_petManager_setPersonalPetPartner_" + pet.index + "'>" + title + "</button>";
            }
            html += "</td>";
            html += "</tr>";
            html += "</tbody>";
            html += "</table>";
            html += "</td>";
            html += "</tr>";
            html += "</tr>";
            html += "<tr class='C_pocket_petManager_personalPet' style='background-color:" + backgroundColor + "'>";
            html += "<td colspan='13' style='text-align:right'>";
            if (pet.using) {
                html += "<button role='button' disabled>发送</button>";
            } else {
                const peopleFinder = new PeopleFinder(this.credential, this.locationMode as LocationModeTown | LocationModeCastle);
                this.__peopleFinderBuffer.set(pet.index!, peopleFinder);
                html += peopleFinder.generateHTML();
                html += PocketPageRenderer.GO();
                html += "<button role='button' " +
                    "class='C_pocket_petManager_personalPetButton C_pocket_petManager_sendButton' " +
                    "id='_pocket_petManager_send_" + pet.index + "'>发送</button>";
            }
            html += "</td>";
            html += "</tr>";
            html += "</tr>";
            html += "<tr class='C_pocket_petManager_personalPet' style='background-color:" + backgroundColor + "'>";
            html += "<td colspan='13'>";
            html += "<table style='background-color:transparent;width:100%;margin:auto;border-width:0;border-spacing:0'>";
            html += "<tbody>";
            html += "<tr>";
            html += "<td style='text-align:left;white-space:nowrap'>";
            if (pet.canConsecrate) {
                html += "<span><button role='button' " +
                    "class='C_pocket_petManager_personalPetButton C_pocket_petManager_consecrateButton' " +
                    "id='_pocket_petManager_consecrate_" + pet.index + "' " +
                    "style='color:red;font-weight:bold' " +
                    "title='花费1000万超级封印" + pet.name + "'>献祭</button> </span>";
            } else {
                html += "<span><button role='button' disabled>献祭</button> </span>";
            }
            html += "</td>";
            html += "<td style='text-align:right;width:100%'>";
            html += "<input type='text' size='15' maxlength='20' spellcheck='false' " +
                "id='_pocket_petManager_renameText_" + pet.index + "'>";
            html += PocketPageRenderer.GO();
            html += "<button role='button' " +
                "class='C_pocket_petManager_personalPetButton C_pocket_petManager_renameButton' " +
                "id='_pocket_petManager_rename_" + pet.index + "'>改名</button>";
            html += "</td>";
            html += "</tr>";
            html += "</tbody>";
            html += "</table>";
            html += "</td>";
            html += "</tr>";
            personalPetTable.append($(html));
        }

        this.__peopleFinderBuffer.forEach(it => it.bindButtons());
        await this._bindUseButton();
        await this._bindCageButton();
        await this._bindRanchButton();
        await this._bindLoveButton();
        await this._bindLeagueButton();
        await this._bindSendButton();
        await this._bindSpellButton();
        await this._bindPartnerButton();
        await this._bindConsecrateButton();
        await this._bindRenameButton();
        await this._bindProfileButton();
    }

    async dispose() {
        const usingPet = this.petPage?.usingPet;
        if (usingPet === null) {
            await new RoleStatusManager(this.credential).unsetPetGender();
            await new RoleStatusManager(this.credential).unsetPetLevel();
        } else {
            const usingPetGender = usingPet!.gender!;
            const usingPetLevel = usingPet!.level!;
            await new RoleStatusManager(this.credential).setPetGender(usingPetGender);
            await new RoleStatusManager(this.credential).setPetLevel(usingPetLevel);
        }

        const promises = [];
        if (this.feature.enableSpaceTriggerOnDispose) {
            const trigger = new PetSpaceTrigger(this.credential);
            promises.push(trigger.withPetPage(this.petPage).triggerUpdate());
        }
        if (this.feature.enableStatusTriggerOnDispose) {
            const statusManager = new RolePetStatusManager(this.credential);
            promises.push(statusManager.updatePersonalPetStatus(this.petPage));
            promises.push(statusManager.updateGoldenCagePetStatus(this.lastCagePage));
            promises.push(statusManager.updateCastleRanchPetStatus(this.lastRanchPage));
        }
        if (this.feature.enableUsingTriggerOnDispose) {
            const trigger = new PetUsingTrigger(this.credential);
            promises.push(trigger.withPetPage(this.petPage).triggerUpdate());
        }
        if (promises.length > 0) {
            await Promise.all(promises);
        }
    }

    private _createPersonalPetPanelHTML(): string {
        let html = "";
        html += "<table style='background-color:transparent;width:100%;margin:auto;border-width:0'>";
        html += "<tbody id='" + this.__personalPetTableId + "' style='text-align:center'>";
        html += "<tr style='background-color:skyblue'>";
        html += "<th style='font-size:120%' colspan='15'>＜ 随 身 宠 物 ＞</th>"
        html += "</tr>";
        html += "<tr style='background-color:wheat'>";
        html += "<th>图鉴</th>";
        html += "<th>使用</th>";
        html += "<th>名字</th>";
        html += "<th>性别</th>";
        html += "<th>等级</th>";
        html += "<th>生命</th>";
        html += "<th>攻击</th>";
        html += "<th>防御</th>";
        html += "<th>智力</th>";
        html += "<th>精神</th>";
        html += "<th>速度</th>";
        html += "<th>亲密</th>";
        html += "<th>种类</th>";
        html += "<th>成长</th>";
        html += "<th>属性</th>";
        html += "</tr>";
        html += "</tbody>";
        html += "</table>";
        return html;
    }

    private _createCommandPanelHTML(): string {
        let html = "";
        html += "<table style='background-color:transparent;width:100%;margin:auto;border-width:0'>";
        html += "<tbody>";
        html += "<tr id='_pocket_petManager_cageAndRanchPanel'>";
        html += "<td style='text-align:right;background-color:#E8E8D0'>";
        html += "<span style='display:none'> <button role='button' disabled " +
            "id='_pocket_petManager_blindCage'>从黄金笼子盲取</button></span>";
        html += "<span style='display:none'> <button role='button' disabled " +
            "id='_pocket_petManager_openCage'>打开黄金笼子</button></span>";
        html += "<span style='display:none'> <button role='button' disabled " +
            "id='_pocket_petManager_closeCage'>关闭黄金笼子</button></span>";
        html += "<span style='display:none'> <button role='button' disabled " +
            "id='_pocket_petManager_openRanch'>打开城堡牧场</button></span>";
        html += "<span style='display:none'> <button role='button' disabled " +
            "id='_pocket_petManager_closeRanch'>关闭城堡牧场</button></span>";
        html += "</td>";
        html += "</tr>";
        if (this.feature.spellEnabled) {
            html += "<tr>";
            html += "<td style='text-align:right;background-color:#E8E8D0'>";
            html += "<span style='color:navy;font-weight:bold'>设置宠物学习技能位</span>";
            html += "<span> </span>";
            html += "<button role='button' class='C_pocket_PTM_spellLearnButton' style='color:grey' id='_pocket_PTM_spellLearn_1'>第１技能位</button>";
            html += "<span> </span>";
            html += "<button role='button' class='C_pocket_PTM_spellLearnButton' style='color:grey' id='_pocket_PTM_spellLearn_2'>第２技能位</button>";
            html += "<span> </span>";
            html += "<button role='button' class='C_pocket_PTM_spellLearnButton' style='color:grey' id='_pocket_PTM_spellLearn_3'>第３技能位</button>";
            html += "<span> </span>";
            html += "<button role='button' class='C_pocket_PTM_spellLearnButton' style='color:grey' id='_pocket_PTM_spellLearn_4'>第４技能位</button>";
            html += "</td>";
            html += "</tr>";
        }
        html += "<tr style='display:none' id='ZodiacPartnerPanel'>";
        html += "<td style='text-align:right;background-color:#E8E8D0'>";
        html += "<button role='button' class='C_StatelessElement' id='summonZodiacPartner'>召唤战宠</button>";
        html += "</td>";
        html += "</tr>";
        if (this.feature.enablePetTransfer && this.isCastleMode) {
            this.petTransferPeopleFinder = new PeopleFinder(this.credential, this.locationMode as LocationModeCastle | LocationModeTown);
            html += "<tr>";
            html += "<td style='text-align:center;background-color:wheat'>";
            html += this.petTransferPeopleFinder.generateHTML();
            html += PocketPageRenderer.GO();
            html += "<button role='button' style='color:grey' class='C_PM_DaemonButton' id='autoSendPetButton'>自动发送闲置宠物</button>";
            html += "</td>";
            html += "</tr>";
            html += "<tr id='CageRanchDaemonPanel'>";
            html += "<td style='text-align:center;background-color:wheat'>";
            html += "<button role='button' style='color:grey' class='C_PM_DaemonButton' id='autoCagePetButton'>闲置宠物自动入笼</button>";
            html += "<button role='button' style='color:grey' class='C_PM_DaemonButton' id='autoRanchPetButton'>闲置宠物自动放牧</button>";
            html += "</td>";
            html += "</tr>";
        }
        html += "</tbody>";
        html += "</table>";
        return html;
    }

    private _createCagePetPanelHTML(): string {
        let html = "";
        html += "<table style='background-color:transparent;width:100%;margin:auto;border-width:0'>";
        html += "<tbody id='" + this.__cagePetTableId + "' style='text-align:center'>";
        html += "<tr style='background-color:skyblue'>";
        html += "<th style='font-size:120%' colspan='16'>＜ 黄 金 笼 子 ＞</th>"
        html += "</tr>";
        html += "<tr style='background-color:wheat'>";
        html += "<th>序号</th>";
        html += "<th style='width:64px'>图鉴</th>";
        html += "<th>名字</th>";
        html += "<th>性别</th>";
        html += "<th>等级</th>";
        html += "<th>生命</th>";
        html += "<th>攻击</th>";
        html += "<th>防御</th>";
        html += "<th>智力</th>";
        html += "<th>精神</th>";
        html += "<th>速度</th>";
        html += "<th>经验</th>";
        html += "<th>成长</th>";
        html += "<th>取出</th>";
        html += "<th>战宠</th>";
        html += "<th>特殊</th>";
        html += "</tr>";
        html += "</tbody>";
        html += "</table>";
        return html;
    }

    private _createRanchPetPanelHTML(): string {
        let html = "";
        html += "<table style='background-color:transparent;width:100%;margin:auto;border-width:0'>";
        html += "<tbody id='" + this.__ranchPetTableId + "' style='text-align:center'>";
        html += "<tr style='background-color:skyblue'>";
        html += "<th style='font-size:120%' colspan='15'>＜ 城 堡 牧 场 ＞</th>"
        html += "</tr>";
        html += "<tr style='background-color:wheat'>";
        html += "<th>序号</th>";
        html += "<th style='width:64px'>图鉴</th>";
        html += "<th>名字</th>";
        html += "<th>性别</th>";
        html += "<th>等级</th>";
        html += "<th>生命</th>";
        html += "<th>攻击</th>";
        html += "<th>防御</th>";
        html += "<th>智力</th>";
        html += "<th>精神</th>";
        html += "<th>速度</th>";
        html += "<th>经验</th>";
        html += "<th>成长</th>";
        html += "<th>取出</th>";
        html += "<th>特殊</th>";
        html += "</tr>";
        html += "</tbody>";
        html += "</table>";
        return html;
    }

    private async _resetButtons() {
        let showPanel = false;
        if (this._hasGoldenCage) {
            if (this._equipmentPage!.findGoldenCage() !== null) {
                $("#_pocket_petManager_openCage")
                    .prop("disabled", false)
                    .parent().show();
                $("#_pocket_petManager_closeCage")
                    .prop("disabled", false)
                    .parent().show();
                $("#_pocket_petManager_blindCage")
                    .prop("disabled", true)
                    .parent().hide();
            } else {
                $("#_pocket_petManager_blindCage")
                    .prop("disabled", false)
                    .parent().show();
                $("#_pocket_petManager_openCage")
                    .prop("disabled", true)
                    .parent().hide();
                $("#_pocket_petManager_closeCage")
                    .prop("disabled", true)
                    .parent().hide();
            }
            showPanel = true;
        }
        if (this.isCastleMode) {
            $("#_pocket_petManager_openRanch")
                .prop("disabled", false)
                .parent().show();
            $("#_pocket_petManager_closeRanch")
                .prop("disabled", false)
                .parent().show();
            showPanel = true;
        } else {
            $("#_pocket_petManager_openRanch")
                .prop("disabled", true)
                .parent().hide();
            $("#_pocket_petManager_closeRanch")
                .prop("disabled", true)
                .parent().hide();
        }
        if (showPanel) {
            $("#_pocket_petManager_cageAndRanchPanel").show();
        } else {
            $("#_pocket_petManager_cageAndRanchPanel").hide();
        }
        if (this._cageOpened) {
            PageUtils.disableElement("_pocket_petManager_openCage");
        } else {
            PageUtils.disableElement("_pocket_petManager_closeCage");
        }
        if (this._ranchOpened) {
            PageUtils.disableElement("_pocket_petManager_openRanch");
        } else {
            PageUtils.disableElement("_pocket_petManager_closeRanch");
        }

        const codes: number[] = [1, 2, 3, 4];
        for (const code of codes) {
            if (this.petPage!.petStudyStatus!.includes(code)) {
                const btnId = "_pocket_PTM_spellLearn_" + code;
                PageUtils.changeColorBlue(btnId);
            }
        }
    }

    private get _hasGoldenCage(): boolean {
        const cage = this._equipmentPage!.findGoldenCage();
        if (cage !== null) return true;
        // 目前已知只有仙人掌和六娃因为某些原因丢失了
        // 笼子和袋子，直接硬编码处理吧。
        // 好了，又新加一个人，可怜的小鹿。
        const poorIds: string[] = ["miss2", "7711", "cangtong"];
        return _.includes(poorIds, this.credential.id);
    }

    private async _triggerRefresh(message: OperationMessage,
                                  includeCage: boolean = false,
                                  includeRanch: boolean = false) {
        this._equipmentPage = await new PersonalEquipmentManagement(this.credential, this.townId).open();
        message.extensions.set("equipmentPage", this._equipmentPage);
        await this.reload();
        await this.render(this._equipmentPage);
        if (includeCage) {
            this.lastCagePage = undefined;
            await this._reloadCage();
            await this._renderCage();
        }
        if (includeRanch) {
            this.lastRanchPage = undefined;
            await this._reloadRanch();
            await this._renderRanch();
        }
        this.feature.publishRefresh(message);
    }

    private async _bindUseButton() {
        $(".C_pocket_petManager_useButton").on("click", event => {
            const btnId = $(event.target).attr("id") as string;
            let index = _.parseInt(StringUtils.substringAfterLast(btnId, "_"));
            const pet = this.petPage!.findPet(index);
            if (pet === null) return;
            if (pet.using) index = -1;
            new PersonalPetManagement(this.credential).set(index).then(() => {
                const message = OperationMessage.success();
                this._triggerRefresh(message).then();
            });
        });
    }

    private async _bindCageButton() {
        $(".C_pocket_petManager_cageButton").on("click", event => {
            const btnId = $(event.target).attr("id") as string;
            const index = _.parseInt(StringUtils.substringAfterLast(btnId, "_"));
            new GoldenCage(this.credential).putInto(index).then(() => {
                const message = OperationMessage.success();
                this._triggerRefresh(message, true).then();
            });
        });
    }

    private async _bindRanchButton() {
        $(".C_pocket_petManager_ranchButton").on("click", event => {
            const btnId = $(event.target).attr("id") as string;
            const index = _.parseInt(StringUtils.substringAfterLast(btnId, "_"));
            new CastleRanch(this.credential).graze(index).then(() => {
                const message = OperationMessage.success();
                this._triggerRefresh(message, false, true).then();
            });
        });
    }

    private async _bindLoveButton() {
        $(".C_pocket_petManager_loveButton").on("click", event => {
            const btnId = $(event.target).attr("id") as string;
            const index = _.parseInt(StringUtils.substringAfterLast(btnId, "_"));
            const pet = this.petPage!.findPet(index);
            if (pet === null || pet.love == undefined || pet.love === 100) return;
            this._executeLovePet(pet).then(() => {
                const message = OperationMessage.success();
                this._triggerRefresh(message).then();
            });
        });
    }

    private async _bindLeagueButton() {
        $(".C_pocket_PTM_PP_leagueButton").on("click", event => {
            const btnId = $(event.target).attr("id") as string;
            const index = _.parseInt(StringUtils.substringAfterLast(btnId, "_"));
            const pet = this.petPage!.findPet(index);
            if (pet === null || pet.level !== 100) return;
            new PersonalPetManagement(this.credential).joinLeague(index).then(() => {
                const message = OperationMessage.success();
                message.extensions.set("mode", "LEAGUE");
                this._triggerRefresh(message).then();
            });
        });
    }

    private async _bindSendButton() {
        $(".C_pocket_petManager_sendButton").on("click", event => {
            const btnId = $(event.target).attr("id") as string;
            const index = _.parseInt(StringUtils.substringAfterLast(btnId, "_"));
            const peopleFinder = this.__peopleFinderBuffer.get(index);
            if (peopleFinder === undefined) return;
            const target = peopleFinder.targetPeople;
            if (target === undefined) {
                this.feature.publishWarning("没有选择发送宠物的对象，忽略！");
                return;
            }
            if (target === this.credential.id) {
                this.feature.publishWarning("不能发送给自己，忽略！");
                return;
            }
            this._executeSendPet(target, index).then(() => {
                const message = OperationMessage.success();
                this._triggerRefresh(message).then();
            });
        });
    }

    private async _bindSpellButton() {
        $(".C_pocket_petManager_spellButton").on("click", event => {
            const btnId = $(event.target).attr("id") as string;
            const index = _.parseInt(StringUtils.substringAfterLast(btnId, "_"));
            PageUtils.toggleColor(btnId, undefined, undefined);
            const request = this.credential.asRequestMap();
            request.set("select", _.toString(index));
            request.set("mode", "PETUSESKILL_SET");
            if (PageUtils.isColorBlue("_pocket_petManager_spell1_" + index)) request.set("use1", "1");
            if (PageUtils.isColorBlue("_pocket_petManager_spell2_" + index)) request.set("use2", "2");
            if (PageUtils.isColorBlue("_pocket_petManager_spell3_" + index)) request.set("use3", "3");
            if (PageUtils.isColorBlue("_pocket_petManager_spell4_" + index)) request.set("use4", "4");
            NetworkUtils.post("mydata.cgi", request).then(response => {
                MessageBoard.processResponseMessage(response);
                const message = OperationMessage.success();
                this._triggerRefresh(message).then();
            });
        });
    }

    private async _bindPartnerButton() {
        $(".C_pocket_petManager_setPersonalPetPartner").on("click", event => {
            const btnId = $(event.target).attr("id") as string;
            const index = _.parseInt(StringUtils.substringAfterLast(btnId, "_"));
            const pet = this.petPage!.findPet(index);
            if (pet === null) return;
            const partnerLoader = new ZodiacPartnerLoader(this.credential);
            if (partnerLoader.isZodiacPartner(pet)) {
                StorageUtils.remove("_pa_066_" + this.credential.id);
            } else {
                const partner = new ZodiacPartner();
                partner.name = pet.name;
                partner.level = pet.level;
                partner.maxHealth = pet.maxHealth;
                partner.attack = pet.attack;
                partner.defense = pet.defense;
                partner.specialAttack = pet.specialAttack;
                partner.specialDefense = pet.specialDefense;
                partner.speed = pet.speed;
                StorageUtils.set("_pa_066_" + this.credential.id, JSON.stringify(partner));
            }
            this.render(this._equipmentPage!).then();
        });
    }

    private async _bindConsecrateButton() {
        $(".C_pocket_petManager_consecrateButton").on("click", event => {
            const btnId = $(event.target).attr("id") as string;
            const index = _.parseInt(StringUtils.substringAfterLast(btnId, "_"));
            const pet = this.petPage!.findPet(index);
            if (pet === null || pet.using) return;
            if (!confirm("你确认要献祭宠物" + pet.name + "吗？")) return;
            this._executeConsecratePet(pet).then(() => {
                const message = OperationMessage.success();
                message.extensions.set("mode", "CONSECRATE");
                this._triggerRefresh(message).then();
            });
        });
    }

    private async _bindRenameButton() {
        $(".C_pocket_petManager_renameButton").on("click", event => {
            const btnId = $(event.target).attr("id") as string;
            const index = _.parseInt(StringUtils.substringAfterLast(btnId, "_"));
            const pet = this.petPage!.findPet(index);
            if (pet === null) return;
            const name = _.trim($("#_pocket_petManager_renameText_" + pet.index).val() as string);
            if (name === "") return;
            new PersonalPetManagement(this.credential).rename(index, name).then(() => {
                const message = OperationMessage.success();
                this._triggerRefresh(message).then();
            });
        });
    }

    private async _bindProfileButton() {
        const configId = TownDashboardLayoutManager.loadDashboardLayoutConfigId(this.credential);
        if (configId === 6) {
            $(".C_pocket_pet_imageButton")
                .on("click", event => {
                    const btnId = $(event.target).attr("id") as string;
                    const code = StringUtils.substringAfterLast(btnId, "_");
                    const html = this.createPetProfileHTML(code);
                    (this.showProfile) && (this.showProfile(html));
                });
        } else {
            $(".C_pocket_pet_imageButton")
                .on("mouseenter", event => {
                    const btnId = $(event.target).attr("id") as string;
                    const code = StringUtils.substringAfterLast(btnId, "_");
                    const html = this.createPetProfileHTML(code);
                    (this.showProfile) && (this.showProfile(html));
                })
                .on("mouseleave", () => {
                    (this.hideProfile) && (this.hideProfile());
                });
        }
    }

    private async _executeLovePet(pet: Pet) {
        const amount = Math.ceil(100 - pet.love!);
        if (this.isTownMode) {
            await new TownBank(this.credential, this.townId).withdraw(amount);
            await new PersonalPetManagement(this.credential).love(pet.index!);
            await new TownBank(this.credential, this.townId).deposit();
        } else if (this.isCastleMode) {
            await new CastleBank(this.credential).withdraw(amount);
            await new PersonalPetManagement(this.credential).love(pet.index!);
            await new CastleBank(this.credential).deposit();
        }
    }

    private async _executeConsecratePet(pet: Pet) {
        if (this.isTownMode) {
            await new TownBank(this.credential, this.townId).withdraw(1000);
            await new PersonalPetEvolution(this.credential).consecrate(pet.index!);
            await new TownBank(this.credential, this.townId).deposit();
        } else if (this.isCastleMode) {
            await new CastleBank(this.credential).withdraw(1000);
            await new PersonalPetEvolution(this.credential).consecrate(pet.index!);
            await new CastleBank(this.credential).deposit();
        }
    }

    private async _executeSendPet(target: string, index: number) {
        if (this.isTownMode) {
            await new TownBank(this.credential, this.townId).withdraw(10);
            const request = this.credential.asRequestMap();
            request.set("mode", "PET_SEND2");
            request.set("eid", target);
            request.set("select", _.toString(index));
            const response = await NetworkUtils.post("town.cgi", request);
            MessageBoard.processResponseMessage(response);
            await new TownBank(this.credential, this.townId).deposit();
        } else if (this.isCastleMode) {
            await new CastleBank(this.credential).withdraw(10);
            await new CastlePetExpressHouse(this.credential).send(target, index);
            await new CastleBank(this.credential).deposit();
        }
    }

    private async _executeOpenGoldenCage() {
        if (this._cageOpened) return;
        this._cageOpened = true;
        $("#_pocket_petManager_cagePetPanel").show();
        PageUtils.disableElement("_pocket_petManager_openCage");
        PageUtils.enableElement("_pocket_petManager_closeCage");
    }

    private async _executeCloseGoldenCage() {
        if (!this._cageOpened) return;
        this._cageOpened = false;
        $("#_pocket_petManager_cagePetPanel").hide();
        PageUtils.enableElement("_pocket_petManager_openCage");
        PageUtils.disableElement("_pocket_petManager_closeCage");
        this._cagePage = undefined;
        $(".C_pocket_petManager_cagePetButton").off("click").off("dblclick");
        $(".C_pocket_petManager_cagePet").remove();
    }

    private async _executeOpenCastleRanch() {
        if (this._ranchOpened) return;
        this._ranchOpened = true;
        $("#_pocket_petManager_ranchPetPanel").show();
        PageUtils.disableElement("_pocket_petManager_openRanch");
        PageUtils.enableElement("_pocket_petManager_closeRanch");
    }

    private async _executeCloseCastleRanch() {
        if (!this._ranchOpened) return;
        this._ranchOpened = false;
        $("#_pocket_petManager_ranchPetPanel").hide();
        PageUtils.enableElement("_pocket_petManager_openRanch");
        PageUtils.disableElement("_pocket_petManager_closeRanch");
        this._ranchPage = undefined;
        $(".C_pocket_petManager_ranchPetButton").off("click").off("dblclick");
        $(".C_pocket_petManager_ranchPet").remove();
    }

    private async _reloadCage() {
        if (!this._cageOpened) return;
        const cage = this._equipmentPage!.findGoldenCage()!;
        this._cagePage = await new GoldenCage(this.credential).open(cage.index!);
        this.lastCagePage = this._cagePage;
    }

    async _renderCage() {
        if (!this._cageOpened) return;
        $(".C_pocket_petManager_cagePetButton").off("click").off("dblclick");
        $(".C_pocket_petManager_cagePet").remove();

        const partnerLoader = new ZodiacPartnerLoader(this.credential);
        const cagePetTable = $("#" + this.__cagePetTableId);
        let sequence = 0;
        for (const pet of this._cagePage!.sortedPetList) {
            let backgroundColor = "#E8E8D0";
            let html = "";
            html += "<tr class='C_pocket_petManager_cagePet' style='background-color:" + backgroundColor + "'>";
            html += "<th>" + (++sequence) + "</th>";
            html += "<td style='width:64px;height:64px'>" + ((await pet.lookupProfile())?.imageHtml ?? "") + "</td>";
            html += "<td>" + pet.nameHtml + "</td>";
            html += "<td>" + pet.gender + "</td>";
            html += "<td>" + pet.levelHtml + "</td>";
            html += "<td>" + pet.healthHtml + "</td>";
            if (partnerLoader.isZodiacPartner(pet)) {
                html += "<td style='background-color:black;color:white;font-weight:bold'>" + pet.attackHtml + "</td>";
                html += "<td style='background-color:black;color:white;font-weight:bold'>" + pet.defenseHtml + "</td>";
                html += "<td style='background-color:black;color:white;font-weight:bold'>" + pet.specialAttackHtml + "</td>";
                html += "<td style='background-color:black;color:white;font-weight:bold'>" + pet.specialDefenseHtml + "</td>";
                html += "<td style='background-color:black;color:white;font-weight:bold'>" + pet.speedHtml + "</td>";
            } else {
                html += "<td>" + pet.attackHtml + "</td>";
                html += "<td>" + pet.defenseHtml + "</td>";
                html += "<td>" + pet.specialAttackHtml + "</td>";
                html += "<td>" + pet.specialDefenseHtml + "</td>";
                html += "<td>" + pet.speedHtml + "</td>";
            }
            html += "<td>" + pet.experienceHtml + "</td>";
            html += "<td>" + ((await pet.lookupProfile())?.growExperience ?? "") + "</td>";
            html += "<td>";
            html += "<button role='button' class='C_pocket_petManager_cagePetButton C_pocket_petManager_takeOutFromCage' " +
                "id='_pocket_petManager_takeOutFromCage_" + pet.index + "'>取出</button>";
            html += "</td>";
            html += "<td>";
            if (pet.isMaxLevel) {
                const title: string = partnerLoader.isZodiacPartner(pet) ? "取消" : "设置";
                html += "<button role='button' " +
                    "class='C_pocket_petManager_cagePetButton C_pocket_petManager_setPartner' " +
                    "id='_pocket_petManager_setPartner_" + pet.index + "'>" + title + "</button>";
            }
            html += "</td>";
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
                    "class='C_pocket_StatelessElement C_pocket_petManager_cagePetButton C_pocket_petManager_cageSpecialPetButton' " +
                    "style='color:" + color + "' " +
                    "id='cageSpecialPetButton_" + pet.index + "'>特殊</button>";
            }
            html += "</td>";
            html += "</tr>";
            cagePetTable.append($(html));
        }
        let html = "";
        html += "<tr class='C_pocket_petManager_cagePet' style='background-color:wheat'>";
        html += "<td style='text-align:right' colspan='16'>";
        html += "<button role='button' class='C_pocket_petManager_cagePetButton' " +
            "id='_pocket_petManager_internalCloseCage'>关闭黄金笼子</button>";
        html += "</td>";
        html += "</tr>";
        cagePetTable.append($(html));

        cagePetTable.find("> tr").each((_idx, tr) => {
            const img = $(tr).find("> td:first > img:first");
            if (img.length > 0) {
                img.addClass("C_pocket_petManager_cagePetButton");
                const code = img.attr("alt") as string;
                new MouseClickEventBuilder(this.credential)
                    .bind(img, () => {
                        const next = $(tr).next();
                        if (next.hasClass("C_PetProfile")) {
                            next.remove();
                        } else {
                            const profileHTML = MonsterPageUtils.generateMonsterProfileHtml(code);
                            if (profileHTML !== "") {
                                $(tr).after($("" +
                                    "<tr style='background-color:#E8E8D0' class='C_pocket_petManager_cagePet C_PetProfile'>" +
                                    "<td colspan='16'>" + profileHTML + "</td>" +
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

        $("#_pocket_petManager_internalCloseCage").on("click", () => {
            PageUtils.triggerClick("_pocket_petManager_closeCage");
        });
        $(".C_pocket_petManager_takeOutFromCage").on("click", event => {
            const btnId = $(event.target).attr("id") as string;
            const index = _.parseInt(StringUtils.substringAfterLast(btnId, "_"));
            new GoldenCage(this.credential).takeOut(index).then(() => {
                const message = OperationMessage.success();
                this._triggerRefresh(message, true).then();
            });
        });
        $(".C_pocket_petManager_setPartner").on("click", event => {
            const btnId = $(event.target).attr("id") as string;
            const index = _.parseInt(StringUtils.substringAfterLast(btnId, "_"));
            const pet = this._cagePage!.findPet(index);
            if (pet === null) return;
            const partnerLoader = new ZodiacPartnerLoader(this.credential);
            if (partnerLoader.isZodiacPartner(pet)) {
                StorageUtils.remove("_pa_066_" + this.credential.id);
            } else {
                const partner = new ZodiacPartner();
                partner.name = pet.name;
                partner.level = pet.level;
                partner.maxHealth = pet.maxHealth;
                partner.attack = pet.attack;
                partner.defense = pet.defense;
                partner.specialAttack = pet.specialAttack;
                partner.specialDefense = pet.specialDefense;
                partner.speed = pet.speed;
                StorageUtils.set("_pa_066_" + this.credential.id, JSON.stringify(partner));
            }
            this._renderCage().then();
        });
        $(".C_pocket_petManager_cageSpecialPetButton").on("click", event => {
            const btnId = $(event.target).attr("id") as string;
            const index = _.parseInt(StringUtils.substringAfter(btnId, "cageSpecialPetButton_"));
            const pet = this._cagePage!.findPet(index);
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
                        this._renderCage().then();
                        const message = OperationMessage.success();
                        message.extensions.set("mode", "SPECIAL");
                        this.feature.publishRefresh(message);
                    });
                },
                () => {
                    SpecialPetStorage.remove(special.id!).then(() => {
                        this._renderCage().then();
                        const message = OperationMessage.success();
                        message.extensions.set("mode", "SPECIAL");
                        this.feature.publishRefresh(message);
                    });
                }
            );
        });
    }

    private async _reloadRanch() {
        if (!this._ranchOpened) return;
        this._ranchPage = await new CastleRanch(this.credential).enter();
        this.lastRanchPage = this._ranchPage;
    }

    async _renderRanch() {
        if (!this._ranchOpened) return;
        $(".C_pocket_petManager_ranchPetButton").off("click").off("dblclick");
        $(".C_pocket_petManager_ranchPet").remove();

        const partnerLoader = new ZodiacPartnerLoader(this.credential);
        const ranchPetTable = $("#" + this.__ranchPetTableId);
        let sequence = 0;
        for (const pet of this._ranchPage!.sortedRanchPetList) {
            let backgroundColor = "#E8E8D0";
            let html = "";
            html += "<tr class='C_pocket_petManager_ranchPet' style='background-color:" + backgroundColor + "'>";
            html += "<th>" + (++sequence) + "</th>";
            html += "<td style='width:64px;height:64px'>" + ((await pet.lookupProfile())?.imageHtml ?? "") + "</td>";
            html += "<td>" + pet.nameHtml + "</td>";
            html += "<td>" + pet.gender + "</td>";
            html += "<td>" + pet.levelHtml + "</td>";
            html += "<td>" + pet.healthHtml + "</td>";
            if (partnerLoader.isZodiacPartner(pet)) {
                html += "<td style='background-color:black;color:white;font-weight:bold'>" + pet.attackHtml + "</td>";
                html += "<td style='background-color:black;color:white;font-weight:bold'>" + pet.defenseHtml + "</td>";
                html += "<td style='background-color:black;color:white;font-weight:bold'>" + pet.specialAttackHtml + "</td>";
                html += "<td style='background-color:black;color:white;font-weight:bold'>" + pet.specialDefenseHtml + "</td>";
                html += "<td style='background-color:black;color:white;font-weight:bold'>" + pet.speedHtml + "</td>";
            } else {
                html += "<td>" + pet.attackHtml + "</td>";
                html += "<td>" + pet.defenseHtml + "</td>";
                html += "<td>" + pet.specialAttackHtml + "</td>";
                html += "<td>" + pet.specialDefenseHtml + "</td>";
                html += "<td>" + pet.speedHtml + "</td>";
            }
            html += "<td>" + pet.experienceHtml + "</td>";
            html += "<td>" + ((await pet.lookupProfile())?.growExperience ?? "") + "</td>";
            html += "<td>";
            html += "<button role='button' class='C_pocket_petManager_ranchPetButton C_pocket_petManager_takeOutFromRanch' " +
                "id='_pocket_petManager_takeOutFromRanch_" + pet.index + "'>取出</button>";
            html += "</td>";
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
                    "class='C_pocket_StatelessElement C_pocket_petManager_ranchPetButton C_pocket_petManager_ranchSpecialPetButton' " +
                    "style='color:" + color + "' " +
                    "id='ranchSpecialPetButton_" + pet.index + "'>特殊</button>";
            }
            html += "</td>";
            html += "</tr>";
            ranchPetTable.append($(html));
        }
        let html = "";
        html += "<tr class='C_pocket_petManager_ranchPet' style='background-color:wheat'>";
        html += "<td style='text-align:right' colspan='15'>";
        html += "<button role='button' class='C_pocket_petManager_ranchPetButton' " +
            "id='_pocket_petManager_internalCloseRanch'>关闭城堡牧场</button>";
        html += "</td>";
        html += "</tr>";
        ranchPetTable.append($(html));

        ranchPetTable.find("> tr").each((_idx, tr) => {
            const img = $(tr).find("> td:first > img:first");
            if (img.length > 0) {
                img.addClass("C_pocket_petManager_ranchPetButton");
                const code = img.attr("alt") as string;
                new MouseClickEventBuilder(this.credential)
                    .bind(img, () => {
                        const next = $(tr).next();
                        if (next.hasClass("C_PetProfile")) {
                            next.remove();
                        } else {
                            const profileHTML = MonsterPageUtils.generateMonsterProfileHtml(code);
                            if (profileHTML !== "") {
                                $(tr).after($("" +
                                    "<tr style='background-color:#E8E8D0' class='C_pocket_petManager_ranchPet C_PetProfile'>" +
                                    "<td colspan='15'>" + profileHTML + "</td>" +
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

        $("#_pocket_petManager_internalCloseRanch").on("click", () => {
            PageUtils.triggerClick("_pocket_petManager_closeRanch");
        });
        $(".C_pocket_petManager_takeOutFromRanch").on("click", event => {
            const btnId = $(event.target).attr("id") as string;
            const index = _.parseInt(StringUtils.substringAfterLast(btnId, "_"));
            const pet = this._ranchPage!.findRanchPet(index);
            if (pet === null) return;
            new CastleRanch(this.credential).summon(index).then(() => {
                const message = OperationMessage.success();
                this._triggerRefresh(message, false, true).then();
            });
        });
        $(".C_pocket_petManager_ranchSpecialPetButton").on("click", event => {
            const btnId = $(event.target).attr("id") as string;
            const index = _.parseInt(StringUtils.substringAfter(btnId, "ranchSpecialPetButton_"));
            const pet = this._ranchPage!.findRanchPet(index);
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
                        this._renderRanch().then();
                        const message = OperationMessage.success();
                        message.extensions.set("mode", "SPECIAL");
                        this.feature.publishRefresh(message);
                    });
                },
                () => {
                    SpecialPetStorage.remove(special.id!).then(() => {
                        this._renderRanch().then();
                        const message = OperationMessage.success();
                        message.extensions.set("mode", "SPECIAL");
                        this.feature.publishRefresh(message);
                    });
                }
            );
        });
    }

    private createPetProfileHTML(code: string) {
        const profile = MonsterProfileLoader.load(code)!;
        let html = "";
        html += "<table style='width:100%;border-width:0;background-color:wheat;margin:auto'>";
        html += "<tbody>";
        html += "<tr style='background-color:black;color:wheat'>";
        html += "<th>名字</th>";
        html += "<th>总族</th>";
        html += "<th>命族</th>";
        html += "<th>攻族</th>";
        html += "<th>防族</th>";
        html += "<th>智族</th>";
        html += "<th>精族</th>";
        html += "<th>速族</th>";
        html += "<th>命努</th>";
        html += "<th>攻努</th>";
        html += "<th>防努</th>";
        html += "<th>智努</th>";
        html += "<th>精努</th>";
        html += "<th>速努</th>";
        html += "<th>捕获</th>";
        html += "<th>成长</th>";
        html += "<td rowspan='5' style='text-align:center'>" + profile.imageHtml + "</td>";
        html += "</tr>";
        html += "<tr style='background-color:black;color:wheat;font-weight:bold;text-align:center'>";
        html += "<td rowspan='2'>" + profile.nameHtml + "</td>";
        html += "<td rowspan='2'>" + profile.totalBaseStats + "</td>";
        html += "<td>" + profile.healthBaseStats + "</td>";
        html += "<td>" + profile.attackBaseStats + "</td>";
        html += "<td>" + profile.defenseBaseStats + "</td>";
        html += "<td>" + profile.specialAttackBaseStats + "</td>";
        html += "<td>" + profile.specialDefenseBaseStats + "</td>";
        html += "<td>" + profile.speedBaseStats + "</td>";
        html += "<td rowspan='2'>" + profile.healthEffort + "</td>";
        html += "<td rowspan='2'>" + profile.attackEffort + "</td>";
        html += "<td rowspan='2'>" + profile.defenseEffort + "</td>";
        html += "<td rowspan='2'>" + profile.specialAttackEffort + "</td>";
        html += "<td rowspan='2'>" + profile.specialDefenseEffort + "</td>";
        html += "<td rowspan='2'>" + profile.speedEffort + "</td>";
        html += "<td rowspan='2'>" + profile.catchRatio + "</td>";
        html += "<td rowspan='2'>" + profile.growExperience + "</td>";
        html += "</tr>";
        html += "<tr style='background-color:black;color:wheat;font-weight:bold;text-align:center'>";
        html += "<td>" + profile.perfectHealth + "</td>";
        html += "<td>" + profile.perfectAttack + "</td>";
        html += "<td>" + profile.perfectDefense + "</td>";
        html += "<td>" + profile.perfectSpecialAttack + "</td>";
        html += "<td>" + profile.perfectSpecialDefense + "</td>";
        html += "<td>" + profile.perfectSpeed + "</td>";
        html += "</tr>";
        html += "<tr style='background-color:black;color:wheat;font-weight:bold;text-align:left'>";
        html += "<td colspan='16'>";
        html += profile.spellText;
        html += "</td>";
        html += "</tr>";
        html += "<tr style='background-color:black;color:wheat;font-weight:bold;text-align:left'>";
        html += "<td colspan='16' style='height:64px'>";
        for (const it of MonsterRelationLoader.getPetRelations(parseInt(profile.code!))) {
            const monsterProfile = MonsterProfileLoader.load(it);
            if (monsterProfile !== null) {
                html += monsterProfile.imageHtml;
                html += monsterProfile.code;
            }
        }
        html += "</td>";
        html += "</tr>";
        html += "</tbody>";
        html += "</table>";
        return html;
    }

    private cancelDaemonButtons(exceptId: string) {
        $(".C_PM_DaemonButton")
            .each((_idx, it) => {
                const btnId = $(it).attr("id") as string;
                if (btnId !== exceptId) {
                    if (PageUtils.isColorBlue(btnId)) {
                        PageUtils.triggerClick(btnId);
                    }
                }
            });
    }

    private async autoSendPet(target: string) {
        await this.reload();
        await this.render(this._equipmentPage!);
        let candidate: Pet | null = null;
        for (const pet of this.petPage!.petList!) {
            if (!pet.using!) {
                candidate = pet;
                break;
            }
        }
        if (candidate === null) return;
        await this._executeSendPet(target, candidate.index!);
        await this._triggerRefresh(OperationMessage.success());
    }

    private async autoCagePet() {
        await this.reload();
        await this.render(this._equipmentPage!);
        let candidate: Pet | null = null;
        for (const pet of this.petPage!.petList!) {
            if (!pet.using!) {
                candidate = pet;
                break;
            }
        }
        if (candidate === null) return;
        await new GoldenCage(this.credential).putInto(candidate.index!);
        await this._triggerRefresh(OperationMessage.success(), true);
    }

    private async autoRanchPet() {
        await this.reload();
        await this.render(this._equipmentPage!);
        let candidate: Pet | null = null;
        for (const pet of this.petPage!.petList!) {
            if (!pet.using!) {
                candidate = pet;
                break;
            }
        }
        if (candidate === null) return;
        await new CastleRanch(this.credential).graze(candidate.index!);
        await this._triggerRefresh(OperationMessage.success(), false, true);
    }
}

class PetManagerFeature extends CommonWidgetFeature {

    leagueEnabled: boolean = false;     // 可以选择宠物联赛参赛
    spellEnabled: boolean = false;      // 可以设置学习技能
    enableSpaceTriggerOnDispose: boolean = true;
    enableStatusTriggerOnDispose: boolean = true;
    enableUsingTriggerOnDispose: boolean = true;
    enablePetTransfer: boolean = false;

}

export {PetManager, PetManagerFeature};