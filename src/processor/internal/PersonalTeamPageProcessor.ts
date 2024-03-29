import _ from "lodash";
import BankRecordReportGenerator from "../../core/bank/BankRecordReportGenerator";
import LocalSettingManager from "../../core/config/LocalSettingManager";
import EquipmentConstants from "../../core/equipment/EquipmentConstants";
import TeamEquipmentReportGenerator from "../../core/equipment/TeamEquipmentReportGenerator";
import MonsterPageUtils from "../../core/monster/MonsterPageUtils";
import MonsterProfileLoader from "../../core/monster/MonsterProfileLoader";
import Pet from "../../core/monster/Pet";
import RolePetStatusStorage from "../../core/monster/RolePetStatusStorage";
import NpcLoader from "../../core/role/NpcLoader";
import TeamMemberLoader from "../../core/team/TeamMemberLoader";
import Credential from "../../util/Credential";
import KeyboardShortcutBuilder from "../../util/KeyboardShortcutBuilder";
import MessageBoard from "../../util/MessageBoard";
import PageUtils from "../../util/PageUtils";
import StringUtils from "../../util/StringUtils";
import PageProcessorContext from "../PageProcessorContext";
import PageProcessorCredentialSupport from "../PageProcessorCredentialSupport";

abstract class PersonalTeamPageProcessor extends PageProcessorCredentialSupport {

    async doProcess(credential: Credential, context?: PageProcessorContext): Promise<void> {
        $("table[height='100%']").removeAttr("height");
        $("form[action='status.cgi']").remove();

        $("td:first")
            .attr("id", "pageTitle")
            .removeAttr("width")
            .removeAttr("height")
            .removeAttr("bgcolor")
            .css("text-align", "center")
            .css("font-size", "150%")
            .css("font-weight", "bold")
            .css("background-color", "navy")
            .css("color", "yellowgreen")
            .text("＜＜  团 队 面 板  ＞＞");

        $("table:first")
            .find("tbody:first")
            .find("> tr:eq(2)")
            .find("td:first")
            .attr("id", "messageBoardContainer")
            .html("");
        const imageHtml = NpcLoader.randomNpcImageHtml();
        MessageBoard.createMessageBoardStyleB("messageBoardContainer", imageHtml);
        $("#messageBoard")
            .css("background-color", "black")
            .css("color", "white")
            .html(this.#welcomeMessageHtml());

        let html = "";
        html += "<tr style='display:none'>";
        html += "<td id='hidden-1'></td>";
        html += "</tr>";
        html += "<tr style='display:none'>";
        html += "<td id='hidden-2'></td>";
        html += "</tr>";
        html += "<tr style='display:none'>";
        html += "<td id='hidden-3'></td>";
        html += "</tr>";
        html += "<tr>";
        html += "<td id='menu' style='background-color:#F8F0E0;text-align:center'>";
        html += "<table style='background-color:transparent;margin:auto;border-spacing:0;border-width:0'>";
        html += "<tbody>";
        html += "<tr>";
        html += "<td style='text-align:center'>";
        html += "<input type='checkbox' id='includeExternal'>是否包含编外队员";
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
        html += "<input type='button' id='searchTeamNonFullExperienceEquipmentButton' value='经验未满装备'>";
        html += "<input type='button' id='searchTeamUsingEquipmentButton' value='使用中的装备'>";
        html += "<input type='button' id='searchTeamStarEquipmentButton' value='有齐心的装备'>";
        html += "<input type='button' id='searchTeamPowerGemButton' value='威力宝石库存'>";
        html += "</td>";
        html += "</tr>";
        html += "</tbody>";
        html += "</table>";
        html += "</td>";
        html += "</tr>";
        html += "<tr style='display:none'>";
        html += "<td id='information' style='background-color:#F8F0E0;width:100%'></td>";
        html += "</tr>";
        $("#messageBoardContainer")
            .parent()
            .after($(html));

        html = "";
        html += "<tr>";
        html += "<td style='background-color:#F8F0E0;text-align:center'>";
        html += "<table style='background-color:transparent;margin:auto;border-spacing:0;border-width:0'>";
        html += "<tbody>";
        html += "<tr>";
        html += "<td>";
        html += "<button role='button' id='refreshButton'>刷新团队面板</button>";
        html += "</td>";
        html += "<td>";
        html += "<button role='button' id='returnButton'>离开团队面板</button>";
        html += "</td>";
        html += "</tr>";
        html += "</tbody>";
        html += "</table>";
        html += "</td>";
        html += "</tr>";
        $("#information")
            .parent()
            .next().hide()
            .after($(html));

        $("#messageBoardManager").on("click", () => {
            $("#information")
                .parent()
                .next()
                .toggle();
        });

        if (LocalSettingManager.isIncludeExternal()) {
            $("#includeExternal").prop("checked", true);
        }
        $("#includeExternal").on("change", event => {
            const checked = $(event.target).prop("checked") as boolean;
            LocalSettingManager.setIncludeExternal(checked);
        });

        this.#bindRefreshButton();
        this.bindReturnButton(credential);
        this.#bindListEquipmentButton();
        this.#bindListPetButton();
        this.#bindBankRecordButton();
        this.#bindSearchTeamEquipmentButton();
        this.#bindSearchTeamPetButton();
        this.#bindSearchTeamNonFullExperienceEquipmentButton();
        this.#bindSearchTeamUsingEquipmentButton();
        this.#bindSearchTeamStarEquipmentButton();
        this.#bindSearchTeamPowerGemButton();
        this.#bindSearchTeamSpecialEquipmentButton_A();
        this.#bindSearchTeamSpecialEquipmentButton_B();
        this.#bindSearchTeamSpecialEquipmentButton_C();
        this.#bindSearchTeamSpecialEquipmentButton_D();
        this.#bindSearchTeamSpecialEquipmentButton_E();
        this.#bindSearchTeamSpecialEquipmentButton_F();
        this.#bindSearchTeamSpecialEquipmentButton_G();
        this.#bindSearchTeamSpecialEquipmentButton_H();
        this.#bindSearchTeamSpecialEquipmentButton_I();
        this.#bindSearchTeamSpecialEquipmentButton_J();
        this.#bindSearchTeamSpecialEquipmentButton_K();

        KeyboardShortcutBuilder.newInstance()
            .onEscapePressed(() => $("#returnButton").trigger("click"))
            .withDefaultPredicate()
            .bind();
    }

    #welcomeMessageHtml() {
        return "<b style='font-size:120%;color:wheat'>什么是团队？在我看来，共同配置在快速登陆里面的才能称为团队。</b><br>" +
            "<b style='font-size:120%;color:yellow'>什么，你是想要修改战斗台词？单击我的头像即可。</b>";
    }

