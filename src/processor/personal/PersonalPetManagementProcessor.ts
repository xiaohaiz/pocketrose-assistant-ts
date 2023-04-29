import PageProcessor from "../PageProcessor";
import PageUtils from "../../util/PageUtils";
import PetParser from "../../pocket/PetParser";
import Credential from "../../util/Credential";
import Pet from "../../pocket/Pet";

class PersonalPetManagementProcessor extends PageProcessor {

    process() {
        PageUtils.removeUnusedHyperLinks();
        PageUtils.removeGoogleAnalyticsScript();
        const credential = PageUtils.currentCredential();
        const petList = PetParser.parsePersonalPetList(this.pageHtml);
        const studyStatus = PetParser.parsePersonalPetStudyStatus(this.pageHtml);
        doProcess(credential, petList, studyStatus);
    }
}

function doProcess(credential: Credential, petList: Pet[], studyStatus: number[]) {
    $("input:submit[value='返回城市']").attr("id", "returnButton");

    console.log(JSON.stringify(studyStatus));
    console.log(PageUtils.currentPageHtml());
}

export = PersonalPetManagementProcessor;