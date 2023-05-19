import Role from "../../common/Role";
import NpcLoader from "../../core/NpcLoader";
import PersonalSpell from "../../pocketrose/PersonalSpell";
import PersonalStatus from "../../pocketrose/PersonalStatus";
import Credential from "../../util/Credential";
import MessageBoard from "../../util/MessageBoard";
import PageUtils from "../../util/PageUtils";
import StringUtils from "../../util/StringUtils";
import PageProcessorContext from "../PageProcessorContext";
import PageProcessorCredentialSupport from "../PageProcessorCredentialSupport";

abstract class AbstractPersonalProfilePageProcessor extends PageProcessorCredentialSupport {

    doLoadButtonStyles(): number[] {
        return [35];
    }

    doProcess(credential: Credential, context?: PageProcessorContext) {
        // 删除老页面的所有元素
        $("center:first").html("").hide();

        // 老页面没有什么有价值的数据，直接渲染新页面
        this.#renderImmutablePage(credential, context);

        // 渲染动态页面
        this.#renderPersonalStatus(credential, context);
    }

    #renderImmutablePage(credential: Credential, context?: PageProcessorContext) {
        let html = "";
        html += "<table style='width:100%;border-width:0;background-color:#888888'>";
        html += "<tbody>";
        html += "<tr>";
        html += "<td id='pageTitleCell'></td>"
        html += "</tr>";
        html += "<tr>";
        html += "<td id='messageBoardCell'></td>"
        html += "</tr>";
        html += "<tr style='display:none'>";
        html += "<td id='hiddenCell-1'></td>"       // 预留给返回城市/城堡功能
        html += "</tr>";
        html += "<tr style='display:none'>";
        html += "<td id='hiddenCell-2'></td>"
        html += "</tr>";
        html += "<tr style='display:none'>";
        html += "<td id='hiddenCell-3'></td>"
        html += "</tr>";
        html += "<tr style='display:none'>";
        html += "<td id='hiddenCell-4'></td>"
        html += "</tr>";
        html += "<tr style='display:none'>";
        html += "<td id='hiddenCell-5'></td>"
        html += "</tr>";
        html += "<tr>";
        html += "<td id='personalStatus'></td>"
        html += "</tr>";
        html += "<tr>";
        html += "<td id='spellStatus'></td>"
        html += "</tr>";
        html += "<tr>";
        html += "<td id='menuCell' style='background-color:#F8F0E0;text-align:center'>";
        html += "<button role='button' id='reloadButton' class='button-35'>刷新个人面板</button>&nbsp;&nbsp;&nbsp;";
        html += "<button role='button' id='returnButton' class='button-35'>返回</button>";
        html += "</td>";
        html += "</tr>";
        html += "</tbody>";
        html += "</table>";

        $("center:first").after($(html));

        $("#pageTitleCell")
            .css("text-align", "center")
            .css("font-size", "180%")
            .css("font-weight", "bold")
            .css("background-color", "navy")
            .css("color", "yellowgreen")
            .text("＜＜  个 人 面 板  ＞＞");

        MessageBoard.createMessageBoardStyleB("messageBoardCell", NpcLoader.randomNpcImageHtml());
        $("#messageBoard")
            .css("background-color", "black")
            .css("color", "wheat")
            .html(this.#welcomeMessageHtml());

        $("#reloadButton").on("click", () => {
            PageUtils.scrollIntoView("pageTitleCell");
            $("#messageBoardManager").html(NpcLoader.randomNpcImageHtml());
            $("#messageBoard").html(this.#welcomeMessageHtml());
            this.#reload(credential, context);
        });

        this.doBindReturnButton(credential, context);
    }

    #welcomeMessageHtml() {
        return "<b style='font-size:120%'>见贤思齐焉，见不贤而内自省也。</b>";
    }

    abstract doBindReturnButton(credential: Credential, context?: PageProcessorContext): void;

    abstract doLoadBankAccount(credential: Credential, context?: PageProcessorContext): void;


