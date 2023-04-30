import PageProcessor from "../PageProcessor";
import PageUtils from "../../util/PageUtils";
import Credential from "../../util/Credential";
import SetupLoader from "../../pocket/SetupLoader";
import Role from "../../pocket/Role";
import StringUtils from "../../util/StringUtils";

class TownDashboardProcessor extends PageProcessor {

    process() {
        PageUtils.removeUnusedHyperLinks();
        PageUtils.removeGoogleAnalyticsScript();
        const credential = PageUtils.currentCredential();
        doProcess(credential);
    }

}

function doProcess(credential: Credential) {
    $("input:text:first").attr("id", "messageInputText");
    doRenderBattleMenu(credential);
    doRenderPostHouseMenu();
    doRenderSetupMenu();
    doRenderEquipmentManagementMenu();
    doRenderPetManagementMenu();
    doRenderCareerManagementMenu();

    const role = doParseRole();
    doRenderBattleCount(role);
    doRenderCareerTransferWarning(credential, role);
}

function doParseRole(): Role {
    // 读取角色当前的能力值
    const text = $("#c_001").find("table:last").find("td:first").text();
    let idx = text.indexOf("Lv：");
    let s = text.substring(idx);
    const level = parseInt(s.substring(3, s.indexOf(" ")));
    idx = text.indexOf("攻击力：");
    s = text.substring(idx);
    const attack = parseInt(s.substring(4, s.indexOf(" ")));
    idx = s.indexOf("防御力：");
    s = s.substring(idx);
    const defense = parseInt(s.substring(4, s.indexOf(" ")));
    idx = s.indexOf("智力：");
    s = s.substring(idx);
    const specialAttack = parseInt(s.substring(3, s.indexOf(" ")));
    idx = s.indexOf("精神力：");
    s = s.substring(idx);
    const specialDefense = parseInt(s.substring(4, s.indexOf(" ")));
    idx = s.indexOf("速度：");
    s = s.substring(idx);
    const speed = parseInt(s.substring(3));
    const battleCount = parseInt($("input:hidden[name='ktotal']").val() as string);

    const role = new Role();
    role.level = level;
    role.attack = attack;
    role.defense = defense;
    role.specialAttack = specialAttack;
    role.specialDefense = specialDefense;
    role.speed = speed;
    role.battleCount = battleCount;
    return role;
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
                btnBattle.focus();
                // 重置 inputDigits
                inputDigits = '';
            }
        });
    }


}

function doRenderPostHouseMenu() {
    $("option[value='INN']").text("客栈·驿站");
    $("option[value='INN']").css("background-color", "yellow");
}

function doRenderSetupMenu() {
    $("option[value='LETTER']").text("口袋助手设置");
    $("option[value='LETTER']").css("background-color", "yellow");

    const th = $("th:contains('看不到图片按这里')")
        .filter(function () {
            return $(this).text() === "看不到图片按这里";
        });

    let html = $(th).html();
    html += "<input type='button' id='setupButton' value='助手'>";
    html += "<input type='button' id='equipmentButton' value='装备'>";
    html += "<input type='button' id='petButton' value='宠物'>";
    $(th).html(html);

    $("#setupButton").on("click", function () {
        $("option[value='LETTER']").prop("selected", true);
        $("option[value='LETTER']").closest("td").next().find("input:submit:first").trigger("click");
    });
    $("#equipmentButton").on("click", function () {
        $("option[value='USE_ITEM']").prop("selected", true);
        $("option[value='USE_ITEM']").closest("td").next().find("input:submit:first").trigger("click");
    });
    $("#petButton").on("click", function () {
        $("option[value='PETSTATUS']").prop("selected", true);
        $("option[value='PETSTATUS']").closest("td").next().find("input:submit:first").trigger("click");
    });
}

function doRenderEquipmentManagementMenu() {
    if (SetupLoader.isEquipmentManagementUIEnabled()) {
        $("option[value='USE_ITEM']").text("装备管理");
        $("option[value='USE_ITEM']").css("background-color", "yellow");
        $("option[value='ITEM_SEND']").remove();
    }
}

function doRenderPetManagementMenu() {
    if (SetupLoader.isPetManagementUIEnabled()) {
        $("option[value='PETSTATUS']").text("宠物管理");
        $("option[value='PETSTATUS']").css("background-color", "yellow");
        $("option[value='PET_SEND']").remove();
    }
}

function doRenderCareerManagementMenu() {
    if (SetupLoader.isCareerManagementUIEnabled()) {
        $("option[value='CHANGE_OCCUPATION']").text("职业管理");
        $("option[value='CHANGE_OCCUPATION']").css("background-color", "yellow");
        $("option[value='MAGIC']").remove();
    }
}

function doRenderBattleCount(role: Role) {
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
                return name + "&nbsp;&nbsp;&nbsp;" + role.battleCount + "战";
            } else {
                return name + "(" + unit + ")" + "&nbsp;&nbsp;&nbsp;" + role.battleCount + "战";
            }
        });
}

function doRenderCareerTransferWarning(credential: Credential, role: Role) {
    // 如果满级并且没有关闭转职入口，则战斗前标签用红色显示
    if (role.level === 150) {
        if (!SetupLoader.isCareerTransferEntranceDisabled(credential.id)) {
            $("th:contains('训练·战斗')")
                .filter(function () {
                    return $(this).text() === "训练·战斗";
                })
                .css("color", "red");
        }
    }
}

export = TownDashboardProcessor;