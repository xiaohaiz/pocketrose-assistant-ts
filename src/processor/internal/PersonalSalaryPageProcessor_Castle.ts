import AbstractPersonalSalaryPageProcessor from "./AbstractPersonalSalaryPageProcessor";
import Credential from "../../util/Credential";
import PageUtils from "../../util/PageUtils";
import PageProcessorContext from "../PageProcessorContext";
import CastleBank from "../../pocketrose/CastleBank";

class PersonalSalaryPageProcessor_Castle extends AbstractPersonalSalaryPageProcessor {

    doGenerateHiddenForm(containerId: string, credential: Credential): void {
        const html = PageUtils.generateReturnCastleForm(credential);
        $("#" + containerId).html(html);
    }

    doBindReturnButton(context?: PageProcessorContext): void {
        if (context !== undefined) {
            const castleName = context.get("castleName")!;
            $("#returnButton").val("返回" + castleName);
        }
        $("#returnButton").on("click", () => {
            $("#returnCastle").trigger("click");
        });
    }

    doBindDepositButton(credential: Credential, context?: PageProcessorContext): void {
        if (context !== undefined) {
            const castleName = context.get("castleName")!;
            $("#returnButton").val("携款逃回" + castleName);
        }
        $("#returnButton").on("click", () => {
            new CastleBank(credential).depositAll().then(() => {
                $("#returnCastle").trigger("click");
            });
        });
    }

}

export = PersonalSalaryPageProcessor_Castle;