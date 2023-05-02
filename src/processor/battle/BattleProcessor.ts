import PageUtils from "../../util/PageUtils";
import SetupLoader from "../../pocket/SetupLoader";
import StringUtils from "../../util/StringUtils";
import NpcLoader from "../../pocket/NpcLoader";
import RandomUtils from "../../util/RandomUtils";
import CommentBoard from "../../util/CommentBoard";
import Processor from "../Processor";

class BattleProcessor implements Processor {

    process(): void {
        PageUtils.removeUnusedHyperLinks();
        PageUtils.removeGoogleAnalyticsScript();

        const pageText = document.documentElement.outerText;
        doRenderPrompt(pageText);

        $('input[value="返回住宿"]').attr('id', 'lodgeButton');
        $('input[value="返回修理"]').attr('id', 'repairButton');
        $('input[value="返回城市"]').attr('id', 'returnButton');
        $('input[value="返回更新"]').attr('id', 'updateButton');
        $('input[value="返回银行"]').attr('id', 'depositButton');

        // 根据设置的内容修改按钮的台词
        let buttonText = SetupLoader.getBattleReturnButtonText();
        if (buttonText !== "") {
            $("#returnButton").val(buttonText);
        }
        buttonText = SetupLoader.getBattleLodgeButtonText();
        if (buttonText !== "") {
            $("#lodgeButton").val(buttonText);
        }
        buttonText = SetupLoader.getBattleRepairButtonText();
        if (buttonText !== "") {
            $("#repairButton").val(buttonText);
        }
        buttonText = SetupLoader.getBattleDepositButtonText();
        if (buttonText !== "") {
            $("#depositButton").val(buttonText);
        }

        // 修改返回修理按钮的行为，直接变成全部修理
        $('#repairButton').parent().prepend($('<input type="hidden" name="arm_mode" value="all">'));
        $('input[value="MY_ARM"]').attr('value', 'MY_ARM2');

        // 修改返回银行按钮的行为，直接变成全部存入
        $('#depositButton').parent().prepend($('<input type="hidden" name="azukeru" value="all">'));
        $('input[value="BANK"]').attr('value', 'BANK_SELL');

        doPostBattle(pageText);

        // 如果强制推荐启用，则删除其余所有的按钮
        if (SetupLoader.isBattleForceRecommendationEnabled()) {
            $("input:submit").each(function (_idx, submit) {
                const tabIndex = $(submit).attr("tabIndex");
                if (tabIndex === undefined || tabIndex === "" || parseInt(tabIndex) !== 1) {
                    $(submit).parent().remove();
                } else {
                    $(submit).trigger("focus");
                }
            });
        }
        // 战斗页自动触底开启
        if (SetupLoader.isBattleResultAutoScrollEnabled()) {
            const buttonId = $("input:submit[tabindex='1']").attr("id");
            document.getElementById(buttonId!)?.scrollIntoView();
        }
        // 十二宫极速战斗
        if (pageText.includes("＜＜ - 十二神殿 - ＞＞") && SetupLoader.isZodiacFlashBattleEnabled()) {
            $("input:submit[tabindex='1']").trigger("click");
        }
    }
}

function doRenderPrompt(pageText: string) {
    if (pageText.includes("入手！")) {
        doRenderBattleHarvestPrompt();
    } else {
        doRenderNormalBattlePrompt();
    }
}

function doPostBattle(pageText: string): void {
    const reportText = $("#ueqtweixin").text();
    const endure = findRecoverItemEndure(reportText);

    if (shouldRepair(reportText, endure)) {
        // 优先修理按钮
        $("#repairButton").attr("tabIndex", 1);
        return;
    }

    const mode = determinePostBattleBehaviour(pageText, endure);
    if (mode === 1) {
        $("#lodgeButton").attr('tabIndex', 1);
    }
    if (mode === 2) {
        $("#depositButton").attr('tabIndex', 1);
    }
    if (mode === 3) {
        $("#returnButton").attr('tabIndex', 1);
    }
}

function findRecoverItemEndure(reportText: string): number {
    // 耐久度初始值10000以下的最大的质数，表示没有发现回血道具
    let endure = 9973;
    if (reportText.includes("(自动)使用。(剩余")) {
        // 找到了回血道具
        const s = StringUtils.substringBetween(reportText, "(自动)使用。(剩余", "回)");
        endure = parseInt(s);
    }
    return endure;
}

function shouldRepair(reportText: string, endure: number): boolean {
    if (endure % 100 === 0) {
        // 当回血道具的耐久度掉到100整倍数时触发修理装备。
        return true;
    }

    // 然后判断剩余的所有装备的耐久，只要有任意一件装备的耐久低于100，
    // 也触发修理装备。这里需要注意的是要排除掉大师球、宗师球、怪兽球
    // 和宠物蛋。。因此判断耐久在10~99区间吧，可以排除掉大师球和宗师球。
    let sourceText = reportText;
    const lowEndures: number[] = [];
    for (let i = 0; i < 4; i++) {
        // 最多查四次耐久度剩余
        let startIndex = sourceText.indexOf("剩余");
        if (startIndex != -1) {
            sourceText = sourceText.substring(startIndex + 2);
            let numbers = [];
            for (let j = 0; j < sourceText.length; j++) {
                if (sourceText[j] >= '0' && sourceText[j] <= '9') {
                    numbers.push(sourceText[j]);
                } else {
                    let number = "";
                    for (let k = 0; k < numbers.length; k++) {
                        number += numbers[k];
                    }
                    numbers = [];
                    if (parseInt(number) < SetupLoader.getRepairMinLimitation()) {
                        lowEndures.push(parseInt(number));
                    }
                    break;
                }
            }
        }
    }
    if (lowEndures.length === 0) {
        // 没有装备耐久掉到阈值之下，忽略
        return false;
    }

    for (let idx = 0; idx < lowEndures.length; idx++) {
        const currentEndure = lowEndures[idx];
        if (reportText.indexOf("大师球剩余" + currentEndure + "耐久度") === -1 &&
            reportText.indexOf("宗师球球剩余" + currentEndure + "耐久度") === -1 &&
            reportText.indexOf("超力怪兽球剩余" + currentEndure + "耐久度") === -1 &&
            reportText.indexOf("宠物蛋剩余" + currentEndure + "耐久度") === -1) {
            // 这个低耐久的装备不是上述需要排除的，说明真的有装备耐久低了，需要修理
            return true;
        }
    }

    return false;
}

