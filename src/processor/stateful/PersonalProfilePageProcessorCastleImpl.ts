import PersonalProfilePageProcessor from "./PersonalProfilePageProcessor";
import Credential from "../../util/Credential";
import PageProcessorContext from "../PageProcessorContext";
import PageUtils from "../../util/PageUtils";
import BankAccount from "../../core/bank/BankAccount";
import CastleBank from "../../core/bank/CastleBank";

class PersonalProfilePageProcessorCastleImpl extends PersonalProfilePageProcessor {

    constructor(credential: Credential, context: PageProcessorContext) {
        super(credential, context);
    }

    protected async doBindReturnButton(): Promise<void> {
        $("#hiddenCell-1").html(PageUtils.generateReturnCastleForm(this.credential));
        $("#returnButton").on("click", () => {
            PageUtils.disablePageInteractiveElements();
            this.doBeforeReturn().then(() => {
                PageUtils.triggerClick("returnCastle");
            });
        });
    }

    protected async doLoadBankAccount(): Promise<BankAccount | undefined> {
        return await new CastleBank(this.credential).load();
    }
}

export = PersonalProfilePageProcessorCastleImpl;