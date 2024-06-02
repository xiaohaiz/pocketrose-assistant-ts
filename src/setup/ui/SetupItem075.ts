import SetupLoader from "../SetupLoader";
import {AbstractBooleanValueSetupItem} from "../SetupSupport";

class SetupItem075 extends AbstractBooleanValueSetupItem {

    protected getCategory(): string {
        return "界面";
    }

    protected getCode(): string {
        return "075";
    }

    protected getCurrentSetupValue(): boolean {
        return SetupLoader.isMobileTownDashboardEnabled();
    }

    protected getName(): string {
        return "手机版布局界面";
    }

    protected doGetDescription(): string {
        return "相对手机友好的竖排为主的简化界面。";
    }

}

export {SetupItem075};