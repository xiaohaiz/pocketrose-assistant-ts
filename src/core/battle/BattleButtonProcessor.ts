import Credential from "../../util/Credential";
import SetupLoader from "../../setup/SetupLoader";
import StringUtils from "../../util/StringUtils";
import _ from "lodash";
import {BattleConfigManager} from "../../setup/ConfigManager";
import {BattleFailureRecordManager} from "./BattleFailureRecordManager";
import {BattleFailureRecord} from "./BattleFailureRecord";
import {PocketLogger} from "../../pocket/PocketLogger";

const logger = PocketLogger.getLogger("TOWN");

class BattleButtonProcessor {

    private readonly recordManager: BattleFailureRecordManager;

    constructor(credential: Credential) {
        this.recordManager = new BattleFailureRecordManager(credential);
    }

    doRefresh?: () => void;

    private digitalValidationCodeMet?: boolean;     // 遇到了数字验证码
    private digitalValidationCodeDodged?: boolean;  // 成功规避了数字验证码

    async renderBattleButton() {
        await this.processValidationFailure();
    }

    async reset() {
        this.digitalValidationCodeMet = undefined;
        this.digitalValidationCodeDodged = undefined;
    }

    private async processValidationFailure() {
        const threshold = BattleFailureRecordManager.loadConfiguredThreshold();
        const records = await this.recordManager.findValidationCodeFailureRecords();
        // Render validation failure if necessary.
        await this.renderValidationFailure(threshold, records);
        if (threshold === 0 || records.length === 0 || records.length < threshold) {
            // Safe, move to next processor.
            await this.processDigitalValidation();
            return;
        }
        // Scan every 5 seconds until safe.
        setTimeout(async () => {
            await this.processValidationFailure();
        }, 5000);
    }

    /**
     * 检查是否出现数字验证码（图破）
     */
    private async processDigitalValidation() {
        if (!SetupLoader.isAvoidDigitalValidationCodeEnabled()) {
            // 没有开启规避数字验证码功能，继续下一个处理器
            await this.processSafeBattleButton();
            return;
        }

        // 解析所有能识别的战斗选项
        const optionValues: string[] = [];
        const battleSelect = $("#battleMenu").find("> form:first > select:first");
        battleSelect.find("> option").each((_idx, it) => {
            const option = $(it);
            const value = option.val() as string;
            if (_.startsWith(value, "1-")) {    // 初森
                optionValues.push(StringUtils.substringAfter(value, "1-"));
            }
            if (_.startsWith(value, "2-")) {    // 中塔
                optionValues.push(StringUtils.substringAfter(value, "2-"));
            }
            if (_.startsWith(value, "3-")) {    // 上洞
                optionValues.push(StringUtils.substringAfter(value, "3-"));
            }
            if (_.startsWith(value, "13-")) {    // 十二宫
                optionValues.push(StringUtils.substringAfter(value, "13-"));
            }
            if (_.startsWith(value, "16-")) {    // 宠训
                optionValues.push(StringUtils.substringAfter(value, "16-"));
            }
        });
        const uniqueOptionValues = Array.from(new Set(optionValues));
        const len1 = uniqueOptionValues.length;
        const len2 = _.forEach(uniqueOptionValues)
            .filter(it => it.length === 4)
            .filter(it => /^\d+$/.test(it))
            .length;

        if (len1 !== len2) {
            // 长度不一致了，说明发现了正常的验证码
            // 无需规避数字验证码了，继续下一个处理器
            await this.processSafeBattleButton();
            return;
        }

        // 发现了数字验证码，10秒后刷新
        this.digitalValidationCodeMet = true;
        logger.debug("Digital validation code found: " + _.join(uniqueOptionValues, " "));
        setTimeout(() => {
            (this.doRefresh) && (this.doRefresh());
        }, 10000);
    }

    private async processSafeBattleButton() {
        // 流程到这里意味着即使有数字验证码出现过也已经成功规避了
        if (this.digitalValidationCodeMet) {
            // 之前的处理器已经发现了数字验证码，设置成功规避
            this.digitalValidationCodeDodged = true;
        }

        if (!BattleConfigManager.isSafeBattleButtonEnabled()) {
            // 没有开启安全按钮，直接恢复战斗按钮
            await this.restoreBattleButton();
            return;
        }
        const remain = this.parseClockTime();
        if (remain <= 0) {
            // clock已经消失或者倒计时已经完成，恢复战斗按钮
            await this.restoreBattleButton();
            return;
        }
        if (remain > 2) {
            // 剩余时间还长，多休息一会
            const timeoutInMillis = (remain - 2) * 1000;
            setTimeout(async () => {
                await this.processSafeBattleButton();
            }, timeoutInMillis);
        } else {
            setTimeout(async () => {
                await this.processSafeBattleButton();
            }, 200);
        }
    }

    private async restoreBattleButton() {
        const battleButton = $("#battleButton");
        const battleButtonText = battleButton.text();
        if (battleButton.find("> span:first").length > 0) {
            // 先清理战斗按钮的状态
            battleButton.html(battleButtonText);
        }
        if (this.digitalValidationCodeDodged) {
            // 成功规避数字验证码的时候特殊显示战斗按钮
            battleButton.html(() => {
                return "<span style='color:red'>" + battleButtonText + "</span>";
            });
        }
        battleButton.show();
    }

    private async renderValidationFailure(threshold: number,
                                          records: BattleFailureRecord[]) {
        if (SetupLoader.isWarningValidationFailureEnabled()) {
            const th = $("#battleMenu").closest("tr").find("> th:first");
            if (threshold === 0 || records.length === 0 || records.length < threshold - 1) {
                th.removeAttr("style").html("");
                return;
            }
            let html = "<table style='background-color:transparent;margin:auto;width:60%;height:60%;border-width:0;border-spacing:0'>";
            html += "<tbody>";
            html += "<tr>";
            html += "<td style='background-color:red;color:white;width:100%;height:100%;text-align:center;vertical-align:middle'>";
            html += "<span style='font-weight:bold;font-size:300%'>" + records.length + "错</span>";
            html += "</td>";
            html += "</tr>";
            html += "</tbody>";
            html += "</table>";
            th.css("text-align", "center")
                .css("vertical-align", "middle")
                .html(html);
        } else {
            const validationFailure = $("#validationFailure");
            if (threshold === 0 || records.length === 0 || records.length < threshold - 1) {
                validationFailure.html("").parent().hide();
                return;
            }
            let html = "<table style='background-color:#888888;margin:0;width:100%;border-width:0'>";
            html += "<tbody style='background-color:#D4D4D4;text-align:center'>";
            html += "<tr>";
            html += "<td colspan='2'>验证码错误次数：<span style='font-weight:bold;color:darkred'>" + records.length + "</span></td>";
            html += "</tr>";
            for (let i = 0; i < records.length; i++) {
                const record = records[i];
                html += "<tr>";
                html += "<td>#" + (i + 1) + "</td>"
                html += "<td style='text-align:left'>";
                html += new Date(record.createTime!).toLocaleString();
                html += "</td>";
                html += "</tr>";
            }
            html += "</tbody>";
            html += "</table>";
            validationFailure.html(html).parent().show();
        }
    }

    private parseClockTime() {
        let clock = $("input:text[name='clock2']");
        if (clock.length > 0) {
            return _.parseInt(clock.val() as string);
        }
        clock = $("input:text[name='clock']");
        if (clock.length > 0) {
            return _.parseInt(clock.val() as string);
        }
        return -1;
    }
}

export {BattleButtonProcessor};