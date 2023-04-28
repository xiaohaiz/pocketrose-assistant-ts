import PocketroseProcessor from "../PocketroseProcessor";
import PageUtils from "../../util/PageUtils";
import RoleLoader from "../../pocket/RoleLoader";

export = SetupProcessor;

class SetupProcessor extends PocketroseProcessor {

    process() {
        const credential = PageUtils.currentCredential();

        new RoleLoader(credential).load().then();
    }

}