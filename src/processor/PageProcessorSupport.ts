import PageProcessor from "./PageProcessor";
import PageUtils from "../util/PageUtils";
import Credential from "../util/Credential";

abstract class PageProcessorSupport implements PageProcessor {

    process(): void {
        PageUtils.fixCurrentPageBrokenImages();
        PageUtils.removeUnusedHyperLinks();
        PageUtils.removeGoogleAnalyticsScript();

        const id = $("input:hidden[name='id']:last").val();
        const pass = $("input:hidden[name='pass']:last").val();
        if (id === undefined || pass === undefined) {
            return;
        }

        this.doProcess(new Credential(id.toString(), pass.toString()));
    }

    abstract doProcess(credential: Credential): void;
}

export = PageProcessorSupport;