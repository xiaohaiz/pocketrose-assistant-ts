import Credential from "../util/Credential";
import PageUtils from "../util/PageUtils";
import PageProcessor from "./PageProcessor";
import PageProcessorContext from "./PageProcessorContext";

abstract class PageProcessorCredentialSupport implements PageProcessor {

    process(context?: PageProcessorContext): void {
        PageUtils.fixCurrentPageBrokenImages();
        PageUtils.removeUnusedHyperLinks();
        PageUtils.removeGoogleAnalyticsScript();

        const id = $("input:hidden[name='id']:last").val();
        const pass = $("input:hidden[name='pass']:last").val();
        if (id === undefined || pass === undefined) {
            return;
        }

        this.doProcess(new Credential(id.toString(), pass.toString()), context);
    }

    abstract doProcess(credential: Credential, context?: PageProcessorContext): void;
}

export = PageProcessorCredentialSupport;