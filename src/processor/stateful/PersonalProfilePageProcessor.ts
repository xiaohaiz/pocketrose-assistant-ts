import StatefulPageProcessor from "../StatefulPageProcessor";
import Credential from "../../util/Credential";
import PageProcessorContext from "../PageProcessorContext";
import PageUtils from "../../util/PageUtils";
import KeyboardShortcutBuilder from "../../util/KeyboardShortcutBuilder";
import MessageBoard from "../../util/MessageBoard";
import NpcLoader from "../../core/role/NpcLoader";
import Role from "../../core/role/Role";
import BankAccount from "../../core/bank/BankAccount";
import _ from "lodash";
import PersonalStatus from "../../core/role/PersonalStatus";
import * as echarts from "echarts";
import {EChartsOption} from "echarts";
import StringUtils from "../../util/StringUtils";
import ButtonUtils from "../../util/ButtonUtils";
import PersonalPetManagementPage from "../../core/monster/PersonalPetManagementPage";
import PersonalPetManagement from "../../core/monster/PersonalPetManagement";
import EquipmentSpaceTrigger from "../../core/trigger/EquipmentSpaceTrigger";
import EquipmentGrowthTrigger from "../../core/trigger/EquipmentGrowthTrigger";
import EquipmentUsingTrigger from "../../core/trigger/EquipmentUsingTrigger";
import PetSpaceTrigger from "../../core/trigger/PetSpaceTrigger";
import SetupLoader from "../../core/config/SetupLoader";
import MouseClickEventBuilder from "../../util/MouseClickEventBuilder";
import StorageUtils from "../../util/StorageUtils";
import ZodiacPartnerLoader from "../../core/monster/ZodiacPartnerLoader";
import GoldenCage from "../../core/monster/GoldenCage";
import SpellManagerComponent from "../../component/SpellManagerComponent";
import LocationModeTown from "../../core/location/LocationModeTown";
import LocationModeCastle from "../../core/location/LocationModeCastle";
import EquipmentManagerComponent from "../../component/EquipmentManagerComponent";

abstract class PersonalProfilePageProcessor extends StatefulPageProcessor {

    protected readonly spellManager: SpellManagerComponent;
    protected readonly equipmentManager: EquipmentManagerComponent;

    protected constructor(credential: Credential, context: PageProcessorContext) {
        super(credential, context);
        const locationMode = this.createLocationMode() as LocationModeTown | LocationModeCastle;
        this.spellManager = new SpellManagerComponent(credential, locationMode);
        this.spellManager.onRefresh = () => {
            this.reloadRole().then(() => {
                this.renderRole().then(() => {
                    this.spellManager.reload().then(() => {
                        this.spellManager.render(this.role).then();
                    });
                });
            });
        };
        this.equipmentManager = new EquipmentManagerComponent(credential, locationMode);
        this.equipmentManager.onRefresh = () => {
            this.reloadRole().then(() => {
                this.renderRole().then(() => {
                    this.equipmentManager.reload().then(() => {
                        this.equipmentManager.render(this.role).then();
                    });
                });
            });
        };
    }

    protected role?: Role;
    protected petPage?: PersonalPetManagementPage;

    #roleDimensionChart?: any;

    protected async doProcess(): Promise<void> {
        await this.#reformatPage();
        await this.reloadRole();
        await this.renderRole();
        await this.#renderBankAccount();
        await this.spellManager.reload();
        await this.spellManager.render(this.role);
        await this.equipmentManager.reload();
        await this.equipmentManager.render(this.role);
        await this.#reloadPetPage();
        await this.#renderPet();
        await this.doReloadMirrorPage();
        await this.doRenderMirror();
        KeyboardShortcutBuilder.newInstance()
            .onKeyPressed("e", () => PageUtils.triggerClick("equipmentButton"))
            .onKeyPressed("r", () => PageUtils.triggerClick("refreshButton"))
            .onKeyPressed("s", () => PageUtils.triggerClick("itemHouseButton"))
            .onKeyPressed("u", () => PageUtils.triggerClick("petButton"))
            .onKeyPressed("z", () => PageUtils.triggerClick("careerButton"))
            .onEscapePressed(() => PageUtils.triggerClick("returnButton"))
            .withDefaultPredicate()
            .bind();
    }

