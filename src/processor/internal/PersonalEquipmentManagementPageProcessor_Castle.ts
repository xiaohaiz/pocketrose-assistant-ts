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


}

export = PersonalEquipmentManagementPageProcessor_Castle;