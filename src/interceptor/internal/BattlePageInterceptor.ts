import PageInterceptor from "../PageInterceptor";
import LocationStateMachine from "../../core/LocationStateMachine";
import BattlePageProcessor from "../../processor/internal/BattlePageProcessor";

class BattlePageInterceptor implements PageInterceptor {

    readonly #processor = new BattlePageProcessor();

    accept(cgi: string, pageText: string): boolean {
        if (cgi === "battle.cgi") {
            return pageText.includes("＜＜ - 秘宝之岛 - ＞＞") ||
                pageText.includes("＜＜ - 初级之森 - ＞＞") ||
                pageText.includes("＜＜ - 中级之塔 - ＞＞") ||
                pageText.includes("＜＜ - 上级之洞窟 - ＞＞") ||
                pageText.includes("＜＜ - 十二神殿 - ＞＞");
        }
        return false;
    }

    intercept(): void {
        LocationStateMachine.currentLocationStateMachine()
            .load()
            .whenInTown(() => {
                this.#processor.process();
            })
            .fork();
    }

}

export = BattlePageInterceptor;