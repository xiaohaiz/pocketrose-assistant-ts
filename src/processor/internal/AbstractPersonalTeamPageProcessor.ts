import _ from "lodash";
import Equipment from "../../common/Equipment";
import Pet from "../../common/Pet";
import EquipmentLocalStorage from "../../core/EquipmentLocalStorage";
import FastLoginManager from "../../core/FastLoginManager";
import NpcLoader from "../../core/NpcLoader";
import PetLocalStorage from "../../core/PetLocalStorage";
import PetProfileLoader from "../../core/PetProfileLoader";
import Pokemon from "../../core/Pokemon";
import Credential from "../../util/Credential";
import MessageBoard from "../../util/MessageBoard";
import PageUtils from "../../util/PageUtils";
import StorageUtils from "../../util/StorageUtils";
import StringUtils from "../../util/StringUtils";
import PageProcessorContext from "../PageProcessorContext";
import PageProcessorCredentialSupport from "../PageProcessorCredentialSupport";

abstract class AbstractPersonalTeamPageProcessor extends PageProcessorCredentialSupport {

    doProcess(credential: Credential, context?: PageProcessorContext) {
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
        html += "<td>";
        html += "<button role='button' id='updateEquipmentButton'>更新装备数据</button>";
        html += "</td>";
        html += "<td>";
        html += "<button role='button' id='updatePetButton'>更新宠物数据</button>";
        html += "</td>";
        html += "<td>";
        html += "<button role='button' id='listEquipmentButton'>团队装备列表</button>";
        html += "</td>";
        html += "<td>";
        html += "<button role='button' id='listPetButton'>团队宠物列表</button>";
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

        this.#bindRefreshButton();
        this.bindReturnButton(credential);
        this.#bindUpdateEquipmentButton(credential);
        this.#bindUpdatePetButton(credential);
        this.#bindListEquipmentButton();
        this.#bindListPetButton();
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

    #bindUpdateEquipmentButton(credential: Credential) {
        $("#updateEquipmentButton").on("click", () => {
            $("button").prop("disabled", true);
            $("input").prop("disabled", true);
            MessageBoard.publishMessage("开始更新装备数据......");
            new EquipmentLocalStorage(credential).updateEquipmentStatus().then(() => {
                MessageBoard.publishMessage("装备数据更新完成。");
                $("button").prop("disabled", false);
                $("input").prop("disabled", false);
            });
        });
    }

