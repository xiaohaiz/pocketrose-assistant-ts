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

    protected doGetDescription(): string {
        return "在战斗菜单左侧空白处警示验证码选择错误的次数。";
    }

}

export {SetupItem077};