    async #reformatPage() {
        // 删除老页面的所有元素
        const anchor = $("center:first").html("").hide();

        // 老页面没有什么有价值的数据，直接渲染新页面
        let html = "";
        html += "<table style='width:100%;border-width:0;background-color:#888888'>";
        html += "<tbody>";
        html += "<tr>";
        html += "<td id='pageTitleCell'>";
        html += "<table style='background-color:navy;border-width:0;margin:auto'>";
        html += "<tbody>";
        html += "<tr>";
        html += "<td style='text-align:left;color:yellowgreen;font-weight:bold;font-size:150%;width:100%'>";
        html += "＜＜  个 人 面 板  ＞＞";
        html += "</td>";
        html += "<td style='white-space:nowrap'>";
        html += "<span style='display:none'> <button role='button' class='C_commandButton' id='itemHouseButton' disabled>" + ButtonUtils.createTitle("商店", "s") + "</button></span>";
        html += "<span> <button role='button' class='C_commandButton' id='equipmentButton'>" + ButtonUtils.createTitle("装备", "e") + "</button></span>";
        html += "<span> <button role='button' class='C_commandButton' id='petButton'>" + ButtonUtils.createTitle("宠物", "u") + "</button></span>";
        html += "<span> <button role='button' class='C_commandButton' id='careerButton'>" + ButtonUtils.createTitle("职业", "z") + "</button></span>";
        html += "<span> <button role='button' class='C_commandButton' id='refreshButton'>" + ButtonUtils.createTitle("刷新", "r") + "</button></span>";
        html += "<span> <button role='button' class='C_commandButton' id='returnButton'>" + ButtonUtils.createTitle("退出", "Esc") + "</button></span>";
        html += "</td>";
        html += "</tr>";
        html += "</tbody>";
        html += "</table>";
        html += "</td>";
        html += "</tr>";
        html += "<tr>";
        html += "<td id='messageBoardCell'></td>"
        html += "</tr>";
        html += "<tr style='display:none'>";
        html += "<td id='hiddenCell-1'></td>";  // return town or castle
        html += "</tr>";
        html += "<tr style='display:none'>";
        html += "<td id='hiddenCell-2'>";
        html += PageUtils.generateEquipmentManagementForm(this.credential);
        html += "</td>";
        html += "</tr>";
        html += "<tr style='display:none'>";
        html += "<td id='hiddenCell-3'>";
        html += PageUtils.generatePetManagementForm(this.credential);
        html += "</td>";
        html += "</tr>";
        html += "<tr style='display:none'>";
        html += "<td id='hiddenCell-4'>";
        html += PageUtils.generateCareerManagementForm(this.credential);
        html += "</td>";
        html += "</tr>";
        html += "<tr style='display:none'>";
        html += "<td id='hiddenCell-5'></td>";  // item house
        html += "</tr>";
        html += "<tr>";
        html += "<td id='personalStatus'></td>";
        html += "</tr>";
        html += "<tr>";
        html += "<td id='spellStatus'>";
        html += this.spellManager.generateHTML();
        html += "</td>";
        html += "</tr>";
        html += "<tr>";
        html += "<td id='equipmentStatus'>";
        html += this.equipmentManager.generateHTML();
        html += "</td>";
        html += "</tr>";
        html += "<tr>";
        html += "<td id='petStatus'></td>";
        html += "</tr>";
        html += "<tr style='display:none'>";
        html += "<td id='mirrorStatus'></td>";
        html += "</tr>";
        html += "</tbody>";
        html += "</table>";
        anchor.after($(html));
        await this.doBindReturnButton();
        await this.doBindItemHouseButton();
        await this.#bindCommandButtons();

