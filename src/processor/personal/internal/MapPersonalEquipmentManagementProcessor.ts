import PageUtils from "../../../util/PageUtils";
import PersonalEquipmentManagement from "../../../pocket/PersonalEquipmentManagement";
import MessageBoard from "../../../util/MessageBoard";
import NpcLoader from "../../../pocket/NpcLoader";
import Coordinate from "../../../util/Coordinate";
import PersonalEquipmentManagementPage from "../../../pocket/PersonalEquipmentManagementPage";
import Credential from "../../../util/Credential";
import Role from "../../../pocket/Role";
import StringUtils from "../../../util/StringUtils";
import Equipment from "../../../pocket/Equipment";
import TreasureBag from "../../../pocket/TreasureBag";

class MapPersonalEquipmentManagementProcessor {

    process(coordinate: Coordinate) {
        doProcess(coordinate);
    }

}

const welcomeMessage: string = "<b style='font-size:120%;color:wheat'>真是难为您了，在野外还不忘捯饬您这些破烂。</b>";

function doProcess(coordinate: Coordinate) {
    // 解析原始的页面信息
    const page = PersonalEquipmentManagement.parsePage(PageUtils.currentPageHtml());

    // 重组旧的页面
    PageUtils.removeUnusedHyperLinks();
    PageUtils.removeGoogleAnalyticsScript();
    $("table[height='100%']").removeAttr("height");

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
        .text("＜＜  装 备 管 理 （ 地 图 模 式 ）  ＞＞")
        .parent()
        .attr("id", "tr0")
        .next()
        .attr("id", "tr1")
        .find("td:first")
        .find("table:first")
        .find("tr:first")
        .find("td:first")
        .attr("id", "roleImage")
        .next()
        .removeAttr("width")
        .css("width", "100%")
        .next().remove();

    $("#roleImage")
        .next()
        .find("table:first")
        .find("tr:first")
        .next()
        .find("td:eq(2)")
        .attr("id", "roleHealth")
        .next()
        .attr("id", "roleMana")
        .parent()
        .next()
        .find("td:last")
        .attr("id", "roleCash")
        .parent()
        .after($("" +
            "<tr>" +
            "<td style='background-color:#E0D0B0'>坐标点</td>" +
            "<td style='background-color:#E8E8D0;text-align:right;font-weight:bold;color:red' " +
            "colspan='5'>" + coordinate.asText() + "</td>" +
            "</tr>" +
            ""));

    // ------------------------------------------------------------------------
    // 消息面板栏
    // ------------------------------------------------------------------------
    $("#tr1")
        .next()
        .attr("id", "tr2")
        .find("td:first")
        .attr("id", "messageBoardContainer")
        .removeAttr("height");
    MessageBoard.createMessageBoardStyleB("messageBoardContainer", NpcLoader.randomNpcImageHtml());
    $("#messageBoard")
        .css("background-color", "black")
        .css("color", "wheat");
    MessageBoard.resetMessageBoard(welcomeMessage);

    // ------------------------------------------------------------------------
    // 隐藏表单栏
    // ------------------------------------------------------------------------
    let html = "";
    html += "<tr id='tr3' style='display:none'>";
    html += "<td>";
    html += PageUtils.generateReturnMapForm(page.credential);
    html += "</td>";
    html += "</tr>"
    $("#tr2").after($(html));

    // ------------------------------------------------------------------------
    // 主菜单栏
    // ------------------------------------------------------------------------
    html = "";
    html += "<tr id='tr4'>";
    html += "<td style='background-color:#F8F0E0;text-align:center'>";
    html += "<input type='button' id='refreshButton' value='刷新装备管理'>";
    html += "<input type='button' id='returnButton' value='退出装备管理'>";
    html += "</td>";
    html += "</tr>"
    $("#tr3").after($(html));
    $("#refreshButton").on("click", function () {
        $("#messageBoardManager").html(NpcLoader.randomNpcImageHtml);
        MessageBoard.resetMessageBoard(welcomeMessage);
        doRefresh(page.credential);
    });
    $("#returnButton").on("click", function () {
        $("#returnMap").trigger("click");
    });

    // ------------------------------------------------------------------------
    // 用于保存百宝袋的状态
    // ------------------------------------------------------------------------
    html = "";
    html += "<tr id='tr5' style='display:none'>";
    html += "<td id='treasureBag'></td>";
    html += "</tr>"
    $("#tr4").after($(html));
    $("#treasureBag").text("off");

    // ------------------------------------------------------------------------
    // 装备栏目
    // ------------------------------------------------------------------------
    html = "";
    html += "<tr id='tr6' style='display:none'>";
    html += "<td id='equipmentList'></td>";
    html += "</tr>"
    $("#tr5").after($(html));

    // ------------------------------------------------------------------------
    // 百宝袋栏目
    // ------------------------------------------------------------------------
    html = "";
    html += "<tr id='tr7' style='display:none'>";
    html += "<td id='storageEquipmentList'></td>";
    html += "</tr>"
    $("#tr6").after($(html));

    // 渲染装备栏
    doRenderEquipmentList(page);
}

