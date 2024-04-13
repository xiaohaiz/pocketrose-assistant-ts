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
import ButtonUtils from "../../util/ButtonUtils";
import SpellManager from "../../widget/SpellManager";
import LocationModeTown from "../../core/location/LocationModeTown";
import LocationModeCastle from "../../core/location/LocationModeCastle";
import {EquipmentManager} from "../../widget/EquipmentManager";
import {PetManager} from "../../widget/PetManager";
import PersonalEquipmentManagementPage from "../../core/equipment/PersonalEquipmentManagementPage";
import MirrorManager from "../../widget/MirrorManager";

abstract class PersonalProfilePageProcessor extends StatefulPageProcessor {

    protected readonly spellManager: SpellManager;
    protected readonly equipmentManager: EquipmentManager;
    protected readonly petManager: PetManager;
    protected mirrorManager?: MirrorManager;

    protected constructor(credential: Credential, context: PageProcessorContext) {
        super(credential, context);
        const locationMode = this.createLocationMode() as LocationModeTown | LocationModeCastle;
        this.spellManager = new SpellManager(credential, locationMode);
        this.spellManager.onRefresh = (message) => {
            this.role = message.extensions.get("role") as Role;
            this.mirrorManager?.reload().then(() => {
                this.mirrorManager?.render(this.role!).then();
            });
        };
        this.equipmentManager = new EquipmentManager(credential, locationMode);
        this.equipmentManager.feature.enableStatusTriggerOnDispose = true;
        this.equipmentManager.feature.enableGrowthTriggerOnDispose = true;
        this.equipmentManager.feature.enableSpaceTriggerOnDispose = true;
        this.equipmentManager.feature.enableStatusTriggerOnDispose = true;
        this.equipmentManager.feature.enableUsingTriggerOnDispose = true;
        this.equipmentManager.feature.onMessage = s => MessageBoard.publishMessage(s);
        this.equipmentManager.feature.onWarning = s => MessageBoard.publishWarning(s);
        this.equipmentManager.feature.onRefresh = (message) => {
            this.equipmentManager.renderHitStatus(this.role);
            // Will trigger pet manager reloading, for golden cage index may changed.
            this.petManager.reload().then(() => {
                this.petManager.render(this.equipmentManager.equipmentPage!).then();
            });
        };
        this.petManager = new PetManager(credential, locationMode);
        this.petManager.feature.leagueEnabled = true;
        this.petManager.feature.enableSpaceTriggerOnDispose = true;
        this.petManager.onRefresh = (message) => {
            this.equipmentManager.equipmentPage = message.extensions.get("equipmentPage") as PersonalEquipmentManagementPage;
            if (message.extensions.get("mode") === "CONSECRATE") {
                this.equipmentManager.render().then();
            }
            if (message.extensions.get("mode") === "LEAGUE") {
                PageUtils.scrollIntoView("pageTitle");
                MessageBoard.publishMessage("<span style='color:yellow;font-weight:bold'>请转到宠物管理查看宠物联赛状态。</span>");
            }
        };
    }

    protected role?: Role;
    private roleDimensionChart?: any;

    protected async doProcess(): Promise<void> {
        await this.reformatPage();
        await this.doPostReformatPage();
        await this.reloadRole();
        await this.renderRole();
        await this._renderBankAccount();
        await this.spellManager.reload();
        await this.spellManager.render(this.role!);
        await this.equipmentManager.reload();
        await this.equipmentManager.render();
        this.equipmentManager.renderHitStatus(this.role);
        await this.petManager.reload();
        await this.petManager.render(this.equipmentManager.equipmentPage!);
        if (this.mirrorManager !== undefined) {
            $("#mirrorStatus").parent().show();
            await this.mirrorManager.reload();
            await this.mirrorManager.render(this.role!);
        }
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

    protected async doPostReformatPage() {
    }

    private async reformatPage() {
        // 删除老页面的所有元素
        const anchor = $("center:first").html("").hide();

        // 老页面没有什么有价值的数据，直接渲染新页面
        let html = "";
        html += "<table style='width:100%;border-width:0;background-color:#888888'>";
        html += "<tbody>";
        html += "<tr>";
        html += "<td id='pageTitle'>";
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
        html += "<td id='petStatus'>";
        html += this.petManager.generateHTML();
        html += "</td>";
        html += "</tr>";
        html += "<tr style='display:none'>";
        html += "<td id='mirrorStatus'></td>";
        html += "</tr>";
        html += "</tbody>";
        html += "</table>";
        anchor.after($(html));
        await this.doBindReturnButton();
        await this.doBindItemHouseButton();
        await this._bindCommandButtons();

        MessageBoard.createMessageBoardStyleB("messageBoardCell", NpcLoader.randomNpcImageHtml());
        $("#messageBoard")
            .css("background-color", "black")
            .css("color", "wheat");
        await this._resetMessageBoard();

        await this._createRolePage();

        this.spellManager.bindButtons();
        this.equipmentManager.bindButtons();
        this.petManager.bindButtons();
    }

    private async _refresh() {
        await this._resetMessageBoard();
        PageUtils.scrollIntoView("pageTitle");
        await this.reloadRole();
        await this.renderRole();
        await this._renderBankAccount();
        await this.spellManager.reload();
        await this.spellManager.render(this.role!);
        await this.equipmentManager.reload();
        await this.equipmentManager.render();
        await this.petManager.reload();
        await this.petManager.render(this.equipmentManager.equipmentPage!);
        await this.mirrorManager?.reload();
        await this.mirrorManager?.render(this.role!);
        MessageBoard.publishMessage("个人面板刷新完成。");
    }

    protected async reloadRole() {
        this.role = await new PersonalStatus(this.credential).load();
    }

    protected async doBeforeReturn() {
        await Promise.all([
            this.equipmentManager.dispose(),
            this.petManager.dispose()
        ]);
    }

    protected async doBindReturnButton() {
    }

    protected async doBindItemHouseButton() {
    }

    private async _bindCommandButtons() {
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
            this._refresh().then(() => {
                $(".C_commandButton").prop("disabled", false);
            });
        });
    }

    private async _resetMessageBoard() {
        const message: string = "<b style='font-size:120%'>见贤思齐焉，见不贤而内自省也。</b>";
        MessageBoard.resetMessageBoard(message);
    }

    private async _createRolePage() {
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

    protected async doLoadBankAccount(): Promise<BankAccount | undefined> {
        return undefined;
    }

    private async _renderBankAccount() {
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

        $("#roleAttack").html(role.attackHtml);
        $("#roleDefense").html(role.defenseHtml);
        $("#roleSpecialAttack").html(role.specialAttackHtml);
        $("#roleSpecialDefense").html(role.specialDefenseHtml);
        $("#roleSpeed").html(role.speedHtml);

        await this._generateRoleDimension();
    }

    private async _generateRoleDimension() {
        this.roleDimensionChart?.dispose();
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
            this.roleDimensionChart = chart;
        }
    }
}

export = PersonalProfilePageProcessor;