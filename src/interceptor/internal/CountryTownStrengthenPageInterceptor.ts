import RoleStateMachineManager from "../../core/state/RoleStateMachineManager";
import CountryTownStrengthenPageProcessor from "../../processor/stateless/CountryTownStrengthenPageProcessor";
import PageProcessorContext from "../../processor/PageProcessorContext";
import PageInterceptor from "../PageInterceptor";

class CountryTownStrengthenPageInterceptor implements PageInterceptor {

    accept(cgi: string, pageText: string): boolean {
        if (cgi === "country.cgi") {
            return pageText.includes("* 国家．内政．强化．指令 *");
        }
        return false;
    }

    intercept(): void {
        RoleStateMachineManager.create()
            .load()
            .then(machine => {
                machine.start()
                    .whenInTown(state => {
                        const context = new PageProcessorContext();
                        context.withTownId(state?.townId);
                        new CountryTownStrengthenPageProcessor().process(context);
                    })
                    .process();
            });
    }

}

export = CountryTownStrengthenPageInterceptor;