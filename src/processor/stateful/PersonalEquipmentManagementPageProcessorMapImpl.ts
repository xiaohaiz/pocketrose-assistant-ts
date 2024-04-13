import PersonalEquipmentManagementPageProcessor from "./PersonalEquipmentManagementPageProcessor";
import PageUtils from "../../util/PageUtils";
import Credential from "../../util/Credential";
import PageProcessorContext from "../PageProcessorContext";
import Role from "../../core/role/Role";

class PersonalEquipmentManagementPageProcessorMapImpl extends PersonalEquipmentManagementPageProcessor {

    constructor(credential: Credential, context: PageProcessorContext) {
        super(credential, context);
    }

    protected triggerLoadRole(handler: (role: (Role | undefined)) => void): void {
        handler(undefined);
    }

    async doBindReturnButton(): Promise<void> {
        $("#extension_1").html(PageUtils.generateReturnMapForm(this.credential));
        $("#returnButton").on("click", () => {
            PageUtils.disablePageInteractiveElements();
            this.doBeforeExit().then(() => {
                PageUtils.triggerClick("returnMap");
            });
        });
    }

    async doBindUpdateButton(): Promise<void> {
    }

}

export = PersonalEquipmentManagementPageProcessorMapImpl;