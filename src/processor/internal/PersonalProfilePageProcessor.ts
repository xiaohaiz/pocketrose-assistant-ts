import NpcLoader from "../../core/role/NpcLoader";
import Role from "../../core/role/Role";
import PersonalEquipmentManagement from "../../pocketrose/PersonalEquipmentManagement";
import PersonalMirror from "../../pocketrose/PersonalMirror";
import PersonalPetManagement from "../../pocketrose/PersonalPetManagement";
import PersonalSpell from "../../pocketrose/PersonalSpell";
import PersonalStatus from "../../pocketrose/PersonalStatus";
import Credential from "../../util/Credential";
import MessageBoard from "../../util/MessageBoard";
import PageUtils from "../../util/PageUtils";
import StringUtils from "../../util/StringUtils";
import PageProcessorContext from "../PageProcessorContext";
import PageProcessorCredentialSupport from "../PageProcessorCredentialSupport";

abstract class PersonalProfilePageProcessor extends PageProcessorCredentialSupport {

    doProcess(credential: Credential, context?: PageProcessorContext) {
        // 删除老页面的所有元素
        $("center:first").html("").hide();

        // 老页面没有什么有价值的数据，直接渲染新页面
        this.#renderImmutablePage(credential, context);

        // 渲染动态页面
        this.#renderPersonalStatus(credential, context);
        this.#renderEquipmentStatus(credential, context);
        this.#renderPetStatus(credential, context);
        this.#renderMirrorStatus(credential, context);
    }

    #renderImmutablePage(credential: Credential, context?: PageProcessorContext) {
        let html = "";
        html += "<table style='width:100%;border-width:0;background-color:#888888'>";
        html += "<tbody>";
        html += "<tr>";
        html += "<td id='pageTitleCell'></td>"
        html += "</tr>";
        html += "<tr>";
        html += "<td id='messageBoardCell'></td>"
        html += "</tr>";
        html += "<tr style='display:none'>";
        html += "<td id='hiddenCell-1'></td>"       // 预留给返回城市/城堡功能
        html += "</tr>";
        html += "<tr style='display:none'>";
        html += "<td id='hiddenCell-2'></td>";      // 跳转到装备管理
        html += "</tr>";
        html += "<tr style='display:none'>";
        html += "<td id='hiddenCell-3'></td>";      // 跳转到宠物管理
        html += "</tr>";
        html += "<tr style='display:none'>";
        html += "<td id='hiddenCell-4'></td>";      // 跳转到职业管理
        html += "</tr>";
        html += "<tr style='display:none'>";
        html += "<td id='hiddenCell-5'></td>";
        html += "</tr>";
        html += "<tr>";
        html += "<td id='personalStatus'></td>";
        html += "</tr>";
        html += "<tr>";
        html += "<td id='spellStatus'></td>";
        html += "</tr>";
        html += "<tr>";
        html += "<td id='equipmentStatus'></td>";
        html += "</tr>";
        html += "<tr>";
        html += "<td id='petStatus'></td>";
        html += "</tr>";
        html += "<tr>";
        html += "<td id='mirrorStatus'></td>";
        html += "</tr>";
        html += "<tr>";
        html += "<td id='menuCell' style='background-color:#F8F0E0;text-align:center'>";
        html += "<button role='button' id='reloadButton'>刷新个人面板</button>&nbsp;&nbsp;&nbsp;";
        html += "<button role='button' id='returnButton'>返回</button>&nbsp;&nbsp;&nbsp;";
        html += "<button role='button' id='equipmentManagementButton'>进入装备管理</button>&nbsp;&nbsp;&nbsp;";
        html += "<button role='button' id='petManagementButton'>进入宠物管理</button>&nbsp;&nbsp;&nbsp;";
        html += "<button role='button' id='careerManagementButton'>进入职业管理</button>";
        html += "</td>";
        html += "</tr>";
        html += "</tbody>";
        html += "</table>";