    #bindUpdatePetButton(credential: Credential) {
        $("#updatePetButton").on("click", () => {
            $("button").prop("disabled", true);
            $("input").prop("disabled", true);
            MessageBoard.publishMessage("开始更新宠物数据......");
            const petLocalStorage = new PetLocalStorage(credential);
            petLocalStorage.updatePetMap().then(() => {
                petLocalStorage.updatePetStatus().then(() => {
                    MessageBoard.publishMessage("宠物数据更新完成。");
                    $("button").prop("disabled", false);
                    $("input").prop("disabled", false);
                });
            });
        });
    }

    #bindListEquipmentButton() {
        $("#listEquipmentButton").on("click", () => {
            $(".simulationButton").off("click");

            let html = "";
            html += "<table style='margin:auto;border-width:0;text-align:center;background-color:#888888;width:100%'>";
            html += "<tbody id='equipmentStatusList'>";
            html += "<tr>";
            html += "<th style='background-color:#F8F0E0'>队员</th>";
            html += "<th style='background-color:#F8F0E0'>名字</th>";
            html += "<th style='background-color:#F8F0E0'>种类</th>";
            html += "<th style='background-color:#F8F0E0'>效果</th>";
            html += "<th style='background-color:#F8F0E0'>重量</th>";
            html += "<th style='background-color:#F8F0E0'>耐久</th>";
            html += "<th style='background-color:#F8F0E0'>威＋</th>";
            html += "<th style='background-color:#F8F0E0'>重＋</th>";
            html += "<th style='background-color:#F8F0E0'>幸＋</th>";
            html += "<th style='background-color:#F8F0E0'>经验</th>";
            html += "<th style='background-color:#F8F0E0'>位置</th>";
            html += "</tr>";
            html += "</tbody>";
            html += "</table>";
            $("#information").html(html).parent().hide();

            const configs = FastLoginManager.getAllFastLogins();
            for (const config of configs) {
                const key = "_es_" + config.id;
                const value = StorageUtils.get(key);
                if (value === null || value === "") {
                    continue;
                }
                const equipments = _.split(value, "$$");

                let html = "";
                let row = 0;

                equipments
                    .map(it => Equipment.parse(it))
                    .sort(Equipment.sorter)
                    .forEach(it => {
                        html += "<tr>";
                        if (row === 0) {
                            html += "<td style='background-color:#F8F0E0;vertical-align:center' rowspan='" + (equipments.length) + "'>" + config.name + "</td>";
                        }
                        html += "<td style='background-color:#E8E8D0;text-align:left'>" + it.fullName + "</td>";
                        html += "<td style='background-color:#E8E8B0'>" + it.category + "</td>";
                        html += "<td style='background-color:#E8E8D0'>" + it.power + "</td>";
                        html += "<td style='background-color:#E8E8B0'>" + it.weight + "</td>";
                        html += "<td style='background-color:#E8E8D0'>" + it.endure + "</td>";
                        html += "<td style='background-color:#E8E8B0'>" + it.additionalPowerHtml + "</td>";
                        html += "<td style='background-color:#E8E8D0'>" + it.additionalWeightHtml + "</td>";
                        html += "<td style='background-color:#E8E8B0'>" + it.additionalLuckHtml + "</td>";
                        html += "<td style='background-color:#E8E8D0'>" + it.experienceHTML + "</td>";
                        html += "<td style='background-color:#E8E8B0'>" + it.location + "</td>";
                        html += "</tr>";
                        row++;
                    });

                $("#equipmentStatusList").append($(html));
            }
            $("#information").parent().show();
        });
    }

    #bindListPetButton() {
        $("#listPetButton").on("click", () => {
            $(".simulationButton").off("click");

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

            const allPetList: Pet[] = [];
            let petIndex = 0;

            const configs = FastLoginManager.getAllFastLogins();
            for (const config of configs) {
                const key = "_ps_" + config.id;
                const value = StorageUtils.get(key);
                if (value === null || value === "") {
                    continue;
                }
                const pets = _.split(value, "$$");
                let html = "";
                let row = 0;
                pets
                    .map(it => Pet.parse(it))
                    .sort(Pet.sorter)
                    .forEach(it => {
                        it.index = petIndex++;
                        allPetList.push(it);

                        html += "<tr>";
                        if (row === 0) {
                            html += "<td style='background-color:#F8F0E0;vertical-align:center' rowspan='" + (pets.length) + "'>" + config.name + "</td>";
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
    }

    #bindSimulationButton(allPetList: Pet[]) {
        allPetList.forEach(it => {
            const buttonId = "simulate-" + it.index;
            if (it.level! === 100) {
                // 宠物已经满级了
                $("#" + buttonId).prop("disabled", true);
            } else {
                if (!Pokemon.isInitialPetName(it.name)) {
                    // 宠物已经改名了，不认识了
                    $("#" + buttonId).prop("disabled", true);
                } else {
                    this.#doPetSimulation(it, buttonId);
                }
            }
        });
    }

    #doPetSimulation(pet: Pet, buttonId: string) {
        $("#" + buttonId).on("click", () => {
            const code = StringUtils.substringBetween(pet.name!, "(", ")");
            const profile = PetProfileLoader.load(code)!;

            let html = "";
            html += "<table style='margin:auto;border-width:0;text-align:center;background-color:#888888;width:100%'>";
            html += "<tbody>";
            html += "<tr>";
            html += "<td colspan='11' style='background-color:#F8F0E0'>" + PetProfileLoader.generatePetProfileHtml(code) + "</td>";
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

            html += "<tr>";
            html += "<td style='background-color:#E8E8D0;font-weight:bold' colspan='4'>平均结果</td>";
            html += "<td style='background-color:#E8E8D0'>" + Math.ceil(totalHealth / 10) + "</td>";
            html += "<td style='background-color:#E8E8B0'>" + Math.ceil(totalAttack / 10) + "</td>";
            html += "<td style='background-color:#E8E8D0'>" + Math.ceil(totalDefense / 10) + "</td>";
            html += "<td style='background-color:#E8E8B0'>" + Math.ceil(totalSpecialAttack / 10) + "</td>";
            html += "<td style='background-color:#E8E8D0'>" + Math.ceil(totalSpecialDefense / 10) + "</td>";
            html += "<td style='background-color:#E8E8B0'>" + Math.ceil(totalSpeed / 10) + "</td>";
            html += "<td style='background-color:#E8E8D0;font-weight:bold;color:red'>" + Math.ceil(totalCapacity / 10) + "</td>";
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


export = AbstractPersonalTeamPageProcessor;