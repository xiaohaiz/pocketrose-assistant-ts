import Processor from "../Processor";
import Credential from "../../util/Credential";
import PageUtils from "../../util/PageUtils";
import CastleRanch from "../../pocket/CastleRanch";

class CastleRanchProcessor implements Processor {

    accept(cgi: string, pageText: string): boolean {
        if (cgi === "castle.cgi") {
            return pageText.includes("＜＜　|||　城堡牧场　|||　＞＞");
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
    // 解析原有页面的宠物列表
    const pageHtml = PageUtils.currentPageHtml();
    const pets = CastleRanch.parsePets(pageHtml);

    // 重组页面
    console.log(JSON.stringify(pets));
}

export = CastleRanchProcessor;