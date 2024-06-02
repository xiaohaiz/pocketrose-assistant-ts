import {AbstractBooleanValueSetupItem} from "../SetupSupport";
import SetupLoader from "../SetupLoader";

class SetupItem100 extends AbstractBooleanValueSetupItem {

    protected getCategory(): string {
        return "其他";
    }

    protected getCode(): string {
        return "100";
    }

    protected getCurrentSetupValue(): boolean {
        return SetupLoader.isElegantChangeAccessoriesEnabled();
    }

    protected getName(): string {
        return "常驻饰品优雅换";
    }

    protected doGetDescription(): string {
        return "千寻、勿忘我、闪光弹优雅更换，随时保持干净整洁。";
    }
}

export {SetupItem100};