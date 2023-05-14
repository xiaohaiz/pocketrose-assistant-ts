import Pet from "../../common/Pet";
import Role from "../../common/Role";
import PetProfileLoader from "../../core/PetProfileLoader";
import CastleLoader from "../../pocket/CastleLoader";
import EquipmentParser from "../../pocket/EquipmentParser";
import PetParser from "../../pocket/PetParser";
import RoleLoader from "../../pocket/RoleLoader";
import CastleRanch from "../../pocketrose/CastleRanch";
import PersonalPetManagementPage from "../../pocketrose/PersonalPetManagementPage";
import PersonalStatus from "../../pocketrose/PersonalStatus";
import TownBank from "../../pocketrose/TownBank";
import SetupLoader from "../../setup/SetupLoader";
import Credential from "../../util/Credential";
import MessageBoard from "../../util/MessageBoard";
import NetworkUtils from "../../util/NetworkUtils";
import PageUtils from "../../util/PageUtils";
import StringUtils from "../../util/StringUtils";
import PageProcessorContext from "../PageProcessorContext";
import AbstractPersonalPetManagementPageProcessor from "./AbstractPersonalPetManagementPageProcessor";

class PersonalPetManagementPageProcessor_Town extends AbstractPersonalPetManagementPageProcessor {

    doProcessWithPageParsed(credential: Credential, page: PersonalPetManagementPage, context?: PageProcessorContext): void {
        doProcess(credential, page.petList!, page.petStudyStatus!);
    }

}

function doProcess(credential: Credential, petList: Pet[], studyStatus: number[]) {

    new RoleLoader(credential).load()
        .then(role => {
            if (role.masterCareerList!.includes("贤者") || role.hasMirror!) {
                $("#hasGoldenCage").text("true");
            }
            $("#roleLocation").text(role.location!);

            doRender(credential, petList, studyStatus, role);

            const request = credential.asRequest();
            // @ts-ignore
            request["mode"] = "USE_ITEM";
            NetworkUtils.sendPostRequest("mydata.cgi", request, function (html) {
                const equipmentList = EquipmentParser.parsePersonalItemList(html);
                const cage = EquipmentParser.findGoldenCage(equipmentList);
                if (cage !== null) {
                    $("#goldenCageIndex").text(cage.index!);
                    $("#openCageButton").show();
                    $("#closeCageButton").show();
                }
            });
        });

}