function doRefresh(credential: Credential) {
    PageUtils.scrollIntoView("pageTitle");
    $(".mutableElement").off("click");
    $("#equipmentList").html("").parent().hide();
    $("#storageEquipmentList").html("").parent().hide();
    new PersonalEquipmentManagement(credential)
        .open()
        .then(page => {
            doRenderRole(page.role);
            doRenderEquipmentList(page);
        });
}

function doRenderRole(role: Role | undefined) {
    if (role !== undefined) {
        $("#roleHealth").text(role.health + "/" + role.maxHealth);
        $("#roleMana").text(role.mana + "/" + role.maxMana);
        $("#roleCash").text(role.cash + " GOLD");
    }
}

function doRenderEquipmentList(page: PersonalEquipmentManagementPage) {
    if (page.equipmentCount === 0) {
        return;
    }

    const treasureBag = page.findTreasureBag();

    let html = "";
    html += "<table style='border-width:0;background-color:#888888;text-align:center;width:100%;margin:auto'>";
    html += "<tbody>";
    html += "<tr>";
    html += "<td style='background-color:darkred;color:wheat;font-weight:bold;font-size:120%;text-align:center' colspan='20'>＜ 随 身 装 备 ＞</td>";
    html += "</tr>";
    html += "<tr>";
    html += "<th style='background-color:#E8E8D0'>选择</th>"
    html += "<th style='background-color:#EFE0C0'>装备</th>"
    html += "<th style='background-color:#E0D0B0'>名字</th>"
    html += "<th style='background-color:#EFE0C0'>种类</th>"
    html += "<th style='background-color:#E0D0B0'>效果</th>"
    html += "<th style='background-color:#EFE0C0'>重量</th>"
    html += "<th style='background-color:#EFE0C0'>耐久</th>"
    html += "<th style='background-color:#E0D0B0'>职需</th>"
    html += "<th style='background-color:#E0D0B0'>攻需</th>"
    html += "<th style='background-color:#E0D0B0'>防需</th>"
    html += "<th style='background-color:#E0D0B0'>智需</th>"
    html += "<th style='background-color:#E0D0B0'>精需</th>"
    html += "<th style='background-color:#E0D0B0'>速需</th>"
    html += "<th style='background-color:#EFE0C0'>威＋</th>"
    html += "<th style='background-color:#EFE0C0'>重＋</th>"
    html += "<th style='background-color:#EFE0C0'>幸＋</th>"
    html += "<th style='background-color:#E0D0B0'>经验</th>"
    html += "<th style='background-color:#EFE0C0'>属性</th>"
    html += "<th style='background-color:#E8E8D0'>使用</th>"
    html += "<th style='background-color:#E8E8D0'>收藏</th>"
    html += "</tr>";

    for (const equipment of page.equipmentList!) {
        if (equipment.isGoldenCage || equipment.isTreasureBag) {
            continue;
        }
        html += "<tr>";
        html += "<td style='background-color:#E8E8D0'>"
        if (equipment.selectable) {
            html += "<input type='button' " +
                "value='选择' " +
                "style='color:grey' " +
                "id='selectPersonal_" + equipment.index + "' " +
                "class='mutableElement'>";
        } else {
            html += PageUtils.generateInvisibleButton("#E8E8D0");
        }
        html += "</td>";
        html += "<td style='background-color:#EFE0C0'>" + equipment.usingHTML + "</td>"
        html += "<td style='background-color:#E0D0B0'>" + equipment.nameHTML + "</td>"
        html += "<td style='background-color:#EFE0C0'>" + equipment.category + "</td>"
        html += "<td style='background-color:#E0D0B0'>" + equipment.power + "</td>"
        html += "<td style='background-color:#EFE0C0'>" + equipment.weight + "</td>"
        html += "<td style='background-color:#EFE0C0'>" + equipment.endureHtml + "</td>"
        html += "<td style='background-color:#E0D0B0'>" + equipment.requiredCareerHtml + "</td>"
        html += "<td style='background-color:#E0D0B0'>" + equipment.requiredAttackHtml + "</td>"
        html += "<td style='background-color:#E0D0B0'>" + equipment.requiredDefenseHtml + "</td>"
        html += "<td style='background-color:#E0D0B0'>" + equipment.requiredSpecialAttackHtml + "</td>"
        html += "<td style='background-color:#E0D0B0'>" + equipment.requiredSpecialDefenseHtml + "</td>"
        html += "<td style='background-color:#E0D0B0'>" + equipment.requiredSpeedHtml + "</td>"
        html += "<td style='background-color:#EFE0C0'>" + equipment.additionalPowerHtml + "</td>"
        html += "<td style='background-color:#EFE0C0'>" + equipment.additionalWeightHtml + "</td>"
        html += "<td style='background-color:#EFE0C0'>" + equipment.additionalLuckHtml + "</td>"
        html += "<td style='background-color:#E0D0B0'>" + equipment.experienceHTML + "</td>"
        html += "<td style='background-color:#EFE0C0'>" + equipment.attributeHtml + "</td>"
        html += "<td style='background-color:#E8E8D0'>"
        if (equipment.selectable) {
            html += "<input type='button' " +
                "value='" + equipment.buttonTitle + "' " +
                "id='use_" + equipment.index + "' " +
                "class='mutableElement'>";
        } else {
            html += PageUtils.generateInvisibleButton("#E8E8D0");
        }
        html += "</td>";
        html += "<td style='background-color:#E8E8D0'>"
        if (treasureBag !== null && equipment.selectable && !equipment.using) {
            html += "<input type='button' " +
                "value='收藏' " +
                "id='store_" + equipment.index + "' " +
                "class='mutableElement'>";
        } else {
            html += PageUtils.generateInvisibleButton("#E8E8D0");
        }
        html += "</td>";
        html += "</tr>";
    }
    // ------------------------------------------------------------------------
    // 装备菜单栏
    // ------------------------------------------------------------------------
    html += "<tr>";
    html += "<td style='background-color:#F8F0E0;text-align:center' colspan='20'>";
    html += "<table style='border-width:0;background-color:#F8F0E0;width:100%;margin:auto'>";
    html += "<tbody>";
    html += "<tr>";
    html += "<td style='text-align:left'>";
    html += "<input type='button' id='use' class='mutableElement' value='使用装备'>";
    html += "<input type='button' id='bag' class='mutableElement' value='入百宝袋'>";
    html += "</td>";
    html += "<td style='text-align:right'>";
    html += "<input type='button' id='openBag' class='mutableElement' value='打开百宝袋'>";
    html += "<input type='button' id='closeBag' class='mutableElement' value='关闭百宝袋'>";
    html += "</td>";
    html += "</tr>";
    html += "</tbody>";
    html += "</table>";
    html += "</td>";
    html += "</tr>";

    html += "</tbody>";
    html += "</table>";

    $("#equipmentList").html(html).parent().show();

    if (treasureBag === null) {
        $("#bag").prop("disabled", true).hide();
        $("#openBag").prop("disabled", true).hide();
        $("#closeBag").prop("disabled", true).hide();
    } else {
        if ($("#treasureBag").text() === "on") {
            $("#openBag").prop("disabled", true);
        } else {
            $("#closeBag").prop("disabled", true);
        }
    }

    doBindSelectPersonalButton();
    doBindUseButton(page.credential);
    doBindStoreButton(page.credential, treasureBag);
    doBindOpenBagButton(page.credential);
    doBindCloseBagButton(page.credential);

    if (treasureBag !== null && $("#treasureBag").text() === "on") {
        doRenderStorageEquipmentList(page, treasureBag);
    }
}

