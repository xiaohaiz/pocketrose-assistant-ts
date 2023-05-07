import PageUtils from "../../util/PageUtils";
import EquipmentParser from "../../pocket/EquipmentParser";
import Credential from "../../util/Credential";
import Equipment from "../../pocket/Equipment";
import MessageBoard from "../../util/MessageBoard";
import NetworkUtils from "../../util/NetworkUtils";
import EquipmentSet from "../../pocket/EquipmentSet";
import EquipmentSetLoader from "../../pocket/EquipmentSetLoader";
import TownBank from "../../pocket/TownBank";
import SetupLoader from "../../pocket/SetupLoader";
import CommentBoard from "../../util/CommentBoard";
import NpcLoader from "../../pocket/NpcLoader";
import RoleStatusLoader from "../../pocket/RoleStatusLoader";
import Processor from "../Processor";
import RoleLoader from "../../pocket/RoleLoader";
import LocationStateMachine from "../../core/LocationStateMachine";
import WildPersonalEquipmentManagementProcessor from "./internal/WildPersonalEquipmentManagementProcessor";

class PersonalEquipmentManagementProcessor implements Processor {

    accept(cgi: string, pageText: string): boolean {
        if (!SetupLoader.isEquipmentManagementUIEnabled()) {
            return false;
        }
        if (cgi === "mydata.cgi") {
            return pageText.includes("＜＜　|||　物品使用．装备　|||　＞＞");
        }
        return false;
    }

    process() {
        LocationStateMachine.currentLocationStateMachine()
            .load()
            .whenInTown(() => {
                PageUtils.removeUnusedHyperLinks();
                PageUtils.removeGoogleAnalyticsScript();
                const credential = PageUtils.currentCredential();
                const pageHtml = document.documentElement.outerHTML;
                const equipmentList = EquipmentParser.parsePersonalItemList(pageHtml);
                doProcess(credential, equipmentList);
            })
            .whenInCastle(() => {
                PageUtils.removeUnusedHyperLinks();
                PageUtils.removeGoogleAnalyticsScript();
                const credential = PageUtils.currentCredential();
                const pageHtml = document.documentElement.outerHTML;
                const equipmentList = EquipmentParser.parsePersonalItemList(pageHtml);
                doProcess(credential, equipmentList);
            })
            .whenInWild(() => {
                new WildPersonalEquipmentManagementProcessor().process();
            })
            .fork();
    }

}