/**
 * 1. 战败需要住宿
 * 2. 十二宫战斗胜利不需要住宿，直接存钱更好
 * 3. 战胜/平手情况下，检查生命力是否低于某个阈值
 * 返回值：
 * 1 - 表示住宿
 * 2 - 表示存钱
 * 3 - 表示返回
 * @param pageText
 * @param endure
 */
function determinePostBattleBehaviour(pageText: string, endure: number): number {
    if (!pageText.includes("将 怪物 全灭！")) {
        // 没有战胜，直接去住宿吧
        return 1;
    }
    if (pageText.includes("＜＜ - 十二神殿 - ＞＞") || pageText.includes("＜＜ - 秘宝之岛 - ＞＞")) {
        // 十二宫和秘宝之岛战斗胜利不需要住宿，直接存钱更好
        return 2;
    }
    let depositBattleCount = SetupLoader.getDepositBattleCount();
    if (depositBattleCount > 0 && endure % depositBattleCount === 0) {
        // 存钱战数到了
        return 2;
    }

    // 通过第一个头像找到玩家的名字
    const player = $("img:first").attr("alt")!;

    // 获取玩家最后剩余的HP和MP
    let health = 0;
    let maxHealth = 0;
    let mana = 0;
    let maxMana = 0;
    $("td:parent").each(function (_idx, td) {
        if (player === $(td).text()) {
            let healthText = $(td).next().text();
            health = parseInt(StringUtils.substringBeforeSlash(healthText));
            maxHealth = parseInt(StringUtils.substringAfterSlash(healthText));

            let manaText = $(td).next().next().text();
            mana = parseInt(StringUtils.substringBeforeSlash(manaText));
            maxMana = parseInt(StringUtils.substringAfterSlash(manaText));
        }
    });

    // 生命力低于最大值的配置比例，住宿推荐
    if (SetupLoader.getLodgeHealthLostRatio() > 0 && (health <= maxHealth * SetupLoader.getLodgeHealthLostRatio())) {
        return 1;
    }
    // 如果MANA小于50%并且小于配置点数，住宿推荐
    if (SetupLoader.getLodgeManaLostPoint() > 0 && (mana <= maxMana * 0.5 && mana <= SetupLoader.getLodgeManaLostPoint())) {
        return 1;
    }

    if (SetupLoader.getDepositBattleCount() > 0) {
        // 设置了定期存钱，但是没有到战数，那么就直接返回吧
        return 3;
    } else {
        // 没有设置定期存钱，那就表示每战都存钱
        return 2;
    }
}

function doRenderBattleHarvestPrompt() {
    const prompt = SetupLoader.getBattleHarvestPrompt();
    if (prompt["person"] !== undefined && prompt["person"] !== "NONE") {
        const candidates: string[] = [];
        $("p").each(function (_idx, p) {
            if ($(p).text().includes("入手！")) {
                const html = $(p).html();
                html.split("<br>").forEach(it => {
                    if (it.endsWith("入手！")) {
                        candidates.push(it);
                    }
                });
            }
        });
        if (candidates.length > 0) {
            // @ts-ignore
            let person = prompt["person"];
            let imageHTML: string;
            if (person === "SELF") {
                imageHTML = PageUtils.findFirstRoleImageHtml()!;
            } else if (person === "RANDOM") {
                const persons = NpcLoader.getNpcNames();
                const idx = RandomUtils.randomInt(0, persons.length - 1);
                person = persons[idx];
                imageHTML = NpcLoader.getNpcImageHtml(person)!;
            } else {
                imageHTML = NpcLoader.getNpcImageHtml(person)!;
            }

            CommentBoard.createCommentBoard(imageHTML);
            $("#commentBoard").css("text-align", "center");
            for (const it of candidates) {
                CommentBoard.writeMessage("<b style='font-size:150%'>" + it + "</b><br>");
            }
            // @ts-ignore
            CommentBoard.writeMessage($("<td>" + prompt["text"] + "</td>").text());
        }
    }
}

function doRenderNormalBattlePrompt() {
    const prompt = SetupLoader.getNormalBattlePrompt();
    if (prompt["person"] !== undefined && prompt["person"] !== "NONE") {
        let person = prompt["person"];
        let imageHTML: string;
        if (person === "SELF") {
            imageHTML = PageUtils.findFirstRoleImageHtml()!;
        } else if (person === "RANDOM") {
            const persons = NpcLoader.getNpcNames();
            const idx = RandomUtils.randomInt(0, persons.length - 1);
            person = persons[idx];
            imageHTML = NpcLoader.getNpcImageHtml(person)!;
        } else {
            imageHTML = NpcLoader.getNpcImageHtml(person)!;
        }
        CommentBoard.createCommentBoard(imageHTML);
        $("#commentBoard")
            .css("text-align", "center")
            .css("background-color", "black")
            .css("color", "greenyellow");
        CommentBoard.writeMessage($("<td>" + prompt["text"] + "</td>").text());
    }
}

export = BattleProcessor;