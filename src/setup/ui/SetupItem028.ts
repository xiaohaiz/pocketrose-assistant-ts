import SetupLoader from "../SetupLoader";
import {AbstractBooleanValueSetupItem} from "../SetupSupport";

class SetupItem028 extends AbstractBooleanValueSetupItem {

    protected getCategory(): string {
        return "界面";
    }

    protected getCode(): string {
        return "028";
    }

    protected getCurrentSetupValue(): boolean {
        return SetupLoader.isHiddenLeaveAndExitEnabled();
    }

    protected getName(): string {
        return "隐藏出城和退出";
    }

    protected doGetDescription(): string {
        return "城市界面不显示出城和退出按钮，在驿站可出城。";
    }

}

export {SetupItem028};