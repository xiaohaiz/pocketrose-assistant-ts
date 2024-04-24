import Credential from "../../util/Credential";
import {BattleFailureRecordManager} from "../battle/BattleFailureRecordManager";

class ValidationCodeTrigger {

    private readonly recordManager: BattleFailureRecordManager;

    constructor(credential: Credential) {
        this.recordManager = new BattleFailureRecordManager(credential);
    }

    safe?: () => void;
    warning?: (count: number) => void;
    danger?: () => void;
    private started: boolean = false;

    async triggerStartup() {
        const threshold = BattleFailureRecordManager.loadConfiguredThreshold();
        if (threshold === 0) return;            // The feature disabled, ignore.
        if (this.started) return;               // Already started, ignore.

        const count = await this.recordManager.getValidationCodeFailureCount();
        if (count === 0) return;              // 没有错误，不满足启动条件
        if (count < threshold - 1) return;    // 错误次数较少，不满足启动条件

        this.started = true;
        this.processValidationCodeFailure().then();
    }

    private async processValidationCodeFailure() {
        const threshold = BattleFailureRecordManager.loadConfiguredThreshold();
        const count = await this.recordManager.getValidationCodeFailureCount();

        if (threshold === 0 || count === 0 || count < threshold - 1) {
            // 安全了，退出处理逻辑
            (this.safe) && (this.safe());
            this.started = false;
            return;
        }

        (this.warning) && (this.warning(count));
        if (count >= threshold) {
            (this.danger) && (this.danger());
        }

        // 5秒后继续扫描
        setTimeout(() => {
            this.processValidationCodeFailure().then();
        }, 5000);
    }
}

export {ValidationCodeTrigger}