import SetupLoader from "../SetupLoader";
import {AbstractBooleanValueSetupItem} from "../SetupSupport";

class SetupItem086 extends AbstractBooleanValueSetupItem {

    protected getCategory(): string {
        return "战斗";
    }

    protected getCode(): string {
        return "086";
    }

    protected getCurrentSetupValue(): boolean {
        return SetupLoader.isAutoRefreshWhenBattleSessionExpiredEnabled();
    }

    protected getName(): string {
        return "会话过期自动刷";
    }

    protected doGetDescription(): string {
        return "超过150秒没有战斗则尝试自动刷新验证码（工作时间生效）。";
    }
}

export {SetupItem086};