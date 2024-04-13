import RoleStateMachineManager from "../../core/state/RoleStateMachineManager";
import CountryPalacePageProcessor from "../../processor/stateless/CountryPalacePageProcessor";
import PageProcessorContext from "../../processor/PageProcessorContext";
import PageInterceptor from "../PageInterceptor";

class CountryPalacePageInterceptor implements PageInterceptor {

    accept(cgi: string, pageText: string): boolean {
        if (cgi === "country.cgi") {
            return pageText.includes("＜＜ * ") && pageText.includes("皇宫 *＞＞");
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
                        new CountryPalacePageProcessor().process(context);
                    })
                    .process();
            });
    }

}

export = CountryPalacePageInterceptor;