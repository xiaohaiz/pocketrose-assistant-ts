class TimeoutUtils {

    static execute(timeoutInMillis: number, handler: () => void) {
        if ($("#countDownTimer").length > 0) {
            let count = timeoutInMillis / 1000;
            const timer = setInterval(function () {
                $("#countDownTimer").text(Math.max(count--, 0));
            }, 1000);
            setTimeout(function () {
                clearInterval(timer);
                $("#countDownTimer").text("-");
                handler();
            }, timeoutInMillis);
        } else {
            setTimeout(handler, timeoutInMillis);
        }
    }

}

export = TimeoutUtils;