function doProcess(credential: Credential, equipmentList: Equipment[]) {
    const roleImage = PageUtils.findFirstRoleImageHtml();

    // 修改标题
    $("table:first").removeAttr("height");
    $("table:first td:first").css("text-align", "center");
    $("table:first td:first").css("font-size", "150%");
    $("table:first td:first").css("font-weight", "bold");
    $("table:first td:first").css("background-color", "navy");
    $("table:first td:first").css("color", "greenyellow");
    $("table:first td:first").text("＜＜　 装 备 管 理 　＞＞");

    // 创建消息面板
    $("table:first tr:first").after($("<tr><td style='background-color:#E8E8D0' id='message_board_container'></td></tr>"));
    MessageBoard.createMessageBoard("message_board_container", roleImage!);
    MessageBoard.resetMessageBoard("全新的装备管理界面为您带来全新的体验。");

    // 删除旧的页面组件，并且预留新的刷新的位置
    // 预留了两个div，ItemUI用于页面刷新，Eden隐藏用于放置表单以便可以转移到其他的页面
    $("table:first tr:first").next().next()
        .html("<td style='background-color:#F8F0E0'>" +
            "<div id='ItemUI'></div><div id='Eden' style='display:none'></div>" +
            "<div id='treasureBagIndex' style='display:none'>none</div>" +
            "<div id='treasureBagStatus' style='display:none'>off</div>" +
            "<div id='hasTreasureBag' style='display:none'>false</div>" +
            "<div id='roleLocation' style='display:none'></div>" +
            "</td>");
    // 在Eden里面添加预制的表单
    $("#Eden").html("" +
        "<form action='' method='post' id='eden_form'>" +
        "        <input type='hidden' name='id' value='" + credential.id + "'>" +
        "        <input type='hidden' name='pass' value='" + credential.pass + "'>" +
        "        <div id='eden_form_payload' style='display:none'></div>" +
        "        <input type='submit' id='eden_form_submit'>" +
        "</form>" +
        "<form action='mydata.cgi' method='post' id='consecrateForm'>" +
        "<input type='hidden' name='id' value='" + credential.id + "'>" +
        "<input type='hidden' name='pass' value='" + credential.pass + "'>" +
        "<input type='hidden' name='chara' value='1'>" +
        "<input type='hidden' name='mode' value='CONSECRATE'>" +
        "<div id='consecrateFormPayload' style='display:none'></div>" +
        "<input type='submit' id='consecrateSubmit'>" +
        "</form>");

    // 将返回按钮调整到页面中间，并且删除不需要的内容
    $("table:first tr:first").next().next().next()
        .html("<td style='background-color:#F8F0E0;text-align:center'>" +
            "    <input type='button' id='returnButton' value='返回上个画面'>" +
            "</td>");
    $("#returnButton").on("click", function () {
        $("#eden_form").attr("action", "status.cgi");
        $("#eden_form_payload").html("<input type='hidden' name='mode' value='STATUS'>");
        $("#eden_form_submit").trigger("click");
    });

    CommentBoard.createCommentBoard(NpcLoader.getNpcImageHtml("饭饭")!);
    CommentBoard.writeMessage("我就要一键祭奠，就要，就要！");
    CommentBoard.writeMessage("<input type='button' id='consecrateButton' value='祭奠选择的装备'>");
    $("#consecrateButton").hide();
    doBindConsecrateButton(credential);

    $("#p_3139").on("click", function () {
        $("#p_3139").off("click");
        new RoleStatusLoader(credential).loadRoleStatus()
            .then(status => {
                if (status.canConsecrate) {
                    $("#consecrateButton").show();
                } else {
                    MessageBoard.publishWarning("祭奠还在冷却中！");
                }
            });
    });

    new RoleLoader(credential).load()
        .then(role => {
            // 已经掌握了剑圣职业，说明应该有百宝袋，但是因为某些bug导致百宝袋不可见了，
            // 还是提供有限的百宝袋功能吧，能够放入、取出，但是不能浏览了。
            // 如果有分身了，那也说明曾经掌握过剑圣职业，就算有百宝袋了
            if (role.masterCareerList!.includes("剑圣") || role.hasMirror!) {
                $("#hasTreasureBag").text("true");
            }
            $("#roleLocation").text(role.location!);

            doRender(credential, equipmentList);
        })
        .catch(() => {
            // 在野外无法查询个人状态，会返回非法访问9的错误，先临时这样解决
            doRender(credential, equipmentList);
        });
}

