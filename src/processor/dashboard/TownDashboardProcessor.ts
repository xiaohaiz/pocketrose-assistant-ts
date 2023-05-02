import PageUtils from "../../util/PageUtils";
import Credential from "../../util/Credential";
import SetupLoader from "../../pocket/SetupLoader";
import StringUtils from "../../util/StringUtils";
import RoleStatusParser from "../../pocket/RoleStatusParser";
import RoleStatus from "../../pocket/RoleStatus";
import Processor from "../Processor";

class TownDashboardProcessor implements Processor {

    accept(cgi: string, pageText: string): boolean {
        if (cgi === "status.cgi" || cgi === "town.cgi") {
            return pageText.includes("城市支配率");
        }
        return false;
    }

    process() {
        PageUtils.removeUnusedHyperLinks();
        PageUtils.removeGoogleAnalyticsScript();
        const credential = PageUtils.currentCredential();
        doProcess(credential);
    }

}

function doProcess(credential: Credential) {
    $("input:text:last").attr("id", "messageInputText");
    $("input:submit[value='更新']").attr("id", "refreshButton");

    doRenderBattleMenu(credential);
    doRenderPostHouseMenu();
    doRenderSetupMenu();
    doRenderEquipmentManagementMenu();
    doRenderPetManagementMenu();
    doRenderCareerManagementMenu();
    doRenderAdventureGuildMenu();

    const roleStatus = RoleStatusParser.parseRoleStatus(document.documentElement.outerHTML);
    doRenderBattleCount(roleStatus);
    doRenderCareerTransferWarning(credential, roleStatus);
    doRenderRoleStatus(roleStatus);
}

function doRenderBattleMenu(credential: Credential) {
    const preference = SetupLoader.getBattlePlacePreference(credential.id);
    let count = 0;
    // @ts-ignore
    if (preference["primary"]) {
        count++;
    }
    // @ts-ignore
    if (preference["junior"]) {
        count++;
    }
    // @ts-ignore
    if (preference["senior"]) {
        count++;
    }
    // @ts-ignore
    if (preference["zodiac"]) {
        count++;
    }
    if (count === 0) {
        // 没有设置战斗场所偏好，忽略
        return;
    }

    // 设置了战斗场所偏好
    $("select[name='level']").find("option").each(function (_idx, option) {
        const text = $(option).text();
        if (text.startsWith("秘宝之岛")) {
            // do nothing, keep
        } else if (text.startsWith("初级之森")) {
            // do nothing, keep
        } else if (text.startsWith("中级之塔")) {
            // do nothing, keep
        } else if (text.startsWith("上级之洞")) {
            // do nothing, keep
        } else if (text.startsWith("十二神殿")) {
            // do nothing, keep
        } else if (text.startsWith("------")) {
            // do nothing, keep
        } else {
            $(option).remove();
        }
    });
    $("select[name='level']").find("option").each(function (_idx, option) {
        const text = $(option).text();
        if (text.startsWith("初级之森")) {
            // @ts-ignore
            if (!preference["primary"]) {
                $(option).remove();
            }
        } else if (text.startsWith("中级之塔")) {
            // @ts-ignore
            if (!preference["junior"]) {
                $(option).remove();
            }
        } else if (text.startsWith("上级之洞")) {
            // @ts-ignore
            if (!preference["senior"]) {
                $(option).remove();
            }
        } else if (text.startsWith("十二神殿")) {
            // @ts-ignore
            if (!preference["zodiac"]) {
                $(option).remove();
            }
        }
    });
    // 删除连续的分隔线
    let delimMatch = false;
    $("select[name='level']").find("option").each(function (_idx, option) {
        const text = $(option).text();
        if (text.startsWith("------")) {
            if (!delimMatch) {
                delimMatch = true;
            } else {
                $(option).remove();
            }
        } else {
            delimMatch = false;
        }
    });
    // 删除头尾的分隔线
    if ($("select[name='level']").find("option:last").text().startsWith("------")) {
        $("select[name='level']").find("option:last").remove();
    }
    if ($("select[name='level']").find("option:first").text().startsWith("------")) {
        $("select[name='level']").find("option:first").remove();
    }

    if (count === 1) {
        // 只设置了一处战斗场所偏好
        let formBattle = $("form[action='battle.cgi']");
        let selectBattle = formBattle.find('select[name="level"]');
        let btnBattle = formBattle.parent().next().find('input');
        let inputDigits = '';
        $(document).off('keydown.city').on('keydown.city', function (e) {
            if ($("#messageInputText:focus").length > 0) {
                // 当前的焦点在消息框，禁用按键辅助
                return;
            }
            const key = e.key;
            if (key !== undefined && !isNaN(parseInt(key))) {
                inputDigits += key;
            }
            if (inputDigits.length === 2) {
                switch (inputDigits) {
                    case '11':
                        selectBattle.find('option').eq(0).prop('selected', true);
                        break;
                    case '22':
                        selectBattle.find('option').eq(1).prop('selected', true);
                        break;
                    default:
                        inputDigits = '';
                        break;
                }
                btnBattle.trigger("focus")
                // 重置 inputDigits
                inputDigits = '';
            }
        });
    }


}

