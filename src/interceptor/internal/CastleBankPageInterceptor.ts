import LocationStateMachine from "../../core/LocationStateMachine";
import CastleBankPageProcessor from "../../processor/internal/CastleBankPageProcessor";
import PageProcessorContext from "../../processor/PageProcessorContext";
import SetupLoader from "../../setup/SetupLoader";
import PageInterceptor from "../PageInterceptor";

class CastleBankPageInterceptor implements PageInterceptor {

    readonly #processor = new CastleBankPageProcessor();

    accept(cgi: string, pageText: string): boolean {
        if (cgi === "castle.cgi") {
            return pageText.includes("存入或取出请输入数额后按下确认键");
        }
        return false;
    }

    intercept(): void {
        if (!SetupLoader.isPocketBankEnabled()) {
            return;
        }
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