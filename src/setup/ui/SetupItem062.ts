import SetupLoader from "../SetupLoader";
import {AbstractBooleanValueSetupItem} from "../SetupSupport";

class SetupItem062 extends AbstractBooleanValueSetupItem {

    protected getCategory(): string {
        return "界面";
    }

    protected getCode(): string {
        return "062";
    }

    protected getCurrentSetupValue(): boolean {
        return SetupLoader.isShortcutPromptHidden();
    }

    protected getName(): string {
        return "隐藏快捷键提示";
    }

    protected doGetDescription(): string {
        return "主打就是记性好，不显示按钮上快捷键的提示。";
    }

}

export {SetupItem062};