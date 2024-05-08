import RoleStateMachineManager from "../../core/state/RoleStateMachineManager";
import BattlePageProcessor from "../../processor/stateless/BattlePageProcessor";
import PageProcessorContext from "../../processor/PageProcessorContext";
import PageInterceptor from "../PageInterceptor";

class BattlePageInterceptor implements PageInterceptor {

    accept(cgi: string, pageText: string): boolean {
        if (cgi === "battle.cgi") {
            return pageText.includes("＜＜ - 秘宝之岛 - ＞＞") ||
                pageText.includes("＜＜ - 初级之森 - ＞＞") ||
                pageText.includes("＜＜ - 中级之塔 - ＞＞") ||
                pageText.includes("＜＜ - 上级之洞窟 - ＞＞") ||
                pageText.includes("＜＜ - 十二神殿 - ＞＞") ||
                pageText.includes("ERROR !");
        }
        return false;
    }

    intercept(): void {
        RoleStateMachineManager.create()
            .load()
            .then(machine => {
                machine.start()
                    .whenInTown(state => {
                        const context = PageProcessorContext.whenInTown(state?.townId)
                            .withBattleCount(state?.battleCount?.toString());
                        new BattlePageProcessor().process(context);
                    })
                    .process();
            });
    }

}

export = BattlePageInterceptor;