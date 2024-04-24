import BankRecordReportGenerator from "../../core/bank/BankRecordReportGenerator";
import ButtonUtils from "../../util/ButtonUtils";
import Credential from "../../util/Credential";
import EquipmentConstants from "../../core/equipment/EquipmentConstants";
import KeyboardShortcutBuilder from "../../util/KeyboardShortcutBuilder";
import LocalSettingManager from "../../core/config/LocalSettingManager";
import LocationModeCastle from "../../core/location/LocationModeCastle";
import LocationModeTown from "../../core/location/LocationModeTown";
import MessageBoard from "../../util/MessageBoard";
import MonsterPageUtils from "../../core/monster/MonsterPageUtils";
import MonsterProfileLoader from "../../core/monster/MonsterProfileLoader";
import MouseClickEventBuilder from "../../util/MouseClickEventBuilder";
import NpcLoader from "../../core/role/NpcLoader";
import PageProcessorContext from "../PageProcessorContext";
import PageUtils from "../../util/PageUtils";
import Pet from "../../core/monster/Pet";
import StatefulPageProcessor from "../StatefulPageProcessor";
import StringUtils from "../../util/StringUtils";
import TeamEquipmentReportGenerator from "../../core/equipment/TeamEquipmentReportGenerator";
import TeamMemberLoader from "../../core/team/TeamMemberLoader";
import _ from "lodash";
import {PocketFormGenerator, PocketPage} from "../../pocket/PocketPage";
import {RoleManager} from "../../widget/RoleManager";
import {RolePetStatusManager} from "../../core/monster/RolePetStatusManager";
import {TeamSetupManager} from "../../widget/TeamSetupManager";
import {RoleStatusManager} from "../../core/role/RoleStatus";
import TownLoader from "../../core/town/TownLoader";
import {RoleUsingEquipmentManager} from "../../core/role/RoleUsingEquipment";
import {RoleUsingPetManager} from "../../core/role/RoleUsingPet";
import SetupLoader from "../../core/config/SetupLoader";
import TeamMember from "../../core/team/TeamMember";

class PersonalTeamPageProcessor extends StatefulPageProcessor {

    private readonly formGenerator: PocketFormGenerator;
    private readonly roleManager: RoleManager;
    private readonly teamSetupManager: TeamSetupManager;

    constructor(credential: Credential, context: PageProcessorContext) {
        super(credential, context);
        const locationMode = this.createLocationMode() as LocationModeTown | LocationModeCastle;
        this.formGenerator = new PocketFormGenerator(credential, locationMode);
        this.roleManager = new RoleManager(credential, locationMode);
        this.teamSetupManager = new TeamSetupManager(credential, locationMode);
    }

    protected async doProcess(): Promise<void> {
        await this.generateHTML();
        this.resetMessageBoard();
        this.roleManager.bindButtons();
        this.teamSetupManager.bindButtons();
        await this.bindButtons();
        await this.roleManager.reload();
        await this.roleManager.render();
        await this.teamSetupManager.reload();
        await this.teamSetupManager.render();
        await this.render();
        KeyboardShortcutBuilder.newInstance()
            .onKeyPressed("r", () => PageUtils.triggerClick("refreshButton"))
            .onEscapePressed(() => PageUtils.triggerClick("returnButton"))
            .withDefaultPredicate()
            .bind();
    }

