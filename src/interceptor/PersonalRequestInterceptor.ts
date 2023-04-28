import PageUtils from "../util/PageUtils";
import PersonalStatusProcessor from "../processor/personal/PersonalStatusProcessor";

export = PersonalRequestInterceptor;

class PersonalRequestInterceptor implements RequestInterceptor {

    readonly cgi: string = "mydata.cgi";

    process(): void {
        const pageText = PageUtils.currentPageText()
        if (pageText.includes("仙人的宝物")) {
            new PersonalStatusProcessor(PageUtils.currentPageHtml(), pageText).process();
        }
    }


}