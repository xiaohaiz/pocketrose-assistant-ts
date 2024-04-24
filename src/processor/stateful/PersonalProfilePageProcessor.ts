import StatefulPageProcessor from "../StatefulPageProcessor";
import Credential from "../../util/Credential";
import PageProcessorContext from "../PageProcessorContext";
import PageUtils from "../../util/PageUtils";
import KeyboardShortcutBuilder from "../../util/KeyboardShortcutBuilder";
import MessageBoard from "../../util/MessageBoard";
import NpcLoader from "../../core/role/NpcLoader";
import Role from "../../core/role/Role";
import _ from "lodash";
import * as echarts from "echarts";
import {EChartsOption} from "echarts";
import ButtonUtils from "../../util/ButtonUtils";
import {SpellManager} from "../../widget/SpellManager";
import LocationModeTown from "../../core/location/LocationModeTown";
import LocationModeCastle from "../../core/location/LocationModeCastle";
import {EquipmentManager} from "../../widget/EquipmentManager";
import {PetManager} from "../../widget/PetManager";
import PersonalEquipmentManagementPage from "../../core/equipment/PersonalEquipmentManagementPage";
import {MirrorManager} from "../../widget/MirrorManager";
import {PocketFormGenerator, PocketPage} from "../../pocket/PocketPage";
import {RoleManager} from "../../widget/RoleManager";
import {BankManager} from "../../widget/BankManager";
import BattleFieldTrigger from "../../core/trigger/BattleFieldTrigger";
import {SnapshotManager} from "../../widget/SnapshotManager";
import {EquipmentStatusTrigger} from "../../core/trigger/EquipmentStatusTrigger";
import PersonalEquipmentManagement from "../../core/equipment/PersonalEquipmentManagement";
import BankAccountTrigger from "../../core/trigger/BankAccountTrigger";
import PetMapStatusTrigger from "../../core/trigger/PetMapStatusTrigger";
import PersonalPetManagement from "../../core/monster/PersonalPetManagement";
import PetStatusTrigger from "../../core/trigger/PetStatusTrigger";

class PersonalProfilePageProcessor extends StatefulPageProcessor {

    private readonly formGenerator: PocketFormGenerator;
    private readonly roleManager: RoleManager;
    private readonly bankManager: BankManager;
    private readonly spellManager: SpellManager;
    private readonly equipmentManager: EquipmentManager;
    private readonly petManager: PetManager;
    private readonly mirrorManager?: MirrorManager;
    private readonly snapshotManager?: SnapshotManager;

    private roleDimensionChart?: any;

