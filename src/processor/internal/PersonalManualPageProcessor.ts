import NpcLoader from "../../core/NpcLoader";
import TownLoader from "../../core/TownLoader";
import Credential from "../../util/Credential";
import MessageBoard from "../../util/MessageBoard";
import PageUtils from "../../util/PageUtils";
import StringUtils from "../../util/StringUtils";
import PageProcessorContext from "../PageProcessorContext";
import PageProcessorCredentialSupport from "../PageProcessorCredentialSupport";

class PersonalManualPageProcessor extends PageProcessorCredentialSupport {

    doProcess(credential: Credential, context?: PageProcessorContext): void {
        $("table[height='100%']").removeAttr("height");
        $("form[action='status.cgi']").remove();

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
            .text("＜＜  口 袋 助 手 用 户 手 册  ＞＞")
            .parent()
            .after("<tr><td id='version'></td></tr>");

        // @ts-ignore
        const version = __VERSION__;
        $("#version")
            .css("background-color", "wheat")
            .css("color", "navy")
            .css("font-weight", "bold")
            .css("text-align", "center")
            .text(version);

        let s = $("center:contains('现在的所持金')").text();
        s = StringUtils.substringBefore(s, " 现在的所持金");
        const roleName = s.substring(2);

        $("table:first")
            .find("tbody:first")
            .find("> tr:eq(2)")
            .find("td:first")
            .attr("id", "roleStatus")
            .find("table:first")
            .find("tbody:first")
            .find("> tr:first")
            .find("> td:eq(1)")
            .find("table:first")
            .find("tbody:first")
            .find("> tr:eq(1)")
            .find("td:first")
            .html(roleName);

        $("#roleStatus")
            .parent()
            .next()
            .find("td:first")
            .attr("id", "messageBoardContainer")
            .html("");

        const imageHtml = NpcLoader.randomNpcImageHtml();
        MessageBoard.createMessageBoardStyleB("messageBoardContainer", imageHtml);
        $("#messageBoard")
            .css("background-color", "black")
            .css("color", "white")
            .html(this.#welcomeMessageHtml());

        let html = "";
        html += "<tr style='display:none'>";
        html += "<td id='hidden-1'></td>";
        html += "</tr>";
        html += "<tr style='display:none'>";
        html += "<td id='hidden-2'></td>";
        html += "</tr>";
        html += "<tr style='display:none'>";
        html += "<td id='hidden-3'></td>";
        html += "</tr>";
        html += "<tr>";
        html += "<td id='manual' style='background-color:#F8F0E0;width:100%'></td>";
        html += "</tr>";
        $("#messageBoardContainer")
            .parent()
            .after($(html));
        $("#hidden-1").html(PageUtils.generateReturnTownForm(credential));

        let returnButtonTitle = "返回城市";
        if (context?.get("townId") !== undefined) {
            returnButtonTitle = "返回" + TownLoader.getTownById(context.get("townId")!)!.name;
        }
        html = "";
        html += "<tr>";
        html += "<td style='background-color:#D4D4D4;text-align:center'>";
        html += "<table style='background-color:transparent;margin:auto;border-spacing:0;border-width:0'>";
        html += "<tbody>";
        html += "<tr>";
        html += "<td>";
        html += "<button role='button' id='returnButton'>" + returnButtonTitle + "</button>";
        html += "</td>";
        html += "</tr>";
        html += "</tbody>";
        html += "</table>";
        html += "</td>";
        html += "</tr>";
        $("#manual")
            .parent()
            .next().hide()
            .attr("id", "deprecation")
            .after($(html));

        $("#messageBoardManager").on("click", () => {
            $("#deprecation").toggle();
            PageUtils.scrollIntoView("returnButton");
        });
        $("#returnButton").on("click", () => {
            $("#returnTown").trigger("click");
        });

        this.#renderManual();
    }

    #welcomeMessageHtml() {
        return "<b style='font-size:120%;color:wheat'>工欲善其事，必先利其器。学会助手的使用能极大提高点口袋的效率。</b><br>" +
            "<b style='font-size:100%;color:yellow'>我没有听错？你想独立？现在都已经是后口袋时代了，你脑子秀逗了吧？有本事你打我一下试试。</b>";
    }