function doRender(credential: Credential, petList: Pet[], studyStatus: number[], role?: Role) {
    let html = "";
    html += "<table style='border-width:0;background-color:#888888;text-align:center;width:100%'>";
    html += "<tbody style='background-color:#F8F0E0'>";
    html += "<tr>";
    html += "<td style='background-color:#EFE0C0'></td>";
    html += "<td style='background-color:#EFE0C0'>使用</td>";
    html += "<td style='background-color:#E8E8D0'>宠物名</td>";
    html += "<td style='background-color:#E8E8D0'>性别</td>";
    html += "<td style='background-color:#E8E8D0'>Ｌｖ</td>";
    html += "<td style='background-color:#E8E8D0'>ＨＰ</td>";
    html += "<td style='background-color:#E8E8D0'>攻击力</td>";
    html += "<td style='background-color:#E8E8D0'>防御力</td>";
    html += "<td style='background-color:#E8E8D0'>智力</td>";
    html += "<td style='background-color:#E8E8D0'>精神力</td>";
    html += "<td style='background-color:#E8E8D0'>速度</td>";
    html += "<td style='background-color:#E8E8D0'>技1</td>";
    html += "<td style='background-color:#E8E8D0'>技2</td>";
    html += "<td style='background-color:#E8E8D0'>技3</td>";
    html += "<td style='background-color:#E8E8D0'>技4</td>";
    html += "<td style='background-color:#E8E8D0'>亲密度</td>";
    html += "<td style='background-color:#E8E8D0'>种类</td>";
    html += "<td style='background-color:#E8E8D0'>属性1</td>";
    html += "<td style='background-color:#E8E8D0'>属性2</td>";
    html += "<td style='background-color:#E8E8D0'>成长</td>";
    html += "</tr>";
    for (const pet of petList) {
        html += "<tr>";
        html += "<td style='background-color:#EFE0C0' rowspan='2' id='pet_picture_" + pet.code + "' class='pet_picture_class'>" +
            pet.imageHtml +
            "</td>";
        html += "<td style='background-color:#EFE0C0' rowspan='2'>" +
            (pet.using ? "★" : "") +
            "</td>";
        html += "<td style='background-color:#E8E8D0' id='pet_name_" + pet.code + "' class='PetUIButton'>" +
            "<b>" + pet.name + "</b>" +
            "</td>";
        html += "<td style='background-color:#E8E8D0'>" +
            pet.gender +
            "</td>";
        html += "<td style='background-color:#E8E8D0'>" +
            pet.level +
            "</td>";
        html += "<td style='background-color:#E8E8D0'>" +
            pet.health + "/" + pet.maxHealth +
            "</td>";
        html += "<td style='background-color:#E8E8D0'>" +
            (pet.attack! >= 375 ? "<b style='color:red'>" + pet.attack + "</b>" : pet.attack) +
            "</td>";
        html += "<td style='background-color:#E8E8D0'>" +
            (pet.defense! >= 375 ? "<b style='color:red'>" + pet.defense + "</b>" : pet.defense) +
            "</td>";
        html += "<td style='background-color:#E8E8D0'>" +
            (pet.specialAttack! >= 375 ? "<b style='color:red'>" + pet.specialAttack + "</b>" : pet.specialAttack) +
            "</td>";
        html += "<td style='background-color:#E8E8D0'>" +
            (pet.specialDefense! >= 375 ? "<b style='color:red'>" + pet.specialDefense + "</b>" : pet.specialDefense) +
            "</td>";
        html += "<td style='background-color:#E8E8D0'>" +
            (pet.speed! >= 375 ? "<b style='color:red'>" + pet.speed + "</b>" : pet.speed) +
            "</td>";
        html += "<td style='background-color:#E8E8D0'>" +
            "<input type='button' class='PetUIButton' id='pet_" + pet.index + "_spell_1' value='" + pet.spell1 + "' title='" + pet.spell1Description + "'>" +
            "</td>";
        html += "<td style='background-color:#E8E8D0'>" +
            "<input type='button' class='PetUIButton' id='pet_" + pet.index + "_spell_2' value='" + pet.spell2 + "' title='" + pet.spell2Description + "'>" +
            "</td>";
        html += "<td style='background-color:#E8E8D0'>" +
            "<input type='button' class='PetUIButton' id='pet_" + pet.index + "_spell_3' value='" + pet.spell3 + "' title='" + pet.spell3Description + "'>" +
            "</td>";
        html += "<td style='background-color:#E8E8D0'>" +
            "<input type='button' class='PetUIButton' id='pet_" + pet.index + "_spell_4' value='" + pet.spell4 + "' title='" + pet.spell4Description + "'>" +
            "</td>";
        html += "<td style='background-color:#E8E8D0'>" +
            (pet.love! >= 100 ? "<b style='color:red'>" + pet.love + "</b>" : pet.love) +
            "</td>";
        html += "<td style='background-color:#E8E8D0'>" +
            pet.race +
            "</td>";
        html += "<td style='background-color:#E8E8D0'>" +
            pet.attribute1 +
            "</td>";
        html += "<td style='background-color:#E8E8D0'>" +
            (pet.attribute2 === "无" ? "-" : pet.attribute2) +
            "</td>";
        html += "<td style='background-color:#E8E8D0'>";
        const petFuture = PetProfileLoader.load(pet.code!);
        if (petFuture !== null) {
            html += petFuture.growExperience;
        }
        html += "</td>";
        html += "</tr>";
        html += "<tr>";
        html += "<td colspan='18' style='text-align: left'>";        // 当前宠物的操作位置
        html += "<input type='button' class='PetUIButton' value='卸下' id='pet_" + pet.index + "_uninstall'>";
        html += "<input type='button' class='PetUIButton' value='使用' id='pet_" + pet.index + "_install'>";
        html += "<input type='button' class='PetUIButton' value='入笼' id='pet_" + pet.index + "_cage'>";
        html += "<input type='button' class='PetUIButton' value='亲密' id='pet_" + pet.index + "_love'>";
        html += "<input type='button' class='PetUIButton' value='参赛' id='pet_" + pet.index + "_league'>";
        html += "<input type='button' class='PetUIButton' value='献祭' id='pet_" + pet.index + "_consecrate'>";
        html += "<input type='button' class='PetUIButton' value='发送' id='pet_" + pet.index + "_send'>";
        html += "<input type='button' class='PetUIButton' value='改名' id='pet_" + pet.index + "_rename'>&nbsp;";
        html += "<input type='text' id='pet_" + pet.index + "_name_text' size='15' maxlength='20'>";
        html += "</td>";
        html += "</tr>";
    }
    html += "<tr><td style='background-color:#EFE0C0;text-align:right' colspan='20'>";
    html += "<input type='text' id='receiverName' size='15' maxlength='20'>";
    html += "<input type='button' class='PetUIButton' id='searchReceiverButton' value='找人'>";
    html += "<select name='eid' id='receiverCandidates'><option value=''>选择发送对象</select>";
    html += "</td></tr>";
    html += "<tr><td style='background-color:#EFE0C0;text-align:center' colspan='20'>";
    html += "<b style='color:navy'>设置宠物升级时学习技能情况</b>";
    html += "</td></tr>";
    html += "<tr><td style='background-color:#E8E8D0;text-align:center' colspan='20'>";
    html += "<input type='button' class='PetUIButton' value='第１技能位' id='pet_spell_study_1'>";
    html += "<input type='button' class='PetUIButton' value='第２技能位' id='pet_spell_study_2'>";
    html += "<input type='button' class='PetUIButton' value='第３技能位' id='pet_spell_study_3'>";
    html += "<input type='button' class='PetUIButton' value='第４技能位' id='pet_spell_study_4'>";
    html += "</td></tr>";
    html += "<tr><td style='background-color:#E8E8D0;text-align:center' colspan='20'>";
    html += "<input type='button' class='PetUIButton' value='刷新宠物管理' id='refreshButton'>";
    html += "<input type='button' class='PetUIButton' value='打开黄金笼子' id='openCageButton'>";
    html += "<input type='button' class='PetUIButton' value='关闭黄金笼子' id='closeCageButton'>";
    html += "<input type='button' class='PetUIButton' value='从黄金笼子盲取' id='takeOutFirstFromCageButton' disabled style='display:none'>";
    html += "</td></tr>";
    html += "<tr id='ranchMenu' style='display:none'><td style='background-color:#E8E8D0;text-align:center' colspan='20'>";
    html += "<input type='button' class='PetUIButton' value='打开城堡牧场' id='openRanchButton'>";
    html += "<input type='button' class='PetUIButton' value='关闭城堡牧场' id='closeRanchButton'>";
    html += "</td></tr>";
    html += "<tr style='display:none'><td id='goldenCageContainer' style='background-color:#E8E8D0;text-align:center' colspan='20'>";
    html += "</td></tr>";
    html += "</tbody>";
    html += "</table>";

    $("#pet_management_container").html(html);

    if ($("#goldenCageIndex").text() === "none") {
        $("#openCageButton").hide();
        $("#closeCageButton").hide();
    }

    // 根据宠物状态修改按钮的样式
    for (let i = 0; i < petList.length; i++) {
        const pet = petList[i];

        // 设置卸下宠物按钮的状态
        if (!pet.using) {
            let buttonId = "pet_" + pet.index + "_uninstall";
            $("#" + buttonId).prop("disabled", true);
            $("#" + buttonId).css("color", "grey");
        }

        // 设置使用宠物按钮的状态
        if (pet.using) {
            let buttonId = "pet_" + pet.index + "_install";
            $("#" + buttonId).prop("disabled", true);
            $("#" + buttonId).css("color", "grey");

            buttonId = "pet_" + pet.index + "_cage";
            $("#" + buttonId).prop("disabled", true);
            $("#" + buttonId).css("color", "grey");
        }

        if ($("#hasGoldenCage").text() !== "true" && !pet.using) {
            // 没有黄金笼子的不应该有入笼选项
            let buttonId = "pet_" + pet.index + "_cage";
            $("#" + buttonId).prop("disabled", true);
            $("#" + buttonId).css("color", "grey");
        }

        // 设置宠物技能按钮的状态
        let spellButtonId = "pet_" + pet.index + "_spell_1";
        if (pet.usingSpell1) {
            $("#" + spellButtonId).css("color", "blue");
        } else {
            $("#" + spellButtonId).css("color", "grey");
        }
        spellButtonId = "pet_" + pet.index + "_spell_2";
        if (pet.usingSpell2) {
            $("#" + spellButtonId).css("color", "blue");
        } else {
            $("#" + spellButtonId).css("color", "grey");
        }
        spellButtonId = "pet_" + pet.index + "_spell_3";
        if (pet.usingSpell3) {
            $("#" + spellButtonId).css("color", "blue");
        } else {
            $("#" + spellButtonId).css("color", "grey");
        }
        spellButtonId = "pet_" + pet.index + "_spell_4";
        if (pet.usingSpell4) {
            $("#" + spellButtonId).css("color", "blue");
        } else {
            $("#" + spellButtonId).css("color", "grey");
        }

        // 设置宠物亲密度按钮的状态
        if (pet.love! >= 100) {
            let buttonId = "pet_" + pet.index + "_love";
            $("#" + buttonId).prop("disabled", true);
            $("#" + buttonId).css("color", "grey");
        }

        // 设置宠物联赛按钮的状态
        if (pet.level! < 100) {
            let buttonId = "pet_" + pet.index + "_league";
            $("#" + buttonId).prop("disabled", true);
            $("#" + buttonId).css("color", "grey");
        }

        // 设置宠物献祭按钮的状态
        if (pet.level !== 1) {
            let buttonId = "pet_" + pet.index + "_consecrate";
            $("#" + buttonId).prop("disabled", true);
            $("#" + buttonId).css("color", "grey");
        }

        // 设置宠物发送按钮的状态
        if (pet.using) {
            let buttonId = "pet_" + pet.index + "_send";
            $("#" + buttonId).prop("disabled", true);
            $("#" + buttonId).css("color", "grey");
        }
    }

    // 设置技能学习位的按钮样式
    if (studyStatus.includes(1)) {
        $("#pet_spell_study_1").css("color", "blue");
    } else {
        $("#pet_spell_study_1").css("color", "grey");
    }
    if (studyStatus.includes(2)) {
        $("#pet_spell_study_2").css("color", "blue");
    } else {
        $("#pet_spell_study_2").css("color", "grey");
    }
    if (studyStatus.includes(3)) {
        $("#pet_spell_study_3").css("color", "blue");
    } else {
        $("#pet_spell_study_3").css("color", "grey");
    }
    if (studyStatus.includes(4)) {
        $("#pet_spell_study_4").css("color", "blue");
    } else {
        $("#pet_spell_study_4").css("color", "grey");
    }

    doBindPetFuture(petList);
    // 绑定按钮点击事件处理
    doBind(credential, petList);

    if (role !== undefined && SetupLoader.isCastleKeeperEnabled()) {
        CastleLoader.loadCastle2(role.name!).then(() => {
            $("#ranchMenu").show();
            $("#openRanchButton").on("click", () => {
                if ($("#ranchState").text() === "on") {
                    return;
                }
                $("#ranchState").text("on");
                doRefresh(credential);
            });
            $("#closeRanchButton").on("click", () => {
                if ($("#ranchState").text() === "off") {
                    return;
                }
                $("#ranchState").text("off");
                doRefresh(credential);
            });
        });
    }

    if ($("#goldenCageStatus").text() === "on") {
        doRenderGoldenCage(credential);
    } else {
        // 由于某些bug造成某些号黄金笼子消失
        if ($("#hasGoldenCage").text() === "true") {
            // 身上没有发现黄金笼子，但是掌握了贤者或者开了分身
            // 应该有笼子的，能提供限制版笼子功能，取出第一个宠物
            $("#takeOutFirstFromCageButton")
                .prop("disabled", false)
                .show()
                .on("click", function () {
                    const request = credential.asRequest();
                    // @ts-ignore
                    request["select"] = "0";
                    // @ts-ignore
                    request["mode"] = "GETOUTLONGZI";
                    NetworkUtils.sendPostRequest("mydata.cgi", request, function (html) {
                        MessageBoard.processResponseMessage(html);
                        doRefresh(credential);
                    });
                });
        }
    }

    if ($("#ranchState").text() === "on") {
        doRenderRanch(credential);
    }
}

