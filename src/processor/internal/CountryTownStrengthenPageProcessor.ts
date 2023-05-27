import PersonalStatus from "../../pocketrose/PersonalStatus";
import Credential from "../../util/Credential";
import PageProcessorContext from "../PageProcessorContext";
import PageProcessorCredentialSupport from "../PageProcessorCredentialSupport";

class CountryTownStrengthenPageProcessor extends PageProcessorCredentialSupport {

    doProcess(credential: Credential, context?: PageProcessorContext): void {
        $("table[height='100%']").removeAttr("height");
        $("table:first")
            .find("> tbody:first")
            .find("> tr:first")
            .find("> td:first")
            .attr("id", "pageTitle")
            .parent()
            .next()
            .find("> td:first")
            .find("> table:first")
            .find("> tbody:first")
            .find("> tr:first")
            .find("> td:eq(1)")
            .find("> table:first")
            .find("> tbody:first")
            .find("> tr:eq(1)")
            .find("> td:first")
            .each((i, td) => {
                new PersonalStatus(credential, context?.get("townId")).load().then(role => {
                    $(td).text(role.name!);
                });
            });
    }

}

export = CountryTownStrengthenPageProcessor;