    #renderManual() {
        let html = "";
        html += "<table style='margin:auto;border-width:0;text-align:center;background-color:#888888;width:100%'>";
        html += "<tbody>";

        // --------------------------------------------------------------------
        // 城市面板
        // --------------------------------------------------------------------
        html += "<tr>";
        html += "<td style='background-color:#F8F0E0;width:64px'>";
        html += NpcLoader.getNpcImageHtml("豚豚");
        html += "</td>";
        html += "<td id='m-1' style='background-color:#E8E8B0;width:72px;font-weight:bold'>城市面板</td>";
        html += "<td style='background-color:#E8E8D0'></td>";
        html += "</tr>";

        // --------------------------------------------------------------------
        // 战斗体系
        // --------------------------------------------------------------------
        html += "<tr>";
        html += "<td style='background-color:#F8F0E0;width:64px'>";
        html += NpcLoader.getNpcImageHtml("骨头");
        html += "</td>";
        html += "<td id='m-2' style='background-color:#E8E8B0;width:72px;font-weight:bold'>战斗体系</td>";
        html += "<td style='background-color:#E8E8D0'></td>";
        html += "</tr>";

        // --------------------------------------------------------------------
        // 驿站系统
        // --------------------------------------------------------------------
        html += "<tr>";
        html += "<td style='background-color:#F8F0E0;width:64px'>";
        html += NpcLoader.getNpcImageHtml("夜三");
        html += "</td>";
        html += "<td id='m-3' style='background-color:#E8E8B0;width:72px;font-weight:bold'>驿站系统</td>";
        html += "<td style='background-color:#E8E8D0'></td>";
        html += "</tr>";

        // --------------------------------------------------------------------
        // 口袋银行
        // --------------------------------------------------------------------
        html += "<tr>";
        html += "<td style='background-color:#F8F0E0;width:64px'>";
        html += NpcLoader.getNpcImageHtml("饭饭");
        html += "</td>";
        html += "<td id='m-4' style='background-color:#E8E8B0;width:72px;font-weight:bold'>口袋银行</td>";
        html += "<td style='background-color:#E8E8D0'></td>";
        html += "</tr>";

        // --------------------------------------------------------------------
        // 物品买卖
        // --------------------------------------------------------------------
        html += "<tr>";
        html += "<td style='background-color:#F8F0E0;width:64px'>";
        html += NpcLoader.getNpcImageHtml("青鸟");
        html += "</td>";
        html += "<td id='m-5' style='background-color:#E8E8B0;width:72px;font-weight:bold'>物品买卖</td>";
        html += "<td style='background-color:#E8E8D0'></td>";
        html += "</tr>";

        // --------------------------------------------------------------------
        // 宝石镶嵌
        // --------------------------------------------------------------------
        html += "<tr>";
        html += "<td style='background-color:#F8F0E0;width:64px'>";
        html += NpcLoader.getNpcImageHtml("末末");
        html += "</td>";
        html += "<td id='m-6' style='background-color:#E8E8B0;width:72px;font-weight:bold'>宝石镶嵌</td>";
        html += "<td style='background-color:#E8E8D0'></td>";
        html += "</tr>";

        // --------------------------------------------------------------------
        // 宠物图鉴
        // --------------------------------------------------------------------
        html += "<tr>";
        html += "<td style='background-color:#F8F0E0;width:64px'>";
        html += NpcLoader.getNpcImageHtml("七七");
        html += "</td>";
        html += "<td id='m-7' style='background-color:#E8E8B0;width:72px;font-weight:bold'>宠物图鉴</td>";
        html += "<td style='background-color:#E8E8D0'></td>";
        html += "</tr>";