function doBindPetFuture(petList: Pet[]) {
    for (const pet of petList) {
        const code = pet.code!;
        if ($("#pet_name_" + code).length > 0) {
            $("#pet_name_" + code)
                .on("click", function () {
                    const petFuture = PetProfileLoader.load(code)!;
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
                    html += "<td rowspan='2' style='text-align:center'>" + petFuture.imageHtml + "</td>";
                    html += "</tr>";
                    html += "<tr style='background-color:black;color:wheat;font-weight:bold;text-align:center'>";
                    html += "<td>" + petFuture.name + "</td>";
                    html += "<td>" + petFuture.totalBaseStats + "</td>";
                    html += "<td>" + petFuture.healthBaseStats + "</td>";
                    html += "<td>" + petFuture.attackBaseStats + "</td>";
                    html += "<td>" + petFuture.defenseBaseStats + "</td>";
                    html += "<td>" + petFuture.specialAttackBaseStats + "</td>";
                    html += "<td>" + petFuture.specialDefenseBaseStats + "</td>";
                    html += "<td>" + petFuture.speedBaseStats + "</td>";
                    html += "<td>" + petFuture.healthEffort + "</td>";
                    html += "<td>" + petFuture.attackEffort + "</td>";
                    html += "<td>" + petFuture.defenseEffort + "</td>";
                    html += "<td>" + petFuture.specialAttackEffort + "</td>";
                    html += "<td>" + petFuture.specialDefenseEffort + "</td>";
                    html += "<td>" + petFuture.speedEffort + "</td>";
                    html += "<td>" + petFuture.catchRatio + "</td>";
                    html += "<td>" + petFuture.growExperience + "</td>";
                    html += "</tr>";
                    html += "</tbody>";
                    html += "</table>";
                    $("#messageBoard").html(html);
                });
        }
        if ($("#pet_picture_" + code).length > 0) {
            $("#pet_picture_" + code)
                .on("mouseenter", function () {
                    const petFuture = PetProfileLoader.load(code)!;
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
                    html += "<td rowspan='3' style='text-align:center'>" + petFuture.imageHtml + "</td>";
                    html += "</tr>";
                    html += "<tr style='background-color:black;color:wheat;font-weight:bold;text-align:center'>";
                    html += "<td rowspan='2'>" + petFuture.name + "</td>";
                    html += "<td rowspan='2'>" + petFuture.totalBaseStats + "</td>";
                    html += "<td>" + petFuture.healthBaseStats + "</td>";
                    html += "<td>" + petFuture.attackBaseStats + "</td>";
                    html += "<td>" + petFuture.defenseBaseStats + "</td>";
                    html += "<td>" + petFuture.specialAttackBaseStats + "</td>";
                    html += "<td>" + petFuture.specialDefenseBaseStats + "</td>";
                    html += "<td>" + petFuture.speedBaseStats + "</td>";
                    html += "<td rowspan='2'>" + petFuture.healthEffort + "</td>";
                    html += "<td rowspan='2'>" + petFuture.attackEffort + "</td>";
                    html += "<td rowspan='2'>" + petFuture.defenseEffort + "</td>";
                    html += "<td rowspan='2'>" + petFuture.specialAttackEffort + "</td>";
                    html += "<td rowspan='2'>" + petFuture.specialDefenseEffort + "</td>";
                    html += "<td rowspan='2'>" + petFuture.speedEffort + "</td>";
                    html += "<td rowspan='2'>" + petFuture.catchRatio + "</td>";
                    html += "<td rowspan='2'>" + petFuture.growExperience + "</td>";
                    html += "</tr>";
                    html += "<tr style='background-color:black;color:wheat;font-weight:bold;text-align:center'>";
                    html += "<td>" + petFuture.perfectHealth + "</td>";
                    html += "<td>" + petFuture.perfectAttack + "</td>";
                    html += "<td>" + petFuture.perfectDefense + "</td>";
                    html += "<td>" + petFuture.perfectSpecialAttack + "</td>";
                    html += "<td>" + petFuture.perfectSpecialDefense + "</td>";
                    html += "<td>" + petFuture.perfectSpeed + "</td>";
                    html += "</tr>";
                    html += "</tbody>";
                    html += "</table>";
                    $("#messageBoard").html(html);
                })
                .on("mouseleave", function () {
                    MessageBoard.resetMessageBoard("全新的宠物管理UI为您带来不一样的感受，试试把鼠标停留在宠物图片上有惊喜。<br>" +
                        "手机用户请试试单击宠物名字那一栏。");
                });
        }
    }
}

