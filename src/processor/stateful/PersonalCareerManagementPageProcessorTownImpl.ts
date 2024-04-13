import PersonalCareerManagementPageProcessor from "./PersonalCareerManagementPageProcessor";
import Credential from "../../util/Credential";
import PageProcessorContext from "../PageProcessorContext";
import PageUtils from "../../util/PageUtils";
import MirrorManager from "../../widget/MirrorManager";
import LocationModeTown from "../../core/location/LocationModeTown";
import Role from "../../core/role/Role";

class PersonalCareerManagementPageProcessorTownImpl extends PersonalCareerManagementPageProcessor {

    constructor(credential: Credential, context: PageProcessorContext) {
        super(credential, context);
        const locationMode = this.createLocationMode() as LocationModeTown;
        this.mirrorManager = new MirrorManager(credential, locationMode);
        this.mirrorManager.onRefresh = (message) => {
            this.onMirrorManagerChanged(message.extensions.get("role") as Role).then();
        };
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

    protected async doRefresh(): Promise<void> {
        await super.doRefresh();
        await this.mirrorManager!.reload();
        await this.mirrorManager!.render(this.role!);
    }

    protected async doPostCreatePage(): Promise<void> {
        const panel = $("#ID_mirrorManagerPanel");
        panel.html(this.mirrorManager!.generateHTML());
        panel.parent().show();
        this.mirrorManager!.bindButtons();
    }

    protected async doPostProcess(): Promise<void> {
        await this.mirrorManager!.reload();
        await this.mirrorManager!.render(this.role!);
    }

    private async onMirrorManagerChanged(role: Role) {
        this.role = role;
        await this.renderRole();
        await this.spellManager.reload();
        await this.spellManager.render(this.role!);
        await this.reloadCareerPage();
        await this.renderCareerPage();
        await this.equipmentManager.reload();
        await this.equipmentManager.render();
    }
}

export = PersonalCareerManagementPageProcessorTownImpl;