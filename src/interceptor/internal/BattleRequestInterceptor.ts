import BattleProcessor from "../../processor/battle/BattleProcessor";
import RequestInterceptor from "../RequestInterceptor";

class BattleRequestInterceptor implements RequestInterceptor {

    readonly cgi: string = "battle.cgi";

    process(): void {
        const pageText = document.documentElement.outerText;
        if (pageText.includes("＜＜ - 秘宝之岛 - ＞＞") ||
            pageText.includes("＜＜ - 初级之森 - ＞＞") ||
            pageText.includes("＜＜ - 中级之塔 - ＞＞") ||
            pageText.includes("＜＜ - 上级之洞窟 - ＞＞") ||
            pageText.includes("＜＜ - 十二神殿 - ＞＞")) {

            new BattleProcessor().process();
        }
    }

}

export = BattleRequestInterceptor;