    #renderPersonalStatus(credential: Credential, context?: PageProcessorContext) {
        new PersonalStatus(credential, context?.get("townId")).open().then(page => {
            const role = page.role!;
            let html = "";
            html += "<table style='text-align:center;border-width:0;margin:auto;width:100%'>";
            html += "<tbody>";
            html += "<tr>";
            html += "<td style='background-color:#E8E8D0;font-size:150%;font-weight:bold;color:navy' colspan='2'>" + role.name + "</td>";
            html += "</tr>";
            html += "<tr>";
            html += "<td style='width:80px;background-color:#E8E8D0' rowspan='3'>" + role.imageHtml + "</td>"
            html += "<td style='width:100%'>";
            html += "<table style='width:100%;margin:auto;border-width:0;text-align:center'>";
            html += "<tbody>";
            html += "<tr style='color:yellowgreen'>";
            html += "<th style='background-color:darkred'>种族</th>";
            html += "<th style='background-color:darkgreen'>性别</th>";
            html += "<th style='background-color:darkred'>国家</th>";
            html += "<th style='background-color:darkgreen'>部队</th>";
            html += "<th style='background-color:darkred'>属性</th>";
            html += "<th style='background-color:darkgreen'>职业</th>";
            html += "<th style='background-color:darkred'>战数</th>";
            html += "</tr>";
            html += "<tr>";
            html += "<td style='background-color:#E0D0B0'>" + role.race + "</td>";
            html += "<td style='background-color:#E0D0C0'>" + role.gender + "</td>";
            html += "<td style='background-color:#E0D0B0'>" + role.country + "</td>";
            html += "<td style='background-color:#E0D0C0'>" + role.unit + "</td>";
            html += "<td style='background-color:#E0D0B0'>" + role.attribute + "</td>";
            html += "<td style='background-color:#E0D0C0'>" + role.career + "</td>";
            html += "<td style='background-color:#E0D0B0'>" + role.battleCount + "/" + role.battleWinCount + "</td>";
            html += "</tr>";
            html += "</tbody>";
            html += "</table>";
            html += "</td>";
            html += "</tr>";


            html += "<tr>";
            html += "<td style='width:100%'>";
            html += "<table style='width:100%;margin:auto;border-width:0;text-align:center'>";
            html += "<tbody>";
            html += "<tr style='color:yellowgreen'>";
            html += "<th style='background-color:darkred'>等级</th>";
            html += "<th style='background-color:darkgreen'>ＨＰ</th>";
            html += "<th style='background-color:darkred'>ＭＰ</th>";
            html += "<th style='background-color:darkgreen'>攻击</th>";
            html += "<th style='background-color:darkred'>防御</th>";
            html += "<th style='background-color:darkgreen'>智力</th>";
            html += "<th style='background-color:darkred'>精神</th>";
            html += "<th style='background-color:darkgreen'>速度</th>";
            html += "</tr>";
            html += "<tr>";
            html += "<td style='background-color:#E0D0B0'>" + role.level + "</td>";
            html += "<td style='background-color:#E0D0C0'>" + role.health + "/" + role.maxHealth + "</td>";
            html += "<td style='background-color:#E0D0B0'>" + role.mana + "/" + role.maxMana + "</td>";
            html += "<td style='background-color:#E0D0C0'>" + role.attack + "</td>";
            html += "<td style='background-color:#E0D0B0'>" + role.defense + "</td>";
            html += "<td style='background-color:#E0D0C0'>" + role.specialAttack + "</td>";
            html += "<td style='background-color:#E0D0B0'>" + role.specialDefense + "</td>";
            html += "<td style='background-color:#E0D0C0'>" + role.speed + "</td>";
            html += "</tr>";
            html += "</tbody>";
            html += "</table>";
            html += "</td>";
            html += "</tr>";

            html += "<tr>";
            html += "<td style='width:100%'>";
            html += "<table style='width:100%;margin:auto;border-width:0;text-align:center'>";
            html += "<tbody>";
            html += "<tr style='color:yellowgreen'>";
            html += "<th style='background-color:darkred'>经验</th>";
            html += "<th style='background-color:darkgreen'>幸运</th>";
            html += "<th style='background-color:darkred'>祭奠RP</th>";
            html += "<th style='background-color:darkgreen'>额外RP</th>";
            html += "<th style='background-color:darkred'>现金</th>";
            html += "<th style='background-color:darkgreen'>存款</th>";
            html += "</tr>";
            html += "<tr>";
            html += "<td style='background-color:#E0D0B0'>" + role.experience + "</td>";
            html += "<td style='background-color:#E0D0C0'>" + role.additionalLuck + "</td>";
            html += "<td style='background-color:#E0D0B0'>" + role.consecrateRP + "</td>";
            html += "<td style='background-color:#E0D0C0'>" + role.additionalRP + "</td>";
            html += "<td style='background-color:#E0D0B0'>" + role.cash + " GOLD</td>";
            html += "<td style='background-color:#E0D0C0' id='roleSaving'></td>";
            html += "</tr>";
            html += "</tbody>";
            html += "</table>";
            html += "</td>";
            html += "</tr>";

            html += "</tbody>";
            html += "</table>";

            $("#personalStatus").html(html);

            this.doLoadBankAccount(credential);

            // 加载完用户才能加载技能。。。
            this.#renderSpellStatus(credential, role, context);
        });
    }

    #renderSpellStatus(credential: Credential, role: Role, context?: PageProcessorContext) {
        const personalSpell = new PersonalSpell(credential, context?.get("townId"));
        personalSpell.open().then(page => {
            const spellList = page.spellList!;

            let html = "";
            html += "<table style='text-align:center;border-width:0;margin:auto;width:100%'>";
            html += "<tbody>";
            html += "<tr>";
            html += "<th style='background-color:yellowgreen;font-size:120%;font-weight:bold;color:navy' colspan='6'>技 能 状 态</th>";
            html += "</tr>";
            html += "<tr style='color:yellowgreen'>";
            html += "<th style='background-color:darkred'>使用</th>";
            html += "<th style='background-color:darkgreen'>技能</th>";
            html += "<th style='background-color:darkred'>威力</th>";
            html += "<th style='background-color:darkgreen'>确率</th>";
            html += "<th style='background-color:darkred'>ＰＰ</th>";
            html += "<th style='background-color:darkgreen'>评分</th>";
            html += "</tr>";

            for (const spell of spellList) {
                const using = spell.name === role.spell;
                html += "<tr>";
                html += "<td style='background-color:#E0D0B0'>" + (using ? "★" : "") + "</td>";
                html += "<td style='background-color:#E0D0C0'>";
                if (using) {
                    html += "<button role='button' class='spellButton' id='spell_" + spell.id + "' " +
                        "style='color:blue'>" + spell.name + "</button>";
                } else {
                    html += "<button role='button' class='spellButton' id='spell_" + spell.id + "' " +
                        "style='color:grey'>" + spell.name + "</button>";
                }
                html += "</td>";
                html += "<td style='background-color:#E0D0B0'>" + spell.power + "</td>";
                html += "<td style='background-color:#E0D0C0'>" + spell.accuracy + "</td>";
                html += "<td style='background-color:#E0D0B0'>" + spell.pp + "</td>";
                html += "<td style='background-color:#E0D0C0'>" + spell.score + "</td>";
                html += "</tr>";
            }

            html += "</tbody>";
            html += "</table>";

            $("#spellStatus").html(html);

            $(".spellButton").on("click", event => {
                const buttonId = $(event.target).attr("id") as string;
                if (PageUtils.isColorBlue(buttonId)) {
                    return;
                }
                const spellId = StringUtils.substringAfter(buttonId, "spell_");
                personalSpell.set(spellId).then(() => {
                    this.#reload(credential, context);
                });
            });
        });
    }

    #reload(credential: Credential, context?: PageProcessorContext) {
        $("#personalStatus").html("");
        $("#spellStatus").html("");
        $(".spellButton").off("click");

        this.#renderPersonalStatus(credential, context);
    }
}

export = AbstractPersonalProfilePageProcessor;