import SetupLoader from "../SetupLoader";
import {AbstractBooleanValueSetupItem} from "../SetupSupport";

class SetupItem035 extends AbstractBooleanValueSetupItem {

    protected getCategory(): string {
        return "界面";
    }

    protected getCode(): string {
        return "035";
    }

    protected getCurrentSetupValue(): boolean {
        return SetupLoader.isAsciiTextButtonEnabled();
    }

    protected getName(): string {
        return "字母文本的按钮";
    }

    protected doGetDescription(): string {
        return "按钮文本显示为英文字母。";
    }

}

export {SetupItem035};