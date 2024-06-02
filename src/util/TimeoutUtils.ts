class TimeoutUtils {

    static execute(timeoutInMillis: number, handler: () => void) {
        if ($("#countDownTimer").length > 0 || $("#_pocket_page_timer").length > 0) {
            let count = timeoutInMillis / 1000;
            const timer = setInterval(function () {
                const v = Math.max(count--, 0);
                $("#countDownTimer").text(v);
                $("#_pocket_page_timer").text("倒计时剩余 " + v + " 秒");
            }, 1000);
            setTimeout(function () {
                clearInterval(timer);
                $("#countDownTimer").text("-");
                $("#_pocket_page_timer").text("");
                handler();
            }, timeoutInMillis);
        } else {
            setTimeout(handler, timeoutInMillis);
        }
    }

    static executeWithTimeoutSpecified(timeoutInSeconds: number | undefined,
                                       callback: () => void,
                                       timeout?: () => void) {
        if (timeoutInSeconds === undefined || timeoutInSeconds <= 0) {
            // 不需要读秒
            callback();
        } else {
            // 开始读秒
            (timeout) && (timeout());
            TimeoutUtils.execute(timeoutInSeconds * 1000, () => {
                callback();
            });
        }
    }

}

export = TimeoutUtils;