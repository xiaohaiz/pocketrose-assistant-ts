import LocationStateMachine from "../../core/LocationStateMachine";
import BattlePageProcessor2 from "../../processor/internal/BattlePageProcessor2";
import PageProcessorContext from "../../processor/PageProcessorContext";
import PageInterceptor from "../PageInterceptor";

class BattlePageInterceptor implements PageInterceptor {

    readonly #processor = new BattlePageProcessor2();

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
        LocationStateMachine.create()
            .load()
            .whenInTown((townId, battleCount) => {
                const context = new PageProcessorContext();
                context.set("townId", townId);
                context.set("battleCount", battleCount);
                this.#processor.process(context);
            })
            .fork();
    }

}

export = BattlePageInterceptor;