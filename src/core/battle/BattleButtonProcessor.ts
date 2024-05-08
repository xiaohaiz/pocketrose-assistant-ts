import Credential from "../../util/Credential";
import _ from "lodash";
import {BattleConfigManager} from "../config/ConfigManager";
import {BattleFailureRecordManager} from "./BattleFailureRecordManager";
import {BattleFailureRecord} from "./BattleFailureRecord";
import SetupLoader from "../config/SetupLoader";
import StringUtils from "../../util/StringUtils";
import PageUtils from "../../util/PageUtils";

class BattleButtonProcessor {

    private readonly recordManager: BattleFailureRecordManager;

    constructor(credential: Credential) {
        this.recordManager = new BattleFailureRecordManager(credential);
    }

    async renderBattleButton() {
        await this.processValidationFailure();
    }

    private async processValidationFailure() {
        const threshold = BattleFailureRecordManager.loadConfiguredThreshold();
        const records = await this.recordManager.findValidationCodeFailureRecords();
        // Render validation failure if necessary.
        await this._renderValidationFailure(threshold, records);
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
        setTimeout(() => {
            PageUtils.triggerClick("reloadButton");
        }, 10000);
    }

    private async processSafeBattleButton() {
        const battleButton = $("#battleButton");
        if (!BattleConfigManager.isSafeBattleButtonEnabled()) {
            // 没有开启安全按钮，直接恢复战斗按钮
            battleButton.show();
            return;
        }
        const clock = $("input:text[name='clock']");
        if (clock.length === 0) {
            // clock已经消失了，表示读秒已经完成，恢复战斗按钮
            battleButton.show();
            return;
        }
        const remain = _.parseInt(clock.val()! as string);
        if (remain <= 0) {
            // 倒计时已经完成，恢复战斗按钮
            battleButton.show();
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

    private async _renderValidationFailure(threshold: number,
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
}

export {BattleButtonProcessor};