    private async generateHTML() {
        $("body:first > table:first")
            .removeAttr("height")
            .find("> tbody:first > tr:first > td:first")
            .removeAttr("height")
            .html(() => {
                return PocketPage.generatePageHeaderHTML("＜＜  团 队 面 板  ＞＞", this.roleLocation);
            });
        $("#_pocket_page_command").html(() => {
            const refreshButtonTitle = ButtonUtils.createTitle("刷新", "r");
            const returnButtonTitle = ButtonUtils.createTitle("退出", "Esc");
            return "" +
                "<span> <button role='button' class='C_StatelessElement' id='refreshButton'>" + refreshButtonTitle + "</button></span>" +
                "<span> <button role='button' class='C_StatelessElement' id='returnButton'>" + returnButtonTitle + "</button></span>" +
                "";
        });

        $("body:first > table:first > tbody:first > tr:eq(1) > td:first > table:first > tbody:first > tr:first > td:first")
            .find("> img:first")
            .attr("id", "_pocket_RoleImage");

        $("body:first > table:first > tbody:first > tr:eq(1) > td:first")
            .find("> table:first > tbody:first > tr:first > td:last")
            .css("vertical-align", "middle")
            .html(() => {
                return this.roleManager.generateHTML();
            });

        $("table:first")
            .find("> tbody:first")
            .find("> tr:eq(2)")
            .find("> td:first")
            .attr("id", "messageBoardContainer")
            .html("");
        MessageBoard.createMessageBoardStyleB("messageBoardContainer", NpcLoader.randomNpcImageHtml());
        $("#messageBoard")
            .css("background-color", "black")
            .css("color", "wheat");

        let html = "";
        html += "<tr style='display:none;background-color:#F8F0E0'>";
        html += "<td id='_pocket_TeamSetupPanel'>" + this.teamSetupManager.generateHTML() + "</td>";
        html += "</tr>";
        html += "<tr>";
        html += "<td style='background-color:#F8F0E0;text-align:center'>";
        html += "<table style='background-color:transparent;margin:auto;border-spacing:0;border-width:0'>";
        html += "<tbody>";
        html += "<tr>";
        html += "<td style='text-align:center'>";
        html += "<input type='checkbox' id='includeExternal'>是否包含编外队员";
        html += "<span> </span>";
        html += "<button role='button' class='C_StatelessElement' id='triggerStatisticsButton' style='color:grey'>触发团队统计更新</button>";
        html += "</td>";
        html += "</tr>";
        html += "<tr>";
        html += "<td>";
        html += "<table style='background-color:transparent;margin:auto;border-spacing:0;border-width:0'>";
        html += "<tbody>";
        html += "<tr>";
        html += "<td>";
        html += "<button role='button' id='listEquipmentButton'>团队装备列表</button>";
        html += "</td>";
        html += "<td>";
        html += "<button role='button' id='listPetButton'>团队宠物列表</button>";
        html += "</td>";
        html += "<td>";
        html += "<button role='button' id='bankRecordButton'>银行资产分析</button>";
        html += "</td>";
        html += "</tr>";
        html += "</tbody>";
        html += "</table>";
        html += "</td>";
        html += "</tr>";
        html += "<tr>";
        html += "<td style='text-align:center'>";
        html += "<input type='text' id='searchName' size='15' maxlength='40' spellcheck='false'>";
        html += "<input type='button' id='searchTeamEquipmentButton' value='查找团队装备'>";
        html += "<input type='button' id='searchTeamPetButton' value='查找团队宠物'>";
        html += "</td>";
        html += "</tr>";
        html += "<tr>";
        html += "<td style='text-align:center'>";
        html += "<input type='button' id='searchTeamSpecialEquipmentButton_A' value='神枪' style='color:red'>";
        html += "<input type='button' id='searchTeamSpecialEquipmentButton_B' value='斧头' style='color:green'>";
        html += "<input type='button' id='searchTeamSpecialEquipmentButton_C' value='神器' style='color:blue'>";
        html += "<input type='button' id='searchTeamSpecialEquipmentButton_D' value='魔刀' style='color:red'>";
        html += "<input type='button' id='searchTeamSpecialEquipmentButton_E' value='魔神器' style='color:green'>";
        html += "<input type='button' id='searchTeamSpecialEquipmentButton_F' value='圣剑' style='color:blue'>";
        html += "<input type='button' id='searchTeamSpecialEquipmentButton_G' value='重铠' style='color:red'>";
        html += "<input type='button' id='searchTeamSpecialEquipmentButton_H' value='龟壳' style='color:green'>";
        html += "<input type='button' id='searchTeamSpecialEquipmentButton_I' value='魔盔' style='color:blue'>";
        html += "<input type='button' id='searchTeamSpecialEquipmentButton_J' value='神冠' style='color:red'>";
        html += "<input type='button' id='searchTeamSpecialEquipmentButton_K' value='龙' style='color:green'>";
        html += "</td>";
        html += "</tr>";
        html += "<tr>";
        html += "<td style='text-align:center'>";
        html += "<input type='button' id='searchHeavyArmorButton_A' value='水铠'>";
        html += "<input type='button' id='searchHeavyArmorButton_B' value='土铠'>";
        html += "<input type='button' id='searchHeavyArmorButton_C' value='暗铠'>";
        html += "<input type='button' id='searchHeavyArmorButton_D' value='火铠'>";
        html += "<input type='button' id='searchHeavyArmorButton_E' value='光铠'>";
        html += "<input type='button' id='searchHeavyArmorButton_F' value='金铠'>";
        html += "<input type='button' id='searchHeavyArmorButton_G' value='风铠'>";
        html += "</td>";
        html += "</tr>";
        html += "<tr>";
        html += "<td style='text-align:center'>";
        html += "<input type='button' id='searchTeamNonFullExperienceEquipmentButton' value='经验未满装备'>";
        html += "<input type='button' id='searchTeamUsingEquipmentButton' value='使用中的装备'>";
        html += "<input type='button' id='searchTeamStarEquipmentButton' value='有齐心的装备'>";
        html += "<input type='button' id='teamGemDistributionButton' value='团队宝石分布'>";
        html += "</td>";
        html += "</tr>";
        html += "</tbody>";
        html += "</table>";
        html += "</td>";
        html += "</tr>";
        html += "<tr style='display:none'>";
        html += "<td id='information' style='background-color:#F8F0E0;width:100%'></td>";
        html += "</tr>";
        html += "<tr style='display:none'>";
        html += "<td id='TeamStatusList' style='background-color:#F8F0E0;width:100%'></td>";
        html += "</tr>";
        $("#messageBoardContainer")
            .parent()
            .after($(html));

        $("#information")
            .parent()
            .next()
            .next()
            .attr("id", "changeBattleDeclarationPanel")
            .hide()
            .find("> td:first > form:first")
            .remove();
        $("#changeBattleDeclarationPanel")
            .find("> td:first > center:first > form:first > table:first")
            .remove();

        $("#TeamStatusList").html(() => {
            return "" +
                "<table style='background-color:#888888;margin:auto;width:100%;border-width:0'>" +
                "<thead style='background-color:wheat;text-align:center'>" +
                "<tr>" +
                "<th>头像</th>" +
                "<th>名字</th>" +
                "<th>分身</th>" +
                "<th>定型</th>" +
                "<th>等级</th>" +
                "<th>职业</th>" +
                "<th>城市</th>" +
                "<th>装备</th>" +
                "<th>宠物</th>" +
                "<th>名字</th>" +
                "<th>性别</th>" +
                "<th>等级</th>" +
                "<th>技能</th>" +
                "</tr>" +
                "<tbody id='TeamStatusListTable' style='background-color:#F8F0E0;text-align:center'></tbody>" +
                "</thead>" +
                "</table>" +
                "";
        });
    }

