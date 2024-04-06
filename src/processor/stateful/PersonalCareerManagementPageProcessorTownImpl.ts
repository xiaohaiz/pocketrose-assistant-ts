import PersonalCareerManagementPageProcessor from "./PersonalCareerManagementPageProcessor";
import Credential from "../../util/Credential";
import PageProcessorContext from "../PageProcessorContext";
import PageUtils from "../../util/PageUtils";

class PersonalCareerManagementPageProcessorTownImpl extends PersonalCareerManagementPageProcessor {

    constructor(credential: Credential, context: PageProcessorContext) {
        super(credential, context);
    }

    protected async doCreateReturnButton(): Promise<void> {
        $("#extension_1").html(PageUtils.generateReturnTownForm(this.credential));
        $("#returnButton").on("click", () => {
            PageUtils.disablePageInteractiveElements();
            this.beforeReturn().then(() => {
                PageUtils.triggerClick("returnTown");
            });
        });
    }
}

export = PersonalCareerManagementPageProcessorTownImpl;