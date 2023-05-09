import TownLoader from "../../core/TownLoader";
import TownBank from "../../pocketrose/TownBank";
import Credential from "../../util/Credential";
import PageUtils from "../../util/PageUtils";
import PageProcessorContext from "../PageProcessorContext";
import AbstractPersonalSalaryPageProcessor from "./AbstractPersonalSalaryPageProcessor";

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
            new TownBank(credential, context?.get("townId")).deposit().then(() => {
                $("#returnTown").trigger("click");
            });
        });
    }

}

export = PersonalSalaryPageProcessor_Town;