function doRenderPostHouseMenu() {
    $("option[value='INN']")
        .css("background-color", "yellow")
        .text("客栈·驿站");
}

function doRenderSetupMenu() {
    $("option[value='LETTER']")
        .css("background-color", "yellow")
        .text("口袋助手设置");
}

function doRenderEquipmentManagementMenu() {
    if (SetupLoader.isEquipmentManagementUIEnabled()) {
        $("option[value='USE_ITEM']")
            .css("background-color", "yellow")
            .text("装备管理");
        $("option[value='ITEM_SEND']").remove();
    }
}

function doRenderPetManagementMenu() {
    if (SetupLoader.isPetManagementUIEnabled()) {
        $("option[value='PETSTATUS']")
            .css("background-color", "yellow")
            .text("宠物管理");
        $("option[value='PET_SEND']").remove();
    }
}

function doRenderCareerManagementMenu() {
    if (SetupLoader.isCareerManagementUIEnabled()) {
        $("option[value='CHANGE_OCCUPATION']")
            .css("background-color", "yellow")
            .text("职业管理");
        $("option[value='MAGIC']").remove();
    }
}

function doRenderAdventureGuildMenu() {
    $("option[value='CHANGEMAP']")
        .css("background-color", "yellow")
        .text("冒险家公会");
}

function doRenderBattleCount(roleStatus: RoleStatus) {
    $("td:contains('贡献度')")
        .filter(function () {
            return $(this).text() === "贡献度";
        })
        .closest("table")
        .find("th:first")
        .find("font:first")
        .html(function (_idx, text) {
            const name = StringUtils.substringBefore(text, "(");
            const unit = StringUtils.substringBetween(text, "(", "军)");
            if (unit.includes("无所属")) {
                return name + "&nbsp;&nbsp;&nbsp;" + roleStatus.battleCount + "战";
            } else {
                return name + "(" + unit + ")" + "&nbsp;&nbsp;&nbsp;" + roleStatus.battleCount + "战";
            }
        });
}

function doRenderCareerTransferWarning(credential: Credential, roleStatus: RoleStatus) {
    // 如果满级并且没有关闭转职入口，则战斗前标签用红色显示
    if (roleStatus.level === 150) {
        if (!SetupLoader.isCareerTransferEntranceDisabled(credential.id)) {
            $("#refreshButton")
                .closest("td")
                .prev()
                .css("color", "red");
        }
    }
}

function doRenderRoleStatus(roleStatus: RoleStatus) {
    $("td:parent").each(function (_idx, td) {
        const text = $(td).text();
        if (text === "经验值") {
            if (SetupLoader.isExperienceProgressBarEnabled()) {
                if (roleStatus.level === 150) {
                    $(td).next()
                        .attr("style", "color: blue")
                        .text("MAX");
                } else {
                    const ratio = roleStatus.level! / 150;
                    const progressBar = PageUtils.generateProgressBarHTML(ratio);
                    const exp = $(td).next().text();
                    $(td).next()
                        .html("<span title='" + exp + "'>" + progressBar + "</span>");
                }
            }
        }
        if (text === "身份") {
            if (roleStatus.level !== 150 && (roleStatus.attack === 375 || roleStatus.defense === 375
                || roleStatus.specialAttack === 375 || roleStatus.specialDefense === 375 || roleStatus.speed === 375)) {
                $(td).next().css("color", "red");
            }
        }
        if (text === "资金") {
            const cashText = $(td).next().text();
            const cash = cashText.substring(0, cashText.indexOf(" Gold"));
            if (parseInt(cash) >= 1000000) {
                $(td).next().css("color", "red");
            }
        }
    });
}

export = TownDashboardProcessor;