function doRender(credential: Credential, equipmentList: Equipment[]) {
    let html = "";
    html += "<table style='background-color:#888888;width:100%;text-align:center'>";
    html += "   <tbody style='background-color:#F8F0E0'>";
    html += "       <tr>";
    html += "           <th style='background-color:#E8E8D0'>选择</th>";
    html += "           <th style='background-color:#EFE0C0'>装备</th>";
    html += "           <th style='background-color:#E0D0B0'>名字</th>";
    html += "           <th style='background-color:#EFE0C0'>种类</th>";
    html += "           <th style='background-color:#E0D0B0'>效果</th>";
    html += "           <th style='background-color:#EFE0C0'>重量</th>";
    html += "           <th style='background-color:#EFE0C0'>耐久</th>";
    html += "           <th style='background-color:#E0D0B0'>职业</th>";
    html += "           <th style='background-color:#E0D0B0'>攻击</th>";
    html += "           <th style='background-color:#E0D0B0'>防御</th>";
    html += "           <th style='background-color:#E0D0B0'>智力</th>";
    html += "           <th style='background-color:#E0D0B0'>精神</th>";
    html += "           <th style='background-color:#E0D0B0'>速度</th>";
    html += "           <th style='background-color:#E0D0B0'>威力</th>";
    html += "           <th style='background-color:#E0D0B0'>重量</th>";
    html += "           <th style='background-color:#E0D0B0'>幸运</th>";
    html += "           <th style='background-color:#E0D0B0'>经验</th>";
    html += "           <th style='background-color:#EFE0C0'>属性</th>";
    html += "       </tr>";
    for (const equipment of equipmentList) {
        if (equipment.isTreasureBag || equipment.isGoldenCage) {
            // 百宝袋和黄金笼子不再显示在页面上
            continue;
        }
        html += "<tr>";
        html += "    <td style='background-color:#E8E8D0'>";
        html += "    " + equipment.checkboxHTML;
        html += "    </td>";
        html += "    <td style='background-color:#EFE0C0'>";
        html += "    " + equipment.usingHTML;
        html += "    </td>";
        html += "    <td style='background-color:#E0D0B0'>";
        html += "    " + equipment.nameHTML;
        html += "    </td>";
        html += "    <td style='background-color:#EFE0C0'>";
        html += "    " + equipment.category;
        html += "    </td>";
        html += "    <td style='background-color:#E0D0B0'>";
        html += "    " + equipment.power;
        html += "    </td>";
        html += "    <td style='background-color:#EFE0C0'>";
        html += "    " + equipment.weight;
        html += "    </td>";
        html += "    <td style='background-color:#EFE0C0'>";
        html += "    " + equipment.endure;
        html += "    </td>";
        html += "    <td style='background-color:#E0D0B0'>";
        html += "    " + (equipment.requiredCareer === "所有职业" ? "-" : equipment.requiredCareer);
        html += "    </td>";
        html += "    <td style='background-color:#E0D0B0'>";
        html += "    " + (equipment.requiredAttack === 0 ? "-" : equipment.requiredAttack);
        html += "    </td>";
        html += "    <td style='background-color:#E0D0B0'>";
        html += "    " + (equipment.requiredDefense === 0 ? "-" : equipment.requiredDefense);
        html += "    </td>";
        html += "    <td style='background-color:#E0D0B0'>";
        html += "    " + (equipment.requiredSpecialAttack === 0 ? "-" : equipment.requiredSpecialAttack);
        html += "    </td>";
        html += "    <td style='background-color:#E0D0B0'>";
        html += "    " + (equipment.requiredSpecialDefense === 0 ? "-" : equipment.requiredSpecialDefense);
        html += "    </td>";
        html += "    <td style='background-color:#E0D0B0'>";
        html += "    " + (equipment.requiredSpeed === 0 ? "-" : equipment.requiredSpeed);
        html += "    </td>";
        html += "    <td style='background-color:#E0D0B0'>";
        html += "    " + (equipment.isItem ? "-" : equipment.additionalPower);
        html += "    </td>";
        html += "    <td style='background-color:#E0D0B0'>";
        html += "    " + (equipment.isItem ? "-" : equipment.additionalWeight);
        html += "    </td>";
        html += "    <td style='background-color:#E0D0B0'>";
        html += "    " + (equipment.isItem ? "-" : equipment.additionalLuck);
        html += "    </td>";
        html += "    <td style='background-color:#E0D0B0'>";
        html += "    " + equipment.experienceHTML;
        html += "    </td>";
        html += "    <td style='background-color:#EFE0C0'>";
        html += "    " + (equipment.attribute === "无" ? "-" : equipment.attribute);
        html += "    </td>";
        html += "</tr>";
    }
    html += "       <tr>";
    html += "           <td style='background-color:#E8E8D0;text-align:left;font-weight:bold' colspan='18'>";
    html += "               <span style='color:navy'>目前剩余空位数：</span><span style='color:red'>" + (20 - equipmentList.length) + "</span>";
    html += "           </td>";
    html += "       </tr>";
    html += "       <tr>";
    html += "           <td style='background-color:#E8E8D0;text-align:center' colspan='18'>";
    html += "               <table style='background-color:#E8E8D0;border-width:0;width:100%'>";
    html += "                   <tbody style='background-color:#E8E8D0'>";
    html += "                       <tr style='background-color:#E8E8D0'>";
    html += "                           <td style='text-align:left'>";
    html += "                               <input type='button' class='ItemUIButton' id='useButton' value='使用'>";
    html += "                               <input type='button' class='ItemUIButton' id='putIntoBagButton' value='入袋'>";
    html += "                           </td>";
    html += "                           <td style='text-align:right'>";
    html += "                               <input type='button' class='ItemUIButton' id='takeAllOutFromBagButton_" + (20 - equipmentList.length) + "' style='display:none' disabled value='从百宝袋盲取'>";
    html += "                               <input type='button' class='ItemUIButton' id='putAllIntoBagButton' value='全部入袋'>";
    html += "                               <input type='button' class='ItemUIButton' id='luckCharmButton' value='千与千寻' style='color:blue'>";
    html += "                               <input type='button' class='ItemUIButton' id='dontForgetMeButton' value='勿忘我' style='color:red'>";
    html += "                               <input type='button' class='ItemUIButton' id='magicBallButton' value='魔法使的闪光弹' style='color:green'>";
    html += "                           </td>";
    html += "                       </tr>";
    html += "                   </tbody>";
    html += "               </table>";
    html += "           </td>";
    html += "       </tr>";
    html += "       <tr>";
    html += "           <td style='background-color:#E8E8D0;text-align:right' colspan='18'>";
    html += "               <input type='button' class='ItemUIButton' id='setButton_A' value='套装Ａ'>";
    html += "               <input type='button' class='ItemUIButton' id='setButton_B' value='套装Ｂ'>";
    html += "               <input type='button' class='ItemUIButton' id='setButton_C' value='套装Ｃ'>";
    html += "               <input type='button' class='ItemUIButton' id='setButton_D' value='套装Ｄ'>";
    html += "               <input type='button' class='ItemUIButton' id='setButton_E' value='套装Ｅ'>";
    html += "           </td>";
    html += "       </tr>";
    html += "       <tr>";
    html += "          <td style='background-color:#E8E8D0;text-align:right' colspan='18'>";
    html += "              <input type='text' id='receiver' size='15' maxlength='20'>";
    html += "              <input type='button' class='ItemUIButton' id='searchButton' value='找人'>";
    html += "              <select id='receiverSelect'><option value=''>选择发送对象</select>";
    html += "              <input type='button' class='ItemUIButton' id='sendButton' value='发送'>";
    html += "          </td>"
    html += "       </tr>";
    html += "       <tr>";
    html += "           <td style='background-color:#E8E8D0;text-align:center' colspan='18'>";
    html += "           <input type='button' class='ItemUIButton' id='refreshButton' value='刷新装备管理界面'>";
    html += "           <input type='button' class='ItemUIButton' id='openBagButton' value='打开百宝袋'>";
    html += "           <input type='button' class='ItemUIButton' id='closeBugButton' value='关闭百宝袋'>";
    html += "           </td>"
    html += "       </tr>";
    html += "       <tr style='display:none'>";
    html += "           <td id='treasureBagContainer' style='background-color:#E8E8D0;text-align:center' colspan='18'>";
    html += "           </td>"
    html += "       </tr>";
    html += "   </tbody>";
    html += "</table>";

    // 渲染装备管理界面
    $("#ItemUI").html(html);
    PageUtils.fixCurrentPageBrokenImages();

    // 修改按钮的状态，如果有必要的话
    const treasureBag = EquipmentParser.findTreasureBag(equipmentList);
    if (treasureBag === null) {
        if ($("#hasTreasureBag").text() !== "true") {
            // 那是真没有百宝袋了，完全不能提供百宝袋的功能
            $("#putIntoBagButton").prop("disabled", true);
            $("#putIntoBagButton").css("display", "none");
            $("#putAllIntoBagButton").prop("disabled", true);
            $("#putAllIntoBagButton").css("display", "none");
        } else {
            // 提供从百宝袋盲取的功能
            if (20 - equipmentList.length > 0) {
                // 身上还有空间
                const buttonId = "takeAllOutFromBagButton_" + (20 - equipmentList.length);
                $("#" + buttonId).prop("disabled", false).show();

                $("#" + buttonId).on("click", function () {
                    const space = parseInt(($(this).attr("id") as string).split("_")[1]);
                    const request = credential.asRequest();
                    // @ts-ignore
                    request.mode = "GETOUTBAG";
                    for (let i = 0; i < space; i++) {
                        // @ts-ignore
                        request["item" + i] = i;
                    }
                    NetworkUtils.sendPostRequest("mydata.cgi", request, function (html) {
                        MessageBoard.processResponseMessage(html);
                        doRefresh(credential);
                    });
                });
            }
        }
        $("#openBagButton").prop("disabled", "true").hide();
        $("#closeBugButton").prop("disabled", "true").hide();
    } else {
        $("#treasureBagIndex").text(treasureBag.index!);
    }

    const config_a = SetupLoader.loadEquipmentSet_A(credential.id);
    if (!isSetConfigAvailable(config_a)) {
        $("#setButton_A").prop("disabled", true);
    }
    const config_b = SetupLoader.loadEquipmentSet_B(credential.id);
    if (!isSetConfigAvailable(config_b)) {
        $("#setButton_B").prop("disabled", true);
    }
    const config_c = SetupLoader.loadEquipmentSet_C(credential.id);
    if (!isSetConfigAvailable(config_c)) {
        $("#setButton_C").prop("disabled", true);
    }
    const config_d = SetupLoader.loadEquipmentSet_D(credential.id);
    if (!isSetConfigAvailable(config_d)) {
        $("#setButton_D").prop("disabled", true);
    }
    const config_e = SetupLoader.loadEquipmentSet_E(credential.id);
    if (!isSetConfigAvailable(config_e)) {
        $("#setButton_E").prop("disabled", true);
    }

    doBindUseButton(credential);
    doBindPutIntoBagButton(credential);
    doBindPutAllIntoBagButton(credential);
    doBindLuckCharmButton(credential, equipmentList);
    doBindDontForgetMeButton(credential, equipmentList);
    doBindMagicBallButton(credential, equipmentList);
    doBindSetButton(credential, equipmentList, "A", config_a);
    doBindSetButton(credential, equipmentList, "B", config_b);
    doBindSetButton(credential, equipmentList, "C", config_c);
    doBindSetButton(credential, equipmentList, "D", config_d);
    doBindSetButton(credential, equipmentList, "E", config_e);
    doBindSearchButton(credential);
    doBindSendButton(credential);
    doBindRefreshButton(credential);
    doBindTreasureBagButton(credential);

    if ($("#treasureBagStatus").text() === "on") {
        doRenderTreasureBag(credential);
    }
}

