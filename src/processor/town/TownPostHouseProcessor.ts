import PocketroseProcessor from "../PocketroseProcessor";
import PageUtils from "../../util/PageUtils";
import Credential from "../../util/Credential";

class TownPostHouseProcessor extends PocketroseProcessor {

    process() {
        PageUtils.removeUnusedHyperLinks();
        PageUtils.removeGoogleAnalyticsScript();
        const credential = PageUtils.currentCredential();
        doProcess(credential);
    }
}

function doProcess(credential: Credential): void {
    const t1 = $("table:eq(1)");
    const t3 = $("table:eq(3)");
    const t4 = $("table:eq(4)");

    // 修改标题
    let td = $(t1).find("tr:first td:first");
    $(td).removeAttr("bgcolor");
    $(td).removeAttr("width");
    $(td).removeAttr("height");
    $(td).css("text-align", "center");
    $(td).css("font-size", "150%");
    $(td).css("font-weight", "bold");
    $(td).css("background-color", "navy");
    $(td).css("color", "yellowgreen");
    $(td).text("＜＜  宿 屋 & 驿 站  ＞＞");

    // 标记现金栏、增加计时器
    let tr = $(t3).find("tr:last");
    td = $(tr).find("td:last");
    $(td).attr("id", "roleCash");
    $(tr).after($("<tr>" +
        "<td style='background-color:#E0D0B0'>计时器</td>" +
        "<td style='background-color:#E8E8D0;color:red;font-weight:bold;text-align:right' id='countDownTimer' colspan='3'>-</td>" +
        "</tr>"));

    // 创建消息面板
    td = $(t4).find("tr:first td:first");
    $(td).attr("id", "messageBoard");
    $(td).attr("color", "white");

    // 增加驿站面板
    tr = $(t1).find("tr:last");
    $(tr).after($("<tr>" +
        "<td style='background-color:#F8F0E0;text-align:center'></td>" +
        "</tr>" +
        "<tr>" +
        "<td style='background-color:#F8F0E0;text-align:center'></td>" +
        "</tr>"));
}

export = TownPostHouseProcessor;