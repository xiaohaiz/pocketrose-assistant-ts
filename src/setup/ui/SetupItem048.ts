import SetupLoader from "../SetupLoader";
import {AbstractBooleanValueSetupItem} from "../SetupSupport";

class SetupItem048 extends AbstractBooleanValueSetupItem {

    protected getCategory(): string {
        return "界面";
    }

    protected getCode(): string {
        return "048";
    }

    protected getCurrentSetupValue(): boolean {
        return SetupLoader.isQiHanTitleEnabled();
    }

    protected getName(): string {
        return "秦汉二十等爵位";
    }

    protected doGetDescription(): string {
        return "贡献等级新的表示体系。";
    }
}


export {SetupItem048};