import SetupLoader from "../SetupLoader";
import {AbstractBooleanValueSetupItem} from "../SetupSupport";

class SetupItem091 extends AbstractBooleanValueSetupItem {

    protected getCategory(): string {
        return "战斗";
    }

    protected getCode(): string {
        return "091";
    }

    protected getCurrentSetupValue(): boolean {
        return SetupLoader.isConfirmAutoRefreshExpiredSessionRiskEnabled();
    }

    protected getName(): string {
        return "承担自动刷风险";
    }

    protected doGetDescription(): string {
        return "免责选项，自行承担自动刷新验证码可能造成的后续一切风险。";
    }

}

export {SetupItem091};