    private async bindButtons() {
        $("#_pocket_page_extension_0").html(() => {
            return this.formGenerator.generateReturnFormHTML();
        });
        $("#returnButton").on("click", () => {
            PageUtils.disablePageInteractiveElements();
            this.dispose().then(() => PageUtils.triggerClick("_pocket_ReturnSubmit"));
        });
        $("#refreshButton").on("click", () => {
            PocketPage.scrollIntoTitle();
            PocketPage.disableStatelessElements();
            $("#messageBoardManager").html(NpcLoader.randomNpcImageHtml());
            this.resetMessageBoard();
            this.refresh().then(() => {
                PocketPage.enableStatelessElements();
                MessageBoard.publishMessage("团队面板刷新操作完成。");
            });
        });
        new MouseClickEventBuilder(this.credential)
            .bind($("#messageBoardManager"), () => {
                $("#changeBattleDeclarationPanel").toggle();
            });
        const checkbox = $("#includeExternal");
        if (LocalSettingManager.isIncludeExternal()) {
            checkbox.prop("checked", true);
        }
        checkbox.on("change", event => {
            const checked = $(event.target).prop("checked") as boolean;
            LocalSettingManager.setIncludeExternal(checked);
            this.renderTeamStatusList().then();
        });

        this.bindListEquipmentButton();
        this.bindListPetButton();
        this.bindBankRecordButton();
        this.bindSearchTeamEquipmentButton();
        this.bindSearchTeamPetButton();
        this.bindSearchTeamNonFullExperienceEquipmentButton();
        this.bindSearchTeamUsingEquipmentButton();
        this.bindSearchTeamStarEquipmentButton();
        this.bindTeamGemDistributionButton();
        this.bindSearchTeamSpecialEquipmentButton_A();
        this.bindSearchTeamSpecialEquipmentButton_B();
        this.bindSearchTeamSpecialEquipmentButton_C();
        this.bindSearchTeamSpecialEquipmentButton_D();
        this.bindSearchTeamSpecialEquipmentButton_E();
        this.bindSearchTeamSpecialEquipmentButton_F();
        this.bindSearchTeamSpecialEquipmentButton_G();
        this.bindSearchTeamSpecialEquipmentButton_H();
        this.bindSearchTeamSpecialEquipmentButton_I();
        this.bindSearchTeamSpecialEquipmentButton_J();
        this.bindSearchTeamSpecialEquipmentButton_K();
        this.bindSearchHeavyArmorButtons();

        new MouseClickEventBuilder(this.credential)
            .bind($("#_pocket_RoleImage"), () => {
                if (!TeamMemberLoader.loadTeamMembersAsMap(true).has(this.credential.id)) {
                    MessageBoard.publishWarning("你不是团队成员，无法进入团队设置。");
                    return;
                }
                $("#_pocket_TeamSetupPanel").parent().toggle();
            });

        $("#triggerStatisticsButton").on("click", () => {
            const members = TeamMemberLoader.loadTeamMembers();
            PageUtils.toggleColor(
                "triggerStatisticsButton",
                () => {
                    _.forEach(members)
                        .map(it => it.id!)
                        .forEach(it => {
                            LocalSettingManager.setStatisticsTriggered(it);
                        });
                },
                () => {
                    _.forEach(members)
                        .map(it => it.id!)
                        .forEach(it => {
                            LocalSettingManager.unsetStatisticsTriggered(it);
                        });
                }
            )
        });
    }

    protected async reload() {
    }

    protected async render() {
        const members = TeamMemberLoader.loadTeamMembers();
        if (members.length > 0) {
            let allSet = true;
            for (const member of members) {
                const roleId = member.id!;
                if (!LocalSettingManager.hasStatisticsTriggered(roleId)) {
                    allSet = false;
                    break;
                }
            }
            if (allSet) {
                PageUtils.changeColorBlue("triggerStatisticsButton");
            }
        }

        const teamStatusListElement = $("#TeamStatusList");
        if (TeamMemberLoader.loadTeamMembersAsMap(true).has(this.credential.id)) {
            teamStatusListElement.parent().show();
            await this.renderTeamStatusList();
        } else {
            teamStatusListElement.parent().hide();
        }
    }

    private async dispose() {
        await this.roleManager.dispose();
        await this.teamSetupManager.dispose();
    }

    private async refresh() {
        await this.roleManager.reload();
        await this.roleManager.render();
        await this.teamSetupManager.reload();
        await this.teamSetupManager.render();
        await this.reload();
        await this.render();
    }

    private resetMessageBoard() {
        MessageBoard.resetMessageBoard("<b style='font-size:120%;color:wheat'>什么是团队？在我看来，共同配置在快速登陆里面的才能称为团队。</b><br>" +
            "<b style='font-size:120%;color:yellowgreen'>点击左上角角色头像可进入团队的配置中心。</b><br>" +
            "<b style='font-size:120%;color:yellow'>什么，你是想要修改战斗台词？点击我的头像即可。</b>");
    }

    private async renderTeamStatusList() {
        $(".C_TeamMemberStatus").remove();
        const table = $("#TeamStatusListTable");
        const members: TeamMember[] = [];
        const includeExternal = $("#includeExternal").prop("checked") as boolean;
        TeamMemberLoader.loadTeamMembersAsMap(includeExternal).forEach(it => {
            members.push(it);
        });
        for (const member of members) {
            const statusManager = new RoleStatusManager(member.id!);
            const status = await statusManager.load();
            let html = "<tr class='C_TeamMemberStatus'>";
            html += "<td style='width:64px;height:64px'>";
            if (status === null || status.image === undefined) {
                html += NpcLoader.getNpcImageHtml("U_041")!;
            } else {
                html += status.imageHtml;
            }
            html += "</td>";
            html += "<td>";
            html += status?.name ?? member.name;
            html += "</td>";
            html += "<td>";
            html += status?.mirrorCategory ?? "-";
            html += "</td>";
            html += "<td>";
            if (status?.mirrorIndex !== undefined) {
                if (SetupLoader.isCareerFixed(member.id!, status.mirrorIndex)) {
                    html += "★";
                }
            }
            html += "</td>";
            html += "<td>";
            html += status?.level ?? "-";
            html += "</td>";
            html += "<td>";
            html += status?.career ?? "-";
            html += "</td>";
            html += "<td>";
            if (status === null || status.townId === undefined) {
                html += "-";
            } else {
                const town = TownLoader.load(status.townId!)!;
                html += town.name;
            }
            html += "</td>";
            html += "<td style='white-space:nowrap;text-align:left'>";
            const usingEquipment = await new RoleUsingEquipmentManager(member.id!).load();
            if (usingEquipment === null || !usingEquipment.available) {
                html += "-";
            } else {
                const ss: string[] = [];
                (usingEquipment.usingWeapon) && (ss.push(usingEquipment.usingWeapon));
                (usingEquipment.usingArmor) && (ss.push(usingEquipment.usingArmor));
                (usingEquipment.usingAccessory) && (ss.push(usingEquipment.usingAccessory));
                html += _.join(ss, "<br>");
            }
            html += "</td>";
            const usingPet = await new RoleUsingPetManager(member.id!).load();
            html += "<td style='width:64px;height:64px'>";
            html += usingPet?.imageHTML ?? "-";
            html += "</td>";
            html += "<td>";
            html += usingPet?.name ?? "-";
            html += "</td>";
            html += "<td>";
            html += usingPet?.gender ?? "-";
            html += "</td>";
            html += "<td>";
            html += usingPet?.level ?? "-";
            html += "</td>";
            html += "<td style='white-space:nowrap'>";
            html += usingPet?.spellHTML ?? "-";
            html += "</td>";
            html += "</tr>";
            table.append($(html));
        }
    }

