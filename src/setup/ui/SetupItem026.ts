import SetupLoader from "../SetupLoader";
import {AbstractBooleanValueSetupItem} from "../SetupSupport";

class SetupItem026 extends AbstractBooleanValueSetupItem {

    protected getCategory(): string {
        return "界面";
    }

    protected getCode(): string {
        return "026";
    }

    protected getCurrentSetupValue(): boolean {
        return SetupLoader.isExperienceProgressBarEnabled();
    }

    protected getName(): string {
        return "经验进度条显示";
    }

    protected doGetDescription(): string {
        return "经验值用进度条方式表示。";
    }
}

export {SetupItem026};