import PageProcessor from "../PageProcessor";
import PageUtils from "../../util/PageUtils";
import EquipmentParser from "../../pocket/EquipmentParser";
import Credential from "../../util/Credential";
import Equipment from "../../pocket/Equipment";
import MessageBoard from "../../util/MessageBoard";
import NetworkUtils from "../../util/NetworkUtils";
import EquipmentSet from "../../pocket/EquipmentSet";
import EquipmentSetLoader from "../../pocket/EquipmentSetLoader";
import TownBank from "../../pocket/TownBank";

class PersonalEquipmentManagementProcessor extends PageProcessor {

    process() {
        PageUtils.removeUnusedHyperLinks();
        PageUtils.removeGoogleAnalyticsScript();
        const credential = PageUtils.currentCredential();
        const equipmentList = EquipmentParser.parsePersonalItemList(this.pageHtml);
        doProcess(credential, equipmentList);
    }

}

function doProcess(credential: Credential, equipmentList: Equipment[]) {
    const userImage = PageUtils.findFirstUserImageHtml();

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
    MessageBoard.createMessageBoard("message_board_container", userImage!);
    MessageBoard.resetMessageBoard("全新的装备管理界面为您带来全新的体验。");

    // 删除旧的页面组件，并且预留新的刷新的位置
    // 预留了两个div，ItemUI用于页面刷新，Eden隐藏用于放置表单以便可以转移到其他的页面
    $("table:first tr:first").next().next()
        .html("<td style='background-color:#F8F0E0'>" +
            "<div id='ItemUI'></div><div id='Eden' style='display:none'></div>" +
            "</td>");
    // 在Eden里面添加预制的表单
    $("#Eden").html("" +
        "<form action='' method='post' id='eden_form'>" +
        "        <input type='hidden' name='id' value='" + credential.id + "'>" +
        "        <input type='hidden' name='pass' value='" + credential.pass + "'>" +
        "        <div id='eden_form_payload' style='display:none'></div>" +
        "        <input type='submit' id='eden_form_submit'>" +
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

    doRender(credential, equipmentList);
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
    html += "           <th style='background-color:#EFE0C0'>出售</th>";
    html += "           <th style='background-color:#EFE0C0'>修理</th>";
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
        html += "    <td style='background-color:#EFE0C0' id='sellButtonContainer_" + equipment.index + "'>";
        html += "    </td>";
        html += "    <td style='background-color:#EFE0C0'>" + (equipment.isRepairable ? "<input type='button' class='ItemUIButton' id='repairItem_" + equipment.index + "' value='修'>" : "");
        html += "    </td>";
        html += "</tr>";
    }
    html += "       <tr>";
    html += "           <td style='background-color:#E8E8D0;text-align:left;font-weight:bold' colspan='20'>";
    html += "               <span style='color:navy'>目前剩余空位数：</span><span style='color:red'>" + (20 - equipmentList.length) + "</span>";
    html += "           </td>";
    html += "       </tr>";
    html += "       <tr>";
    html += "           <td style='background-color:#E8E8D0;text-align:center' colspan='20'>";
    html += "               <table style='background-color:#E8E8D0;border-width:0;width:100%'>";
    html += "                   <tbody style='background-color:#E8E8D0'>";
    html += "                       <tr style='background-color:#E8E8D0'>";
    html += "                           <td style='text-align:left'>";
    html += "                               <input type='button' class='ItemUIButton' id='useButton' value='使用'>";
    html += "                               <input type='button' class='ItemUIButton' id='putIntoBagButton' value='入袋'>";
    html += "                           </td>";
    html += "                           <td style='text-align:right'>";
    html += "                               <input type='button' class='ItemUIButton' id='treasureBagButton' value='百宝袋'>";
    html += "                               <input type='button' class='ItemUIButton' id='goldenCageButton' value='黄金笼子'>";
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
    html += "           <td style='background-color:#E8E8D0;text-align:right' colspan='20'>";
    html += "               <input type='button' class='ItemUIButton' id='setButton_A' value='套装Ａ'>";
    html += "               <input type='button' class='ItemUIButton' id='setButton_B' value='套装Ｂ'>";
    html += "               <input type='button' class='ItemUIButton' id='setButton_C' value='套装Ｃ'>";
    html += "               <input type='button' class='ItemUIButton' id='setButton_D' value='套装Ｄ'>";
    html += "               <input type='button' class='ItemUIButton' id='setButton_E' value='套装Ｅ'>";
    html += "           </td>";
    html += "       </tr>";
    html += "       <tr>";
    html += "          <td style='background-color:#E8E8D0;text-align:right' colspan='20'>";
    html += "              <input type='text' id='receiver' size='15' maxlength='20'>";
    html += "              <input type='button' class='ItemUIButton' id='searchButton' value='找人'>";
    html += "              <select id='receiverSelect'><option value=''>选择发送对象</select>";
    html += "              <input type='button' class='ItemUIButton' id='sendButton' value='发送'>";
    html += "          </td>"
    html += "       </tr>";
    html += "       <tr>";
    html += "           <td style='background-color:#E8E8D0;text-align:center' colspan='20'>";
    html += "           <input type='button' class='ItemUIButton' id='refreshButton' value='刷新装备管理界面'>";
    html += "           </td>"
    html += "       </tr>";
    html += "   </tbody>";
    html += "</table>";

    // 渲染装备管理界面
    $("#ItemUI").html(html);

    // 修改按钮的状态，如果有必要的话
    const treasureBag = EquipmentParser.findTreasureBag(equipmentList);
    if (treasureBag === null) {
        $("#putIntoBagButton").prop("disabled", true);
        $("#putIntoBagButton").css("display", "none");
        $("#treasureBagButton").prop("disabled", true);
        $("#treasureBagButton").css("display", "none");
        $("#putAllIntoBagButton").prop("disabled", true);
        $("#putAllIntoBagButton").css("display", "none");
    }
    const goldenCage = EquipmentParser.findGoldenCage(equipmentList);
    if (goldenCage === null) {
        $("#goldenCageButton").prop("disabled", true);
        $("#goldenCageButton").css("display", "none");
    }

    doBindUseButton(credential);
    doBindPutIntoBagButton(credential);
    doBindTreasureBagButton(credential, treasureBag);
    doBindGoldenCageButton(credential, goldenCage);
    doBindPutAllIntoBagButton(credential);
    doBindLuckCharmButton(credential, equipmentList);
    doBindDontForgetMeButton(credential, equipmentList);
    doBindMagicBallButton(credential, equipmentList);
    doBindSearchButton(credential);
    doBindSendButton(credential);
    doBindRefreshButton(credential);
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
        $("input:checkbox:checked").each(function (_idx, checkbox) {
            checkedCount++;
            const name = $(checkbox).attr("name");
            // @ts-ignore
            request[name] = $(checkbox).val();
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
        $("input:checkbox:checked").each(function (_idx, checkbox) {
            if (!$(checkbox).parent().next().text().includes("★")) {
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
        request["mode"] = "PUTINBAG";
        NetworkUtils.sendPostRequest("mydata.cgi", request, function (html) {
            MessageBoard.processResponseMessage(html);
            doRefresh(credential);
        });
    });
}

function doBindTreasureBagButton(credential: Credential, treasureBag: Equipment | null) {
    if (treasureBag === null) {
        return;
    }
    $("#treasureBagButton").on("click", function () {
        $("#eden_form").attr("action", "mydata.cgi");
        $("#eden_form_payload").html("" +
            "<input type='hidden' name='chara' value='1'>" +
            "<input type='hidden' name='item" + treasureBag.index + "' value='" + treasureBag.index + "'>" +
            "<input type='hidden' name='mode' value='USE'>");
        $("#eden_form_submit").trigger("click");
    });
}

function doBindGoldenCageButton(credential: Credential, goldenCage: Equipment | null) {
    if (goldenCage === null) {
        return;
    }
    $("#goldenCageButton").on("click", function () {
        $("#eden_form").attr("action", "mydata.cgi");
        $("#eden_form_payload").html("" +
            "<input type='hidden' name='chara' value='1'>" +
            "<input type='hidden' name='item" + goldenCage.index + "' value='" + goldenCage.index + "'>" +
            "<input type='hidden' name='mode' value='USE'>");
        $("#eden_form_submit").trigger("click");
    });
}

function doBindPutAllIntoBagButton(credential: Credential) {
    if ($("#putAllIntoBagButton").prop("disabled")) {
        return;
    }
    $("#putAllIntoBagButton").on("click", function () {
        const request = credential.asRequest();
        let checkedCount = 0;
        $("input:checkbox").each(function (_idx, checkbox) {
            console.log("[" + $(checkbox).parent().next().text() + "]");
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
        $("input:checkbox:checked").each(function (_idx, checkbox) {
            checkedCount++;
            const name = $(checkbox).attr("name");
            // @ts-ignore
            request[name] = $(checkbox).val();
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


export = PersonalEquipmentManagementProcessor;