    private bindListEquipmentButton() {
        $("#listEquipmentButton").on("click", () => {
            $(".simulationButton").off("click");
            const includeExternal = $("#includeExternal").prop("checked") as boolean;
            new TeamEquipmentReportGenerator(includeExternal).generate();
        });
    }

    private bindListPetButton() {
        $("#listPetButton").on("click", () => {
            $(".simulationButton").off("click");

            const includeExternal = $("#includeExternal").prop("checked") as boolean;

            let html = "";
            html += "<table style='margin:auto;border-width:0;text-align:center;background-color:#888888;width:100%'>";
            html += "<tbody id='petStatusList'>";
            html += "<tr>";
            html += "<th style='background-color:#F8F0E0'>队员</th>";
            html += "<th style='background-color:#F8F0E0'>名字</th>";
            html += "<th style='background-color:#F8F0E0'>性别</th>";
            html += "<th style='background-color:#F8F0E0'>等级</th>";
            html += "<th style='background-color:#F8F0E0'>生命</th>";
            html += "<th style='background-color:#F8F0E0'>攻击</th>";
            html += "<th style='background-color:#F8F0E0'>防御</th>";
            html += "<th style='background-color:#F8F0E0'>智力</th>";
            html += "<th style='background-color:#F8F0E0'>精神</th>";
            html += "<th style='background-color:#F8F0E0'>速度</th>";
            html += "<th style='background-color:#F8F0E0'>位置</th>";
            html += "<th style='background-color:#F8F0E0'>模拟</th>";
            html += "</tr>";
            html += "</tbody>";
            html += "</table>";
            $("#information").html(html).parent().hide();

            const configs = TeamMemberLoader.loadTeamMembers()
                .filter(it => includeExternal || it.external === undefined || !it.external);

            const idList = configs.map(it => it.id!);
            RolePetStatusManager.loadRolePetStatusReports(idList)
                .then(dataMap => {
                    const allPetList: Pet[] = [];
                    let petIndex = 0;

                    for (const config of configs) {
                        const data = dataMap.get(config.id!);
                        if (data === undefined) {
                            continue;
                        }

                        let html = "";
                        let row = 0;

                        const petList = data.petList!
                            .sort(Pet.sorter)
                            .filter(it => !(config.warehouse !== undefined && config.warehouse && it.location === "R"));

                        petList.forEach(it => {
                            it.index = petIndex++;
                            allPetList.push(it);

                            html += "<tr>";
                            if (row === 0) {
                                html += "<td style='background-color:#F8F0E0;vertical-align:center' rowspan='" + (petList.length) + "'>" + config.name + "</td>";
                            }
                            html += "<td style='background-color:#E8E8D0;text-align:left'>" + it.nameHtml + "</td>";
                            html += "<td style='background-color:#E8E8B0'>" + it.gender + "</td>";
                            html += "<td style='background-color:#E8E8D0'>" + it.levelHtml + "</td>";
                            html += "<td style='background-color:#E8E8B0'>" + it.maxHealth + "</td>";
                            html += "<td style='background-color:#E8E8D0'>" + it.attackHtml + "</td>";
                            html += "<td style='background-color:#E8E8B0'>" + it.defenseHtml + "</td>";
                            html += "<td style='background-color:#E8E8D0'>" + it.specialAttackHtml + "</td>";
                            html += "<td style='background-color:#E8E8B0'>" + it.specialDefenseHtml + "</td>";
                            html += "<td style='background-color:#E8E8D0'>" + it.speedHtml + "</td>";
                            html += "<td style='background-color:#E8E8B0'>" + it.location + "</td>";
                            html += "<td style='background-color:#E8E8D0'>";
                            html += "<button role='button' class='simulationButton' id='simulate-" + it.index + "'>模拟</button>";
                            html += "</td>";
                            html += "</tr>";
                            row++;
                        });

                        $("#petStatusList").append($(html));
                    }

                    html = "";
                    html += "<tr style='display:none'>";
                    html += "<td id='simulation' style='background-color:#F8F0E0' colspan='12'></td>";
                    html += "</tr>";
                    $("#petStatusList").append($(html));
                    this.bindSimulationButton(allPetList);

                    $("#information").parent().show();
                });


        });
    }

    private bindBankRecordButton() {
        $("#bankRecordButton").on("click", () => {
            $(".simulationButton").off("click");

            const includeExternal = $("#includeExternal").prop("checked") as boolean;

            new BankRecordReportGenerator().generate(includeExternal);
        });
    }

    private bindSearchTeamEquipmentButton() {
        $("#searchTeamEquipmentButton").on("click", () => {
            $(".simulationButton").off("click");
            const includeExternal = $("#includeExternal").prop("checked") as boolean;
            const s = $("#searchName").val();
            let searchName = "";
            if (s) searchName = s as string;
            new TeamEquipmentReportGenerator(includeExternal, searchName).generate();
        });
    }

