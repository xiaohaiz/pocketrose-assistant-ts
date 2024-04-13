import RoleStateMachineManager from "../../core/state/RoleStateMachineManager";
import ConversationPageProcessor from "../../processor/stateless/ConversationPageProcessor";
import PageInterceptor from "../PageInterceptor";

class ConversationPageInterceptor implements PageInterceptor {

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
                        new ConversationPageProcessor().process();
                    })
                    .process();
            });
    }


}

export = ConversationPageInterceptor;