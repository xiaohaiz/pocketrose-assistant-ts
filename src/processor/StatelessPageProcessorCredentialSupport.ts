import ButtonUtils from "../util/ButtonUtils";
import Credential from "../util/Credential";
import PageUtils from "../util/PageUtils";
import PageProcessor from "./PageProcessor";
import PageProcessorContext from "./PageProcessorContext";

/**
 * @deprecated
 */
abstract class StatelessPageProcessorCredentialSupport implements PageProcessor {

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
        this.doProcess(credential, context).then();
    }

    async doProcess(credential: Credential, context?: PageProcessorContext): Promise<void> {
    }

    doLoadButtonStyles(): number[] {
        return [];
    }
}

export = StatelessPageProcessorCredentialSupport;