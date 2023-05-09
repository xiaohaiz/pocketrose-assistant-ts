import Credential from "../../util/Credential";
import PageUtils from "../../util/PageUtils";
import PageProcessorContext from "../PageProcessorContext";
import PageProcessorCredentialSupport from "../PageProcessorCredentialSupport";

class TownAccessoryHousePageProcessor extends PageProcessorCredentialSupport {

    doProcess(credential: Credential, context?: PageProcessorContext): void {
        PageUtils.loadButtonStyle(7);
        PageUtils.loadButtonStyle(8);
        PageUtils.loadButtonStyle(35);
    }

}

export = TownAccessoryHousePageProcessor;