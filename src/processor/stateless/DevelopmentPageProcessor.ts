import PageProcessor from "../PageProcessor";
import PageProcessorContext from "../PageProcessorContext";
import {PocketPage} from "../../pocket/PocketPage";
import {CacheManager} from "../../widget/CacheManager";
import LocationModeMetro from "../../core/location/LocationModeMetro";
import Credential from "../../util/Credential";

class DevelopmentPageProcessor implements PageProcessor {

    private readonly cacheManager: CacheManager;

    constructor() {
        const credential = new Credential("", "");
        const location = new LocationModeMetro();
        this.cacheManager = new CacheManager(credential, location);
    }

    process(context?: PageProcessorContext): void {
        this.doProcess().then();
    }

    private async doProcess() {
        await this.generateHTML();
        await this.bindButtons();
        await this.cacheManager.reload();
        await this.cacheManager.render();
    }

    private async generateHTML() {
        const table = $("body:first > table:first");
        table.removeAttr("width")
            .css("width", "100%");

        table.find("> tbody:first > tr:first > td:first")
            .removeAttr("align")
            .html(() => {
                return PocketPage.generatePageHeaderHTML("＜＜ 开 发 调 试 ＞＞");
            });

        table.find("> tbody:first > tr:eq(1) > td:first")
            .html(() => {
                return this.cacheManager.generateHTML();
            });
    }

    private async bindButtons() {
        this.cacheManager.bindButtons();
    }


}

export {DevelopmentPageProcessor};