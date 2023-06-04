import RoleStateMachineManager from "../../core/state/RoleStateMachineManager";
import ConversationPageProcessor from "../../processor/internal/ConversationPageProcessor";
import PageProcessor from "../../processor/PageProcessor";
import PageInterceptor from "../PageInterceptor";

class ConversationPageInterceptor implements PageInterceptor {

    readonly #processor: PageProcessor = new ConversationPageProcessor();

    accept(cgi: string, pageText: string): boolean {
        if (cgi === "messe_print.cgi") {
            return pageText.includes("全员的留言");
        }
        return false;
    }

    intercept(): void {
        RoleStateMachineManager.create()
            .load()
            .then(machine => {
                machine.start()
                    .whenInTown(() => {
                        this.#processor.process();
                    })
                    .process();
            });
    }


}

export = ConversationPageInterceptor;