import _, {parseInt} from "lodash";
import StringUtils from "../../util/StringUtils";
import SetupLoader from "../../setup/SetupLoader";
import BattleDeclarationManager from "./BattleDeclarationManager";
import BattlePage from "./BattlePage";
import Credential from "../../util/Credential";
import {RoleStatusManager} from "../role/RoleStatus";

class BattlePageParser {

    private readonly credential: Credential;

    constructor(credential: Credential) {
        this.credential = credential;
    }

    async parse(html: string): Promise<BattlePage> {
        const page = new BattlePage();

        let table = $(html)
            .find("img:first")
            .closest("table")
            .parent()
            .closest("table")
            .parent()
            .closest("table");
        let div = table.prev();

        const roleTable = table.find("> tbody:first")
            .find("> tr:eq(3) > td:first")
            .find("> table:first > tbody:first")
            .find("> tr:first > td:first")
            .find("> table:first");

        const weaponName = roleTable.find("> tbody:first")
            .find("> tr:eq(2)")
            .find("> td:eq(4)")
            .text();
        const armorName = roleTable.find("> tbody:first")
            .find("> tr:eq(2)")
            .find("> td:eq(5)")
            .text();
        const accessoryName = roleTable.find("> tbody:first")
            .find("> tr:eq(2)")
            .find("> td:eq(6)")
            .text();

        roleTable.find("> tbody:first")
            .find("> tr:eq(2)")
            .find("> td:first")
            .next()
            .html((idx, html) => {
                page.roleNameHtml = html;
                return html;
            })
            .prev()
            .html((idx, html) => {
                page.roleImageHtml = $("<td>" + html + "</td>")
                    .find("> img:first")
                    .attr("title", page.roleNameHtml!)
                    .parent()
                    .html();
                return html;
            })

        table.find("> tbody:first")
            .find("> tr:eq(4)")
            .find("> td:first")
            .find("> table:first")
            .find("> tbody:first")
            .find("> tr:first")
            .find("> td:first")
            .find("> table:first")
            .find("> tbody:first")
            .find("> tr:eq(2)")
            .find("> td:first")
            .html((idx, html) => {
                page.monsterNameHtml = html;
                return html;
            })
            .parent()
            .find("> td:last")
            .html((idx, html) => {
                page.monsterImageHtml = $("<td>" + html + "</td>")
                    .find("> img:first")
                    .attr("title", page.monsterNameHtml!)
                    .attr("alt", page.monsterNameHtml!)
                    .parent()
                    .html();
                return html;
            });

        table.find("> tbody:first")
            .find("> tr:first")
            .find("> td:first")
            .find("> font:first")
            .find("> b:first")
            .each((idx, b) => {
                let battleField = $(b).text();
                page.treasureBattle = battleField.includes("秘宝之岛");
                page.primaryBattle = battleField.includes("初级之森");
                page.juniorBattle = battleField.includes("中级之塔");
                page.seniorBattle = battleField.includes("上级之洞窟");
                page.zodiacBattle = battleField.includes("十二神殿");
            });

        let petName = "";
        const endureList: number[] = [];
        for (const s of _.split(div.text(), "\n")) {
            if (_.endsWith(s, "耐久度")) {
                if (!s.includes("大师球") &&
                    !s.includes("宗师球") &&
                    !s.includes("超力怪兽球") &&
                    !s.includes("宠物蛋")) {
                    let t = StringUtils.substringBetween(s, "剩余", "耐久度");
                    let n = parseInt(t);
                    endureList.push(n);
                }
            }
            if (_.endsWith(s, "回)")) {
                let t = StringUtils.substringBetween(s, "(剩余", "回)");
                let n = parseInt(t);
                endureList.push(n);
            }
            if (s.includes(" 获得 ") && s.includes(" 经验值.")) {
                // 这一行是宠物获得经验值的那一行
                page.petEarnExperience = true;
                // 记录下宠物名
                petName = StringUtils.substringBefore(s, " 获得 ");
            }
            if (petName !== "") {
                const searchString = petName + "等级上升！";
                if (s.includes(searchString)) {
                    page.petUpgrade = true;
                }
            }
        }
        if (endureList.length > 0) {
            page.lowestEndure = _.min(endureList);
        }

        let battleTable = table
            .find("> tbody:first")
            .find("> tr:eq(5)")
            .find("> td:first")
            .find("> table:first");

        const imgSrcList: string[] = [];
        battleTable
            .find("> tbody:first")
            .find("> tr:first")
            .find("> td:first")
            .find("> center:first")
            .find("> h1:eq(1)")
            .find("> font:first")
            .find("> b:first")
            .find("> p:first")
            .find("> table:first")
            .find("> tbody:first")
            .find("> tr")
            .filter(idx => idx > 1)
            .find("img")
            .each((idx, img) => {
                const src = $(img).attr("src")!;
                imgSrcList.push(src);
            });
        if (imgSrcList.length === 3) {
            // 在战斗的第一个回合的表格中找到3张图片，说明有宠物
            const roleImageSrc = $(page.roleImageHtml!).attr("src")!;
            const monsterImageSrc = $(page.monsterImageHtml!).attr("src")!;
            let petImageSrc = "";
            for (const imgSrc of imgSrcList) {
                // 过滤掉角色图片和怪物图片剩下的就是宠物图片
                if (imgSrc === roleImageSrc || imgSrc === monsterImageSrc) {
                    continue;
                }
                petImageSrc = imgSrc;
            }
            if (petImageSrc === "") {
                // 没有找到？那说明宠物图片和怪物图片是一个
                petImageSrc = monsterImageSrc;
            }
            page.petImageHtml = "<img src='" + petImageSrc + "' alt='' width='64' height='64'>";
        }

        if (page.petImageHtml !== undefined) {
            battleTable
                .find("> tbody:first")
                .find("> tr:first")
                .find("> td:first")
                .find("> center:first")
                .find("> h1:eq(1)")
                .find("> font:first")
                .find("> b:first")
                .find("> p:first")
                .find("> table:eq(1)")
                .find("> tbody:first")
                .find("> tr:first")
                .find("> td:first")
                .find("> table:first")
                .find("> tbody:first")
                .find("> tr:eq(4)")
                .each((idx, tr) => {
                    page.petNameHtml = $(tr).find("> td:first").html();
                });
        }


        battleTable
            .find("td:contains('＜怪物＞')")
            .filter((idx, td) => $(td).text() === "＜怪物＞")
            .each((idx, td) => {
                let monsterTable = $(td).closest("table");
                let roleTable = monsterTable.parent().prev().find("table:first");

                roleTable
                    .find("tr:first")
                    .next()
                    .next()
                    .find("td:eq(1)")
                    .each((i, td) => {
                        let s = StringUtils.substringBefore($(td).text(), " / ");
                        page.roleHealth = _.parseInt(s);
                        s = StringUtils.substringAfter($(td).text(), " / ");
                        page.roleMaxHealth = _.parseInt(s);
                    })
                    .next()
                    .each((i, td) => {
                        let s = StringUtils.substringBefore($(td).text(), " / ");
                        page.roleMana = _.parseInt(s);
                        s = StringUtils.substringAfter($(td).text(), " / ");
                        page.roleMaxMana = _.parseInt(s);
                    })

                monsterTable
                    .find("tr:first")
                    .next()
                    .next()
                    .find("td:eq(1)")
                    .each((i, td) => {
                        let s = StringUtils.substringBefore($(td).text(), " / ");
                        page.monsterHealth = _.parseInt(s);
                        s = StringUtils.substringAfter($(td).text(), " / ");
                        page.monsterMaxHealth = _.parseInt(s);
                    })
            });


        if (page.roleHealth! === 0) {
            page.battleResult = "战败";
        } else if (page.monsterHealth! === 0) {
            page.battleResult = "战胜";
        } else {
            page.battleResult = "平手";
        }

        page.harvestList = [];
        battleTable
            .find("p")
            .filter((idx, p) => $(p).text().includes("入手！"))
            .each((idx, p) => {
                _.split($(p).html(), "<br>").forEach(it => {
                    if (it.endsWith("入手！")) {
                        page.harvestList!.push(it);
                    }
                });
            });


        page.eggBorn = html.includes("孵化成功");
        page.monsterTask = html.includes("完成杀怪任务");
        page.petLearnSpell = html.includes("遗忘了技能") || html.includes("学会了新技能");

        // 宠物升级了，但是没有学会新技能，有两种情况：
        // 1. 正常的非整10级
        // 2. 整10级，但是没有设置学习技能
        if (page.petUpgrade && !page.petLearnSpell) {
            const currentPetLevel = (await new RoleStatusManager(this.credential).load())?.readPetLevel ?? -1;
            if (currentPetLevel >= 0 && (currentPetLevel % 10 === 9)) {
                // 如果缓存有数据时，这里宠物等级是升级前的等级，因此需要判断尾数9
                // 满足条件时也可视为宠物学习了新技能
                page.petLearnSpell = true;
            }
        }
        // 宠物学习新技能时（到达技能等级），尝试记录缓存中当前的宠物等级（正常情况应该是尾数9）
        if (page.petLearnSpell) {
            const currentPetLevel = (await new RoleStatusManager(this.credential).load())?.readPetLevel ?? -1;
            if (currentPetLevel >= 0) {
                page.petBeforeLevel = currentPetLevel;
            }
        }

        // 解析宠物的亲密度
        if (page.petNameHtml !== undefined) {
            $(html).find("font:contains('亲密度成为')")
                .filter((_idx, it) => _.startsWith($(it).text(), "亲密度成为"))
                .each((idx, it) => {
                    let petLoveText = $(it).html();
                    petLoveText = StringUtils.substringBetween(petLoveText, "亲密度成为", "！");
                    page.petLove = parseFloat(petLoveText);
                });
        }

        generateBattleReport(battleTable, page);

        $(page.reportHtml!)
            .find("font[color='orange']")
            .each((idx, font) => {
                let t = $(font).text();
                if (!page.additionalRP && _.startsWith(t, "RP上升1点")) {
                    t = StringUtils.substringAfter(t, "RP上升1点，达到了");
                    t = StringUtils.substringBefore(t, "点");
                    page.additionalRP = _.parseInt(t);
                }
            });


        page.noWeaponFound = (weaponName === "");
        page.noArmorFound = (armorName === "");
        page.noAccessoryFound = (accessoryName === "");
        page.noPetFound = (page.petNameHtml === undefined);

        if (weaponName !== "") page.usingWeaponName = weaponName;
        if (armorName !== "") page.usingArmorName = armorName;
        if (accessoryName !== "") page.usingAccessoryName = accessoryName;

        if (page.noWeaponFound) {
            page.harvestList.push("亲，你好像没有带<span style='color:green'>武器</span>！");
        }
        if (page.noArmorFound) {
            page.harvestList.push("穿上<span style='color:green'>防具</span>不裸奔，是一种美德！");
        }
        if (page.noAccessoryFound) {
            page.harvestList.push("<span style='color:green'>饰品</span>空空，不觉得有点别扭么？");
        }
        if (page.noPetFound) {
            page.harvestList.push("就不带<span style='color:blue'>宠物</span>，就要独美！");
        }

        return await (() => {
            return new Promise<BattlePage>(resolve => resolve(page));
        })();
    }

}