    private bindSearchTeamPetButton() {
        $("#searchTeamPetButton").on("click", () => {
            $(".simulationButton").off("click");

            const includeExternal = $("#includeExternal").prop("checked") as boolean;

            const s = $("#searchName").val();
            let searchName = "";
            if (s) searchName = s as string;

            let html = "";
            html += "<table style='margin:auto;border-width:0;text-align:center;background-color:#888888;width:100%'>";
            html += "<tbody id='petStatusList'>";
            html += "<tr>";
            html += "<th style='background-color:#F8F0E0'>队员</th>";
            html += "<th style='background-color:#F8F0E0'>名字</th>";
            html += "<th style='background-color:#F8F0E0'>性别</th>";
            html += "<th style='background-color:#F8F0E0'>等级</th>";
            html += "<th style='background-color:#F8F0E0'>生命</th>";
            html += "<th style='background-color:#F8F0E0'>攻击</th>";
            html += "<th style='background-color:#F8F0E0'>防御</th>";
            html += "<th style='background-color:#F8F0E0'>智力</th>";
            html += "<th style='background-color:#F8F0E0'>精神</th>";
            html += "<th style='background-color:#F8F0E0'>速度</th>";
            html += "<th style='background-color:#F8F0E0'>位置</th>";
            html += "<th style='background-color:#F8F0E0'>模拟</th>";
            html += "</tr>";
            html += "</tbody>";
            html += "</table>";
            $("#information").html(html).parent().hide();

            const configs = TeamMemberLoader.loadTeamMembers()
                .filter(it => includeExternal || it.external === undefined || !it.external);

            const idList = configs.map(it => it.id!);
            RolePetStatusManager.loadRolePetStatusReports(idList)
                .then(dataMap => {
                    const allPetList: Pet[] = [];
                    let petIndex = 0;

                    for (const config of configs) {
                        const data = dataMap.get(config.id!);
                        if (data === undefined) {
                            continue;
                        }

                        let html = "";
                        let row = 0;
                        const petList = data.petList!
                            .sort(Pet.sorter)
                            .filter(it => !(config.warehouse !== undefined && config.warehouse && it.location === "R"))
                            .filter(it => it.name?.includes(searchName));
                        petList.forEach(it => {
                            it.index = petIndex++;
                            allPetList.push(it);

                            html += "<tr>";
                            if (row === 0) {
                                html += "<td style='background-color:black;color:white;white-space:nowrap;font-weight:bold;vertical-align:center' " +
                                    "rowspan='" + (petList.length) + "'>" + config.name + "</td>";
                            }
                            html += "<td style='background-color:#E8E8D0;text-align:left'>" + it.nameHtml + "</td>";
                            html += "<td style='background-color:#E8E8B0'>" + it.gender + "</td>";
                            html += "<td style='background-color:#E8E8D0'>" + it.levelHtml + "</td>";
                            html += "<td style='background-color:#E8E8B0'>" + it.maxHealth + "</td>";
                            html += "<td style='background-color:#E8E8D0'>" + it.attackHtml + "</td>";
                            html += "<td style='background-color:#E8E8B0'>" + it.defenseHtml + "</td>";
                            html += "<td style='background-color:#E8E8D0'>" + it.specialAttackHtml + "</td>";
                            html += "<td style='background-color:#E8E8B0'>" + it.specialDefenseHtml + "</td>";
                            html += "<td style='background-color:#E8E8D0'>" + it.speedHtml + "</td>";
                            html += "<td style='background-color:#E8E8B0'>" + it.location + "</td>";
                            html += "<td style='background-color:#E8E8D0'>";
                            html += "<button role='button' class='simulationButton' id='simulate-" + it.index + "'>模拟</button>";
                            html += "</td>";
                            html += "</tr>";
                            row++;
                        });

                        $("#petStatusList").append($(html));
                    }

                    html = "";
                    html += "<tr style='display:none'>";
                    html += "<td id='simulation' style='background-color:#F8F0E0' colspan='12'></td>";
                    html += "</tr>";
                    $("#petStatusList").append($(html));
                    this.bindSimulationButton(allPetList);

                    $("#information").parent().show();
                });
        });
    }

    private bindSearchTeamNonFullExperienceEquipmentButton() {
        $("#searchTeamNonFullExperienceEquipmentButton").on("click", () => {
            $(".simulationButton").off("click");
            const includeExternal = $("#includeExternal").prop("checked") as boolean;
            new TeamEquipmentReportGenerator(
                includeExternal,
                undefined,
                equipment => {
                    return equipment.fullExperienceRatio >= 0 && equipment.fullExperienceRatio < 1;
                })
                .generate();
        });
    }

    private bindSearchTeamUsingEquipmentButton() {
        $("#searchTeamUsingEquipmentButton").on("click", () => {
            $(".simulationButton").off("click");
            const includeExternal = $("#includeExternal").prop("checked") as boolean;
            new TeamEquipmentReportGenerator(
                includeExternal,
                undefined,
                equipment => {
                    return equipment.using !== undefined && equipment.using;
                })
                .generate();
        });
    }

    private bindSearchTeamStarEquipmentButton() {
        $("#searchTeamStarEquipmentButton").on("click", () => {
            $(".simulationButton").off("click");
            const includeExternal = $("#includeExternal").prop("checked") as boolean;
            new TeamEquipmentReportGenerator(includeExternal, "齐心★").generate();
        });
    }

    private bindTeamGemDistributionButton() {
        $("#teamGemDistributionButton").on("click", () => {
            $(".simulationButton").off("click");
            const includeExternal = $("#includeExternal").prop("checked") as boolean;
            new TeamEquipmentReportGenerator(includeExternal)
                .generateTeamGemDistribution()
                .then(html => {
                    $("#information").html(html).parent().show();
                });
        });
    }

    private bindSearchTeamSpecialEquipmentButton_A() {
        $("#searchTeamSpecialEquipmentButton_A").on("click", () => {
            $(".simulationButton").off("click");
            const includeExternal = $("#includeExternal").prop("checked") as boolean;
            new TeamEquipmentReportGenerator(includeExternal, "神枪 永恒").generate();
        });
    }

    private bindSearchTeamSpecialEquipmentButton_B() {
        $("#searchTeamSpecialEquipmentButton_B").on("click", () => {
            $(".simulationButton").off("click");
            const includeExternal = $("#includeExternal").prop("checked") as boolean;
            new TeamEquipmentReportGenerator(includeExternal, "霸邪斧 天煌").generate();
        });
    }

    private bindSearchTeamSpecialEquipmentButton_C() {
        $("#searchTeamSpecialEquipmentButton_C").on("click", () => {
            $(".simulationButton").off("click");
            const includeExternal = $("#includeExternal").prop("checked") as boolean;
            new TeamEquipmentReportGenerator(includeExternal, "神器 苍穹").generate();
        });
    }

    private bindSearchTeamSpecialEquipmentButton_D() {
        $("#searchTeamSpecialEquipmentButton_D").on("click", () => {
            $(".simulationButton").off("click");
            const includeExternal = $("#includeExternal").prop("checked") as boolean;
            new TeamEquipmentReportGenerator(includeExternal, "魔刀 哭杀").generate();
        });
    }