function doRenderGoldenCage(credential: Credential) {
    const s = $("#goldenCageIndex").text();
    if (s === "none") {
        return;
    }
    const index = parseInt(s);
    const request = credential.asRequest();
    // @ts-ignore
    request["chara"] = "1";
    // @ts-ignore
    request["item" + index] = index;
    // @ts-ignore
    request["mode"] = "USE";
    NetworkUtils.sendPostRequest("mydata.cgi", request, function (pageHtml) {
        const cagePetList = PetParser.parseGoldenCagePetList(pageHtml);

        let html = "";
        html += "<table style='border-width:0;background-color:#888888;text-align:center;width:100%'>";
        html += "<tbody style='background-color:#F8F0E0'>";
        html += "<tr>";
        html += "<td style='background-color:#E8E8D0'>宠物名</td>";
        html += "<td style='background-color:#E8E8D0'>Ｌｖ</td>";
        html += "<td style='background-color:#E8E8D0'>ＨＰ</td>";
        html += "<td style='background-color:#E8E8D0'>攻击力</td>";
        html += "<td style='background-color:#E8E8D0'>防御力</td>";
        html += "<td style='background-color:#E8E8D0'>智力</td>";
        html += "<td style='background-color:#E8E8D0'>精神力</td>";
        html += "<td style='background-color:#E8E8D0'>速度</td>";
        html += "<td style='background-color:#E8E8D0'>经验</td>";
        html += "<td style='background-color:#E8E8D0'>性别</td>";
        html += "<td style='background-color:#E8E8D0'>取出</td>";
        html += "</tr>";
        for (const pet of cagePetList) {
            html += "<tr>";
            html += "<td style='background-color:#E8E8D0'>" + pet.name + "</td>";
            html += "<td style='background-color:#E8E8D0'>" + pet.level + "</td>";
            html += "<td style='background-color:#E8E8D0'>" + pet.health + "/" + pet.maxHealth + "</td>";
            html += "<td style='background-color:#E8E8D0'>" + pet.attack + "</td>";
            html += "<td style='background-color:#E8E8D0'>" + pet.defense + "</td>";
            html += "<td style='background-color:#E8E8D0'>" + pet.specialAttack + "</td>";
            html += "<td style='background-color:#E8E8D0'>" + pet.specialDefense + "</td>";
            html += "<td style='background-color:#E8E8D0'>" + pet.speed + "</td>";
            html += "<td style='background-color:#E8E8D0'>" + pet.experience + "</td>";
            html += "<td style='background-color:#E8E8D0'>" + pet.gender + "</td>";
            html += "<td style='background-color:#E8E8D0'>";
            html += "<input type='button' class='PetUIButton' id='takeOutButton_" + pet.index + "' value='取出'>";
            html += "</td>";
            html += "</tr>";
        }
        html += "</tbody>";
        html += "</table>";

        $("#goldenCageContainer")
            .html(html)
            .parent()
            .show();
        $("#goldenCageStatus").text("on");

        for (const pet of cagePetList) {
            doBindTakeOutButton(credential, pet.index!);
        }
    });
}

