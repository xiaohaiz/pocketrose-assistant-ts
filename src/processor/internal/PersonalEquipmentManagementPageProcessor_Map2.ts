import PersonalEquipmentManagementPage from "../../pocketrose/PersonalEquipmentManagementPage";
import Credential from "../../util/Credential";
import PageUtils from "../../util/PageUtils";
import PageProcessorContext from "../PageProcessorContext";
import AbstractPersonalEquipmentManagementPageProcessor from "./AbstractPersonalEquipmentManagementPageProcessor";

class PersonalEquipmentManagementPageProcessor_Map2 extends AbstractPersonalEquipmentManagementPageProcessor {

    doGeneratePageTitleHtml(context?: PageProcessorContext): string {
        return "＜＜  装 备 管 理 （ 地 图 模 式 ）  ＞＞";
    }

    doGenerateRoleLocationHtml(context?: PageProcessorContext): string {
        if (context === undefined) {
            return "野外";
        } else {
            return context.get("coordinate")!;
        }
    }

    doGenerateWelcomeMessageHtml(): string {
        return "<b style='font-size:120%;color:wheat'>真是难为您了，在野外还不忘捯饬您这些破烂。</b>";
    }

    doBindReturnButton(credential: Credential): void {
        const html = PageUtils.generateReturnMapForm(credential);
        $("#hiddenFormContainer").html(html);
        $("#returnButton").on("click", () => {
            $("#returnMap").trigger("click");
        });
    }

    doRenderMutablePage(credential: Credential, page: PersonalEquipmentManagementPage, context?: PageProcessorContext): void {
    }


}

export = PersonalEquipmentManagementPageProcessor_Map2;