import SetupLoader from "../SetupLoader";
import {AbstractBooleanValueSetupItem} from "../SetupSupport";

class SetupItem076 extends AbstractBooleanValueSetupItem {

    protected getCategory(): string {
        return "其他";
    }

    protected getCode(): string {
        return "076";
    }

    protected getCurrentSetupValue(): boolean {
        return SetupLoader.isAvoidDigitalValidationCodeEnabled();
    }

    protected getName(): string {
        return "规避数字验证码";
    }

    protected doGetDescription(): string {
        return "出现数字验证码时禁止战斗并定时刷新直至正常验证码出现。";
    }
}

export {SetupItem076};