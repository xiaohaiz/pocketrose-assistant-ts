import RoleStateMachineManager from "../../core/state/RoleStateMachineManager";
import PersonalMirrorPageProcessor from "../../processor/internal/PersonalMirrorPageProcessor";
import PageProcessorContext from "../../processor/PageProcessorContext";
import PageInterceptor from "../PageInterceptor";

class PersonalMirrorPageInterceptor implements PageInterceptor {

    accept(cgi: string, pageText: string): boolean {
        if (cgi === "mydata.cgi") {
            return pageText.includes("* 分身试管 *");
        }
        return false;
    }

    intercept(): void {
        RoleStateMachineManager.create()
            .load()
            .then(machine => {
                machine.start()
                    .whenInTown(state => {
                        const context = new PageProcessorContext()
                            .withTownId(state?.townId);
                        new PersonalMirrorPageProcessor().process(context);
                    })
                    .process();
            });
    }

}

export = PersonalMirrorPageInterceptor;