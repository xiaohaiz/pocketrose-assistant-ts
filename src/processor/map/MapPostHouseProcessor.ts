import Processor from "../Processor";
import PageUtils from "../../util/PageUtils";
import Credential from "../../util/Credential";

class MapPostHouseProcessor implements Processor {

    accept(cgi: string, pageText: string): boolean {
        if (cgi === "map.cgi") {
            return pageText.includes("＜＜住所＞＞");
        }
        return false;
    }

    process(): void {
        PageUtils.removeUnusedHyperLinks();
        PageUtils.removeGoogleAnalyticsScript();
        const credential = PageUtils.currentCredential();
        doProcess(credential);
    }

}

function doProcess(credential: Credential) {

}

export = MapPostHouseProcessor;