function doRenderTreasureBag(credential: Credential) {
    const s = $("#treasureBagIndex").text();
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
        const bagEquipmentList = EquipmentParser.parseTreasureBagItemList(pageHtml);

        let html = "";
        html += "<table style='background-color:#888888;width:100%;text-align:center'>";
        html += "<tbody style='background-color:#F8F0E0'>";
        html += "<tr>";
        html += "<th style='background-color:#E8E8D0'>选择</th>";
        html += "<th style='background-color:#E0D0B0'>名字</th>";
        html += "<th style='background-color:#EFE0C0'>种类</th>";
        html += "<th style='background-color:#E0D0B0'>效果</th>";
        html += "<th style='background-color:#EFE0C0'>重量</th>";
        html += "<th style='background-color:#EFE0C0'>耐久</th>";
        html += "<th style='background-color:#E0D0B0'>威力</th>";
        html += "<th style='background-color:#E0D0B0'>重量</th>";
        html += "<th style='background-color:#E0D0B0'>幸运</th>";
        html += "<th style='background-color:#E0D0B0'>经验</th>";
        html += "</tr>";
        for (const equipment of bagEquipmentList) {
            html += "<tr>";
            html += "<td style='background-color:#E8E8D0'>";
            html += "<input class='bag_checkbox' type='checkbox' name='item" + equipment.index + "' value='" + equipment.index + "'>";
            html += "</td>";
            html += "<td style='background-color:#E0D0B0'>" + equipment.nameHTML + "</td>";
            html += "<td style='background-color:#EFE0C0'>" + equipment.category + "</td>";
            html += "<td style='background-color:#E0D0B0'>" + equipment.power + "</td>";
            html += "<td style='background-color:#EFE0C0'>" + equipment.weight + "</td>";
            html += "<td style='background-color:#EFE0C0'>" + equipment.endure + "</td>";
            html += "<td style='background-color:#E0D0B0'>" + equipment.additionalPower + "</td>";
            html += "<td style='background-color:#E0D0B0'>" + equipment.additionalWeight + "</td>";
            html += "<td style='background-color:#E0D0B0'>" + equipment.additionalLuck + "</td>";
            html += "<td style='background-color:#E0D0B0'>" + equipment.experienceHTML + "</td>";
            html += "</tr>";
        }
        html += "<tr>";
        html += "<td colspan='10' style='background-color:#E8E8D0;text-align:left'>";
        html += "<input type='button' class='ItemUIButton' id='takeOutButton' value='从百宝袋中取出'>";
        html += "</td>";
        html += "</tr>";
        html += "</tbody>";
        html += "</table>";

        $("#treasureBagContainer").html(html).parent().show();
        $("#treasureBagStatus").text("on");
        PageUtils.fixCurrentPageBrokenImages();

        doBindTakeOutButton(credential);
    });
}

