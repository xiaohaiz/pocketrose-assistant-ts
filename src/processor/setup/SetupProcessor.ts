import PocketroseProcessor from "../PocketroseProcessor";
import PageUtils from "../../util/PageUtils";

export = SetupProcessor;

class SetupProcessor extends PocketroseProcessor {

    process() {
        const credential = PageUtils.currentCredential();
        console.log(credential.asRequest());

    }

}