        MessageBoard.createMessageBoardStyleB("messageBoardCell", NpcLoader.randomNpcImageHtml());
        $("#messageBoard")
            .css("background-color", "black")
            .css("color", "wheat");
        await this.#resetMessageBoard();

        await this.#createRolePage();
        await this.#createPetPage();
        await this.doCreateMirrorPage();

        this.spellManager.bindButtons();
        this.equipmentManager.bindButtons();
    }

    async #refresh() {
        await this.#resetMessageBoard();
        PageUtils.scrollIntoView("pageTitle");
        await this.reloadRole();
        await this.renderRole();
        await this.#renderBankAccount();
        await this.spellManager.reload();
        await this.spellManager.render(this.role);
        await this.equipmentManager.reload();
        await this.equipmentManager.render(this.role);
        await this.#reloadPetPage();
        await this.#renderPet();
        await this.doReloadMirrorPage();
        await this.doRenderMirror();
        MessageBoard.publishMessage("个人面板刷新完成。");

    }

    protected async reloadRole() {
        this.role = await new PersonalStatus(this.credential).load();
    }

    async #reloadPetPage() {
        this.petPage = await new PersonalPetManagement(this.credential).open();
    }

    protected async doReloadMirrorPage() {
    }

    protected async doBeforeReturn() {
        await new EquipmentSpaceTrigger(this.credential)
            .withEquipmentPage(this.equipmentManager.equipmentPage)
            .triggerUpdate();
        await new EquipmentGrowthTrigger(this.credential)
            .withEquipmentPage(this.equipmentManager.equipmentPage)
            .triggerUpdate();
        await new EquipmentUsingTrigger(this.credential)
            .withEquipmentPage(this.equipmentManager.equipmentPage)
            .triggerUpdate();
        await new PetSpaceTrigger(this.credential)
            .withPetPage(this.petPage)
            .triggerUpdate();
    }

    protected async doBindReturnButton() {
    }

    protected async doBindItemHouseButton() {
    }

    async #bindCommandButtons() {
        $("#equipmentButton").on("click", () => {
            PageUtils.disablePageInteractiveElements();
            this.doBeforeReturn().then(() => {
                PageUtils.triggerClick("openEquipmentManagement");
            });
        });
        $("#petButton").on("click", () => {
            PageUtils.disablePageInteractiveElements();
            this.doBeforeReturn().then(() => {
                PageUtils.triggerClick("openPetManagement");
            });
        });
        $("#careerButton").on("click", () => {
            PageUtils.disablePageInteractiveElements();
            this.doBeforeReturn().then(() => {
                PageUtils.triggerClick("openCareerManagement");
            });
        });
        $("#refreshButton").on("click", () => {
            $(".C_commandButton").prop("disabled", true);
            this.#refresh().then(() => {
                $(".C_commandButton").prop("disabled", false);
            });
        });
    }

    async #resetMessageBoard() {
        const message: string = "<b style='font-size:120%'>见贤思齐焉，见不贤而内自省也。</b>";
        MessageBoard.resetMessageBoard(message);
    }

    async #createRolePage() {
        let html = "";
        html += "<table style='text-align:center;border-width:0;margin:auto;width:100%'>";
        html += "<tbody>";
        html += "<tr>";
        html += "<td style='background-color:#E8E8D0;font-size:150%;font-weight:bold;color:navy' colspan='2' id='roleName'></td>";
        html += "</tr>";
        html += "<tr>";
        html += "<td style='width:80px;background-color:#E8E8D0' id='roleImage'></td>"
        html += "<td style='width:100%;background-color:#E8E8D0'>";

        html += "<table style='width:100%;margin:auto;text-align:center;background-color:#888888'>";
        html += "<tbody>";
        html += "<tr>";
        html += "<th style='background-color:#E0D0B0;white-space:nowrap'>种族</th>";
        html += "<td style='background-color:#E8E8D0' id='roleRace'></td>";
        html += "<th style='background-color:#E0D0B0;white-space:nowrap'>等级</th>";
        html += "<td style='background-color:#E8E8D0' id='roleLevel'></td>";
        html += "<td style='background-color:#E8E8D0;width:100%' rowspan='13' id='roleDimension'></td>";
        html += "</tr>";
        html += "<tr>";
        html += "<th style='background-color:#E0D0B0;white-space:nowrap'>性别</th>";
        html += "<td style='background-color:#E8E8D0' id='roleGender'></td>";
        html += "<th style='background-color:#E0D0B0;white-space:nowrap'>ＨＰ</th>";
        html += "<td style='background-color:#E8E8D0' id='roleHealth'></td>";
        html += "</tr>";
        html += "<tr>";
        html += "<th style='background-color:#E0D0B0;white-space:nowrap'>国家</th>";
        html += "<td style='background-color:#E8E8D0' id='roleCountry'></td>";
        html += "<th style='background-color:#E0D0B0;white-space:nowrap'>ＭＰ</th>";
        html += "<td style='background-color:#E8E8D0' id='roleMana'></td>";
        html += "</tr>";
        html += "<tr>";
        html += "<th style='background-color:#E0D0B0;white-space:nowrap'>部队</th>";
        html += "<td style='background-color:#E8E8D0' id='roleUnit'></td>";
        html += "<th style='background-color:#E0D0B0;white-space:nowrap'>攻击</th>";
        html += "<td style='background-color:#E8E8D0' id='roleAttack'></td>";
        html += "</tr>";
        html += "<tr>";
        html += "<th style='background-color:#E0D0B0;white-space:nowrap'>属性</th>";
        html += "<td style='background-color:#E8E8D0' id='roleAttribute'></td>";
        html += "<th style='background-color:#E0D0B0;white-space:nowrap'>防御</th>";
        html += "<td style='background-color:#E8E8D0' id='roleDefense'></td>";
        html += "</tr>";
        html += "<tr>";
        html += "<th style='background-color:#E0D0B0;white-space:nowrap'>职业</th>";
        html += "<td style='background-color:#E8E8D0' id='roleCareer'></td>";
        html += "<th style='background-color:#E0D0B0;white-space:nowrap'>智力</th>";
        html += "<td style='background-color:#E8E8D0' id='roleSpecialAttack'></td>";
        html += "</tr>";
        html += "<tr>";
        html += "<th style='background-color:#E0D0B0;white-space:nowrap'>战数</th>";
        html += "<td style='background-color:#E8E8D0' id='roleBattleCount'></td>";
        html += "<th style='background-color:#E0D0B0;white-space:nowrap'>精神</th>";
        html += "<td style='background-color:#E8E8D0' id='roleSpecialDefense'></td>";
        html += "</tr>";
        html += "<tr>";
        html += "<th style='background-color:#E0D0B0;white-space:nowrap'>经验</th>";
        html += "<td style='background-color:#E8E8D0' id='roleExperience'></td>";
        html += "<th style='background-color:#E0D0B0;white-space:nowrap'>速度</th>";
        html += "<td style='background-color:#E8E8D0' id='roleSpeed'></td>";
        html += "</tr>";
        html += "<tr>";
        html += "<th style='background-color:#E0D0B0;white-space:nowrap'>幸运</th>";
        html += "<td style='background-color:#E8E8D0' colspan='3' id='roleAdditionalLuck'></td>";
        html += "</tr>";
        html += "<tr>";
        html += "<th style='background-color:#E0D0B0;white-space:nowrap'>祭奠RP</th>";
        html += "<td style='background-color:#E8E8D0' colspan='3' id='roleConsecrateRP'></td>";
        html += "</tr>";
        html += "<tr>";
        html += "<th style='background-color:#E0D0B0;white-space:nowrap'>额外RP</th>";
        html += "<td style='background-color:#E8E8D0' colspan='3' id='roleAdditionalRP'></td>";
        html += "</tr>";
        html += "<tr>";
        html += "<th style='background-color:#E0D0B0;white-space:nowrap'>现金</th>";
        html += "<td style='background-color:#E8E8D0' colspan='3' id='roleCash'></td>";
        html += "</tr>";
        html += "<tr>";
        html += "<th style='background-color:#E0D0B0;white-space:nowrap'>存款</th>";
        html += "<td style='background-color:#E8E8D0' colspan='3' id='roleSaving'></td>";
        html += "</tr>";
        html += "</tbody>";
        html += "</table>";

        html += "</td>";
        html += "</tr>";

        html += "</tbody>";
        html += "</table>";

        $("#personalStatus").html(html);
    }

    async #createPetPage() {
        let html = "";
        html += "<table style='text-align:center;border-width:0;margin:auto;width:100%'>";
        html += "<tbody id='petTable'>";
        html += "<tr>";
        html += "<th style='background-color:yellowgreen;font-size:120%;font-weight:bold;color:navy' colspan='19'>宠 物 状 态</th>";
        html += "</tr>";
        html += "<tr style='background-color:skyblue'>";
        html += "<th></th>";
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
        html += "<th>技1</th>";
        html += "<th>技2</th>";
        html += "<th>技3</th>";
        html += "<th>技4</th>";
        html += "<th>亲密</th>";
        html += "<th>种类</th>";
        html += "<th>属1</th>";
        html += "<th>属2</th>";
        html += "</tr>";
        html += "</tbody>";
        html += "</table>";

        $("#petStatus").html(html);
    }

    protected async doCreateMirrorPage() {
    }

    protected async doLoadBankAccount(): Promise<BankAccount | undefined> {
        return undefined;
    }

    async #renderBankAccount() {
        const account = await this.doLoadBankAccount();
        if (account !== undefined && !_.isNaN(account.saving)) {
            $("#roleSaving").html(account.saving + " GOLD");
        }
    }

    protected async renderRole() {
        $(".C_roleImage").off("click").off("dblclick");
        const roleImage = $("#roleImage");
        const role = this.role!;
        $("#roleName").html(_.toString(role.name));
        roleImage.html(role.imageHtml);
        $("#roleRace").html(_.toString(role.race));
        $("#roleLevel").html(_.toString(role.level));
        $("#roleGender").html(_.toString(role.gender));
        $("#roleHealth").html(role.health + "/" + role.maxHealth);
        $("#roleCountry").html(_.toString(role.country));
        $("#roleMana").html(role.mana + "/" + role.maxMana);
        $("#roleUnit").html(_.toString(role.unit));
        $("#roleAttribute").html(_.toString(role.attribute));
        $("#roleCareer").html(_.toString(role.career));
        $("#roleBattleCount").html(role.battleCount + "/" + role.battleWinCount);
        $("#roleExperience").html(role.experienceHtml);
        $("#roleAdditionalLuck").html(_.toString(role.additionalLuck));
        $("#roleConsecrateRP").html(_.toString(role.consecrateRP));
        $("#roleAdditionalRP").html(_.toString(role.additionalRP));
        $("#roleCash").html(_.toString(role.cash) + " GOLD");

        await this.#_renderRoleDimension();
        await this.#_generateRoleDimension();

        roleImage.find("> img:first")
            .addClass("C_roleImage")
            .attr("id", "roleImageButton");

        new MouseClickEventBuilder(this.credential)
            .bind($("#roleImageButton"), () => {
                const key = "_m_" + role.mirrorIndex!;
                const c: any = SetupLoader.loadMirrorCareerFixedConfig(this.credential.id);
                c[key] = !c[key];
                StorageUtils.set("_pa_070_" + this.credential.id, JSON.stringify(c));
                this.#_renderRoleDimension().then();
            });
    }

    async #_renderRoleDimension() {
        const role = this.role!;
        let at = role.attackHtml;
        let df = role.defenseHtml;
        let sa = role.specialAttackHtml;
        let sd = role.specialDefenseHtml;
        let sp = role.speedHtml;
        if (SetupLoader.isCareerFixed(this.credential.id, role.mirrorIndex!)) {
            at = "<span style='background-color:black;color:white'>" + at + "</span>";
            df = "<span style='background-color:black;color:white'>" + df + "</span>";
            sa = "<span style='background-color:black;color:white'>" + sa + "</span>";
            sd = "<span style='background-color:black;color:white'>" + sd + "</span>";
            sp = "<span style='background-color:black;color:white'>" + sp + "</span>";
        }
        $("#roleAttack").html(at);
        $("#roleDefense").html(df);
        $("#roleSpecialAttack").html(sa);
        $("#roleSpecialDefense").html(sd);
        $("#roleSpeed").html(sp);
    }

    async #renderPet() {
        $(".C_petButton").off("click");
        $(".C_pet").remove();
        const partnerLoader = new ZodiacPartnerLoader(this.credential);
        const table = $("#petTable");
        for (const pet of this.petPage!.petList!) {
            let html = "<tr class='C_pet' id='petIndex_" + pet.index + "'>";
            html += "<td style='background-color:#E8E8D0;width:64px;height:64px' rowspan='2'>";
            html += pet.imageHtml;
            html += "</td>";
            html += "<td style='background-color:#E8E8D0' rowspan='2'>" + pet.usingHtml + "</td>";
            html += "<td style='background-color:#E8E8D0'>" + pet.nameHtml + "</td>";
            html += "<td style='background-color:#E8E8D0'>" + pet.gender + "</td>";
            html += "<td style='background-color:#E8E8D0'>" + pet.levelHtml + "</td>";
            html += "<td style='background-color:#E8E8D0'>" + pet.healthHtml + "</td>";
            html += "<td style='background-color:#E8E8D0' class='C_partnerDimension_" + pet.index + "'>" + pet.attackHtml + "</td>";
            html += "<td style='background-color:#E8E8D0' class='C_partnerDimension_" + pet.index + "'>" + pet.defenseHtml + "</td>";
            html += "<td style='background-color:#E8E8D0' class='C_partnerDimension_" + pet.index + "'>" + pet.specialAttackHtml + "</td>";
            html += "<td style='background-color:#E8E8D0' class='C_partnerDimension_" + pet.index + "'>" + pet.specialDefenseHtml + "</td>";
            html += "<td style='background-color:#E8E8D0' class='C_partnerDimension_" + pet.index + "'>" + pet.speedHtml + "</td>";
            html += "<td style='background-color:#E8E8D0'>" + pet.spell1 + "</td>";
            html += "<td style='background-color:#E8E8D0'>" + pet.spell2 + "</td>";
            html += "<td style='background-color:#E8E8D0'>" + pet.spell3 + "</td>";
            html += "<td style='background-color:#E8E8D0'>" + pet.spell4 + "</td>";
            html += "<td style='background-color:#E8E8D0'>" + pet.love + "</td>";
            html += "<td style='background-color:#E8E8D0'>" + pet.raceHtml + "</td>";
            html += "<td style='background-color:#E8E8D0'>" + pet.attribute1 + "</td>";
            html += "<td style='background-color:#E8E8D0'>" + pet.attribute2 + "</td>";
            html += "</tr>";

            html += "<tr class='C_pet'>";
            html += "<td style='background-color:#E8E8D0;text-align:left' colspan='17'>";
            const title = pet.using! ? "卸下" : "使用";
            html += "<button role='button' id='pet_" + pet.index + "' class='C_petButton C_usePetButton'>" + title + "</button>";
            if (!(pet.using!) && (this.equipmentManager.equipmentPage!.findGoldenCage() !== null || this.role!.hasGoldenCage)) {
                html += "<button role='button' class='C_petButton C_petCageButton' " +
                    "id='putIntoCage_" + pet.index + "'>入笼</button>";
            }
            html += "</td>";
            html += "</tr>";
            table.append($(html));
        }
        if (partnerLoader.available()) {
            let html = "<tr class='C_pet'>";
            html += "<td style='background-color:#E8E8D0;text-align:right' colspan='19'>";
            html += "<button role='button' id='partnerButton' class='C_petButton'>十二宫战斗伴侣</button>";
            html += "</td>";
            html += "</tr>";
            table.append($(html));

            for (const pet of this.petPage!.petList!) {
                if (partnerLoader.isZodiacPartner(pet)) {
                    $(".C_partnerDimension_" + pet.index)
                        .html((_idx, s) => {
                            return "<span style='background-color:black;color:white'>" + s + "</span>";
                        });
                }
            }
        }
        $(".C_usePetButton").on("click", event => {
            const btnId = $(event.target).attr("id") as string;
            let index = _.parseInt(StringUtils.substringAfterLast(btnId, "_"));
            const pet = this.petPage!.findPet(index);
            if (pet !== null && pet.using) {
                // uninstall pet
                index = -1;
            }
            this._usePet(index).then();
        });
        $(".C_petCageButton").on("click", event => {
            const btnId = $(event.target).attr("id") as string;
            let index = _.parseInt(StringUtils.substringAfterLast(btnId, "_"));
            new GoldenCage(this.credential).putInto(index).then(() => {
                this.#reloadPetPage().then(() => {
                    this.#renderPet().then();
                });
            });
        });
        $("#partnerButton").on("click", () => {
            PageUtils.disableElement("partnerButton");
            partnerLoader.load(this.petPage).then(message => {
                if (message.success && message.doRefresh) {
                    this.#reloadPetPage().then(() => {
                        this.#renderPet().then(() => {
                            PageUtils.enableElement("partnerButton");
                        });
                    });
                }
            });
        });
    }

    protected async doRenderMirror() {
    }

    #_calculateEquipmentSelection(): number[] {
        const indexList: number[] = [];
        $(".C_equipmentSelectButton").each((_idx, btn) => {
            const btnId = $(btn).attr("id") as string;
            if (PageUtils.isColorBlue(btnId)) {
                const index = _.parseInt(StringUtils.substringAfterLast(btnId, "_"));
                indexList.push(index);
            }
        });
        return indexList;
    }

    async _usePet(index: number) {
        await new PersonalPetManagement(this.credential).set(index);
        await this.#reloadPetPage();
        await this.#renderPet();
    }

    async #_generateRoleDimension() {
        this.#roleDimensionChart?.dispose();
        $("#roleDimension").html("");

        const role = this.role!;
        const option: EChartsOption = {
            tooltip: {
                show: true
            },
            radar: {
                // shape: 'circle',
                indicator: [
                    {name: 'ＨＰ', max: 1999},
                    {name: 'ＭＰ', max: 1999},
                    {name: '攻击', max: 375},
                    {name: '防御', max: 375},
                    {name: '智力', max: 375},
                    {name: '精神', max: 375},
                    {name: '速度', max: 375}
                ]
            },
            series: [
                {
                    name: 'Role Dimension',
                    type: 'radar',
                    data: [
                        {
                            value: [role.maxHealth!, role.maxMana!, role.attack!, role.defense!,
                                role.specialAttack!, role.specialDefense!, role.speed!],
                            name: role.name
                        }
                    ]
                }
            ]
        };
        const element = document.getElementById("roleDimension");
        if (element) {
            const chart = echarts.init(element);
            chart.setOption(option);
            this.#roleDimensionChart = chart;
        }
    }
}

export = PersonalProfilePageProcessor;