function doRefresh(credential: Credential) {
    const request = credential.asRequest();
    // @ts-ignore
    request["mode"] = "USE_ITEM";
    NetworkUtils.sendPostRequest("mydata.cgi", request, function (html) {
        // 从新的界面中重新解析装备状态
        const equipmentList = EquipmentParser.parsePersonalItemList(html);
        // 解除当前所有的按钮
        $(".ItemUIButton").off("click");
        // 清除ItemUI的内容
        $("#ItemUI").html("");
        // 使用新的重新渲染ItemUI并绑定新的按钮
        doRender(credential, equipmentList);
    });
}

function doBindUseButton(credential: Credential) {
    $("#useButton").on("click", function () {
        const request = credential.asRequest();
        let checkedCount = 0;
        $(".personal_checkbox")
            .each(function (_idx, checkbox) {
                if ($(checkbox).prop("checked")) {
                    checkedCount++;
                    const name = $(checkbox).attr("name");
                    // @ts-ignore
                    request[name] = $(checkbox).val();
                }
            });
        if (checkedCount === 0) {
            MessageBoard.publishWarning("没有选择任何装备！");
            return;
        }
        // @ts-ignore
        request["chara"] = "1";
        // @ts-ignore
        request["mode"] = "USE";
        NetworkUtils.sendPostRequest("mydata.cgi", request, function (html) {
            MessageBoard.processResponseMessage(html);
            doRefresh(credential);
        });
    });
}

