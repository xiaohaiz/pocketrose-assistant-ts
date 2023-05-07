import PageUtils from "../../../util/PageUtils";
import PersonalEquipmentManagement from "../../../pocket/PersonalEquipmentManagement";

class WildPersonalEquipmentManagementProcessor {

    process() {
        PageUtils.removeUnusedHyperLinks();
        PageUtils.removeGoogleAnalyticsScript();
        doProcess();
    }

}

function doProcess() {
    const page = PersonalEquipmentManagement.parsePage(PageUtils.currentPageHtml());
    console.log(JSON.stringify(page));
    $("table[height='100%']").removeAttr("height");
}

export = WildPersonalEquipmentManagementProcessor;