import PageProcessor from "../PageProcessor";
import PageUtils from "../../util/PageUtils";
import PetParser from "../../pocket/PetParser";
import Credential from "../../util/Credential";
import Pet from "../../pocket/Pet";
import StringUtils from "../../util/StringUtils";
import RoleLoader from "../../pocket/RoleLoader";
import MessageBoard from "../../util/MessageBoard";
import NetworkUtils from "../../util/NetworkUtils";
import TownBank from "../../pocket/TownBank";
import EquipmentParser from "../../pocket/EquipmentParser";

class PersonalPetManagementProcessor extends PageProcessor {

    process() {
        PageUtils.removeUnusedHyperLinks();
        PageUtils.removeGoogleAnalyticsScript();
        const credential = PageUtils.currentCredential();
        const petList = PetParser.parsePersonalPetList(this.pageHtml);
        const studyStatus = PetParser.parsePersonalPetStudyStatus(this.pageHtml);
        doProcess(credential, petList, studyStatus);
    }
}

function doProcess(credential: Credential, petList: Pet[], studyStatus: number[]) {
    $("input:submit[value='返回城市']").attr("id", "returnButton");

    let html = "<center>";
    html += "<table style='background-color:#888888;width:100%;text-align:center'>";
    html += "<tbody style='background-color:#F8F0E0'>";
    html += "<tr>";
    html += "<td style='background-color:navy;color:yellowgreen;font-size:200%;font-weight:bold'>" +
        "＜＜  宠 物 管 理  ＞＞" +
        "</td>";
    html += "</tr>";
    html += "<tr style='display:none'>";
    html += "<td id='eden'></td>";
    html += "</tr>";
    html += "<tr>";
    html += "<td id='message_board_container'></td>";
    html += "</tr>";
    html += "<tr>";
    html += "<td id='pet_management_container'></td>";
    html += "</tr>";
    html += "</tody>";
    html += "</table>";
    html += "<center>已登陆宠物联赛的宠物一览";

    const leftHtml = StringUtils.substringAfter(PageUtils.currentPageHtml(), "<center>已登陆宠物联赛的宠物一览");

    $("body:first").html(html + leftHtml);

    new RoleLoader(credential).load()
        .then(role => {
            MessageBoard.createMessageBoard("message_board_container", role.imageHtml);
            MessageBoard.resetMessageBoard("全新的宠物管理UI为您带来不一样的感受。");
        });

    doRender(credential, petList, studyStatus);
}

function doRender(credential: Credential, petList: Pet[], studyStatus: number[]) {
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
    html += "</tr>";
    for (const pet of petList) {
        html += "<tr>";
        html += "<td style='background-color:#EFE0C0' rowspan='2'>" +
            pet.imageHTML +
            "</td>";
        html += "<td style='background-color:#EFE0C0' rowspan='2'>" +
            (pet.using ? "★" : "") +
            "</td>";
        html += "<td style='background-color:#E8E8D0'>" +
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
        html += "</tr>";
        html += "<tr>";
        html += "<td colspan='17' style='text-align: left'>";        // 当前宠物的操作位置
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
    html += "<tr><td style='background-color:#EFE0C0;text-align:right' colspan='19'>";
    html += "<input type='text' id='receiverName' size='15' maxlength='20'>";
    html += "<input type='button' class='PetUIButton' id='searchReceiverButton' value='找人'>";
    html += "<select name='eid' id='receiverCandidates'><option value=''>选择发送对象</select>";
    html += "</td></tr>";
    html += "<tr><td style='background-color:#EFE0C0;text-align:center' colspan='19'>";
    html += "<b style='color:navy'>设置宠物升级时学习技能情况</b>";
    html += "</td></tr>";
    html += "<tr><td style='background-color:#E8E8D0;text-align:center' colspan='19'>";
    html += "<input type='button' class='PetUIButton' value='第１技能位' id='pet_spell_study_1'>";
    html += "<input type='button' class='PetUIButton' value='第２技能位' id='pet_spell_study_2'>";
    html += "<input type='button' class='PetUIButton' value='第３技能位' id='pet_spell_study_3'>";
    html += "<input type='button' class='PetUIButton' value='第４技能位' id='pet_spell_study_4'>";
    html += "</td></tr>";
    html += "<tr><td style='background-color:#E8E8D0;text-align:center' colspan='19'>";
    html += "<input type='button' class='PetUIButton' value='刷新宠物管理' id='refreshButton'>";
    html += "<input type='button' class='PetUIButton' value='打开黄金笼子' id='goldenCageButton'>";
    html += "</td></tr>";
    html += "</tbody>";
    html += "</table>";

    $("#pet_management_container").html(html);

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

    // 绑定按钮点击事件处理
    doBind(credential, petList);
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
        // 解除当前所有的按钮
        $(".PetUIButton").off("click");
        // 清除PetUI的内容
        $("#pet_management_container").html("");
        // 使用新的宠物重新渲染PetUI
        doRender(credential, petList, petStudyStatus);
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
        bank.withdraw(amount)
            .then(success => {
                if (!success) {
                    MessageBoard.publishWarning("没钱就不要顾及宠物亲密度了！");
                } else {
                    const request = credential.asRequest();
                    // @ts-ignore
                    request["mode"] = "PETADDLOVE";
                    // @ts-ignore
                    request["select"] = pet.index;
                    NetworkUtils.sendPostRequest("mydata.cgi", request, function (html) {
                        MessageBoard.processResponseMessage(html);
                        bank.deposit(undefined)
                            .then(() => {
                                doRefresh(credential);
                            });
                    });
                }
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
        bank.withdraw(1000)
            .then(success => {
                if (!success) {
                    MessageBoard.publishWarning("没钱玩什么献祭！");
                    return;
                }
                consecratePet(credential, pet.index!)
                    .then(() => {
                        bank.deposit(undefined)
                            .then(() => {
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
        bank.withdraw(10)
            .then(success => {
                if (!success) {
                    MessageBoard.publishWarning("没钱还是自己留着宠物吧！");
                    return;
                }
                const request = credential.asRequest();
                // @ts-ignore
                request["mode"] = "PET_SEND2";
                // @ts-ignore
                request["eid"] = receiver;
                // @ts-ignore
                request["select"] = pet.index;
                NetworkUtils.sendPostRequest("town.cgi", request, function (html) {
                    MessageBoard.processResponseMessage(html);
                    bank.deposit(undefined)
                        .then(() => {
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
    $("#goldenCageButton").on("click", function () {
        const request = credential.asRequest();
        // @ts-ignore
        request["mode"] = "USE_ITEM";
        NetworkUtils.sendPostRequest("mydata.cgi", request, function (html) {
            const equipmentList = EquipmentParser.parsePersonalItemList(html);
            const cage = EquipmentParser.findGoldenCage(equipmentList);
            if (cage !== null) {
                $("form[action='status.cgi']").attr("action", "mydata.cgi");
                $("input:hidden[value='STATUS']").attr("value", "USE");
                $("#returnButton").prepend("<input type='hidden' name='chara' value='1'>");
                $("#returnButton").prepend("<input type='hidden' name='item" + cage.index + "' value='" + cage.index + "'>");
                $("#returnButton").trigger("click");
            }
        });
    });
}

export = PersonalPetManagementProcessor;