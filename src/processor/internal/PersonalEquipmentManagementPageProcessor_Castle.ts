import StringUtils from "../../util/StringUtils";
import PageProcessorContext from "../PageProcessorContext";
import AbstractPersonalEquipmentManagementPageProcessor from "./AbstractPersonalEquipmentManagementPageProcessor";

class PersonalEquipmentManagementPageProcessor_Castle extends AbstractPersonalEquipmentManagementPageProcessor {

    doGeneratePageTitleHtml(context?: PageProcessorContext): string {
        if (context === undefined) {
            return "＜＜  装 备 管 理 （ 城 堡 模 式 ）  ＞＞";
        } else {
            const castleName = context.get("castleName")!;
            return "＜＜  装 备 管 理 （ " + StringUtils.toTitleString(castleName) + " 城 堡 ）  ＞＞";
        }
    }

    doGenerateRoleLocationHtml(context?: PageProcessorContext): string {
        if (context === undefined) {
            return "城堡";
        } else {
            return context.get("castleName")!;
        }
    }

    doGenerateWelcomeMessageHtml(): string {
        return "<b style='font-size:120%;color:wheat'>又来管理您的装备来啦？真是一刻不得闲置啊。</b>";
    }


}

export = PersonalEquipmentManagementPageProcessor_Castle;