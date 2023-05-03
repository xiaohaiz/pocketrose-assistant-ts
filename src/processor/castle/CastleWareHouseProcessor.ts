import Processor from "../Processor";
import PageUtils from "../../util/PageUtils";
import EquipmentParser from "../../pocket/EquipmentParser";
import Credential from "../../util/Credential";
import Equipment from "../../pocket/Equipment";
import MessageBoard from "../../util/MessageBoard";
import NpcLoader from "../../pocket/NpcLoader";
import NetworkUtils from "../../util/NetworkUtils";
import SetupLoader from "../../pocket/SetupLoader";

class CastleWareHouseProcessor implements Processor {

    accept(cgi: string, pageText: string): boolean {
        if (cgi === "castle.cgi") {
            return pageText.includes("＜＜　|||　城堡仓库　|||　＞＞");
        }
        return false;
    }

    process(): void {
        PageUtils.removeUnusedHyperLinks();
        PageUtils.removeGoogleAnalyticsScript();
        PageUtils.fixCurrentPageBrokerImages();
        doProcess();
    }

}

function doProcess() {
    const credential = PageUtils.currentCredential();
    const pageHtml = PageUtils.currentPageHtml();
    const personalEquipmentList = EquipmentParser.parseCastleWareHousePersonalEquipmentList(pageHtml);
    const storageEquipmentList = EquipmentParser.parseCastleWareHouseStorageEquipmentList(pageHtml);

    // 修改标题
    $("td:first")
        .attr("id", "title")
        .removeAttr("width")
        .removeAttr("height")
        .removeAttr("bgcolor")
        .css("text-align", "center")
        .css("font-size", "150%")
        .css("font-weight", "bold")
        .css("background-color", "navy")
        .css("color", "yellowgreen")
        .text("＜＜  城 堡 仓 库  ＞＞");

    // 创建消息面板
    $("tr:first")
        .next()
        .after("" +
            "<tr><td id='messageBoardContainer' style='background-color:#E8E8D0'></td></tr>" +
            "<tr style='display:none'><td id='eden'></td></tr>" +
            "<tr style='display:none'><td></td></tr>");
    MessageBoard.createMessageBoardStyleB("messageBoardContainer", NpcLoader.randomNpcImageHtml());
    $("#messageBoard")
        .css("background-color", "black")
        .css("color", "white")
        .text("请管理您的城堡仓库。");

    // 重新布局页面
    // 删除之前的全部表单，会连带删除表单内的表格
    $("form").remove();
    $("h3").remove();
    $("hr")
        .filter(function (_idx) {
            return _idx !== 3;
        })
        .each(function (_idx, hr) {
            hr.remove();
        });

    // 准备新的界面
    let html = "";
    html += "<table style='width:100%;border-width:0;background-color:#888888'>";
    html += "<tbody>";
    html += "<tr style='display:none'>";
    html += "<td id='personalEquipmentList'></td>";
    html += "</tr>";
    html += "<tr style='display:none'>";
    html += "<td id='storageEquipmentList'></td>";
    html += "</tr>";
    html += "<tr>";
    html += "<td style='background-color:#F8F0E0;text-align:center'>";
    html += "<input type='button' id='returnButton' value='离开城堡仓库'>";
    html += "</td>";
    html += "</tr>";
    html += "</tbody>";
    html += "</table>";
    $("table:first").after($(html));

    doGenerateEdenForm(credential);
    doBindReturnButton();

    doRender(credential, personalEquipmentList, storageEquipmentList);

    console.log(PageUtils.currentPageHtml());
}

function doGenerateEdenForm(credential: Credential) {
    let html = "";
    // noinspection HtmlUnknownTarget
    html += "<form action='castlestatus.cgi' method='post' id='returnForm'>";
    html += "<input type='hidden' name='id' value='" + credential.id + "'>";
    html += "<input type='hidden' name='pass' value='" + credential.pass + "'>";
    html += "<input type='hidden' name='mode' value='CASTLESTATUS'>";
    html += "<input type='submit' id='returnSubmit'>";
    html += "</form>";
    $("#eden").html(html);
}

function doBindReturnButton() {
    $("#returnButton").on("click", function () {
        $("#returnSubmit").trigger("click");
    });
}

function doRender(credential: Credential,
                  personalEquipmentList: Equipment[],
                  storageEquipmentList: Equipment[]) {
    doRenderPersonalEquipmentList(credential, personalEquipmentList);
    doRenderStorageEquipmentList(credential, storageEquipmentList);
}