    private bindSearchTeamSpecialEquipmentButton_E() {
        $("#searchTeamSpecialEquipmentButton_E").on("click", () => {
            $(".simulationButton").off("click");
            const includeExternal = $("#includeExternal").prop("checked") as boolean;
            new TeamEquipmentReportGenerator(includeExternal, "魔神器 幻空").generate();
        });
    }

    private bindSearchTeamSpecialEquipmentButton_F() {
        $("#searchTeamSpecialEquipmentButton_F").on("click", () => {
            $(".simulationButton").off("click");
            const includeExternal = $("#includeExternal").prop("checked") as boolean;
            new TeamEquipmentReportGenerator(includeExternal, "真·圣剑 苍白的正义").generate();
        });
    }

    private bindSearchTeamSpecialEquipmentButton_G() {
        $("#searchTeamSpecialEquipmentButton_G").on("click", () => {
            $(".simulationButton").off("click");
            const includeExternal = $("#includeExternal").prop("checked") as boolean;
            new TeamEquipmentReportGenerator(
                includeExternal,
                undefined,
                equipment => {
                    const name = equipment.fullName;
                    for (const armorName of EquipmentConstants.ATTRIBUTE_HEAVY_ARMOR_ITEM_LIST) {
                        if (name.includes(armorName)) {
                            return true;
                        }
                    }
                    return false;
                }).generate();
        });
    }

    private bindSearchTeamSpecialEquipmentButton_H() {
        $("#searchTeamSpecialEquipmentButton_H").on("click", () => {
            $(".simulationButton").off("click");
            const includeExternal = $("#includeExternal").prop("checked") as boolean;
            new TeamEquipmentReportGenerator(includeExternal, "圣皇铠甲 天威").generate();
        });
    }

    private bindSearchTeamSpecialEquipmentButton_I() {
        $("#searchTeamSpecialEquipmentButton_I").on("click", () => {
            $(".simulationButton").off("click");
            const includeExternal = $("#includeExternal").prop("checked") as boolean;
            new TeamEquipmentReportGenerator(includeExternal, "魔盔 虚无").generate();
        });
    }

    private bindSearchTeamSpecialEquipmentButton_J() {
        $("#searchTeamSpecialEquipmentButton_J").on("click", () => {
            $(".simulationButton").off("click");
            const includeExternal = $("#includeExternal").prop("checked") as boolean;
            new TeamEquipmentReportGenerator(includeExternal, "神冠 灵通").generate();
        });
    }

    private bindSearchTeamSpecialEquipmentButton_K() {
        $("#searchTeamSpecialEquipmentButton_K").on("click", () => {
            $(".simulationButton").off("click");
            const includeExternal = $("#includeExternal").prop("checked") as boolean;
            new TeamEquipmentReportGenerator(
                includeExternal,
                undefined,
                equipment => {
                    const name = equipment.fullName;
                    return name === "龙" || name === "齐心★龙";
                }).generate();
        });
    }

    private bindSearchHeavyArmorButtons() {
        $("#searchHeavyArmorButton_A").on("click", () => {
            $(".simulationButton").off("click");
            const includeExternal = $("#includeExternal").prop("checked") as boolean;
            new TeamEquipmentReportGenerator(includeExternal, "千幻碧水猿洛克奇斯").generate();
        });
        $("#searchHeavyArmorButton_B").on("click", () => {
            $(".simulationButton").off("click");
            const includeExternal = $("#includeExternal").prop("checked") as boolean;
            new TeamEquipmentReportGenerator(includeExternal, "地纹玄甲龟斯特奥特斯").generate();
        });
        $("#searchHeavyArmorButton_C").on("click", () => {
            $(".simulationButton").off("click");
            const includeExternal = $("#includeExternal").prop("checked") as boolean;
            new TeamEquipmentReportGenerator(includeExternal, "幽冥黑鳞蟒罗尼科斯").generate();
        });
        $("#searchHeavyArmorButton_D").on("click", () => {
            $(".simulationButton").off("click");
            const includeExternal = $("#includeExternal").prop("checked") as boolean;
            new TeamEquipmentReportGenerator(includeExternal, "火睛混沌兽哈贝达").generate();
        });
        $("#searchHeavyArmorButton_E").on("click", () => {
            $(".simulationButton").off("click");
            const includeExternal = $("#includeExternal").prop("checked") as boolean;
            new TeamEquipmentReportGenerator(includeExternal, "羽翅圣光虎阿基勒斯").generate();
        });
        $("#searchHeavyArmorButton_F").on("click", () => {
            $(".simulationButton").off("click");
            const includeExternal = $("#includeExternal").prop("checked") as boolean;
            new TeamEquipmentReportGenerator(includeExternal, "金翅追日鹰庞塔雷斯").generate();
        });
        $("#searchHeavyArmorButton_G").on("click", () => {
            $(".simulationButton").off("click");
            const includeExternal = $("#includeExternal").prop("checked") as boolean;
            new TeamEquipmentReportGenerator(includeExternal, "风翼三足凤纳托利斯").generate();
        });
    }

    private bindSimulationButton(allPetList: Pet[]) {
        allPetList.forEach(it => {
            const buttonId = "simulate-" + it.index;
            if (!MonsterProfileLoader.load(it.name)) {
                // 宠物已经改名了，不认识了
                $("#" + buttonId).prop("disabled", true);
            } else {
                if (it.level! === 100) {
                    $("#" + buttonId).text("评估");
                }
                this.doPetSimulation(it, buttonId);
            }
        });
    }

