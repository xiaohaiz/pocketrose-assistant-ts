import ButtonUtils from "../util/ButtonUtils";
import Credential from "../util/Credential";
import PageUtils from "../util/PageUtils";
import PageProcessor from "./PageProcessor";
import PageProcessorContext from "./PageProcessorContext";

abstract class PageProcessorCredentialSupport implements PageProcessor {

    process(context?: PageProcessorContext): void {
        const buttons = this.doLoadButtonStyles();
        if (buttons.length > 0) {
            for (const button of buttons) {
                ButtonUtils.loadButtonStyle(button);
            }
        }

        PageUtils.fixCurrentPageBrokenImages();
        PageUtils.removeUnusedHyperLinks();
        PageUtils.removeGoogleAnalyticsScript();

        const id = $("input:hidden[name='id']:last").val();
        const pass = $("input:hidden[name='pass']:last").val();
        if (id === undefined || pass === undefined) {
            return;
        }

        const credential = new Credential(id.toString(), pass.toString());
        this.doProcess0(credential, context).then(() => {
            this.doProcess1(credential, context);
        });
    }

    async doProcess0(credential: Credential, context?: PageProcessorContext): Promise<void> {
    }

    abstract doProcess1(credential: Credential, context?: PageProcessorContext): void;

    doLoadButtonStyles(): number[] {
        return [];
    }
}

export = PageProcessorCredentialSupport;