        // --------------------------------------------------------------------
        // 宠物排行
        // --------------------------------------------------------------------
        html += "<tr>";
        html += "<td style='background-color:#F8F0E0;width:64px'>";
        html += NpcLoader.getNpcImageHtml("飘雪");
        html += "</td>";
        html += "<td id='m-8' style='background-color:#E8E8B0;width:72px;font-weight:bold'>宠物排行</td>";
        html += "<td style='background-color:#E8E8D0'></td>";
        html += "</tr>";

        // --------------------------------------------------------------------
        // 冒险公会
        // --------------------------------------------------------------------
        html += "<tr>";
        html += "<td style='background-color:#F8F0E0;width:64px'>";
        html += NpcLoader.getNpcImageHtml("花子");
        html += "</td>";
        html += "<td id='m-9' style='background-color:#E8E8B0;width:72px;font-weight:bold'>冒险公会</td>";
        html += "<td style='background-color:#E8E8D0'></td>";
        html += "</tr>";

        // --------------------------------------------------------------------
        // 领取俸禄
        // --------------------------------------------------------------------
        html += "<tr>";
        html += "<td style='background-color:#F8F0E0;width:64px'>";
        html += NpcLoader.getNpcImageHtml("莫莫");
        html += "</td>";
        html += "<td id='m-10' style='background-color:#E8E8B0;width:72px;font-weight:bold'>领取俸禄</td>";
        html += "<td style='background-color:#E8E8D0'></td>";
        html += "</tr>";

        // --------------------------------------------------------------------
        // 装备管理
        // --------------------------------------------------------------------
        html += "<tr>";
        html += "<td style='background-color:#F8F0E0;width:64px'>";
        html += NpcLoader.getNpcImageHtml("路路");
        html += "</td>";
        html += "<td id='m-11' style='background-color:#E8E8B0;width:72px;font-weight:bold'>装备管理</td>";
        html += "<td style='background-color:#E8E8D0'></td>";
        html += "</tr>";

        // --------------------------------------------------------------------
        // 宠物管理
        // --------------------------------------------------------------------
        html += "<tr>";
        html += "<td style='background-color:#F8F0E0;width:64px'>";
        html += NpcLoader.getNpcImageHtml("剑心");
        html += "</td>";
        html += "<td id='m-12' style='background-color:#E8E8B0;width:72px;font-weight:bold'>宠物管理</td>";
        html += "<td style='background-color:#E8E8D0'></td>";
        html += "</tr>";

        // --------------------------------------------------------------------
        // 职业管理
        // --------------------------------------------------------------------
        html += "<tr>";
        html += "<td style='background-color:#F8F0E0;width:64px'>";
        html += NpcLoader.getNpcImageHtml("白皇");
        html += "</td>";
        html += "<td id='m-13' style='background-color:#E8E8B0;width:72px;font-weight:bold'>职业管理</td>";
        html += "<td style='background-color:#E8E8D0'></td>";
        html += "</tr>";

        // --------------------------------------------------------------------
        // 个人面板
        // --------------------------------------------------------------------
        html += "<tr>";
        html += "<td style='background-color:#F8F0E0;width:64px'>";
        html += NpcLoader.getNpcImageHtml("夜九");
        html += "</td>";
        html += "<td id='m-14' style='background-color:#E8E8B0;width:72px;font-weight:bold'>个人面板</td>";
        html += "<td style='background-color:#E8E8D0'></td>";
        html += "</tr>";

        // --------------------------------------------------------------------
        // 团队面板
        // --------------------------------------------------------------------
        html += "<tr>";
        html += "<td style='background-color:#F8F0E0;width:64px'>";
        html += NpcLoader.getNpcImageHtml("亲戚");
        html += "</td>";
        html += "<td id='m-15' style='background-color:#E8E8B0;width:72px;font-weight:bold'>团队面板</td>";
        html += "<td style='background-color:#E8E8D0'></td>";
        html += "</tr>";

        html += "</tbody>";
        html += "</table>";
        $("#manual").html(html);
    }
}

export = PersonalManualPageProcessor;