    #bindRefreshButton() {
        $("#refreshButton").on("click", () => {
            PageUtils.scrollIntoView("pageTitle");
            const imageHtml = NpcLoader.randomNpcImageHtml();
            $("#messageBoardManager").html(imageHtml);
            $("#messageBoard").html(this.#welcomeMessageHtml());
            $("#information").html("").parent().hide();
            $(".simulationButton").off("click");
        });
    }

    abstract bindReturnButton(credential: Credential): void;

    #bindListEquipmentButton() {
        $("#listEquipmentButton").on("click", () => {
            $(".simulationButton").off("click");
            const includeExternal = $("#includeExternal").prop("checked") as boolean;
            new TeamEquipmentReportGenerator(includeExternal).generate();
        });
    }

    #bindListPetButton() {
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
            RolePetStatusStorage.getInstance()
                .loads(idList)
                .then(dataMap => {
                    const allPetList: Pet[] = [];
                    let petIndex = 0;

                    for (const config of configs) {
                        const data = dataMap.get(config.id!);
                        if (data === undefined) {
                            continue;
                        }

                        const pets: string[] = JSON.parse(data.json!);
                        let html = "";
                        let row = 0;

                        const petList = pets.map(it => Pet.parse(it))
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
                    this.#bindSimulationButton(allPetList);

                    $("#information").parent().show();
                });


        });
    }

    #bindBankRecordButton() {
        $("#bankRecordButton").on("click", () => {
            $(".simulationButton").off("click");

            const includeExternal = $("#includeExternal").prop("checked") as boolean;

            new BankRecordReportGenerator().generate(includeExternal);
        });
    }

    #bindSearchTeamEquipmentButton() {
        $("#searchTeamEquipmentButton").on("click", () => {
            $(".simulationButton").off("click");
            const includeExternal = $("#includeExternal").prop("checked") as boolean;
            const s = $("#searchName").val();
            let searchName = "";
            if (s) searchName = s as string;
            new TeamEquipmentReportGenerator(includeExternal, searchName).generate();
        });
    }

    #bindSearchTeamPetButton() {
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
            RolePetStatusStorage.getInstance()
                .loads(idList)
                .then(dataMap => {
                    const allPetList: Pet[] = [];
                    let petIndex = 0;

                    for (const config of configs) {
                        const data = dataMap.get(config.id!);
                        if (data === undefined) {
                            continue;
                        }

                        const pets: string[] = JSON.parse(data.json!);
                        let html = "";
                        let row = 0;
                        const petList = pets.map(it => Pet.parse(it))
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
                    this.#bindSimulationButton(allPetList);

                    $("#information").parent().show();
                });
        });
    }

    #bindSearchTeamNonFullExperienceEquipmentButton() {
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

    #bindSearchTeamUsingEquipmentButton() {
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

    #bindSearchTeamStarEquipmentButton() {
        $("#searchTeamStarEquipmentButton").on("click", () => {
            $(".simulationButton").off("click");
            const includeExternal = $("#includeExternal").prop("checked") as boolean;
            new TeamEquipmentReportGenerator(includeExternal, "齐心★").generate();
        });
    }

    #bindSearchTeamPowerGemButton() {
        $("#searchTeamPowerGemButton").on("click", () => {
            $(".simulationButton").off("click");
            const includeExternal = $("#includeExternal").prop("checked") as boolean;
            new TeamEquipmentReportGenerator(includeExternal, "威力宝石").generate();
        });
    }

    #bindSearchTeamSpecialEquipmentButton_A() {
        $("#searchTeamSpecialEquipmentButton_A").on("click", () => {
            $(".simulationButton").off("click");
            const includeExternal = $("#includeExternal").prop("checked") as boolean;
            new TeamEquipmentReportGenerator(includeExternal, "神枪 永恒").generate();
        });
    }

    #bindSearchTeamSpecialEquipmentButton_B() {
        $("#searchTeamSpecialEquipmentButton_B").on("click", () => {
            $(".simulationButton").off("click");
            const includeExternal = $("#includeExternal").prop("checked") as boolean;
            new TeamEquipmentReportGenerator(includeExternal, "霸邪斧 天煌").generate();
        });
    }

    #bindSearchTeamSpecialEquipmentButton_C() {
        $("#searchTeamSpecialEquipmentButton_C").on("click", () => {
            $(".simulationButton").off("click");
            const includeExternal = $("#includeExternal").prop("checked") as boolean;
            new TeamEquipmentReportGenerator(includeExternal, "神器 苍穹").generate();
        });
    }

    #bindSearchTeamSpecialEquipmentButton_D() {
        $("#searchTeamSpecialEquipmentButton_D").on("click", () => {
            $(".simulationButton").off("click");
            const includeExternal = $("#includeExternal").prop("checked") as boolean;
            new TeamEquipmentReportGenerator(includeExternal, "魔刀 哭杀").generate();
        });
    }

    #bindSearchTeamSpecialEquipmentButton_E() {
        $("#searchTeamSpecialEquipmentButton_E").on("click", () => {
            $(".simulationButton").off("click");
            const includeExternal = $("#includeExternal").prop("checked") as boolean;
            new TeamEquipmentReportGenerator(includeExternal, "魔神器 幻空").generate();
        });
    }

    #bindSearchTeamSpecialEquipmentButton_F() {
        $("#searchTeamSpecialEquipmentButton_F").on("click", () => {
            $(".simulationButton").off("click");
            const includeExternal = $("#includeExternal").prop("checked") as boolean;
            new TeamEquipmentReportGenerator(includeExternal, "真·圣剑 苍白的正义").generate();
        });
    }

    #bindSearchTeamSpecialEquipmentButton_G() {
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

    #bindSearchTeamSpecialEquipmentButton_H() {
        $("#searchTeamSpecialEquipmentButton_H").on("click", () => {
            $(".simulationButton").off("click");
            const includeExternal = $("#includeExternal").prop("checked") as boolean;
            new TeamEquipmentReportGenerator(includeExternal, "圣皇铠甲 天威").generate();
        });
    }

    #bindSearchTeamSpecialEquipmentButton_I() {
        $("#searchTeamSpecialEquipmentButton_I").on("click", () => {
            $(".simulationButton").off("click");
            const includeExternal = $("#includeExternal").prop("checked") as boolean;
            new TeamEquipmentReportGenerator(includeExternal, "魔盔 虚无").generate();
        });
    }

    #bindSearchTeamSpecialEquipmentButton_J() {
        $("#searchTeamSpecialEquipmentButton_J").on("click", () => {
            $(".simulationButton").off("click");
            const includeExternal = $("#includeExternal").prop("checked") as boolean;
            new TeamEquipmentReportGenerator(includeExternal, "神冠 灵通").generate();
        });
    }

    #bindSearchTeamSpecialEquipmentButton_K() {
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


    #bindSimulationButton(allPetList: Pet[]) {
        allPetList.forEach(it => {
            const buttonId = "simulate-" + it.index;
            if (!MonsterProfileLoader.load(it.name)) {
                // 宠物已经改名了，不认识了
                $("#" + buttonId).prop("disabled", true);
            } else {
                if (it.level! === 100) {
                    $("#" + buttonId).text("评估");
                }
                this.#doPetSimulation(it, buttonId);
            }
        });
    }

    #doPetSimulation(pet: Pet, buttonId: string) {
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


export = PersonalTeamPageProcessor;