function doRenderPersonalEquipmentList(credential: Credential, personalEquipmentList: Equipment[]) {
    let html = "";
    html += "<table style='border-width:0;width:100%;background-color:#888888'>";
    html += "<tbody style='background-color:#F8F0E0;text-align:center'>";
    html += "<tr>";
    html += "<th style='background-color:#E8E8D0'>选择</th>";
    html += "<th style='background-color:#EFE0C0'>装备</th>";
    html += "<th style='background-color:#E0D0B0'>名字</th>";
    html += "<th style='background-color:#EFE0C0'>种类</th>";
    html += "<th style='background-color:#E0D0B0'>效果</th>";
    html += "<th style='background-color:#EFE0C0'>重量</th>";
    html += "<th style='background-color:#EFE0C0'>耐久</th>";
    html += "<th style='background-color:#E0D0B0'>职业</th>";
    html += "<th style='background-color:#E0D0B0'>攻击</th>";
    html += "<th style='background-color:#E0D0B0'>防御</th>";
    html += "<th style='background-color:#E0D0B0'>智力</th>";
    html += "<th style='background-color:#E0D0B0'>精神</th>";
    html += "<th style='background-color:#E0D0B0'>速度</th>";
    html += "<th style='background-color:#E0D0B0'>威力</th>";
    html += "<th style='background-color:#E0D0B0'>重量</th>";
    html += "<th style='background-color:#E0D0B0'>幸运</th>";
    html += "<th style='background-color:#E0D0B0'>经验</th>";
    html += "<th style='background-color:#EFE0C0'>属性</th>";
    html += "<th style='background-color:#E0D0B0'>入库</th>";
    html += "</tr>";

    let selectableCount = 0;
    for (const equipment of personalEquipmentList) {
        html += "<tr>";
        html += "<td style='background-color:#E8E8D0'>";
        if (equipment.selectable) {
            selectableCount++;
            html += "<input type='checkbox' class='personal_checkbox_class' " +
                "name='item" + equipment.index + "' value='" + equipment.index + "'>";
        }
        html += "</td>";
        html += "<td style='background-color:#EFE0C0'>";
        if (equipment.using) {
            html += equipment.usingHTML;
        }
        html += "</td>";
        html += "<td style='background-color:#E0D0B0'>" + equipment.nameHTML + "</td>";
        html += "<td style='background-color:#EFE0C0'>" + equipment.category + "</td>";
        html += "<td style='background-color:#E0D0B0'>" + equipment.power + "</td>";
        html += "<td style='background-color:#EFE0C0'>" + equipment.weight + "</td>";
        html += "<td style='background-color:#EFE0C0'>";
        html += equipment.endureHtml;
        html += "</td>";
        html += "<td style='background-color:#E0D0B0'>";
        if (equipment.requiredCareer === "所有职业") {
            html += "-";
        } else {
            html += equipment.requiredCareer;
        }
        html += "</td>";
        html += "<td style='background-color:#E0D0B0'>";
        if (equipment.requiredAttack === 0) {
            html += "-";
        } else {
            html += equipment.requiredAttack;
        }
        html += "</td>";
        html += "<td style='background-color:#E0D0B0'>";
        if (equipment.requiredDefense === 0) {
            html += "-";
        } else {
            html += equipment.requiredDefense;
        }
        html += "</td>";
        html += "<td style='background-color:#E0D0B0'>";
        if (equipment.requiredSpecialAttack === 0) {
            html += "-";
        } else {
            html += equipment.requiredSpecialAttack;
        }
        html += "</td>";
        html += "<td style='background-color:#E0D0B0'>";
        if (equipment.requiredSpecialDefense === 0) {
            html += "-";
        } else {
            html += equipment.requiredSpecialDefense;
        }
        html += "</td>";
        html += "<td style='background-color:#E0D0B0'>";
        if (equipment.requiredSpeed === 0) {
            html += "-";
        } else {
            html += equipment.requiredSpeed;
        }
        html += "</td>";
        html += "<td style='background-color:#E0D0B0'>";
        if (equipment.additionalPower === 0) {
            html += "-";
        } else {
            html += equipment.additionalPower;
        }
        html += "</td>";
        html += "<td style='background-color:#E0D0B0'>";
        if (equipment.additionalWeight === 0) {
            html += "-";
        } else {
            html += equipment.additionalWeight;
        }
        html += "</td>";
        html += "<td style='background-color:#E0D0B0'>";
        if (equipment.additionalLuck === 0) {
            html += "-";
        } else {
            html += equipment.additionalLuck;
        }
        html += "</td>";
        html += "<td style='background-color:#E0D0B0'>";
        if (SetupLoader.isExperienceProgressBarEnabled()) {
            html += equipment.experienceHTML;
        } else {
            html += equipment.experience;
        }
        html += "</td>";
        html += "<td style='background-color:#EFE0C0'>";
        if (equipment.attribute === "无") {
            html += "-";
        } else {
            html += equipment.attribute;
        }
        html += "</td>";
        html += "<td style='background-color:#E0D0B0'>";
        if (equipment.selectable) {
            html += "<input type='button' class='button_class' " +
                "id='putIntoWareHouseButton_" + equipment.index + "' value='入库'>";
        } else {
            html += "<input type='button' value='　　' disabled " +
                "style='background-color:#E0D0B0;border-width:0'>";
        }
        html += "</td>";
        html += "</tr>";
    }

    html += "<tr>";
    html += "<td colspan='19' style='text-align:left'>";
    html += "<b style='color:navy'>目前剩余空位数：</b><b style='color:red'>" + (20 - personalEquipmentList.length) + "</b>";
    html += "</td>";
    html += "</tr>";
    if (selectableCount > 0) {
        html += "<tr>";
        html += "<td colspan='19' style='text-align:left'>";
        html += "<input type='button' class='button_class' " +
            "id='putIntoWareHouseButton' value='放入城堡仓库'>";
        html += "</td>";
        html += "</tr>";
    }
    html += "</tbody>";
    html += "</table>"

    $("#personalEquipmentList")
        .html(html)
        .parent()
        .show();

    doBindPutIntoWareHouseButton(credential, personalEquipmentList);
}