        $("center:first").after($(html));

        $("#pageTitleCell")
            .css("text-align", "center")
            .css("font-size", "180%")
            .css("font-weight", "bold")
            .css("background-color", "navy")
            .css("color", "yellowgreen")
            .text("＜＜  个 人 面 板  ＞＞");

        MessageBoard.createMessageBoardStyleB("messageBoardCell", NpcLoader.randomNpcImageHtml());
        $("#messageBoard")
            .css("background-color", "black")
            .css("color", "wheat")
            .html(this.#welcomeMessageHtml());

        $("#reloadButton").on("click", () => {
            PageUtils.scrollIntoView("pageTitleCell");
            $("#messageBoardManager").html(NpcLoader.randomNpcImageHtml());
            $("#messageBoard").html(this.#welcomeMessageHtml());
            this.#reload(credential, context);
        });

        this.doBindReturnButton(credential, context);

        $("#hiddenCell-2").html(PageUtils.generateEquipmentManagementForm(credential));
        $("#equipmentManagementButton").on("click", () => {
            $("#openEquipmentManagement").trigger("click");
        });

        $("#hiddenCell-3").html(PageUtils.generatePetManagementForm(credential));
        $("#petManagementButton").on("click", () => {
            $("#openPetManagement").trigger("click");
        });

        $("#hiddenCell-4").html(PageUtils.generateCareerManagementForm(credential));
        $("#careerManagementButton").on("click", () => {
            $("#openCareerManagement").trigger("click");
        });

    }

    #welcomeMessageHtml() {
        return "<b style='font-size:120%'>见贤思齐焉，见不贤而内自省也。</b>";
    }

    abstract doBindReturnButton(credential: Credential, context?: PageProcessorContext): void;

    abstract doLoadBankAccount(credential: Credential, context?: PageProcessorContext): void;


