import PageUtils from "../util/PageUtils";
import PersonalStatusProcessor from "../processor/personal/PersonalStatusProcessor";
import SetupProcessor from "../processor/setup/SetupProcessor";

export = PersonalRequestInterceptor;

class PersonalRequestInterceptor implements RequestInterceptor {

    readonly cgi: string = "mydata.cgi";

    process(): void {
        const pageHtml = PageUtils.currentPageHtml();
        const pageText = PageUtils.currentPageText()
        if (pageText.includes("仙人的宝物")) {
            new PersonalStatusProcessor(pageHtml, pageText).process();
            return;
        }
        if (pageText.includes("给其他人发送消息")) {
            new SetupProcessor(pageHtml, pageText).process();
        }
    }


}