function doRenderStorageEquipmentList(credential: Credential, storageEquipmentList: Equipment[]) {
    if (storageEquipmentList.length === 0) {
        return;
    }
    let html = "";
    html += "<table style='border-width:0;width:100%;background-color:#888888'>";
    html += "<tbody style='background-color:#F8F0E0;text-align:center'>";
    html += "<tr>";
    html += "<th style='background-color:#E8E8D0'>选择</th>";
    html += "<th style='background-color:#E0D0B0'>名字</th>";
    html += "<th style='background-color:#EFE0C0'>种类</th>";
    html += "<th style='background-color:#E0D0B0'>效果</th>";
    html += "<th style='background-color:#EFE0C0'>重量</th>";
    html += "<th style='background-color:#EFE0C0'>耐久</th>";
    html += "<th style='background-color:#E0D0B0'>职业</th>";
    html += "<th style='background-color:#E0D0B0'>攻击</th>";
    html += "<th style='background-color:#E0D0B0'>防御</th>";
    html += "<th style='background-color:#E0D0B0'>智力</th>";
    html += "<th style='background-color:#E0D0B0'>精神</th>";
    html += "<th style='background-color:#E0D0B0'>速度</th>";
    html += "<th style='background-color:#E0D0B0'>威力</th>";
    html += "<th style='background-color:#E0D0B0'>重量</th>";
    html += "<th style='background-color:#E0D0B0'>幸运</th>";
    html += "<th style='background-color:#E0D0B0'>经验</th>";
    html += "<th style='background-color:#EFE0C0'>属性</th>";
    html += "<th style='background-color:#E0D0B0'>出库</th>";
    html += "</tr>";

    for (const equipment of storageEquipmentList) {
        html += "<tr>";
        html += "<td style='background-color:#E8E8D0'>";
        html += "<input type='checkbox' class='storage_checkbox_class' " +
            "name='item" + equipment.index + "' value='" + equipment.index + "'>";
        html += "</td>";
        html += "<td style='background-color:#E0D0B0'>" + equipment.nameHTML + "</td>";
        html += "<td style='background-color:#EFE0C0'>" + equipment.category + "</td>";
        html += "<td style='background-color:#E0D0B0'>" + equipment.power + "</td>";
        html += "<td style='background-color:#EFE0C0'>" + equipment.weight + "</td>";
        html += "<td style='background-color:#EFE0C0'>";
        html += equipment.endureHtml;
        html += "</td>";
        html += "<td style='background-color:#E0D0B0'>";
        if (equipment.requiredCareer === "所有职业") {
            html += "-";
        } else {
            html += equipment.requiredCareer;
        }
        html += "</td>";
        html += "<td style='background-color:#E0D0B0'>";
        if (equipment.requiredAttack === 0) {
            html += "-";
        } else {
            html += equipment.requiredAttack;
        }
        html += "</td>";
        html += "<td style='background-color:#E0D0B0'>";
        if (equipment.requiredDefense === 0) {
            html += "-";
        } else {
            html += equipment.requiredDefense;
        }
        html += "</td>";
        html += "<td style='background-color:#E0D0B0'>";
        if (equipment.requiredSpecialAttack === 0) {
            html += "-";
        } else {
            html += equipment.requiredSpecialAttack;
        }
        html += "</td>";
        html += "<td style='background-color:#E0D0B0'>";
        if (equipment.requiredSpecialDefense === 0) {
            html += "-";
        } else {
            html += equipment.requiredSpecialDefense;
        }
        html += "</td>";
        html += "<td style='background-color:#E0D0B0'>";
        if (equipment.requiredSpeed === 0) {
            html += "-";
        } else {
            html += equipment.requiredSpeed;
        }
        html += "</td>";
        html += "<td style='background-color:#E0D0B0'>";
        if (equipment.additionalPower === 0) {
            html += "-";
        } else {
            html += equipment.additionalPower;
        }
        html += "</td>";
        html += "<td style='background-color:#E0D0B0'>";
        if (equipment.additionalWeight === 0) {
            html += "-";
        } else {
            html += equipment.additionalWeight;
        }
        html += "</td>";
        html += "<td style='background-color:#E0D0B0'>";
        if (equipment.additionalLuck === 0) {
            html += "-";
        } else {
            html += equipment.additionalLuck;
        }
        html += "</td>";
        html += "<td style='background-color:#E0D0B0'>";
        if (SetupLoader.isExperienceProgressBarEnabled()) {
            html += equipment.experienceHTML;
        } else {
            html += equipment.experience;
        }
        html += "</td>";
        html += "<td style='background-color:#EFE0C0'>";
        if (equipment.attribute === "无") {
            html += "-";
        } else {
            html += equipment.attribute;
        }
        html += "</td>";
        html += "<td style='background-color:#E0D0B0'>";
        if (equipment.selectable) {
            html += "<input type='button' class='button_class' " +
                "id='takeFromWareHouseButton_" + equipment.index + "' value='出库'>";
        } else {
            html += "<input type='button' value='　　' disabled " +
                "style='background-color:#E0D0B0;border-width:0'>";
        }
        html += "</td>";
        html += "</tr>";
    }
    html += "<tr>";
    html += "<td colspan='18' style='text-align:left'>";
    html += "<input type='button' class='button_class' " +
        "id='takeFromWareHouseButton' value='从城堡仓库中取出'>";
    html += "</td>";
    html += "</tr>";
    html += "</tbody>";
    html += "</table>"

    $("#storageEquipmentList")
        .html(html)
        .parent()
        .show();

    doBindTakeFromWareHouseButton(credential, storageEquipmentList);
}

