import StatefulPageProcessor from "../StatefulPageProcessor";
import Credential from "../../util/Credential";
import PageProcessorContext from "../PageProcessorContext";

class TownDashboardPageProcessor extends StatefulPageProcessor {

    constructor(credential: Credential, context: PageProcessorContext) {
        super(credential, context);
    }

    protected async doProcess(): Promise<void> {
    }

}

export {TownDashboardPageProcessor};