function doBind(credential: Credential, petList: Pet[]) {
    for (let i = 0; i < petList.length; i++) {
        const pet = petList[i];
        let buttonId = "pet_" + pet.index + "_uninstall";
        if (!$("#" + buttonId).prop("disabled")) {
            doBindPetUninstallButton(credential, buttonId);
        }
        buttonId = "pet_" + pet.index + "_install";
        if (!$("#" + buttonId).prop("disabled")) {
            doBindPetInstallButton(credential, buttonId, pet);
        }
        buttonId = "pet_" + pet.index + "_cage";
        if (!$("#" + buttonId).prop("disabled")) {
            doBindPetCageButton(credential, buttonId, pet);
        }

        doBindPetSpellButton(credential, pet);

        buttonId = "pet_" + pet.index + "_love";
        if (!$("#" + buttonId).prop("disabled")) {
            doBindPetLoveButton(credential, buttonId, pet);
        }
        buttonId = "pet_" + pet.index + "_league";
        if (!$("#" + buttonId).prop("disabled")) {
            doBindPetLeagueButton(credential, buttonId, pet);
        }
        buttonId = "pet_" + pet.index + "_rename";
        if (!$("#" + buttonId).prop("disabled")) {
            doBindPetRenameButton(credential, buttonId, pet);
        }

        buttonId = "pet_" + pet.index + "_consecrate";
        if (!$("#" + buttonId).prop("disabled")) {
            doBindPetConsecrateButton(credential, buttonId, pet);
        }

        buttonId = "pet_" + pet.index + "_send";
        if (!$("#" + buttonId).prop("disabled")) {
            doBindPetSendButton(credential, buttonId, pet);
        }
    }

    // 设置宠物技能学习位的按钮行为
    doBindPetStudyButton(credential);

    // 设置查找发送对象按钮行为
    doBindSearchButton(credential);

    // 设置更新按钮行为
    doBindRefreshButton(credential);

    // 设置黄金笼子按钮的行为
    doBindGoldenCageButton(credential);
}

function doRefresh(credential: Credential) {
    const request = credential.asRequest();
    // @ts-ignore
    request["mode"] = "PETSTATUS";
    NetworkUtils.sendPostRequest("mydata.cgi", request, function (html) {
        // 从新的宠物界面中重新解析宠物状态
        const petList = PetParser.parsePersonalPetList(html);
        const petStudyStatus = PetParser.parsePersonalPetStudyStatus(html);

        $(".pet_picture_class").off("mouseenter").off("mouseleave");
        // 解除当前所有的按钮
        $(".PetUIButton").off("click");
        // 清除PetUI的内容
        $("#pet_management_container").html("");
        // 清除牧场
        $("#ranchList").html("").parent().hide();
        $("#ranchMenu").hide();
        new PersonalStatus(credential).open().then(page => {
            const role = page.role;
            // 使用新的宠物重新渲染PetUI
            doRender(credential, petList, petStudyStatus, role);
        });
    });
}