    #renderPersonalStatus(credential: Credential, context?: PageProcessorContext) {
        new PersonalStatus(credential, context?.get("townId")).open().then(page => {
            const role = page.role!;
            let html = "";
            html += "<table style='text-align:center;border-width:0;margin:auto;width:100%'>";
            html += "<tbody>";
            html += "<tr>";
            html += "<td style='background-color:#E8E8D0;font-size:150%;font-weight:bold;color:navy' colspan='2'>" + role.name + "</td>";
            html += "</tr>";
            html += "<tr>";
            html += "<td style='width:80px;background-color:#E8E8D0' rowspan='3'>" + role.imageHtml + "</td>"
            html += "<td style='width:100%'>";
            html += "<table style='width:100%;margin:auto;border-width:0;text-align:center'>";
            html += "<tbody>";
            html += "<tr style='color:yellowgreen'>";
            html += "<th style='background-color:darkred'>种族</th>";
            html += "<th style='background-color:darkgreen'>性别</th>";
            html += "<th style='background-color:darkred'>国家</th>";
            html += "<th style='background-color:darkgreen'>部队</th>";
            html += "<th style='background-color:darkred'>属性</th>";
            html += "<th style='background-color:darkgreen'>职业</th>";
            html += "<th style='background-color:darkred'>战数</th>";
            html += "</tr>";
            html += "<tr>";
            html += "<td style='background-color:#E8E8D0'>" + role.race + "</td>";
            html += "<td style='background-color:#E8E8D0'>" + role.gender + "</td>";
            html += "<td style='background-color:#E8E8D0'>" + role.country + "</td>";
            html += "<td style='background-color:#E8E8D0'>" + role.unit + "</td>";
            html += "<td style='background-color:#E8E8D0'>" + role.attribute + "</td>";
            html += "<td style='background-color:#E8E8D0'>" + role.career + "</td>";
            html += "<td style='background-color:#E8E8D0'>" + role.battleCount + "/" + role.battleWinCount + "</td>";
            html += "</tr>";
            html += "</tbody>";
            html += "</table>";
            html += "</td>";
            html += "</tr>";


            html += "<tr>";
            html += "<td style='width:100%'>";
            html += "<table style='width:100%;margin:auto;border-width:0;text-align:center'>";
            html += "<tbody>";
            html += "<tr style='color:yellowgreen'>";
            html += "<th style='background-color:darkred'>等级</th>";
            html += "<th style='background-color:darkgreen'>ＨＰ</th>";
            html += "<th style='background-color:darkred'>ＭＰ</th>";
            html += "<th style='background-color:darkgreen'>攻击</th>";
            html += "<th style='background-color:darkred'>防御</th>";
            html += "<th style='background-color:darkgreen'>智力</th>";
            html += "<th style='background-color:darkred'>精神</th>";
            html += "<th style='background-color:darkgreen'>速度</th>";
            html += "</tr>";
            html += "<tr>";
            html += "<td style='background-color:#E8E8D0'>" + role.level + "</td>";
            html += "<td style='background-color:#E8E8D0'>" + role.health + "/" + role.maxHealth + "</td>";
            html += "<td style='background-color:#E8E8D0'>" + role.mana + "/" + role.maxMana + "</td>";
            html += "<td style='background-color:#E8E8D0'>" + role.attack + "</td>";
            html += "<td style='background-color:#E8E8D0'>" + role.defense + "</td>";
            html += "<td style='background-color:#E8E8D0'>" + role.specialAttack + "</td>";
            html += "<td style='background-color:#E8E8D0'>" + role.specialDefense + "</td>";
            html += "<td style='background-color:#E8E8D0'>" + role.speed + "</td>";
            html += "</tr>";
            html += "</tbody>";
            html += "</table>";
            html += "</td>";
            html += "</tr>";

            html += "<tr>";
            html += "<td style='width:100%'>";
            html += "<table style='width:100%;margin:auto;border-width:0;text-align:center'>";
            html += "<tbody>";
            html += "<tr style='color:yellowgreen'>";
            html += "<th style='background-color:darkred'>经验</th>";
            html += "<th style='background-color:darkgreen'>幸运</th>";
            html += "<th style='background-color:darkred'>祭奠RP</th>";
            html += "<th style='background-color:darkgreen'>额外RP</th>";
            html += "<th style='background-color:darkred'>现金</th>";
            html += "<th style='background-color:darkgreen'>存款</th>";
            html += "</tr>";
            html += "<tr>";
            html += "<td style='background-color:#E8E8D0'>" + role.experience + "</td>";
            html += "<td style='background-color:#E8E8D0'>" + role.additionalLuck + "</td>";
            html += "<td style='background-color:#E8E8D0'>" + role.consecrateRP + "</td>";
            html += "<td style='background-color:#E8E8D0'>" + role.additionalRP + "</td>";
            html += "<td style='background-color:#E8E8D0'>" + role.cash + " GOLD</td>";
            html += "<td style='background-color:#E8E8D0' id='roleSaving'></td>";
            html += "</tr>";
            html += "</tbody>";
            html += "</table>";
            html += "</td>";
            html += "</tr>";

            html += "</tbody>";
            html += "</table>";

            $("#personalStatus").html(html);

            this.doLoadBankAccount(credential);

            // 加载完用户才能加载技能。。。
            this.#renderSpellStatus(credential, role, context);
        });
    }

    #renderSpellStatus(credential: Credential, role: Role, context?: PageProcessorContext) {
        const personalSpell = new PersonalSpell(credential, context?.get("townId"));
        personalSpell.open().then(page => {
            const spellList = page.spellList!;

            let html = "";
            html += "<table style='text-align:center;border-width:0;margin:auto;width:100%'>";
            html += "<tbody>";
            html += "<tr>";
            html += "<th style='background-color:yellowgreen;font-size:120%;font-weight:bold;color:navy' colspan='6'>技 能 状 态</th>";
            html += "</tr>";
            html += "<tr style='color:yellowgreen'>";
            html += "<th style='background-color:darkred'>使用</th>";
            html += "<th style='background-color:darkgreen'>技能</th>";
            html += "<th style='background-color:darkred'>威力</th>";
            html += "<th style='background-color:darkgreen'>确率</th>";
            html += "<th style='background-color:darkred'>ＰＰ</th>";
            html += "<th style='background-color:darkgreen'>评分</th>";
            html += "</tr>";

            for (const spell of spellList) {
                const using = spell.name === role.spell;
                html += "<tr>";
                html += "<td style='background-color:#E8E8D0'>" + (using ? "★" : "") + "</td>";
                html += "<td style='background-color:#E8E8D0'>";
                if (using) {
                    html += "<button role='button' class='spellButton' id='spell_" + spell.id + "' " +
                        "style='color:blue'>" + spell.name + "</button>";
                } else {
                    html += "<button role='button' class='spellButton' id='spell_" + spell.id + "' " +
                        "style='color:grey'>" + spell.name + "</button>";
                }
                html += "</td>";
                html += "<td style='background-color:#E8E8D0'>" + spell.power + "</td>";
                html += "<td style='background-color:#E8E8D0'>" + spell.accuracy + "</td>";
                html += "<td style='background-color:#E8E8D0'>" + spell.pp + "</td>";
                html += "<td style='background-color:#E8E8D0'>" + spell.score + "</td>";
                html += "</tr>";
            }

            html += "</tbody>";
            html += "</table>";

            $("#spellStatus").html(html);

            $(".spellButton").on("click", event => {
                const buttonId = $(event.target).attr("id") as string;
                if (PageUtils.isColorBlue(buttonId)) {
                    return;
                }
                const spellId = StringUtils.substringAfter(buttonId, "spell_");
                personalSpell.set(spellId).then(() => {
                    this.#reload(credential, context);
                });
            });
        });
    }

    #renderEquipmentStatus(credential: Credential, context?: PageProcessorContext) {
        const personalEquipment = new PersonalEquipmentManagement(credential, context?.get("townId"));
        personalEquipment.open().then(page => {
            const equipmentList = page.equipmentList!;

            let html = "";
            html += "<table style='text-align:center;border-width:0;margin:auto;width:100%'>";
            html += "<tbody>";
            html += "<tr>";
            html += "<th style='background-color:yellowgreen;font-size:120%;font-weight:bold;color:navy' colspan='18'>装 备 状 态</th>";
            html += "</tr>";
            html += "<tr style='color:yellowgreen'>";
            html += "<th style='background-color:darkred'>使用</th>";
            html += "<th style='background-color:darkgreen'>装备</th>";
            html += "<th style='background-color:darkred'>名字</th>";
            html += "<th style='background-color:darkgreen'>种类</th>";
            html += "<th style='background-color:darkred'>效果</th>";
            html += "<th style='background-color:darkgreen'>重量</th>";
            html += "<th style='background-color:darkred'>耐久</th>";
            html += "<th style='background-color:darkgreen'>职需</th>";
            html += "<th style='background-color:darkred'>攻需</th>";
            html += "<th style='background-color:darkgreen'>防需</th>";
            html += "<th style='background-color:darkred'>智需</th>";
            html += "<th style='background-color:darkgreen'>精需</th>";
            html += "<th style='background-color:darkred'>速需</th>";
            html += "<th style='background-color:darkgreen'>威＋</th>";
            html += "<th style='background-color:darkred'>重＋</th>";
            html += "<th style='background-color:darkgreen'>幸＋</th>";
            html += "<th style='background-color:darkred'>经验</th>";
            html += "<th style='background-color:darkgreen'>属性</th>";
            html += "</tr>";

            for (const equipment of equipmentList) {
                if (!equipment.isWeapon && !equipment.isArmor && !equipment.isAccessory) {
                    continue;
                }
                html += "<tr>";
                html += "<td style='background-color:#E8E8D0'>";
                let title = equipment.using! ? "卸下" : "装备";
                html += "<button role='button' class='equipmentButton' id='equipment_" + equipment.index + "'>" + title + "</button>";
                html += "</td>";
                html += "<td style='background-color:#E8E8D0'>" + equipment.usingHTML + "</td>";
                html += "<td style='background-color:#E8E8D0'>" + equipment.nameHTML + "</td>";
                html += "<td style='background-color:#E8E8D0'>" + equipment.category + "</td>";
                html += "<td style='background-color:#E8E8D0'>" + equipment.power + "</td>";
                html += "<td style='background-color:#E8E8D0'>" + equipment.weight + "</td>";
                html += "<td style='background-color:#E8E8D0'>" + equipment.endureHtml + "</td>";
                html += "<td style='background-color:#E8E8D0'>" + equipment.requiredCareerHtml + "</td>";
                html += "<td style='background-color:#E8E8D0'>" + equipment.requiredAttackHtml + "</td>";
                html += "<td style='background-color:#E8E8D0'>" + equipment.requiredDefenseHtml + "</td>";
                html += "<td style='background-color:#E8E8D0'>" + equipment.requiredSpecialAttackHtml + "</td>";
                html += "<td style='background-color:#E8E8D0'>" + equipment.requiredSpecialDefenseHtml + "</td>";
                html += "<td style='background-color:#E8E8D0'>" + equipment.requiredSpeedHtml + "</td>";
                html += "<td style='background-color:#E8E8D0'>" + equipment.additionalPowerHtml + "</td>";
                html += "<td style='background-color:#E8E8D0'>" + equipment.additionalWeightHtml + "</td>";
                html += "<td style='background-color:#E8E8D0'>" + equipment.additionalLuckHtml + "</td>";
                html += "<td style='background-color:#E8E8D0'>" + equipment.experienceHTML + "</td>";
                html += "<td style='background-color:#E8E8D0'>" + equipment.attributeHtml + "</td>";
                html += "</tr>";
            }

            html += "</tbody>";
            html += "</table>";

            $("#equipmentStatus").html(html);

            $(".equipmentButton").on("click", event => {
                const buttonId = $(event.target).attr("id") as string;
                const index = parseInt(StringUtils.substringAfter(buttonId, "equipment_"));
                personalEquipment.use([index]).then(() => {
                    $("#equipmentStatus").html("");
                    $(".equipmentButton").off("click");
                    this.#renderEquipmentStatus(credential, context);
                });
            });
        });
    }

    #renderPetStatus(credential: Credential, context?: PageProcessorContext) {
        const personalPet = new PersonalPetManagement(credential, context?.get("townId"));
        personalPet.open().then(page => {
            const petList = page.petList!;

            let html = "";
            html += "<table style='text-align:center;border-width:0;margin:auto;width:100%'>";
            html += "<tbody>";
            html += "<tr>";
            html += "<th style='background-color:yellowgreen;font-size:120%;font-weight:bold;color:navy' colspan='19'>宠 物 状 态</th>";
            html += "</tr>";
            html += "<tr style='color:yellowgreen'>";
            html += "<th style='background-color:darkred'></th>";
            html += "<th style='background-color:darkgreen'>使用</th>";
            html += "<th style='background-color:darkred'>名字</th>";
            html += "<th style='background-color:darkgreen'>性别</th>";
            html += "<th style='background-color:darkred'>等级</th>";
            html += "<th style='background-color:darkgreen'>生命</th>";
            html += "<th style='background-color:darkred'>攻击</th>";
            html += "<th style='background-color:darkgreen'>防御</th>";
            html += "<th style='background-color:darkred'>智力</th>";
            html += "<th style='background-color:darkgreen'>精神</th>";
            html += "<th style='background-color:darkred'>速度</th>";
            html += "<th style='background-color:darkgreen'>技1</th>";
            html += "<th style='background-color:darkred'>技2</th>";
            html += "<th style='background-color:darkgreen'>技3</th>";
            html += "<th style='background-color:darkred'>技4</th>";
            html += "<th style='background-color:darkgreen'>亲密</th>";
            html += "<th style='background-color:darkred'>种类</th>";
            html += "<th style='background-color:darkgreen'>属1</th>";
            html += "<th style='background-color:darkred'>属2</th>";
            html += "</tr>";

            for (const pet of petList) {
                html += "<tr>";
                html += "<td style='background-color:#E8E8D0;width:64px;height:64px' rowspan='2'>";
                html += pet.imageHtml;
                html += "</td>";
                html += "<td style='background-color:#E8E8D0' rowspan='2'>" + pet.usingHtml + "</td>";
                html += "<td style='background-color:#E8E8D0'>" + pet.nameHtml + "</td>";
                html += "<td style='background-color:#E8E8D0'>" + pet.gender + "</td>";
                html += "<td style='background-color:#E8E8D0'>" + pet.levelHtml + "</td>";
                html += "<td style='background-color:#E8E8D0'>" + pet.healthHtml + "</td>";
                html += "<td style='background-color:#E8E8D0'>" + pet.attackHtml + "</td>";
                html += "<td style='background-color:#E8E8D0'>" + pet.defenseHtml + "</td>";
                html += "<td style='background-color:#E8E8D0'>" + pet.specialAttackHtml + "</td>";
                html += "<td style='background-color:#E8E8D0'>" + pet.specialDefenseHtml + "</td>";
                html += "<td style='background-color:#E8E8D0'>" + pet.speedHtml + "</td>";
                html += "<td style='background-color:#E8E8D0'>" + pet.spell1 + "</td>";
                html += "<td style='background-color:#E8E8D0'>" + pet.spell2 + "</td>";
                html += "<td style='background-color:#E0D0C0'>" + pet.spell3 + "</td>";
                html += "<td style='background-color:#E8E8D0'>" + pet.spell4 + "</td>";
                html += "<td style='background-color:#E8E8D0'>" + pet.love + "</td>";
                html += "<td style='background-color:#E8E8D0'>" + pet.raceHtml + "</td>";
                html += "<td style='background-color:#E8E8D0'>" + pet.attribute1 + "</td>";
                html += "<td style='background-color:#E8E8D0'>" + pet.attribute2 + "</td>";
                html += "</tr>";

                html += "<tr>";
                html += "<td style='background-color:#E8E8D0;text-align:left' colspan='17'>";
                const title = pet.using! ? "卸下" : "使用";
                html += "<button role='button' id='pet_" + pet.index + "' class='petButton'>" + title + "</button>";
                html += "</td>";
                html += "</tr>";
            }

            html += "</tbody>";
            html += "</table>";

            $("#petStatus").html(html);

            $(".petButton").on("click", event => {
                const buttonId = $(event.target).attr("id") as string;
                let index = parseInt(StringUtils.substringAfter(buttonId, "pet_"));
                const pet = page.findPet(index)!;
                if (pet.using) {
                    index = -1;
                }
                personalPet.set(index).then(() => {
                    $("#petStatus").html("");
                    $(".petButton").off("click");
                    this.#renderPetStatus(credential, context);
                });
            });
        });
    }

    #renderMirrorStatus(credential: Credential, context?: PageProcessorContext) {
        const personalMirror = new PersonalMirror(credential, context?.get("townId"));
        personalMirror.open().then(page => {
            const mirrorList = page.mirrorList!;
            let html = "";
            html += "<table style='text-align:center;border-width:0;margin:auto;width:100%'>";
            html += "<tbody>";
            html += "<tr>";
            html += "<th style='background-color:yellowgreen;font-size:120%;font-weight:bold;color:navy' colspan='15'>分 身 状 态</th>";
            html += "</tr>";
            html += "<tr style='color:yellowgreen'>";
            html += "<th style='background-color:darkred'>类别</th>";
            html += "<th style='background-color:darkgreen'>头像</th>";
            html += "<th style='background-color:darkred'>姓名</th>";
            html += "<th style='background-color:darkgreen'>性别</th>";
            html += "<th style='background-color:darkred'>ＨＰ</th>";
            html += "<th style='background-color:darkgreen'>ＭＰ</th>";
            html += "<th style='background-color:darkred'>属性</th>";
            html += "<th style='background-color:darkgreen'>攻击</th>";
            html += "<th style='background-color:darkred'>防御</th>";
            html += "<th style='background-color:darkgreen'>智力</th>";
            html += "<th style='background-color:darkred'>精神</th>";
            html += "<th style='background-color:darkgreen'>速度</th>";
            html += "<th style='background-color:darkred'>职业</th>";
            html += "<th style='background-color:darkgreen'>技能</th>";
            html += "<th style='background-color:darkred'>经验</th>";
            html += "</tr>";

            for (const mirror of mirrorList) {
                html += "<tr>";
                html += "<td style='background-color:#E8E8D0'>";
                html += "<button role='button' class='mirrorButton' id='mirror_" + mirror.index + "'>" + mirror.category + "</button>";
                html += "</td>";
                html += "<td style='background-color:#E8E8D0;width:64px;height:64px'>" + mirror.imageHtml + "</td>";
                html += "<td style='background-color:#E8E8D0'>" + mirror.name + "</td>";
                html += "<td style='background-color:#E8E8D0'>" + mirror.gender + "</td>";
                html += "<td style='background-color:#E8E8D0'>" + mirror.healthHtml + "</td>";
                html += "<td style='background-color:#E8E8D0'>" + mirror.manaHtml + "</td>";
                html += "<td style='background-color:#E8E8D0'>" + mirror.attribute + "</td>";
                html += "<td style='background-color:#E8E8D0'>" + mirror.attack + "</td>";
                html += "<td style='background-color:#E8E8D0'>" + mirror.defense + "</td>";
                html += "<td style='background-color:#E8E8D0'>" + mirror.specialAttack + "</td>";
                html += "<td style='background-color:#E8E8D0'>" + mirror.specialDefense + "</td>";
                html += "<td style='background-color:#E8E8D0'>" + mirror.speed + "</td>";
                html += "<td style='background-color:#E8E8D0'>" + mirror.career + "</td>";
                html += "<td style='background-color:#E8E8D0'>" + mirror.spell + "</td>";
                html += "<td style='background-color:#E8E8D0'>" + mirror.experience + "</td>";
                html += "</tr>";
            }

            html += "</tbody>";
            html += "</table>";

            $("#mirrorStatus").html(html);

            $(".mirrorButton").on("click", event => {
                const buttonId = $(event.target).attr("id") as string;
                const index = parseInt(StringUtils.substringAfter(buttonId, "mirror_"));
                personalMirror.change(index).then(() => {
                    this.#reload(credential, context);
                });
            });
        });
    }

    #reload(credential: Credential, context?: PageProcessorContext) {
        $("#personalStatus").html("");
        $("#spellStatus").html("");
        $("#equipmentStatus").html("");
        $("#petStatus").html("");
        $("#mirrorStatus").html("");

        $(".spellButton").off("click");
        $(".equipmentButton").off("click");
        $(".petButton").off("click");
        $(".mirrorButton").off("click");

        this.#renderPersonalStatus(credential, context);
        this.#renderEquipmentStatus(credential, context);
        this.#renderPetStatus(credential, context);
        this.#renderMirrorStatus(credential, context);
    }
}

export = PersonalProfilePageProcessor;