function doBindPutIntoBagButton(credential: Credential) {
    if ($("#putIntoBagButton").prop("disabled")) {
        return;
    }
    $("#putIntoBagButton").on("click", function () {
        const request = credential.asRequest();
        let checkedCount = 0;
        $(".personal_checkbox")
            .each(function (_idx, checkbox) {
                if ($(checkbox).prop("checked")) {
                    if (!$(checkbox).parent().next().text().includes("★")) {
                        checkedCount++;
                        const name = $(checkbox).attr("name");
                        // @ts-ignore
                        request[name] = $(checkbox).val();
                    }
                }
            });
        if (checkedCount === 0) {
            MessageBoard.publishWarning("没有选择任何装备！");
            return;
        }
        // @ts-ignore
        request["chara"] = "1";
        // @ts-ignore
        request["mode"] = "PUTINBAG";
        NetworkUtils.sendPostRequest("mydata.cgi", request, function (html) {
            MessageBoard.processResponseMessage(html);
            doRefresh(credential);
        });
    });
}

function doBindPutAllIntoBagButton(credential: Credential) {
    if ($("#putAllIntoBagButton").prop("disabled")) {
        return;
    }
    $("#putAllIntoBagButton").on("click", function () {
        const request = credential.asRequest();
        let checkedCount = 0;
        $(".personal_checkbox")
            .each(function (_idx, checkbox) {
                if (!$(checkbox).parent().next().text().includes("★")) {
                    checkedCount++;
                    const name = $(checkbox).attr("name");
                    // @ts-ignore
                    request[name] = $(checkbox).val();
                }
            });
        if (checkedCount === 0) {
            MessageBoard.publishWarning("目前没有任何装备可以放入百宝袋。");
            return;
        }
        // @ts-ignore
        request["chara"] = "1";
        // @ts-ignore
        request["mode"] = "PUTINBAG";
        NetworkUtils.sendPostRequest("mydata.cgi", request, function (html) {
            MessageBoard.processResponseMessage(html);
            doRefresh(credential);
        });
    });
}

