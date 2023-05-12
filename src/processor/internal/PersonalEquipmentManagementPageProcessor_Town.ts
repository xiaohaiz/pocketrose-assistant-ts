import TownLoader from "../../core/TownLoader";
import PersonalEquipmentManagementPage from "../../pocketrose/PersonalEquipmentManagementPage";
import Credential from "../../util/Credential";
import PageUtils from "../../util/PageUtils";
import PageProcessorContext from "../PageProcessorContext";
import AbstractPersonalEquipmentManagementPageProcessor from "./AbstractPersonalEquipmentManagementPageProcessor";

class PersonalEquipmentManagementPageProcessor_Town extends AbstractPersonalEquipmentManagementPageProcessor {

    doGeneratePageTitleHtml(context?: PageProcessorContext): string {
        if (context === undefined) {
            return "＜＜  装 备 管 理 （ 城 市 模 式 ）  ＞＞";
        } else {
            const townId = context.get("townId")!;
            const town = TownLoader.getTownById(townId)!;
            return "＜＜  装 备 管 理 （ " + town.nameTitle + " ）  ＞＞";
        }
    }

    doGenerateRoleLocationHtml(context?: PageProcessorContext): string {
        if (context === undefined) {
            return "城市";
        } else {
            const townId = context.get("townId")!;
            const town = TownLoader.getTownById(townId)!;
            return town.name;
        }
    }

    doGenerateWelcomeMessageHtml(): string {
        return "<b style='font-size:120%;color:wheat'>又来管理您的装备来啦？就这点破烂折腾来折腾去的，您累不累啊。</b>";
    }

    doBindReturnButton(credential: Credential): void {
        const html = PageUtils.generateReturnTownForm(credential);
        $("#hiddenFormContainer").html(html);
        $("#returnButton").on("click", () => {
            $("#returnTown").trigger("click");
        });
    }

    doRenderMutablePage(credential: Credential, page: PersonalEquipmentManagementPage, context?: PageProcessorContext): void {
    }

}

export = PersonalEquipmentManagementPageProcessor_Town;