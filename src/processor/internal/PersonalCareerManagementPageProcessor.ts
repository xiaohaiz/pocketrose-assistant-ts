import PersonalCareerManagement from "../../core/career/PersonalCareerManagement";
import PersonalCareerManagementPage from "../../core/career/PersonalCareerManagementPage";
import RoleControlPanel from "../../core/role/RoleControlPanel";
import Credential from "../../util/Credential";
import KeyboardShortcutBuilder from "../../util/KeyboardShortcutBuilder";
import PageUtils from "../../util/PageUtils";
import PageProcessorContext from "../PageProcessorContext";
import PageProcessorCredentialSupport from "../PageProcessorCredentialSupport";

abstract class PersonalCareerManagementPageProcessor extends PageProcessorCredentialSupport {

    #careerTransferEnabled = false;

    async doProcess(credential: Credential, context?: PageProcessorContext): Promise<void> {
        this.#careerTransferEnabled = await new RoleControlPanel(credential).isCareerTransferEnabled();
        const page = PersonalCareerManagement.parsePage(PageUtils.currentPageHtml());
        this.doProcessPageParsed(credential, page, context);
        this.doBindKeyboardShortcut();
    }

    get isCareerTransferEnabled() {
        return this.#careerTransferEnabled;
    }

    doBindKeyboardShortcut() {
        KeyboardShortcutBuilder.newInstance()
            .onEscapePressed(() => $("#returnButton").trigger("click"))
            .withDefaultPredicate()
            .bind();
    }

    abstract doProcessPageParsed(credential: Credential, page: PersonalCareerManagementPage, context?: PageProcessorContext): void;

}

export = PersonalCareerManagementPageProcessor;