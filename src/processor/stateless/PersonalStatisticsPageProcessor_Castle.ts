import Credential from "../../util/Credential";
import PageUtils from "../../util/PageUtils";
import PersonalStatisticsPageProcessor from "./PersonalStatisticsPageProcessor";

class PersonalStatisticsPageProcessor_Castle extends PersonalStatisticsPageProcessor {

    doBindReturnButton(credential: Credential): void {
        const form = PageUtils.generateReturnCastleForm(credential);
        $("#hidden-1").html(form);
        $("#returnButton").on("click", () => {
            $("#returnCastle").trigger("click");
        });
    }

}

export = PersonalStatisticsPageProcessor_Castle;