    private doPetSimulation(pet: Pet, buttonId: string) {
        $("#" + buttonId).on("click", () => {
            const code = StringUtils.substringBetween(pet.name!, "(", ")");
            const profile = MonsterProfileLoader.load(code)!;

            let html = "";
            html += "<table style='margin:auto;border-width:0;text-align:center;background-color:#888888;width:100%'>";
            html += "<tbody>";
            html += "<tr>";
            html += "<td colspan='11' style='background-color:#F8F0E0'>" + MonsterPageUtils.generateMonsterProfileHtml(code) + "</td>";
            html += "</tr>";
            html += "<tr>";
            html += "<th style='background-color:#F8F0E0'>模拟</th>";
            html += "<th style='background-color:#F8F0E0'>名字</th>";
            html += "<th style='background-color:#F8F0E0'>性别</th>";
            html += "<th style='background-color:#F8F0E0'>等级</th>";
            html += "<th style='background-color:#F8F0E0'>生命</th>";
            html += "<th style='background-color:#F8F0E0'>攻击</th>";
            html += "<th style='background-color:#F8F0E0'>防御</th>";
            html += "<th style='background-color:#F8F0E0'>智力</th>";
            html += "<th style='background-color:#F8F0E0'>精神</th>";
            html += "<th style='background-color:#F8F0E0'>速度</th>";
            html += "<th style='background-color:#F8F0E0'>能力</th>";
            html += "</tr>";

            let totalHealth = 0;
            let totalAttack = 0;
            let totalDefense = 0;
            let totalSpecialAttack = 0;
            let totalSpecialDefense = 0;
            let totalSpeed = 0;
            let totalCapacity = 0;

            let totalAddHealth = 0;
            let totalAddAttack = 0;
            let totalAddDefense = 0;
            let totalAddSpecialAttack = 0;
            let totalAddSpecialDefense = 0;
            let totalAddSpeed = 0;

            html += "<tr>";
            html += "<td style='background-color:#E8E8D0;font-weight:bold'>原始</td>";
            html += "<td style='background-color:#E8E8B0;text-align:left'>" + pet.nameHtml + "</td>";
            html += "<td style='background-color:#E8E8D0'>" + pet.gender + "</td>";
            html += "<td style='background-color:#E8E8B0'>" + pet.levelHtml + "</td>";
            html += "<td style='background-color:#E8E8D0'>" + pet.maxHealth + "</td>";
            html += "<td style='background-color:#E8E8B0'>" + pet.attackHtml + "</td>";
            html += "<td style='background-color:#E8E8D0'>" + pet.defenseHtml + "</td>";
            html += "<td style='background-color:#E8E8B0'>" + pet.specialAttackHtml + "</td>";
            html += "<td style='background-color:#E8E8D0'>" + pet.specialDefenseHtml + "</td>";
            html += "<td style='background-color:#E8E8B0'>" + pet.speedHtml + "</td>";
            html += "<td style='background-color:#E8E8D0;font-weight:bold;color:red'>" + pet.capacity + "</td>";
            html += "</tr>";

            if (pet.level! < 100) {
                for (let i = 0; i < 10; i++) {
                    let p = _.clone(pet);

                    const delta = 100 - p.level!;
                    for (let j = 0; j < delta; j++) {
                        p.level = p.level! + 1;

                        // health
                        let max = 20 + (profile.healthEffort! * 10);
                        let add = _.random(0, max);
                        totalAddHealth += add;
                        p.maxHealth = p.maxHealth! + add;
                        // attack
                        max = profile.attackEffort! + 1;
                        add = _.random(0, max);
                        p.attack = p.attack! + add;
                        totalAddAttack += add;
                        // defense
                        max = profile.defenseEffort! + 1;
                        add = _.random(0, max);
                        p.defense = p.defense! + add;
                        totalAddDefense += add;
                        // special attack
                        max = profile.specialAttackEffort! + 1;
                        add = _.random(0, max);
                        p.specialAttack = p.specialAttack! + add;
                        totalAddSpecialAttack += add;
                        // special defense
                        max = profile.specialDefenseEffort! + 1;
                        add = _.random(0, max);
                        p.specialDefense = p.specialDefense! + add;
                        totalAddSpecialDefense += add;
                        // speed
                        max = profile.speedEffort! + 1;
                        add = _.random(0, max);
                        p.speed = p.speed! + add;
                        totalAddSpeed += add;
                    }

                    html += "<tr>";
                    html += "<td style='background-color:#E8E8D0;font-weight:bold'>#" + (i + 1) + "</td>";
                    html += "<td style='background-color:#E8E8B0;text-align:left'>" + p.nameHtml + "</td>";
                    html += "<td style='background-color:#E8E8D0'>" + p.gender + "</td>";
                    html += "<td style='background-color:#E8E8B0'>" + p.levelHtml + "</td>";
                    html += "<td style='background-color:#E8E8D0'>" + p.maxHealth + "</td>";
                    html += "<td style='background-color:#E8E8B0'>" + p.attackHtml + "</td>";
                    html += "<td style='background-color:#E8E8D0'>" + p.defenseHtml + "</td>";
                    html += "<td style='background-color:#E8E8B0'>" + p.specialAttackHtml + "</td>";
                    html += "<td style='background-color:#E8E8D0'>" + p.specialDefenseHtml + "</td>";
                    html += "<td style='background-color:#E8E8B0'>" + p.speedHtml + "</td>";
                    html += "<td style='background-color:#E8E8D0;font-weight:bold;color:red'>" + p.capacity + "</td>";
                    html += "</tr>";

                    totalHealth += p.maxHealth!;
                    totalAttack += p.attack!;
                    totalDefense += p.defense!;
                    totalSpecialAttack += p.specialAttack!;
                    totalSpecialDefense += p.specialDefense!;
                    totalSpeed += p.speed!;
                    totalCapacity += p.capacity;
                }
            } else {
                totalHealth = pet.maxHealth! * 10;
                totalAttack = pet.attack! * 10;
                totalDefense = pet.defense! * 10;
                totalSpecialAttack = pet.specialAttack! * 10;
                totalSpecialDefense = pet.specialDefense! * 10;
                totalSpeed = pet.speed! * 10;
                totalCapacity = pet.capacity! * 10;
            }

            const a0 = Math.ceil(totalHealth / 10);
            const a1 = Math.ceil(totalAttack / 10);
            const a2 = Math.ceil(totalDefense / 10);
            const a3 = Math.ceil(totalSpecialAttack / 10);
            const a4 = Math.ceil(totalSpecialDefense / 10);
            const a5 = Math.ceil(totalSpeed / 10);
            const a6 = Math.ceil(totalCapacity / 10);

            if (pet.level! < 100) {
                html += "<tr>";
                html += "<td style='background-color:#E8E8D0;font-weight:bold' colspan='4'>平均结果</td>";
                html += "<td style='background-color:#E8E8D0'>" + a0 + "</td>";
                html += "<td style='background-color:#E8E8B0'>" + a1 + "</td>";
                html += "<td style='background-color:#E8E8D0'>" + a2 + "</td>";
                html += "<td style='background-color:#E8E8B0'>" + a3 + "</td>";
                html += "<td style='background-color:#E8E8D0'>" + a4 + "</td>";
                html += "<td style='background-color:#E8E8B0'>" + a5 + "</td>";
                html += "<td style='background-color:#E8E8D0;font-weight:bold;color:red'>" + a6 + "</td>";
                html += "</tr>";
                html += "<tr>";
                html += "<td style='background-color:#E8E8D0;font-weight:bold' colspan='4'>成长结果</td>";
                html += "<td style='background-color:#E8E8D0'>" + (Math.ceil(totalHealth / 10) - pet.maxHealth!) + "</td>";
                html += "<td style='background-color:#E8E8B0'>" + (Math.ceil(totalAttack / 10) - pet.attack!) + "</td>";
                html += "<td style='background-color:#E8E8D0'>" + (Math.ceil(totalDefense / 10) - pet.defense!) + "</td>";
                html += "<td style='background-color:#E8E8B0'>" + (Math.ceil(totalSpecialAttack / 10) - pet.specialAttack!) + "</td>";
                html += "<td style='background-color:#E8E8D0'>" + (Math.ceil(totalSpecialDefense / 10) - pet.specialDefense!) + "</td>";
                html += "<td style='background-color:#E8E8B0'>" + (Math.ceil(totalSpeed / 10) - pet.speed!) + "</td>";
                html += "<td style='background-color:#E8E8D0;font-weight:bold;color:red'>" + (Math.ceil(totalCapacity / 10) - pet.capacity) + "</td>";
                html += "</tr>";
                html += "<tr>";
                html += "<td style='background-color:#E8E8D0;font-weight:bold' colspan='4'>平均成长</td>";
                html += "<td style='background-color:#E8E8D0'>" + (totalAddHealth / (10 * (100 - pet.level!))).toFixed(2) + "</td>";
                html += "<td style='background-color:#E8E8B0'>" + (totalAddAttack / (10 * (100 - pet.level!))).toFixed(2) + "</td>";
                html += "<td style='background-color:#E8E8D0'>" + (totalAddDefense / (10 * (100 - pet.level!))).toFixed(2) + "</td>";
                html += "<td style='background-color:#E8E8B0'>" + (totalAddSpecialAttack / (10 * (100 - pet.level!))).toFixed(2) + "</td>";
                html += "<td style='background-color:#E8E8D0'>" + (totalAddSpecialDefense / (10 * (100 - pet.level!))).toFixed(2) + "</td>";
                html += "<td style='background-color:#E8E8B0'>" + (totalAddSpeed / (10 * (100 - pet.level!))).toFixed(2) + "</td>";
                html += "<td style='background-color:#E8E8D0;font-weight:bold;color:red'></td>";
                html += "</tr>";
            }
            html += "<tr>";
            html += "<td style='background-color:#E8E8D0;font-weight:bold' colspan='4'>顶级能力</td>";
            html += "<td style='background-color:#E8E8D0;font-weight:bold;color:blue'>" + (profile.perfectHealth) + "</td>";
            html += "<td style='background-color:#E8E8B0;font-weight:bold;color:blue'>" + (profile.perfectAttack) + "</td>";
            html += "<td style='background-color:#E8E8D0;font-weight:bold;color:blue'>" + (profile.perfectDefense) + "</td>";
            html += "<td style='background-color:#E8E8B0;font-weight:bold;color:blue'>" + (profile.perfectSpecialAttack) + "</td>";
            html += "<td style='background-color:#E8E8D0;font-weight:bold;color:blue'>" + (profile.perfectSpecialDefense) + "</td>";
            html += "<td style='background-color:#E8E8B0;font-weight:bold;color:blue'>" + (profile.perfectSpeed) + "</td>";
            html += "<td style='background-color:#E8E8D0;font-weight:bold;color:red'>" + (profile.perfectCapacity) + "</td>";
            html += "</tr>";

            const d0 = (Math.min(1, a0 / (profile.perfectHealth)) * 100);
            const d1 = (Math.min(1, a1 / (profile.perfectAttack)) * 100);
            const d2 = (Math.min(1, a2 / (profile.perfectDefense)) * 100);
            const d3 = (Math.min(1, a3 / (profile.perfectSpecialAttack)) * 100);
            const d4 = (Math.min(1, a4 / (profile.perfectSpecialDefense)) * 100);
            const d5 = (Math.min(1, a5 / (profile.perfectSpeed)) * 100);
            const d6 = (Math.min(1, a6 / (profile.perfectCapacity)) * 100);

            html += "<tr>";
            html += "<td style='background-color:#E8E8D0;font-weight:bold' colspan='4'>能力差距</td>";
            html += "<td style='background-color:#E8E8D0'>" + PageUtils.generateProgressBarHTML(d0 / 100) + d0.toFixed(2) + "%</td>";
            html += "<td style='background-color:#E8E8B0'>" + PageUtils.generateProgressBarHTML(d1 / 100) + d1.toFixed(2) + "%</td>";
            html += "<td style='background-color:#E8E8D0'>" + PageUtils.generateProgressBarHTML(d2 / 100) + d2.toFixed(2) + "%</td>";
            html += "<td style='background-color:#E8E8B0'>" + PageUtils.generateProgressBarHTML(d3 / 100) + d3.toFixed(2) + "%</td>";
            html += "<td style='background-color:#E8E8D0'>" + PageUtils.generateProgressBarHTML(d4 / 100) + d4.toFixed(2) + "%</td>";
            html += "<td style='background-color:#E8E8B0'>" + PageUtils.generateProgressBarHTML(d5 / 100) + d5.toFixed(2) + "%</td>";
            html += "<td style='background-color:#E8E8D0;font-weight:bold;color:red'>" + PageUtils.generateProgressBarHTML(d6 / 100) + d6.toFixed(2) + "%</td>";
            html += "</tr>";

            html += "</tbody>";
            html += "</table>";

            $("#simulation").html(html).parent().show();

            $("#petProfile-" + profile.code)
                .css("background-color", "#888888")
                .find("tbody:first")
                .css("background-color", "#F8F0E0");

            PageUtils.scrollIntoView("simulation");
        });
    }
}

export {PersonalTeamPageProcessor};