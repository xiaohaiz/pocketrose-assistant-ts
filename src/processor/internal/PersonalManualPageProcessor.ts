import NpcLoader from "../../core/role/NpcLoader";
import TownLoader from "../../core/town/TownLoader";
import Credential from "../../util/Credential";
import MessageBoard from "../../util/MessageBoard";
import PageUtils from "../../util/PageUtils";
import StringUtils from "../../util/StringUtils";
import PageProcessorContext from "../PageProcessorContext";
import PageProcessorCredentialSupport from "../PageProcessorCredentialSupport";

class PersonalManualPageProcessor extends PageProcessorCredentialSupport {

    doProcess1(credential: Credential, context?: PageProcessorContext): void {
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
        if (context?.get("townId")) {
            returnButtonTitle = "返回" + TownLoader.load(context?.get("townId"))?.name;
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
        html += "<td style='background-color:#E8E8D0;text-align:left'>" +
            "相信眼神像你这么好的人，是绝对不会开启老年辅助模式的，我猜的对不对？对了，记得自己去挑选合适的布局哦。" +
            "</td>";
        html += "</tr>";

        // --------------------------------------------------------------------
        // 战斗体系
        // --------------------------------------------------------------------
        html += "<tr>";
        html += "<td style='background-color:#F8F0E0;width:64px'>";
        html += NpcLoader.getNpcImageHtml("骨头");
        html += "</td>";
        html += "<td id='m-2' style='background-color:#E8E8B0;width:72px;font-weight:bold'>战斗体系</td>";
        html += "<td style='background-color:#E8E8D0;text-align:left'>" +
            "简化战后操作：不怕死、不怕爆装备、不怕忘存钱；战后页自动触底，打了谁被谁打，谁也不知道。让你真正成为没有感情的点击机器人。" +
            "</td>";
        html += "</tr>";

        // --------------------------------------------------------------------
        // 地图模式
        // --------------------------------------------------------------------
        html += "<tr>";
        html += "<td style='background-color:#F8F0E0;width:64px'>";
        html += NpcLoader.getNpcImageHtml("夜三");
        html += "</td>";
        html += "<td id='m-3' style='background-color:#E8E8B0;width:72px;font-weight:bold'>地图模式</td>";
        html += "<td style='background-color:#E8E8D0;text-align:left'>" +
            "给出城即迷路朋友们的导航系统。详细标注各国城市分布；选定目的地后，自动触发最优行进路线，包你旅途愉快心情好。" +
            "</td>";
        html += "</tr>";

        // --------------------------------------------------------------------
        // 口袋银行
        // --------------------------------------------------------------------
        html += "<tr>";
        html += "<td style='background-color:#F8F0E0;width:64px'>";
        html += NpcLoader.getNpcImageHtml("饭饭");
        html += "</td>";
        html += "<td id='m-4' style='background-color:#E8E8B0;width:72px;font-weight:bold'>口袋银行</td>";
        html += "<td style='background-color:#E8E8D0;text-align:left'>" +
            "没有转帐功能的银行不是好钱庄。对了！升级后就可以直接在这里转账啦~~~欢迎给豚家的每个号时不时转点钱，测试功能效果。" +
            "</td>";
        html += "</tr>";

        // --------------------------------------------------------------------
        // 物品买卖
        // --------------------------------------------------------------------
        html += "<tr>";
        html += "<td style='background-color:#F8F0E0;width:64px'>";
        html += NpcLoader.getNpcImageHtml("青鸟");
        html += "</td>";
        html += "<td id='m-5' style='background-color:#E8E8B0;width:72px;font-weight:bold'>物品买卖</td>";
        html += "<td style='background-color:#E8E8D0;text-align:left'>" +
            "买入卖出一条龙，支持银行自动取款支付，暂时还没有打折提示哦~~请务必管好你的钱袋子，请在上午1-4点，下午1-4点间购买打折款。" +
            "</td>";
        html += "</tr>";

        // --------------------------------------------------------------------
        // 宝石镶嵌
        // --------------------------------------------------------------------
        html += "<tr>";
        html += "<td style='background-color:#F8F0E0;width:64px'>";
        html += NpcLoader.getNpcImageHtml("末末");
        html += "</td>";
        html += "<td id='m-6' style='background-color:#E8E8B0;width:72px;font-weight:bold'>宝石镶嵌</td>";
        html += "<td style='background-color:#E8E8D0;text-align:left'>" +
            "砸石头这种事儿，确实是有手就行。支持批量砸，连环砸等各种花式砸法，让人来不及纠结。请提前准备好足够多的石头。" +
            "</td>";
        html += "</tr>";

        // --------------------------------------------------------------------
        // 宠物图鉴
        // --------------------------------------------------------------------
        html += "<tr>";
        html += "<td style='background-color:#F8F0E0;width:64px'>";
        html += NpcLoader.getNpcImageHtml("七七");
        html += "</td>";
        html += "<td id='m-7' style='background-color:#E8E8B0;width:72px;font-weight:bold'>宠物图鉴</td>";
        html += "<td style='background-color:#E8E8D0;text-align:left'>" +
            "自动更新账号内图鉴信息，支持图鉴编号快速检索、团队辖内各成员图鉴持有情况查询，找图超级快。" +
            "</td>";
        html += "</tr>";

        // --------------------------------------------------------------------
        // 宠物排行
        // --------------------------------------------------------------------
        html += "<tr>";
        html += "<td style='background-color:#F8F0E0;width:64px'>";
        html += NpcLoader.getNpcImageHtml("飘雪");
        html += "</td>";
        html += "<td id='m-8' style='background-color:#E8E8B0;width:72px;font-weight:bold'>宠物排行</td>";
        html += "<td style='background-color:#E8E8D0;text-align:left'>" +
            "当宠物认识你，你不认识宠物的时候，请看这里，让你小学毕业我猜是没问题了。" +
            "</td>";
        html += "</tr>";

        // --------------------------------------------------------------------
        // 冒险公会
        // --------------------------------------------------------------------
        html += "<tr>";
        html += "<td style='background-color:#F8F0E0;width:64px'>";
        html += NpcLoader.getNpcImageHtml("花子");
        html += "</td>";
        html += "<td id='m-9' style='background-color:#E8E8B0;width:72px;font-weight:bold'>冒险公会</td>";
        html += "<td style='background-color:#E8E8D0;text-align:left'>" +
            "拿什么样的藏宝图去挖呀挖呀挖，挖什么样的东西看什么样的人。在口袋的世界里面挖呀挖呀挖，用很多的藏宝图，挖很多很多的蛋。" +
            "</td>";
        html += "</tr>";

        // --------------------------------------------------------------------
        // 领取俸禄
        // --------------------------------------------------------------------
        html += "<tr>";
        html += "<td style='background-color:#F8F0E0;width:64px'>";
        html += NpcLoader.getNpcImageHtml("莫莫");
        html += "</td>";
        html += "<td id='m-10' style='background-color:#E8E8B0;width:72px;font-weight:bold'>领取俸禄</td>";
        html += "<td style='background-color:#E8E8D0;text-align:left'>" +
            "“打工人打工魂，打工人上人”，领完工资就给你自动存起来了哦。为了防备某只骷髅兔子的打劫，请移步口袋银行领薪水。" +
            "</td>";
        html += "</tr>";

        // --------------------------------------------------------------------
        // 装备管理
        // --------------------------------------------------------------------
        html += "<tr>";
        html += "<td style='background-color:#F8F0E0;width:64px'>";
        html += NpcLoader.getNpcImageHtml("路路");
        html += "</td>";
        html += "<td id='m-11' style='background-color:#E8E8B0;width:72px;font-weight:bold'>装备管理</td>";
        html += "<td style='background-color:#E8E8D0;text-align:left'>" +
            "男装？女装？重装？套装？随心装？五款自由搭配，周一到周五不带重样儿的。" +
            "</td>";
        html += "</tr>";

        // --------------------------------------------------------------------
        // 宠物管理
        // --------------------------------------------------------------------
        html += "<tr>";
        html += "<td style='background-color:#F8F0E0;width:64px'>";
        html += NpcLoader.getNpcImageHtml("剑心");
        html += "</td>";
        html += "<td id='m-12' style='background-color:#E8E8B0;width:72px;font-weight:bold'>宠物管理</td>";
        html += "<td style='background-color:#E8E8D0;text-align:left'>" +
            "唔。。。就是你家宠物操作的所有一切，都在这里实现了。最最重要的是，拥有完整的宠物档案：查属性、查技能、查进退化链……再也不用担心菜鸟们乱封印了。" +
            "</td>";
        html += "</tr>";

        // --------------------------------------------------------------------
        // 职业管理
        // --------------------------------------------------------------------
        html += "<tr>";
        html += "<td style='background-color:#F8F0E0;width:64px'>";
        html += NpcLoader.getNpcImageHtml("白皇");
        html += "</td>";
        html += "<td id='m-13' style='background-color:#E8E8B0;width:72px;font-weight:bold'>职业管理</td>";
        html += "<td style='background-color:#E8E8D0;text-align:left'>" +
            "转职顺序还要看国法？NONONONONO~~请来这里吧，清晰的职业发展规划、醒目的任务提醒，转残肯定是你RP不行啊。对了，战斗时出现" +
            "<span style='background-color:red;color:white'>红底=满级</span>；出现" +
            "<span style='background-color:yellow'>黄底=该嗑药</span>了，好好定型哟，菜鸟们。" +
            "</td>";
        html += "</tr>";

        // --------------------------------------------------------------------
        // 个人面板
        // --------------------------------------------------------------------
        html += "<tr>";
        html += "<td style='background-color:#F8F0E0;width:64px'>";
        html += NpcLoader.getNpcImageHtml("夜九");
        html += "</td>";
        html += "<td id='m-14' style='background-color:#E8E8B0;width:72px;font-weight:bold'>个人面板</td>";
        html += "<td style='background-color:#E8E8D0;text-align:left'>" +
            "全面地看看你那高低贵贱的人生啊，还不赶紧努力战斗去！！！" +
            "</td>";
        html += "</tr>";

        // --------------------------------------------------------------------
        // 团队面板
        // --------------------------------------------------------------------
        html += "<tr>";
        html += "<td style='background-color:#F8F0E0;width:64px'>";
        html += NpcLoader.getNpcImageHtml("亲戚");
        html += "</td>";
        html += "<td id='m-15' style='background-color:#E8E8B0;width:72px;font-weight:bold'>团队面板</td>";
        html += "<td style='background-color:#E8E8D0;text-align:left'>" +
            "你可能不是一个人在战斗，装备、宠物都在谁身上，一目了然。当然穷人的家底一眼即可望穿~~~" +
            "</td>";
        html += "</tr>";

        // --------------------------------------------------------------------
        // 任务指南
        // --------------------------------------------------------------------
        html += "<tr>";
        html += "<td style='background-color:#F8F0E0;width:64px'>";
        html += NpcLoader.getNpcImageHtml("狐狸");
        html += "</td>";
        html += "<td id='m-16' style='background-color:#E8E8B0;width:72px;font-weight:bold'>任务指南</td>";
        html += "<td style='background-color:#E8E8D0;text-align:left'>" +
            "作为老菜鸟的一员，我其实也不会做任务，我都是看任务指南怎么说就怎么来的。" +
            "</td>";
        html += "</tr>";

        // --------------------------------------------------------------------
        // 皇宫任务
        // --------------------------------------------------------------------
        html += "<tr>";
        html += "<td style='background-color:#F8F0E0;width:64px'>";
        html += NpcLoader.getNpcImageHtml("小明");
        html += "</td>";
        html += "<td id='m-17' style='background-color:#E8E8B0;width:72px;font-weight:bold'>皇宫任务</td>";
        html += "<td style='background-color:#E8E8D0;text-align:left'>" +
            "杀怪！杀怪！杀怪啊！！！" +
            "</td>";
        html += "</tr>";

        html += "</tbody>";
        html += "</table>";
        $("#manual").html(html);
    }
}

export = PersonalManualPageProcessor;