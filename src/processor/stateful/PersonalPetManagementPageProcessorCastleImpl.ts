import PersonalPetManagementPageProcessor from "./PersonalPetManagementPageProcessor";
import Credential from "../../util/Credential";
import PageProcessorContext from "../PageProcessorContext";
import PageUtils from "../../util/PageUtils";

class PersonalPetManagementPageProcessorCastleImpl extends PersonalPetManagementPageProcessor {

    constructor(credential: Credential, context: PageProcessorContext) {
        super(credential, context);
    }

    protected async doBindReturnButton() {
        $("#_pocket_extension_1").html(PageUtils.generateReturnCastleForm(this.credential));
        $("#returnButton").on("click", () => {
            PageUtils.disablePageInteractiveElements();
            this.doBeforeReturn().then(() => {
                PageUtils.triggerClick("returnCastle");
            });
        });
    }
}

export = PersonalPetManagementPageProcessorCastleImpl;