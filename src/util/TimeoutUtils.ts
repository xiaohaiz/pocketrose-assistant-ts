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

}

export = TimeoutUtils;