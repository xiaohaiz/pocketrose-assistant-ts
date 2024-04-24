import PageUtils from "../../util/PageUtils";
import SetupLoader from "../config/SetupLoader";
import RankTitleLoader from "../role/RankTitleLoader";
import Role from "../role/Role";

class TownDashboardPage {

    t0Html?: string;
    t1Html?: string;

    role?: Role;
    townId?: string;
    townCountry?: string;
    townTax?: number;

    onlineListHtml?: string;                        // 在线列表
    mobilizationText?: string;                      // 国家动员令
    processedMobilizationText?: string;             // 国家动员令（处理后）
    messageNotificationHtml?: string;               // 是否有未读消息
    actionNotificationHtml?: string;                // 行动提示

    battleSessionId?: string;                       // 战斗会话ID
    battleLevelSelectionHtml?: string;              // 战斗选项
    processedBattleLevelSelectionHtml?: string;     // 战斗选项（处理后）
    battleLevelShortcut?: boolean;
    battleVerificationSource?: string;              // 验证码源

    eventBoardHtml?: string;                        // 事件面板
    processedEventBoardHtml?: string;               // 事件面板（处理后）

    globalMessageHtml?: string;
    personalMessageHtml?: string;
    redPaperMessageHtml?: string;
    domesticMessageHtml?: string;
    unitMessageHtml?: string;
    townMessageHtml?: string;

    capacityLimitationNotification?: boolean;
    canCollectTownTax?: boolean;

    get obtainRole(): Role {
        return this.role!;
    }

    get cashHtml() {
        const cash = this.obtainRole.cash;
        if (cash! >= 1000000) {
            return "<span style='color:red'>" + cash + " Gold</span>";
        } else {
            return cash + " Gold";
        }
    }

    get experienceHtml() {
        const experience = this.obtainRole.experience!;
        if (SetupLoader.isExperienceProgressBarEnabled()) {
            if (this.obtainRole.level === 150) {
                return "<span style='color:blue'>MAX</span>";
            } else {
                const ratio = this.obtainRole.level! / 150;
                const progressBar = PageUtils.generateProgressBarHTML(ratio);
                return "<span title='" + experience + " EX'>" + progressBar + "</span>";
            }
        } else {
            return experience + " EX";
        }
    }

    get rankHtml() {
        const rank = this.obtainRole.rank!;
        if (SetupLoader.isQiHanTitleEnabled()) {
            return RankTitleLoader.transformTitle(rank);
        } else {
            return rank;
        }
    }

}

export = TownDashboardPage;