function doBindSelectPersonalButton() {
    $("input:button[value='选择']")
        .filter(function () {
            const buttonId = $(this).attr("id") as string;
            return buttonId.startsWith("selectPersonal_");
        })
        .on("click", function () {
            const buttonId = $(this).attr("id") as string;
            if (PageUtils.isColorGrey(buttonId)) {
                $(this).css("color", "blue");
            } else if (PageUtils.isColorBlue(buttonId)) {
                $(this).css("color", "grey");
            }
        });
}

function doBindUseButton(credential: Credential) {
    for (let i = 0; i < 20; i++) {
        const buttonId = "use_" + i;
        if ($("#" + buttonId).length === 0) {
            continue;
        }
        $("#" + buttonId).on("click", function () {
            new PersonalEquipmentManagement(credential)
                .use([i])
                .then(() => {
                    doRefresh(credential);
                });
        });
    }
    $("#use").on("click", function () {
        const indexList: number[] = [];
        $("input:button[value='选择']")
            .each(function (_idx, input) {
                const buttonId = $(input).attr("id") as string;
                if (PageUtils.isColorBlue(buttonId)) {
                    const index = parseInt(StringUtils.substringAfter(buttonId, "_"));
                    indexList.push(index);
                }
            });
        if (indexList.length === 0) {
            PageUtils.scrollIntoView("pageTitle");
            MessageBoard.publishWarning("没有选择装备或者物品！");
            return;
        }
        new PersonalEquipmentManagement(credential)
            .use(indexList)
            .then(() => {
                doRefresh(credential);
            });
    });
}

