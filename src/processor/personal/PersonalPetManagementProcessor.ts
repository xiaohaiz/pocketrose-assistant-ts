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
        doProcess(credential, petList);
    }
}

function doProcess(credential: Credential, petList: Pet[]) {
    console.log(JSON.stringify(petList));
}

export = PersonalPetManagementProcessor;