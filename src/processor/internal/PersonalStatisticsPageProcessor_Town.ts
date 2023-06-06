import Credential from "../../util/Credential";
import PersonalStatisticsPageProcessor from "./PersonalStatisticsPageProcessor";

class PersonalStatisticsPageProcessor_Town extends PersonalStatisticsPageProcessor {

    doBindReturnButton(credential: Credential): void {
        $("#returnButton").on("click", () => {
            $("input:submit[value='返回城市']").trigger("click");
        });
    }

}

export = PersonalStatisticsPageProcessor_Town;