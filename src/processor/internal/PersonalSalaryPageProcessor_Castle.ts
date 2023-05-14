import CastleBank from "../../pocketrose/CastleBank";
import Credential from "../../util/Credential";
import PageUtils from "../../util/PageUtils";
import PageProcessorContext from "../PageProcessorContext";
import AbstractPersonalSalaryPageProcessor from "./AbstractPersonalSalaryPageProcessor";

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
            new CastleBank(credential).deposit1().then(() => {
                $("#returnCastle").trigger("click");
            });
        });
    }

}

export = PersonalSalaryPageProcessor_Castle;