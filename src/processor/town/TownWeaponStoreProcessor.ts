import Processor from "../Processor";
import PageUtils from "../../util/PageUtils";
import TownWeaponStore from "../../pocket/store/TownWeaponStore";

class TownWeaponStoreProcessor implements Processor {

    accept(cgi: string, pageText: string): boolean {
        if (cgi === "town.cgi") {
            return pageText.includes("＜＜　□　武器屋　□　＞＞");
        }
        return false;
    }

    process(): void {
        PageUtils.removeUnusedHyperLinks();
        PageUtils.removeGoogleAnalyticsScript();
        doProcess();
    }

}

function doProcess() {
    const page = TownWeaponStore.parsePage(PageUtils.currentPageHtml());

}

export = TownWeaponStoreProcessor;