import RoleStateMachineManager from "../../core/state/RoleStateMachineManager";
import CastleBankPageProcessor from "../../processor/internal/CastleBankPageProcessor";
import PageProcessorContext from "../../processor/PageProcessorContext";
import PageInterceptor from "../PageInterceptor";

class CastleBankPageInterceptor implements PageInterceptor {

    accept(cgi: string, pageText: string): boolean {
        if (cgi === "castle.cgi") {
            return pageText.includes("存入或取出请输入数额后按下确认键");
        }
        return false;
    }

    intercept(): void {
        RoleStateMachineManager.create()
            .load()
            .then(machine => {
                machine.start()
                    .whenInCastle(state => {
                        const context = new PageProcessorContext();
                        context.withCastleName(state?.castleName);
                        new CastleBankPageProcessor().process(context);
                    })
                    .process();
            });
    }

}

export = CastleBankPageInterceptor;