function doBindLuckCharmButton(credential: Credential, equipmentList: Equipment[]) {
    $("#luckCharmButton").on("click", function () {
        const set = new EquipmentSet();
        set.initialize();
        set.accessoryName = "千与千寻";
        new EquipmentSetLoader(credential, equipmentList).load(set)
            .then(() => {
                doRefresh(credential);
            });
    });
}

function doBindDontForgetMeButton(credential: Credential, equipmentList: Equipment[]) {
    $("#dontForgetMeButton").on("click", function () {
        const set = new EquipmentSet();
        set.initialize();
        set.accessoryName = "勿忘我";
        new EquipmentSetLoader(credential, equipmentList).load(set)
            .then(() => {
                doRefresh(credential);
            });
    });
}

function doBindMagicBallButton(credential: Credential, equipmentList: Equipment[]) {
    $("#magicBallButton").on("click", function () {
        const set = new EquipmentSet();
        set.initialize();
        set.accessoryName = "魔法使的闪光弹";
        new EquipmentSetLoader(credential, equipmentList).load(set)
            .then(() => {
                doRefresh(credential);
            });
    });
}

function doBindSetButton(credential: Credential, equipmentList: Equipment[], setId: string, setConfig: {}) {
    const buttonId = "setButton_" + setId;
    if ($("#" + buttonId).prop("disabled")) {
        return;
    }
    $("#" + buttonId).on("click", function () {
        const set = new EquipmentSet();
        set.initialize();

        // @ts-ignore
        set.weaponName = setConfig["weaponName"];
        // @ts-ignore
        if (setConfig["weaponStar"] !== undefined && setConfig["weaponStar"]) {
            set.weaponName = "齐心★" + set.weaponName;
        }
        // @ts-ignore
        set.armorName = setConfig["armorName"];
        // @ts-ignore
        if (setConfig["armorStar"] !== undefined && setConfig["armorStar"]) {
            set.armorName = "齐心★" + set.armorName;
        }
        // @ts-ignore
        set.accessoryName = setConfig["accessoryName"];
        // @ts-ignore
        if (setConfig["accessoryStar"] !== undefined && setConfig["accessoryStar"]) {
            set.accessoryName = "齐心★" + set.accessoryName;
        }

        new EquipmentSetLoader(credential, equipmentList).load(set)
            .then(() => {
                doRefresh(credential);
            });
    });
}

function doBindSearchButton(credential: Credential) {
    $("#searchButton").on("click", function () {
        let receiver = $("#receiver").val();
        if (receiver === undefined || (receiver as string).trim() === "") {
            return;
        }
        receiver = escape((receiver as string).trim());
        const request = credential.asRequest();
        // @ts-ignore
        request["serch"] = receiver;
        // @ts-ignore
        request["mode"] = "ITEM_SEND";
        NetworkUtils.sendPostRequest("town.cgi", request, function (html) {
            const optionHTML = $(html).find("select[name='eid']").html();
            $("#receiverSelect").html(optionHTML);
        });
    });
}