function doBindPetUninstallButton(credential: Credential, buttonId: string) {
    $("#" + buttonId).on("click", function () {
        const request = credential.asRequest();
        // @ts-ignore
        request["select"] = "-1";
        // @ts-ignore
        request["mode"] = "CHOOSEPET";
        NetworkUtils.sendPostRequest("mydata.cgi", request, function (html) {
            MessageBoard.processResponseMessage(html);
            doRefresh(credential);
        });
    });
}

function doBindPetInstallButton(credential: Credential, buttonId: string, pet: Pet) {
    $("#" + buttonId).on("click", function () {
        const request = credential.asRequest();
        // @ts-ignore
        request["select"] = pet.index;
        // @ts-ignore
        request["mode"] = "CHOOSEPET";
        NetworkUtils.sendPostRequest("mydata.cgi", request, function (html) {
            MessageBoard.processResponseMessage(html);
            doRefresh(credential);
        });
    });
}

function doBindPetCageButton(credential: Credential, buttonId: string, pet: Pet) {
    $("#" + buttonId).on("click", function () {
        const request = credential.asRequest();
        // @ts-ignore
        request["select"] = pet.index;
        // @ts-ignore
        request["mode"] = "PUTINLONGZI";
        NetworkUtils.sendPostRequest("mydata.cgi", request, function (html) {
            MessageBoard.processResponseMessage(html);
            doRefresh(credential);
        });
    });
}

function doBindPetSpellButton(credential: Credential, pet: Pet) {
    $("#" + "pet_" + pet.index + "_spell_1").on("click", function () {
        const request = credential.asRequest();
        // @ts-ignore
        request["select"] = pet.index;
        // @ts-ignore
        request["mode"] = "PETUSESKILL_SET";
        if (PageUtils.isColorGrey("pet_" + pet.index + "_spell_1")) {
            // 启用当前的技能
            // @ts-ignore
            request["use1"] = "1";
        }
        if (PageUtils.isColorBlue("pet_" + pet.index + "_spell_2")) {
            // @ts-ignore
            request["use2"] = "2";
        }
        if (PageUtils.isColorBlue("pet_" + pet.index + "_spell_3")) {
            // @ts-ignore
            request["use3"] = "3";
        }
        if (PageUtils.isColorBlue("pet_" + pet.index + "_spell_4")) {
            // @ts-ignore
            request["use4"] = "4";
        }
        NetworkUtils.sendPostRequest("mydata.cgi", request, function (html) {
            MessageBoard.processResponseMessage(html);
            doRefresh(credential);
        });
    });
    $("#" + "pet_" + pet.index + "_spell_2").on("click", function () {
        const request = credential.asRequest();
        // @ts-ignore
        request["select"] = pet.index;
        // @ts-ignore
        request["mode"] = "PETUSESKILL_SET";
        if (PageUtils.isColorGrey("pet_" + pet.index + "_spell_2")) {
            // 启用当前的技能
            // @ts-ignore
            request["use2"] = "2";
        }
        if (PageUtils.isColorBlue("pet_" + pet.index + "_spell_1")) {
            // @ts-ignore
            request["use1"] = "1";
        }
        if (PageUtils.isColorBlue("pet_" + pet.index + "_spell_3")) {
            // @ts-ignore
            request["use3"] = "3";
        }
        if (PageUtils.isColorBlue("pet_" + pet.index + "_spell_4")) {
            // @ts-ignore
            request["use4"] = "4";
        }
        NetworkUtils.sendPostRequest("mydata.cgi", request, function (html) {
            MessageBoard.processResponseMessage(html);
            doRefresh(credential);
        });
    });
    $("#" + "pet_" + pet.index + "_spell_3").on("click", function () {
        const request = credential.asRequest();
        // @ts-ignore
        request["select"] = pet.index;
        // @ts-ignore
        request["mode"] = "PETUSESKILL_SET";
        if (PageUtils.isColorGrey("pet_" + pet.index + "_spell_3")) {
            // 启用当前的技能
            // @ts-ignore
            request["use3"] = "3";
        }
        if (PageUtils.isColorBlue("pet_" + pet.index + "_spell_1")) {
            // @ts-ignore
            request["use1"] = "1";
        }
        if (PageUtils.isColorBlue("pet_" + pet.index + "_spell_2")) {
            // @ts-ignore
            request["use2"] = "2";
        }
        if (PageUtils.isColorBlue("pet_" + pet.index + "_spell_4")) {
            // @ts-ignore
            request["use4"] = "4";
        }
        NetworkUtils.sendPostRequest("mydata.cgi", request, function (html) {
            MessageBoard.processResponseMessage(html);
            doRefresh(credential);
        });
    });
    $("#" + "pet_" + pet.index + "_spell_4").on("click", function () {
        const request = credential.asRequest();
        // @ts-ignore
        request["select"] = pet.index;
        // @ts-ignore
        request["mode"] = "PETUSESKILL_SET";
        if (PageUtils.isColorGrey("pet_" + pet.index + "_spell_4")) {
            // 启用当前的技能
            // @ts-ignore
            request["use4"] = "4";
        }
        if (PageUtils.isColorBlue("pet_" + pet.index + "_spell_1")) {
            // @ts-ignore
            request["use1"] = "1";
        }
        if (PageUtils.isColorBlue("pet_" + pet.index + "_spell_2")) {
            // @ts-ignore
            request["use2"] = "2";
        }
        if (PageUtils.isColorBlue("pet_" + pet.index + "_spell_3")) {
            // @ts-ignore
            request["use3"] = "3";
        }
        NetworkUtils.sendPostRequest("mydata.cgi", request, function (html) {
            MessageBoard.processResponseMessage(html);
            doRefresh(credential);
        });
    });
}

