import PersonalPetManagementPageProcessor from "./PersonalPetManagementPageProcessor";
import Credential from "../../util/Credential";
import PageProcessorContext from "../PageProcessorContext";
import PageUtils from "../../util/PageUtils";
import BattleFieldTrigger from "../../core/trigger/BattleFieldTrigger";
import LocationModeTown from "../../core/location/LocationModeTown";
import {PetMapFinder} from "../../widget/PetMapFinder";
import MessageBoard from "../../util/MessageBoard";

class PersonalPetManagementPageProcessorTownImpl extends PersonalPetManagementPageProcessor {

    constructor(credential: Credential, context: PageProcessorContext) {
        super(credential, context);
        const locationMode = this.createLocationMode() as LocationModeTown;
        this.petMapFinder = new PetMapFinder(this.credential, locationMode);
        this.petMapFinder.onWarningMessage = (message) => {
            MessageBoard.publishWarning(message);
        };
    }

    protected async doBindReturnButton() {
        $("#_pocket_extension_1").html(PageUtils.generateReturnTownForm(this.credential));
        $("#returnButton").on("click", () => {
            PageUtils.disablePageInteractiveElements();
            this.doBeforeReturn().then(() => {
                PageUtils.triggerClick("returnTown");
            });
        });
    }

    protected async doBeforeReturn() {
        await super.doBeforeReturn();
        await new BattleFieldTrigger(this.credential)
            .withRole(this.role)
            .withPetPage(this.petManager.petPage)
            .triggerUpdate();
    }
}

export = PersonalPetManagementPageProcessorTownImpl;