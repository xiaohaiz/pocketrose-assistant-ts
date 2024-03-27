import PersonalMirrorPage from "../../core/role/PersonalMirrorPage";
import Credential from "../../util/Credential";
import KeyboardShortcutBuilder from "../../util/KeyboardShortcutBuilder";
import PageUtils from "../../util/PageUtils";
import PageProcessorContext from "../PageProcessorContext";
import PageProcessorCredentialSupport from "../PageProcessorCredentialSupport";
import PageProcessorUtils from "../PageProcessorUtils";

class PersonalMirrorPageProcessor extends PageProcessorCredentialSupport {

    async doProcess(credential: Credential, context?: PageProcessorContext): Promise<void> {
        const page = PersonalMirrorPage.parse(PageUtils.currentPageHtml());
        await this.#reformatPage(credential, page, context);
        await this.#bindImmutableButton();
        KeyboardShortcutBuilder.newInstance()
            .onEscapePressed(() => PageUtils.triggerClick("returnButton"))
            .withDefaultPredicate()
            .bind();
    }

    async #reformatPage(credential: Credential,
                        mirrorPage: PersonalMirrorPage,
                        context?: PageProcessorContext) {
        $("table[height='100%']").removeAttr("height");
        $("td:first")
            .attr("id", "pageTitle")
            .removeAttr("width")
            .removeAttr("height")
            .removeAttr("bgcolor")
            .css("text-align", "center")
            .css("font-size", "150%")
            .css("font-weight", "bold")
            .css("background-color", "navy")
            .css("color", "yellowgreen")
            .text("＜＜  分 身 试 管  ＞＞");
        $("input:submit[value='返回城市']")
            .attr("id", "returnTown")
            .parent().hide()
            .parent()
            .parent()
            .after($("<tr><td style='background-color:#F8F0E0;text-align:center' id='TD_command'></td></tr>"));

        const buttonText = PageProcessorUtils.generateReturnTownButtonTitle(context);
        const html = "<button role='button' id='returnButton'>" + buttonText + "(Esc)</button>";
        $("#TD_command").html(html);
    }

    async #bindImmutableButton() {
        $("#returnButton").on("click", () => {
            PageUtils.disableButtons();
            PageUtils.triggerClick("returnTown");
        });
    }
}

export = PersonalMirrorPageProcessor;