function doBindPetLoveButton(credential: Credential, buttonId: string, pet: Pet) {
    $("#" + buttonId).on("click", function () {
        const amount = Math.ceil(100 - pet.love!);
        const bank = new TownBank(credential);
        bank.withdraw(amount).then(() => {
            const request = credential.asRequest();
            // @ts-ignore
            request["mode"] = "PETADDLOVE";
            // @ts-ignore
            request["select"] = pet.index;
            NetworkUtils.sendPostRequest("mydata.cgi", request, function (html) {
                MessageBoard.processResponseMessage(html);
                bank.deposit().then(() => {
                    doRefresh(credential);
                });
            });
        });
    });
}

function doBindPetLeagueButton(credential: Credential, buttonId: string, pet: Pet) {
    $("#" + buttonId).on("click", function () {
        const request = credential.asRequest();
        // @ts-ignore
        request["select"] = pet.index;
        // @ts-ignore
        request["mode"] = "PETGAME";
        NetworkUtils.sendPostRequest("mydata.cgi", request, function (html) {
            if (html.includes("ERROR !")) {
                const result = $(html).find("font b").text();
                MessageBoard.publishWarning(result);
                doRefresh(credential);
            } else {
                // 由于目前登陆宠联的操作不会触发页面刷新，因此直接返回主页面
                $("#returnButton").trigger("click");
            }
        });
    });
}

function doBindPetRenameButton(credential: Credential, buttonId: string, pet: Pet) {
    $("#" + buttonId).on("click", function () {
        const textId = "pet_" + pet.index + "_name_text";
        let newName = $("#" + textId).val();
        if (newName !== "") {
            newName = escape(newName as string);
            const request = credential.asRequest();
            // @ts-ignore
            request["select"] = pet.index;
            // @ts-ignore
            request["name"] = newName;
            // @ts-ignore
            request["mode"] = "PETCHANGENAME";
            NetworkUtils.sendPostRequest("mydata.cgi", request, function (html) {
                MessageBoard.processResponseMessage(html);
                doRefresh(credential);
            });
        }
    });
}

function doBindPetConsecrateButton(credential: Credential, buttonId: string, pet: Pet) {
    $("#" + buttonId).on("click", function () {
        if (!confirm("你确认要献祭宠物" + pet.name + "吗？")) {
            return;
        }
        const bank = new TownBank(credential);
        bank.withdraw(1000).then(() => {
            consecratePet(credential, pet.index!).then(() => {
                bank.deposit().then(() => {
                    doRefresh(credential);
                });
            });
        });
    });
}

function doBindPetSendButton(credential: Credential, buttonId: string, pet: Pet) {
    $("#" + buttonId).on("click", function () {
        const receiver = $("#receiverCandidates").val();
        if (receiver === undefined || receiver === "") {
            MessageBoard.publishWarning("没有选择发送对象！");
            return;
        }
        const bank = new TownBank(credential);
        bank.withdraw(10).then(() => {
            const request = credential.asRequest();
            // @ts-ignore
            request["mode"] = "PET_SEND2";
            // @ts-ignore
            request["eid"] = receiver;
            // @ts-ignore
            request["select"] = pet.index;
            NetworkUtils.sendPostRequest("town.cgi", request, function (html) {
                MessageBoard.processResponseMessage(html);
                bank.deposit().then(() => {
                    doRefresh(credential);
                });
            });
        });
    });
}

function doBindPetStudyButton(credential: Credential) {
    $("#pet_spell_study_1").on("click", function () {
        const request = credential.asRequest();
        const color = $("#pet_spell_study_1").css("color");
        if (color.toString() === "rgb(128, 128, 128)") {
            // @ts-ignore
            request["study1"] = "1";
        }
        if (color.toString() === "rgb(0, 0, 255)") {
            // 当前是已经设置学习状态
        }
        // @ts-ignore
        request["mode"] = "STUDY_SET";
        NetworkUtils.sendPostRequest("mydata.cgi", request, function (html) {
            MessageBoard.processResponseMessage(html);
            doRefresh(credential);
        });
    });
    $("#pet_spell_study_2").on("click", function () {
        const request = credential.asRequest();
        const color = $("#pet_spell_study_2").css("color");
        if (color.toString() === "rgb(128, 128, 128)") {
            // @ts-ignore
            request["study2"] = "2";
        }
        if (color.toString() === "rgb(0, 0, 255)") {
            // 当前是已经设置学习状态
        }
        // @ts-ignore
        request["mode"] = "STUDY_SET";
        NetworkUtils.sendPostRequest("mydata.cgi", request, function (html) {
            MessageBoard.processResponseMessage(html);
            doRefresh(credential);
        });
    });
    $("#pet_spell_study_3").on("click", function () {
        const request = credential.asRequest();
        const color = $("#pet_spell_study_3").css("color");
        if (color.toString() === "rgb(128, 128, 128)") {
            // @ts-ignore
            request["study3"] = "3";
        }
        if (color.toString() === "rgb(0, 0, 255)") {
            // 当前是已经设置学习状态
        }
        // @ts-ignore
        request["mode"] = "STUDY_SET";
        NetworkUtils.sendPostRequest("mydata.cgi", request, function (html) {
            MessageBoard.processResponseMessage(html);
            doRefresh(credential);
        });
    });
    $("#pet_spell_study_4").on("click", function () {
        const request = credential.asRequest();
        const color = $("#pet_spell_study_4").css("color");
        if (color.toString() === "rgb(128, 128, 128)") {
            // @ts-ignore
            request["study4"] = "4";
        }
        if (color.toString() === "rgb(0, 0, 255)") {
            // 当前是已经设置学习状态
        }
        // @ts-ignore
        request["mode"] = "STUDY_SET";
        NetworkUtils.sendPostRequest("mydata.cgi", request, function (html) {
            MessageBoard.processResponseMessage(html);
            doRefresh(credential);
        });
    });
}

