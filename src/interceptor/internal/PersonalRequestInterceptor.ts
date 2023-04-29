import PageUtils from "../../util/PageUtils";
import PersonalStatusProcessor from "../../processor/personal/PersonalStatusProcessor";
import PersonalSetupProcessor from "../../processor/personal/PersonalSetupProcessor";
import PersonalPetManagementProcessor from "../../processor/personal/PersonalPetManagementProcessor";

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
            new PersonalSetupProcessor(pageHtml, pageText).process();
            return;
        }
        if (pageText.includes("宠物现在升级时学习新技能情况一览")) {
            new PersonalPetManagementProcessor(pageHtml, pageText).process();
        }
    }

}

export = PersonalRequestInterceptor;