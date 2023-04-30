import PageUtils from "../../util/PageUtils";
import PersonalStatusProcessor from "../../processor/personal/PersonalStatusProcessor";
import PersonalSetupProcessor from "../../processor/personal/PersonalSetupProcessor";
import PersonalPetManagementProcessor from "../../processor/personal/PersonalPetManagementProcessor";
import PersonalEquipmentManagementProcessor from "../../processor/personal/PersonalEquipmentManagementProcessor";
import SetupLoader from "../../pocket/SetupLoader";
import PersonalCareerManagementProcessor from "../../processor/personal/PersonalCareerManagementProcessor";
import RequestInterceptor from "../RequestInterceptor";
import PersonalGoldenCageProcessor from "../../processor/personal/PersonalGoldenCageProcessor";

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
        if (pageText.includes("＜＜　|||　物品使用．装备　|||　＞＞")) {
            if (SetupLoader.isEquipmentManagementUIEnabled()) {
                new PersonalEquipmentManagementProcessor(pageHtml, pageText).process();
            }
            return;
        }
        if (pageText.includes("宠物现在升级时学习新技能情况一览")) {
            if (SetupLoader.isPetManagementUIEnabled()) {
                new PersonalPetManagementProcessor(pageHtml, pageText).process();
            }
            return;
        }
        if (pageText.includes("物品 黄金笼子 使用")) {
            new PersonalGoldenCageProcessor(pageHtml, pageText).process();
            return;
        }
        if (pageText.includes("* 转职神殿 *")) {
            if (SetupLoader.isCareerManagementUIEnabled()) {
                new PersonalCareerManagementProcessor(pageHtml, pageText).process();
            }
        }
    }

}

export = PersonalRequestInterceptor;