function generateBattleReport(battleTable: JQuery, page: BattlePage) {
    let p1 = "";
    let p2 = "";
    let p3 = "";

    // 没有宠物的时候最后一个回合不在p里面！！！巨坑巨坑。
    if (page.petNameHtml === undefined) {
        let s = battleTable
            .find("> tbody:first")
            .find("> tr:first")
            .find("> td:first")
            .find("> center:first")
            .find("> h1:eq(1)")
            .find("> p:first")
            .html();
        p3 = StringUtils.substringAfterLast(s, "</table>");
        if (_.startsWith(p3, "<br>")) {
            p3 = StringUtils.substringAfter(p3, "<br>");
            // noinspection HtmlDeprecatedTag,HtmlDeprecatedAttribute,XmlDeprecatedElement
            p3 = "<b><font size='3'>" + p3 + "</font></b>";
        }
    } else {
        let lastTurnIndex = 0;  // 最后一个回合p元素对应的下标
        battleTable
            .find("> tbody:first")
            .find("> tr:first")
            .find("> td:first")
            .find("> center:first")
            .find("> h1:eq(1)")
            .find("> font:first")
            .find("> b:first")
            .find("> p")
            .each((idx, p) => {
                const t = $(p).text();
                if (_.startsWith(t, "第 ") && _.includes(t, " 回合")) {
                    lastTurnIndex = idx;
                }
            });

        const pList: JQuery[] = [];
        battleTable
            .find("> tbody:first")
            .find("> tr:first")
            .find("> td:first")
            .find("> center:first")
            .find("> h1:eq(1)")
            .find("> font:first")
            .find("> b:first")
            .find("> p")
            .each((idx, p) => {
                if (idx >= lastTurnIndex) {
                    pList.push($(p));
                }
            });

        p1 = pList[0].html();
        p1 = StringUtils.substringAfterLast(p1, "</tbody></table><br>");

        p2 = "";
        if (pList.length > 1) {
            p2 = pList[1].html();
        }

        p3 = battleTable
            .find("> tbody:first")
            .find("> tr:first")
            .find("> td:first")
            .find("> center:first")
            .find("> h1:eq(1)")
            .find("> p:first")
            .html();
    }


    let report = "";
    if (!SetupLoader.isQuietBattleModeEnabled()) {
        if (p1 !== "") {
            // noinspection HtmlDeprecatedTag,HtmlDeprecatedAttribute,XmlDeprecatedElement
            report += "<b><font size='3'>" + p1 + "</font></b><br>"
        }
        if (p2 !== "") {
            // noinspection HtmlDeprecatedTag,HtmlDeprecatedAttribute,XmlDeprecatedElement
            report += "<b><font size='3'>" + p2 + "</font></b><br>";
        }
        report += p3;
        while (true) {
            if (!report.includes("<br><br>")) {
                break;
            }
            report = _.replace(report, "<br><br>", "<br>");
        }
    }

    let loseBattle = false;
    let brs: string;
    if (page.battleResult === "战胜") {
        brs = BattleDeclarationManager.randomWinDeclaration(page.monsterNameHtml);
    } else if (page.battleResult === "战败") {
        loseBattle = true;
        brs = BattleDeclarationManager.randomLoseDeclaration(page.monsterNameHtml);
    } else {
        if (page.zodiacBattle) {
            loseBattle = true;
        }
        brs = BattleDeclarationManager.randomDrawDeclaration(page.monsterNameHtml);
    }
    // noinspection HtmlDeprecatedTag,HtmlDeprecatedAttribute,XmlDeprecatedElement
    report = "<p style='font-weight:bold'><font size='3'>" + brs + "</font></p>" + report;

    // 展现入手
    if (page.harvestList!.length > 0) {
        let harvest = "";
        for (const it of page.harvestList!) {
            harvest += "<b>" + it + "</b><br>";
        }
        report = "<p style='font-size:250%'>" + harvest + "</p>" + report;
    }

    // 展现宠物升级
    if (page.petUpgrade! && page.petNameHtml !== undefined) {
        let pu = "<span style='color:green'>" + page.petNameHtml + "</span> ";
        if (page.petLearnSpell!) {
            pu += "<span style='color:blue'>吐故纳新，扶摇直上！</span>";
        } else {
            pu += "<span style='color:indigo'>突飞猛进！</span>";
        }
        // noinspection HtmlDeprecatedTag,HtmlDeprecatedAttribute,XmlDeprecatedElement
        report = "<p style='font-weight:bold'><font size='3'>" + pu + "</font></p>" + report;
    }

    // 展现战斗双方
    if (!SetupLoader.isQuietBattleModeEnabled()) {
        if (loseBattle && SetupLoader.isWinnerLeftEnabled()) {
            report = "<p>" + page.monsterImageHtml +
                "&nbsp;&nbsp;&nbsp;<b style='font-size:300%;color:blue'>VS</b>&nbsp;&nbsp;&nbsp;" +
                page.roleImageHtml +
                (page.petImageHtml === undefined ? "" : page.petImageHtml) + "</p>" + report;
        } else {
            report = "<p>" + page.roleImageHtml +
                (page.petImageHtml === undefined ? "" : page.petImageHtml) +
                "&nbsp;&nbsp;&nbsp;<b style='font-size:300%;color:red'>VS</b>&nbsp;&nbsp;&nbsp;" +
                page.monsterImageHtml + "</p>" + report;
        }
    }


    if (page.battleResult !== "战胜" && page.zodiacBattle) {
        // 十二宫战斗没有取得胜利，显示圣斗士剩余的生命
        report = "<p><b style='color:navy;font-size:120%'>" + page.battleField + "</b></p>" +
            "<p><b style='background-color:lightgreen;font-size:120%'>" + page.monsterHealth + "/" + page.monsterMaxHealth + "</b></p>" +
            "" + report;
    } else {
        report = "<p><b style='color:navy;font-size:120%'>" + page.battleField + "</b></p>" + report;
    }

    page.reportHtml = report;
}

export = BattlePageParser;