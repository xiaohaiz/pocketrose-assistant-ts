import SetupLoader from "../SetupLoader";
import {AbstractBooleanValueSetupItem} from "../SetupSupport";

class SetupItem077 extends AbstractBooleanValueSetupItem {

    protected getCategory(): string {
        return "界面";
    }

    protected getCode(): string {
        return "077";
    }

    protected getCurrentSetupValue(): boolean {
        return SetupLoader.isWarningValidationFailureEnabled();
    }

    protected getName(): string {
        return "警示验证码错误";
    }

}

export {SetupItem077};