function doBindSendButton(credential: Credential) {
    $("#sendButton").on("click", function () {
        const receiver = $("#receiverSelect").val();
        if (receiver === undefined || receiver === "") {
            MessageBoard.publishWarning("没有选择接收的对象！");
            return;
        }
        const request = credential.asRequest();
        // @ts-ignore
        request["eid"] = receiver;
        let checkedCount = 0;
        $(".personal_checkbox")
            .each(function (_idx, checkbox) {
                if ($(checkbox).prop("checked")) {
                    checkedCount++;
                    const name = $(checkbox).attr("name");
                    // @ts-ignore
                    request[name] = $(checkbox).val();
                }
            });
        if (checkedCount === 0) {
            MessageBoard.publishWarning("没有选择要发送的装备！");
            return;
        }
        // @ts-ignore
        request["mode"] = "ITEM_SEND2";
        const bank = new TownBank(credential);
        bank.withdraw(10)
            .then(success => {
                if (!success) {
                    MessageBoard.publishWarning("没钱就不要学别人送装备了！");
                } else {
                    NetworkUtils.sendPostRequest("town.cgi", request, function (html) {
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

function doBindRefreshButton(credential: Credential) {
    $("#refreshButton").on("click", function () {
        MessageBoard.resetMessageBoard("");
        doRefresh(credential);
    });
}

function doBindTreasureBagButton(credential: Credential) {
    if (!$("#openBagButton").prop("disabled")) {
        $("#openBagButton").on("click", function () {
            if ($("#treasureBagStatus").text() === "on") {
                return;
            }
            doRenderTreasureBag(credential);
        });
    }
    if (!$("#closeBugButton").prop("disabled")) {
        $("#closeBugButton").on("click", function () {
            if ($("#treasureBagStatus").text() === "off") {
                return;
            }
            $("#treasureBagContainer").html("").parent().hide();
            $("#treasureBagStatus").text("off");
        });
    }
}

function doBindTakeOutButton(credential: Credential) {
    $("#takeOutButton").on("click", function () {
        const request = credential.asRequest();
        let checkedCount = 0;
        $(".bag_checkbox")
            .each(function (_idx, checkbox) {
                if ($(checkbox).prop("checked")) {
                    checkedCount++;
                    const name = $(checkbox).attr("name")!;
                    // @ts-ignore
                    request[name] = $(checkbox).val();
                }
            });
        if (checkedCount === 0) {
            MessageBoard.publishWarning("没有选择要从百宝袋中取出的装备！");
            return;
        }
        // @ts-ignore
        request["mode"] = "GETOUTBAG";
        NetworkUtils.sendPostRequest("mydata.cgi", request, function (html) {
            MessageBoard.processResponseMessage(html);
            doRefresh(credential);
        });
    });
}

function doBindConsecrateButton(credential: Credential) {
    $("#consecrateButton").on("click", function () {
        const consecrateCandidates: number[] = [];
        const consecrateCandidateNames: string[] = [];

        $(".personal_checkbox")
            .each(function (_idx, checkbox) {
                if ($(checkbox).prop("checked")) {
                    const c0 = $(checkbox).parent();
                    const c1 = $(c0).next();
                    const c2 = $(c1).next();
                    const c3 = $(c2).next();

                    let s = $(c3).text().trim();
                    if (s === "武器" || s === "防具" || s === "饰品") {
                        s = $(c1).text().trim();
                        if (s !== "★") {
                            s = $(c2).text().trim();
                            consecrateCandidates.push(parseInt($(checkbox).val() as string));
                            consecrateCandidateNames.push(s);
                        }
                    }
                }
            });

        if (consecrateCandidates.length === 0) {
            MessageBoard.publishWarning("没有选择能够祭奠的装备！");
            return;
        }
        if (!confirm("请务必确认你将要祭奠的这些装备：" + consecrateCandidateNames.join())) {
            return;
        }
        new TownBank(credential).withdraw(100)
            .then(success => {
                if (!success) {
                    MessageBoard.publishWarning("没钱学别人玩什么祭奠！");
                    return;
                }
                let html = "";
                consecrateCandidates.forEach(it => {
                    html += "<input type='hidden' name='item" + it + "' value='" + it + "'>";
                });
                $("#consecrateFormPayload").html(html);
                $("#consecrateSubmit").trigger("click");
            });
    });
}

function isSetConfigAvailable(config: {}) {
    // @ts-ignore
    const a = config["weaponName"];
    // @ts-ignore
    const b = config["armorName"];
    // @ts-ignore
    const c = config["accessoryName"];
    return (a !== undefined && a !== "NONE") || (b !== undefined && b !== "NONE") || (c !== undefined && c !== "NONE");
}

export = PersonalEquipmentManagementProcessor;