function doBindStoreButton(credential: Credential, treasureBag: Equipment | null) {
    if (treasureBag === null) {
        return;
    }
    $("input:button[value='收藏']").on("click", function () {
        const buttonId = $(this).attr("id") as string;
        const index = parseInt(StringUtils.substringAfter(buttonId, "_"));
        new TreasureBag(credential, treasureBag.index!)
            .putInto([index])
            .then(() => {
                doRefresh(credential);
            });
    });
}

function doBindOpenBagButton(credential: Credential) {
    if ($("#openBag").prop("disabled")) {
        return;
    }
    $("#openBag").on("click", function () {
        $("#treasureBag").text("on");
        doRefresh(credential);
    });
}

function doBindCloseBagButton(credential: Credential) {
    if ($("#closeBag").prop("disabled")) {
        return;
    }
    $("#closeBag").on("click", function () {
        $("#treasureBag").text("off");
        doRefresh(credential);
    });
}

function doRenderStorageEquipmentList(page: PersonalEquipmentManagementPage, treasureBag: Equipment) {
    new TreasureBag(page.credential, treasureBag.index!)
        .open()
        .then(equipmentList => {

            if (equipmentList.length === 0) {
                // Nothing found in bag.
                return;
            }

            let html = "";
            html += "<table style='border-width:0;background-color:#888888;text-align:center;width:100%;margin:auto'>";
            html += "<tbody>";
            html += "<tr>";
            html += "<td style='background-color:darkgreen;color:wheat;font-weight:bold;font-size:120%;text-align:center' colspan='11'>＜ 百 宝 袋 ＞</td>";
            html += "</tr>";
            html += "<tr>";
            html += "<th style='background-color:#E8E8D0'>选择</th>"
            html += "<th style='background-color:#E0D0B0'>名字</th>"
            html += "<th style='background-color:#EFE0C0'>种类</th>"
            html += "<th style='background-color:#E0D0B0'>效果</th>"
            html += "<th style='background-color:#EFE0C0'>重量</th>"
            html += "<th style='background-color:#EFE0C0'>耐久</th>"
            html += "<th style='background-color:#EFE0C0'>威＋</th>"
            html += "<th style='background-color:#EFE0C0'>重＋</th>"
            html += "<th style='background-color:#EFE0C0'>幸＋</th>"
            html += "<th style='background-color:#E0D0B0'>经验</th>"
            html += "<th style='background-color:#E8E8D0'>取出</th>"
            html += "</tr>";

            for (const equipment of equipmentList) {
                html += "<tr>";
                html += "<td style='background-color:#E8E8D0'>选择</td>";
                html += "<td style='background-color:#E0D0B0'>" + equipment.nameHTML + "</td>";
                html += "<td style='background-color:#EFE0C0'>" + equipment.category + "</td>";
                html += "<td style='background-color:#E0D0B0'>" + equipment.power + "</td>";
                html += "<td style='background-color:#EFE0C0'>" + equipment.weight + "</td>";
                html += "<td style='background-color:#EFE0C0'>" + equipment.endureHtml + "</td>";
                html += "<td style='background-color:#EFE0C0'>" + equipment.additionalPowerHtml + "</td>";
                html += "<td style='background-color:#EFE0C0'>" + equipment.additionalWeightHtml + "</td>";
                html += "<td style='background-color:#EFE0C0'>" + equipment.additionalLuckHtml + "</td>";
                html += "<td style='background-color:#E0D0B0'>" + equipment.experienceHTML + "</td>";
                html += "<td style='background-color:#E8E8D0'>";
                html += "<input type='button' " +
                    "value='取出' " +
                    "id='takeOut_" + equipment.index + "' " +
                    "class='mutableElement'>";
                html += "</td>";
                html += "</tr>";
            }

            html += "</tbody>";
            html += "</table>";

            $("#storageEquipmentList").html(html).parent().show();

            bindTakeOutButton(page.credential, treasureBag);
        });
}

function bindTakeOutButton(credential: Credential, treasureBag: Equipment) {
    $("input:button[value='取出']").on("click", function () {
        const buttonId = $(this).attr("id") as string;
        const index = parseInt(StringUtils.substringAfter(buttonId, "_"));
        new TreasureBag(credential, treasureBag.index!)
            .takeOut([index])
            .then(() => {
                doRefresh(credential);
            });
    });
}

export = MapPersonalEquipmentManagementProcessor;