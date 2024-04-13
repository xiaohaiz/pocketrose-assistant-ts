import PersonalEquipmentManagementPageProcessor from "./PersonalEquipmentManagementPageProcessor";
import Credential from "../../util/Credential";
import PageProcessorContext from "../PageProcessorContext";
import PageUtils from "../../util/PageUtils";
import Role from "../../core/role/Role";
import PersonalStatus from "../../core/role/PersonalStatus";

class PersonalEquipmentManagementPageProcessorCastleImpl extends PersonalEquipmentManagementPageProcessor {

    constructor(credential: Credential, context: PageProcessorContext) {
        super(credential, context);
    }

    protected triggerLoadRole(handler: (role: (Role | undefined)) => void): void {
        new PersonalStatus(this.credential).load().then(role => {
            handler(role);
        });
    }

    async doBindReturnButton(): Promise<void> {
        $("#extension_1").html(PageUtils.generateReturnCastleForm(this.credential));
        $("#returnButton").on("click", () => {
            PageUtils.disablePageInteractiveElements();
            this.doBeforeExit().then(() => {
                PageUtils.triggerClick("returnCastle");
            });
        });
    }

}

export = PersonalEquipmentManagementPageProcessorCastleImpl;