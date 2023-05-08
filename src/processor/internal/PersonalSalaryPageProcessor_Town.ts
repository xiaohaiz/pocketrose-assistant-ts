import AbstractPersonalSalaryPageProcessor from "./AbstractPersonalSalaryPageProcessor";
import Credential from "../../util/Credential";
import PageUtils from "../../util/PageUtils";
import PageProcessorContext from "../PageProcessorContext";
import TownLoader from "../../pocket/TownLoader";
import TownBank from "../../pocket/bank/TownBank";

class PersonalSalaryPageProcessor_Town extends AbstractPersonalSalaryPageProcessor {

    doGenerateHiddenForm(containerId: string, credential: Credential): void {
        const html = PageUtils.generateReturnTownForm(credential);
        $("#" + containerId).html(html);
    }

    doBindReturnButton(context?: PageProcessorContext): void {
        if (context !== undefined) {
            const townId = context.get("townId")!;
            const town = TownLoader.getTownById(townId)!;
            $("#returnButton").val("返回" + town.name);
        }
        $("#returnButton").on("click", () => {
            $("#returnTown").trigger("click");
        });
    }

    doBindDepositButton(credential: Credential, context?: PageProcessorContext): void {
        if (context !== undefined) {
            const townId = context.get("townId")!;
            const town = TownLoader.getTownById(townId)!;
            $("#returnButton").val("携款逃回" + town.name);
        }
        $("#returnButton").on("click", () => {
            new TownBank(credential).depositAll().then(() => {
                $("#returnTown").trigger("click");
            });
        });
    }

}

export = PersonalSalaryPageProcessor_Town;