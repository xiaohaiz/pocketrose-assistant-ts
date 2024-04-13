import _ from "lodash";
import StorageUtils from "../../util/StorageUtils";
import TimeoutUtils from "../../util/TimeoutUtils";

class BattleButtonManager {

    static isSafeButtonEnabled() {
        return StorageUtils.getBoolean("_pa_045");
    }

    static isHiddenButtonEnabled() {
        return StorageUtils.getBoolean("_pa_046");
    }

    async createSafeBattleButton() {
        return await (() => {
            return new Promise<void>(resolve => {
                if (!BattleButtonManager.isSafeButtonEnabled()) {
                    resolve();
                    return;
                }
                $("#battleButton").hide();

                const clock = $("input:text[name='clock']");
                if (clock.length === 0) {
                    // clock已经消失了，表示读秒已经完成，返回
                    this.showBattleButtonIfNecessary();
                    resolve();
                    return;
                }
                const remain = _.parseInt(clock.val()! as string);
                if (remain > 2) {
                    const timeoutInMillis = (remain - 2) * 1000;
                    TimeoutUtils.execute(timeoutInMillis, () => {
                        this.#startSafeBattleButtonTimer(clock);
                    });
                } else {
                    this.#startSafeBattleButtonTimer(clock);
                }
                resolve();
            });
        })();
    }

    #startSafeBattleButtonTimer(clock: JQuery) {
        const timer = setInterval(() => {
            const remain = _.parseInt(clock.val()! as string);
            if (remain <= 0) {
                clearInterval(timer);
                this.showBattleButtonIfNecessary();
            }
        }, 200);
    }

    private showBattleButtonIfNecessary() {
        const e = $("#ID_DANGEROUS");
        if (e.length === 0) {
            $("#battleButton").show();
            return;
        }
        const s = e.text();
        if (s === "DANGEROUS") {
            // Don't shou button
            return;
        }
        $("#battleButton").show();
    }
}

export = BattleButtonManager;