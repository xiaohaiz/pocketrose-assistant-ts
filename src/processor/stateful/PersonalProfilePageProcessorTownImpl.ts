import PersonalProfilePageProcessor from "./PersonalProfilePageProcessor";
import Credential from "../../util/Credential";
import PageProcessorContext from "../PageProcessorContext";
import PageUtils from "../../util/PageUtils";
import TownBank from "../../core/bank/TownBank";
import BankAccount from "../../core/bank/BankAccount";
import BattleFieldTrigger from "../../core/trigger/BattleFieldTrigger";
import LocationModeTown from "../../core/location/LocationModeTown";
import MirrorManager from "../../widget/MirrorManager";
import Role from "../../core/role/Role";

class PersonalProfilePageProcessorTownImpl extends PersonalProfilePageProcessor {

    constructor(credential: Credential, context: PageProcessorContext) {
        super(credential, context);
        const locationMode = this.createLocationMode() as LocationModeTown;
        this.mirrorManager = new MirrorManager(credential, locationMode);
        this.mirrorManager.onRefresh = (message) => {
            this.role = message.extensions.get("role") as Role;
            this.renderRole().then(() => {
                this.spellManager.reload().then(() => {
                    this.spellManager.render(this.role!).then(() => {
                        this.equipmentManager.reload().then(() => {
                            this.equipmentManager.render().then();
                        });
                    });
                });
            });
        };
    }

    protected async doPostReformatPage(): Promise<void> {
        const html = this.mirrorManager!.generateHTML();
        $("#mirrorStatus").html(html);
        this.mirrorManager!.bindButtons();
    }

    protected async doBeforeReturn(): Promise<void> {
        await super.doBeforeReturn();
        await new BattleFieldTrigger(this.credential)
            .withRole(this.role)
            .withPetPage(this.petManager.petPage)
            .triggerUpdate();
    }

    protected async doBindReturnButton(): Promise<void> {
        $("#hiddenCell-1").html(PageUtils.generateReturnTownForm(this.credential));
        $("#returnButton").on("click", () => {
            PageUtils.disablePageInteractiveElements();
            this.doBeforeReturn().then(() => {
                PageUtils.triggerClick("returnTown");
            });
        });
    }

    protected async doBindItemHouseButton(): Promise<void> {
        if (this.townId === undefined) return;
        $("#hiddenCell-5").html(PageUtils.generateItemShopForm(this.credential, this.townId!));
        $("#itemHouseButton")
            .prop("disabled", false)
            .on("click", () => {
                PageUtils.disablePageInteractiveElements();
                this.doBeforeReturn().then(() => {
                    PageUtils.triggerClick("openItemShop");
                });
            })
            .parent().show();
    }

    protected async doLoadBankAccount(): Promise<BankAccount | undefined> {
        return await new TownBank(this.credential, this.townId).load();
    }

}

export = PersonalProfilePageProcessorTownImpl;