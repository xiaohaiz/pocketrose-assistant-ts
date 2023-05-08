import PageInterceptor from "../PageInterceptor";
import CastleBankPageProcessor from "../../processor/internal/CastleBankPageProcessor";
import LocationStateMachine from "../../core/LocationStateMachine";
import PageProcessorContext from "../../processor/PageProcessorContext";

class CastleBankPageInterceptor implements PageInterceptor {

    readonly #processor = new CastleBankPageProcessor();

    accept(cgi: string, pageText: string): boolean {
        if (cgi === "castle.cgi") {
            return pageText.includes("存入或取出请输入数额后按下确认键");
        }
        return false;
    }

    intercept(): void {
        LocationStateMachine.create()
            .load()
            .whenInCastle(castleName => {
                const context = new PageProcessorContext();
                context.set("castleName", castleName!);
                this.#processor.process(context);
            })
            .fork();
    }

}

export = CastleBankPageInterceptor;