    constructor(credential: Credential, context: PageProcessorContext) {
        super(credential, context);
        const locationMode = this.createLocationMode() as LocationModeTown | LocationModeCastle;

        this.formGenerator = new PocketFormGenerator(credential, locationMode);

        this.roleManager = new RoleManager(credential, locationMode);
        this.roleManager.feature.enableCareerFixedFlag = false;

        this.bankManager = new BankManager(credential, locationMode);
        this.bankManager.feature.enableWriteRecordOnDispose = true;
        this.bankManager.feature.enableSalaryDistribution = false;
        this.bankManager.feature.onRefresh = () => {
            this._renderBankAccount().then();
        }

        this.spellManager = new SpellManager(credential, locationMode);
        this.spellManager.feature.onRefresh = (message) => {
            this.roleManager.role = message.extensions.get("role") as Role;
            this.mirrorManager?.reload().then(() => {
                this.mirrorManager?.render(this.roleManager.role!).then();
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
        this.equipmentManager.feature.onRefresh = () => {
            this.equipmentManager.renderHitStatus(this.roleManager.role);
            // Will trigger pet manager reloading, for golden cage index may changed.
            this.petManager.reload().then(() => {
                this.petManager.render(this.equipmentManager.equipmentPage!).then();
            });
        };
        this.petManager = new PetManager(credential, locationMode);
        this.petManager.feature.leagueEnabled = true;
        this.petManager.feature.enableSpaceTriggerOnDispose = true;
        this.petManager.feature.enableStatusTriggerOnDispose = true;
        this.petManager.feature.enableUsingTriggerOnDispose = true;
        this.petManager.feature.onRefresh = (message) => {
            this.equipmentManager.equipmentPage = message.extensions.get("equipmentPage") as PersonalEquipmentManagementPage;
            if (message.extensions.get("mode") === "CONSECRATE") {
                this.equipmentManager.render().then();
            }
            if (message.extensions.get("mode") === "LEAGUE") {
                PocketPage.scrollIntoTitle();
                MessageBoard.publishMessage("<span style='color:yellow;font-weight:bold'>请转到宠物管理查看宠物联赛状态。</span>");
            }
        };

        if (locationMode instanceof LocationModeTown) {
            this.mirrorManager = new MirrorManager(credential, locationMode);
            this.mirrorManager.feature.onRefresh = (message) => {
                this.roleManager.role = message.extensions.get("role") as Role;
                this.renderRole().then(() => {
                    this.spellManager.reload().then(() => {
                        this.spellManager.render(this.roleManager.role!).then(() => {
                            this.equipmentManager.reload().then(() => {
                                this.equipmentManager.render().then();
                            });
                        });
                    });
                });
            };

            this.snapshotManager = new SnapshotManager(credential, locationMode);
            this.snapshotManager.feature.onRefresh = message => {
                if (message.extensions.get("mode") === "RESTORE") {
                    this.refresh().then();
                }
            };
            this.snapshotManager.feature.scrollToPageTitle = () => {
                PocketPage.scrollIntoTitle();
            };
        }
    }

    protected async doProcess(): Promise<void> {
        await this.generateHTML();
        await this.bindButtons();
        await this.roleManager.reload();
        await this.renderRole();
        await this.bankManager.reload();
        await this.bankManager.render();
        await this._renderBankAccount();
        await this.spellManager.reload();
        await this.spellManager.render(this.roleManager.role!);
        await this.equipmentManager.reload();
        await this.equipmentManager.render();
        this.equipmentManager.renderHitStatus(this.roleManager.role);
        await this.petManager.reload();
        await this.petManager.render(this.equipmentManager.equipmentPage!);
        await this.mirrorManager?.reload();
        await this.mirrorManager?.render(this.roleManager.role!);
        await this.snapshotManager?.reload();
        await this.snapshotManager?.render();
        KeyboardShortcutBuilder.newInstance()
            .onKeyPressed("e", () => PageUtils.triggerClick("equipmentButton"))
            .onKeyPressed("j", () => PageUtils.triggerClick("statisticsButton"))
            .onKeyPressed("r", () => PageUtils.triggerClick("refreshButton"))
            .onKeyPressed("s", () => PageUtils.triggerClick("itemHouseButton"))
            .onKeyPressed("u", () => PageUtils.triggerClick("petButton"))
            .onKeyPressed("z", () => PageUtils.triggerClick("careerButton"))
            .onEscapePressed(() => PageUtils.triggerClick("returnButton"))
            .withDefaultPredicate()
            .bind();
    }

    private async generateHTML() {
        // 删除老页面的所有元素
        const anchor = $("center:first").html("").hide();

        // 老页面没有什么有价值的数据，直接渲染新页面
        let html = "";
        html += "<table style='width:100%;border-width:0;background-color:#888888'>";
        html += "<tbody>";
        html += "<tr>";
        html += "<td>";
        html += PocketPage.generatePageHeaderHTML("＜＜  个 人 面 板  ＞＞", this.roleLocation);
        html += "</td>";
        html += "</tr>";
        html += "<tr>";
        html += "<td id='messageBoardCell'></td>"
        html += "</tr>";
        html += "<tr>";
        html += "<td id='personalStatus'></td>";
        html += "</tr>";
        html += "<tr>";
        html += "<td id='BankManagerPanel'>";
        html += this.bankManager.generateHTML();
        html += "</td>";
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
        html += "<tr style='display:none'>";
        html += "<td id='snapshotStatus'></td>";
        html += "</tr>";
        html += "</tbody>";
        html += "</table>";
        anchor.after($(html));

        $("#_pocket_page_command").html(() => {
            return "<span style='display:none'> <button role='button' class='C_pocket_StatelessElement' id='itemHouseButton' disabled>" + ButtonUtils.createTitle("商店", "s") + "</button></span>" +
                "<span> <button role='button' class='C_pocket_StatelessElement' id='equipmentButton'>" + ButtonUtils.createTitle("装备", "e") + "</button></span>" +
                "<span> <button role='button' class='C_pocket_StatelessElement' id='petButton'>" + ButtonUtils.createTitle("宠物", "u") + "</button></span>" +
                "<span> <button role='button' class='C_pocket_StatelessElement' id='careerButton'>" + ButtonUtils.createTitle("职业", "z") + "</button></span>" +
                "<span> <button role='button' class='C_pocket_StatelessElement' id='statisticsButton'>" + ButtonUtils.createTitle("统计", "j") + "</button></span>" +
                "<span> <button role='button' class='C_pocket_StatelessElement' id='refreshButton'>" + ButtonUtils.createTitle("刷新", "r") + "</button></span>" +
                "<span> <button role='button' class='C_pocket_StatelessElement' id='returnButton'>" + ButtonUtils.createTitle("退出", "Esc") + "</button></span>";
        });

        if (this.mirrorManager) {
            $("#mirrorStatus")
                .html(() => {
                    return this.mirrorManager!.generateHTML();
                })
                .parent().show();
        }
        if (this.snapshotManager) {
            $("#snapshotStatus")
                .html(() => {
                    return this.snapshotManager!.generateHTML();
                })
                .parent().show();
        }

        MessageBoard.createMessageBoardStyleB("messageBoardCell", NpcLoader.randomNpcImageHtml());
        $("#messageBoard")
            .css("background-color", "black")
            .css("color", "wheat");
        this._resetMessageBoard();

        await this._createRolePage();
    }

    private async bindButtons() {
        $("#_pocket_page_extension_0").html(this.formGenerator.generateReturnFormHTML());
        $("#returnButton").on("click", () => {
            PageUtils.disablePageInteractiveElements();
            this.dispose().then(() => {
                PageUtils.triggerClick("_pocket_ReturnSubmit");
            });
        });
        $("#refreshButton").on("click", () => {
            PocketPage.scrollIntoTitle();
            PocketPage.disableStatelessElements();
            this._resetMessageBoard();
            this.refresh().then(() => {
                MessageBoard.publishMessage("个人面板刷新完成。");
                PocketPage.enableStatelessElements();
            });
        });
        $("#statisticsButton").on("click", () => {
            PocketPage.scrollIntoTitle();
            PocketPage.disableStatelessElements();
            this._updateStatistics().then(() => {
                MessageBoard.publishMessage("统计数据更新完成。");
                PocketPage.enableStatelessElements();
            });
        });
        $("#_pocket_page_extension_1").html(() => {
            return PageUtils.generateCareerManagementForm(this.credential);
        });
        $("#careerButton").on("click", () => {
            PageUtils.disablePageInteractiveElements();
            this.dispose().then(() => {
                PageUtils.triggerClick("openCareerManagement");
            });
        });
        $("#_pocket_page_extension_2").html(() => {
            return PageUtils.generatePetManagementForm(this.credential);
        });
        $("#petButton").on("click", () => {
            PageUtils.disablePageInteractiveElements();
            this.dispose().then(() => {
                PageUtils.triggerClick("openPetManagement");
            });
        });
        $("#_pocket_page_extension_3").html(() => {
            return PageUtils.generateEquipmentManagementForm(this.credential);
        });
        $("#equipmentButton").on("click", () => {
            PageUtils.disablePageInteractiveElements();
            this.dispose().then(() => {
                PageUtils.triggerClick("openEquipmentManagement");
            });
        });
        if (this.createLocationMode() instanceof LocationModeTown) {
            $("#_pocket_page_extension_4").html(() => {
                return PageUtils.generateItemShopForm(this.credential, this.townId!);
            });
            $("#itemHouseButton")
                .prop("disabled", false)
                .on("click", () => {
                    PageUtils.disablePageInteractiveElements();
                    this.dispose().then(() => {
                        PageUtils.triggerClick("openItemShop");
                    });
                })
                .parent().show();
        }

        this.roleManager.bindButtons();
        this.bankManager.bindButtons();
        this.spellManager.bindButtons();
        this.equipmentManager.bindButtons();
        this.petManager.bindButtons();
        this.mirrorManager?.bindButtons();
        this.snapshotManager?.bindButtons();
    }

    private async refresh() {
        await this.roleManager.reload();
        await this.bankManager.reload();
        await this.bankManager.render();
        await this.renderRole();
        await this._renderBankAccount();
        await this.spellManager.reload();
        await this.spellManager.render(this.roleManager.role!);
        await this.equipmentManager.reload();
        await this.equipmentManager.render();
        await this.petManager.reload();
        await this.petManager.render(this.equipmentManager.equipmentPage!);
        await this.mirrorManager?.reload();
        await this.mirrorManager?.render(this.roleManager.role!);
        await this.snapshotManager?.reload();
        await this.snapshotManager?.render();
    }

    private async dispose() {
        this.roleDimensionChart?.dispose();
        await Promise.all([
            this.roleManager.dispose(),
            this.bankManager.dispose(),
            this.equipmentManager.dispose(),
            this.petManager.dispose()
        ]);
        await this.snapshotManager?.dispose();
        if (this.createLocationMode() instanceof LocationModeTown) {
            await new BattleFieldTrigger(this.credential)
                .withRole(this.roleManager.role)
                .withPetPage(this.petManager.petPage)
                .triggerUpdate();
        }
    }

    private _resetMessageBoard() {
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
        html += "<td style='background-color:#E8E8D0;text-align:right' colspan='3' id='roleCash'></td>";
        html += "</tr>";
        html += "<tr>";
        html += "<th style='background-color:#E0D0B0;white-space:nowrap'>存款</th>";
        html += "<td style='background-color:#E8E8D0;text-align:right' colspan='3' id='roleSaving'></td>";
        html += "</tr>";
        html += "</tbody>";
        html += "</table>";

        html += "</td>";
        html += "</tr>";

        html += "</tbody>";
        html += "</table>";

        $("#personalStatus").html(html);
    }

    private async _renderBankAccount() {
        const account = this.bankManager.bankPage?.account;
        if (account !== undefined) {
            $("#roleCash").html(() => {
                return "<span style='color:red'>" + account.cash!.toLocaleString() + "</span> GOLD";
            });
            $("#roleSaving").html(() => {
                return "<span style='color:blue'>" + account.saving!.toLocaleString() + "</span> GOLD";
            });
        }
    }

    private async renderRole() {
        $(".C_roleImage").off("click").off("dblclick");
        const roleImage = $("#roleImage");
        const role = this.roleManager.role!;
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

        const role = this.roleManager.role!;
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

    private async _updateStatistics() {
        const equipmentPage = await new PersonalEquipmentManagement(this.credential, this.townId).open();
        const petPage = await new PersonalPetManagement(this.credential, this.townId).open();
        await Promise.all([
            new BankAccountTrigger(this.credential).triggerUpdate(),
            new EquipmentStatusTrigger(this.credential).withEquipmentPage(equipmentPage).triggerUpdate(),
            new PetMapStatusTrigger(this.credential).triggerUpdate(),
            new PetStatusTrigger(this.credential).withPetPage(petPage).withEquipmentPage(equipmentPage).triggerUpdate(),
        ]);
    }
}

export = PersonalProfilePageProcessor;