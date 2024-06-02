import {AbstractBooleanValueSetupItem} from "../SetupSupport";
import SetupLoader from "../SetupLoader";

class SetupItem098 extends AbstractBooleanValueSetupItem {

    protected getCategory(): string {
        return "其他";
    }

    protected getCode(): string {
        return "098";
    }

    protected getCurrentSetupValue(): boolean {
        return SetupLoader.isAutoCollectTownRevenueEnabled();
    }

    protected getName(): string {
        return "低贡献自动收益";
    }

    protected doGetDescription(): string {
        return "低贡献者战斗可触发自动收益不足100万的城市税收。";
    }
}

export {SetupItem098};