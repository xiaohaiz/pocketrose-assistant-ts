import TownDashboardPage from "../../pocketrose/TownDashboardPage";
import Credential from "../../util/Credential";
import PageUtils from "../../util/PageUtils";
import PageProcessorContext from "../PageProcessorContext";
import PageProcessorCredentialSupport from "../PageProcessorCredentialSupport";

class TownDashboardPageProcessor2 extends PageProcessorCredentialSupport {

    doProcess(credential: Credential, context?: PageProcessorContext): void {
        // --------------------------------------------------------------------
        // 解析城市主页面的内容
        // --------------------------------------------------------------------
        const page = TownDashboardPage.parse(PageUtils.currentPageHtml());

        // --------------------------------------------------------------------
        // 标记页面上的元素
        // --------------------------------------------------------------------
        // 手机战斗返回后不在页面顶端，标记顶端系统公告尝试自动触顶。
        $("center:first").attr("id", "systemAnnouncement");
        PageUtils.scrollIntoView("systemAnnouncement");
        // 所有表格加id属性
        $("table").each((idx, table) => {
            const tableId = "t" + idx;
            $(table).attr("id", tableId);
        });
        // 标记聊天输入文本框
        $("input:text:last").attr("id", "messageInputText");
        // 标记更新按钮
        $("input:submit[value='更新']").attr("id", "refreshButton");
        // 标记菜单所有的按钮
        $("#t5")
            .find("form[action='battle.cgi']")
            .parent()
            .attr("id", "battleCell")
            .next()
            .find("input:submit:first")
            .attr("id", "battleButton");
        $("#t5")
            .find("form[action='town.cgi']")
            .parent()
            .attr("id", "townCell")
            .next()
            .find("input:submit:first")
            .attr("id", "townButton");
        $("#t5")
            .find("form[action='mydata.cgi']")
            .next()
            .attr("id", "personalCell")
            .next()
            .find("input:submit:first")
            .attr("id", "personalButton");
        $("#t5")
            .find("form[action='country.cgi']:first")
            .next()
            .attr("id", "country1Cell")
            .next()
            .find("input:submit:first")
            .attr("id", "country1Button");
        $("#t5")
            .find("form[action='country.cgi']:eq(1)")
            .next()
            .attr("id", "country2Cell")
            .next()
            .find("input:submit:first")
            .attr("id", "country2Button");
        $("#t5")
            .find("form[action='map.cgi']")
            .find("input:submit:first")
            .attr("id", "leaveButton");
        $("#t5")
            .find("form[action='exit.cgi']")
            .find("input:submit:first")
            .attr("id", "exitButton");
    }


}

export = TownDashboardPageProcessor2;