function doBindPutIntoWareHouseButton(credential: Credential, personalEquipmentList: Equipment[]) {
    for (const equipment of personalEquipmentList) {
        const buttonId = "putIntoWareHouseButton_" + equipment.index;
        if ($("#" + buttonId).length === 0) {
            continue;
        }
        $("#" + buttonId).on("click", function () {
            const index = ($(this).attr("id") as string).split("_")[1];
            const request = credential.asRequest();
            // @ts-ignore
            request["item" + index] = index;
            // @ts-ignore
            request.chara = "1";
            // @ts-ignore
            request.mode = "CASTLE_ITEMSTORE";
            NetworkUtils.sendPostRequest("castle.cgi", request, function (pageHtml) {
                MessageBoard.processResponseMessage(pageHtml);
                doRefresh(credential);
            });
        });
    }
}

function doBindTakeFromWareHouseButton(credential: Credential, storageEquipmentList: Equipment[]) {
    for (const equipment of storageEquipmentList) {
        const buttonId = "takeFromWareHouseButton_" + equipment.index;
        if ($("#" + buttonId).length === 0) {
            continue;
        }
        $("#" + buttonId).on("click", function () {
            const index = ($(this).attr("id") as string).split("_")[1];
            const request = credential.asRequest();
            // @ts-ignore
            request["item" + index] = index;
            // @ts-ignore
            request.chara = "1";
            // @ts-ignore
            request.mode = "CASTLE_ITEMWITHDRAW";
            NetworkUtils.sendPostRequest("castle.cgi", request, function (pageHtml) {
                MessageBoard.processResponseMessage(pageHtml);
                doRefresh(credential);
            });
        });
    }
}

function doRefresh(credential: Credential) {
    const request = credential.asRequest();
    // @ts-ignore
    request.mode = "CASTLE_ITEM";
    NetworkUtils.sendPostRequest("castle.cgi", request, function (pageHtml) {
        $(".button_class").off("click");
        $("#personalEquipmentList")
            .html("")
            .parent()
            .hide();
        $("#storageEquipmentList")
            .html("")
            .parent()
            .hide();
        const personalEquipmentList = EquipmentParser.parseCastleWareHousePersonalEquipmentList(pageHtml);
        const storageEquipmentList = EquipmentParser.parseCastleWareHouseStorageEquipmentList(pageHtml);
        doRender(credential, personalEquipmentList, storageEquipmentList);
    });
}

export = CastleWareHouseProcessor;