function doBindSearchButton(credential: Credential) {
    $("#searchReceiverButton").on("click", function () {
        const search = $("#receiverName").val();
        if ((search as string).trim() === "") {
            MessageBoard.publishWarning("接收人没有输入！");
            return;
        }
        const request = credential.asRequest();
        // @ts-ignore
        request["mode"] = "PET_SEND";
        // @ts-ignore
        request["serch"] = escape(search.trim());
        NetworkUtils.sendPostRequest("town.cgi", request, function (html) {
            const optionHTML = $(html).find("select[name='eid']").html();
            $("#receiverCandidates").html(optionHTML);
        });
    });
}

function doBindRefreshButton(credential: Credential) {
    $("#refreshButton").on("click", function () {
        MessageBoard.resetMessageBoard("");
        doRefresh(credential);
    });
}

async function consecratePet(credential: Credential, petIndex: number) {
    const action = function (credential: Credential, petIndex: number) {
        return new Promise<void>((resolve) => {
            const request = credential.asRequest();
            // @ts-ignore
            request["select"] = petIndex;
            // @ts-ignore
            request["mode"] = "PETBORN6";
            NetworkUtils.sendPostRequest("mydata.cgi", request, function (html) {
                MessageBoard.processResponseMessage(html);
                resolve();
            });
        });
    }
    return await action(credential, petIndex);
}

function doBindGoldenCageButton(credential: Credential) {
    $("#openCageButton").on("click", function () {
        if ($("#goldenCageStatus").text() === "on") {
            return;
        }
        doRenderGoldenCage(credential);
    });
    $("#closeCageButton").on("click", function () {
        if ($("#goldenCageStatus").text() === "off") {
            return;
        }
        $("#goldenCageContainer")
            .html("")
            .parent()
            .hide();
        $("#goldenCageStatus").text("off");
    });
}

function doBindTakeOutButton(credential: Credential, index: number) {
    $("#takeOutButton_" + index).on("click", function () {
        const select = StringUtils.substringAfter($(this).attr("id") as string, "_");
        const request = credential.asRequest();
        // @ts-ignore
        request["select"] = select;
        // @ts-ignore
        request["mode"] = "GETOUTLONGZI";
        NetworkUtils.sendPostRequest("mydata.cgi", request, function (html) {
            MessageBoard.processResponseMessage(html);
            doRefresh(credential);
        });
    });
}

function doRenderRanch(credential: Credential) {
    new CastleRanch(credential).enter().then(status => {
        const petList = Pet.sortPetList(status.ranchPetList!);

        let html = "";
        html += "<table style='border-width:0;background-color:#888888;margin:auto;width:100%'>";
        html += "<tbody style='background-color:#F8F0E0;text-align:center'>";
        html += "<tr>";
        html += "<td style='background-color:darkgreen;color:wheat;font-weight:bold' colspan='10'>";
        html += "＜ 城 堡 牧 场 ＞";
        html += "</td>";
        html += "<tr>";
        html += "<th style='background-color:#E8E8D0'>名字</th>";
        html += "<th style='background-color:#EFE0C0'>等级</th>";
        html += "<th style='background-color:#E0D0B0'>生命</th>";
        html += "<th style='background-color:#E0D0B0'>攻击</th>";
        html += "<th style='background-color:#E0D0B0'>防御</th>";
        html += "<th style='background-color:#E0D0B0'>智力</th>";
        html += "<th style='background-color:#E0D0B0'>精神</th>";
        html += "<th style='background-color:#E0D0B0'>速度</th>";
        html += "<th style='background-color:#EFE0C0'>经验</th>";
        html += "<th style='background-color:#EFE0C0'>性别</th>";
        html += "</tr>";

        for (const pet of petList) {
            html += "<tr>";
            html += "<td style='background-color:#E8E8D0'>" + pet.name + "</td>";
            html += "<td style='background-color:#EFE0C0'>" + pet.levelHtml + "</td>";
            html += "<td style='background-color:#E0D0B0'>" + pet.healthHtml + "</td>";
            html += "<td style='background-color:#E0D0B0'>" + pet.attackHtml + "</td>";
            html += "<td style='background-color:#E0D0B0'>" + pet.defenseHtml + "</td>";
            html += "<td style='background-color:#E0D0B0'>" + pet.specialAttackHtml + "</td>";
            html += "<td style='background-color:#E0D0B0'>" + pet.specialDefenseHtml + "</td>";
            html += "<td style='background-color:#E0D0B0'>" + pet.speedHtml + "</td>";
            html += "<td style='background-color:#EFE0C0'>" + pet.experienceHtml + "</td>";
            html += "<td style='background-color:#EFE0C0'>" + pet.gender + "</td>";
            html += "</tr>";
        }

        html += "</tbody>";
        html += "</table>";

        $("#ranchList").html(html).parent().show();
    });
}

export = PersonalPetManagementPageProcessor_Town;