import PageUtils from "../../util/PageUtils";
import BattleProcessor from "../../processor/battle/BattleProcessor";
import RequestInterceptor from "../RequestInterceptor";

class BattleRequestInterceptor implements RequestInterceptor {

    readonly cgi: string = "battle.cgi";

    process(): void {
        const pageHtml = PageUtils.currentPageHtml();
        const pageText = PageUtils.currentPageText();

        if (pageText.includes("＜＜ - 秘宝之岛 - ＞＞") ||
            pageText.includes("＜＜ - 初级之森 - ＞＞") ||
            pageText.includes("＜＜ - 中级之塔 - ＞＞") ||
            pageText.includes("＜＜ - 上级之洞窟 - ＞＞") ||
            pageText.includes("＜＜ - 十二神殿 - ＞＞")) {
            $('a[target="_blank"]').attr('tabIndex', -1);
            new BattleProcessor(pageHtml, pageText).process();
        }
    }

}

export = BattleRequestInterceptor;