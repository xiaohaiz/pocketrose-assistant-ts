import _ from "lodash";
import Constants from "../../util/Constants";

class ReportUtils {

    // percentage
    // permillage
    // permyriad

    static generatePercentageHtml(a: number, b: number) {
        if (b === 0) {
            return "-";
        }
        let ratio = a / b;
        ratio = _.min([ratio, 1])!;
        ratio = _.max([ratio, 0])!;

        if (ratio === 0) {
            return bar2(50) + "&nbsp;0<b>%</b>";
        }
        if (ratio === 1) {
            return bar1(50) + "&nbsp;100<b>%</b>";
        }
        const w1 = Math.min(49, Math.ceil(50 * ratio));
        const w2 = 50 - w1;
        return bar1(w1) + bar2(w2) + "&nbsp;" + (ratio * 100).toFixed(2) + "<b>%</b>";
    }

    static generatePermillageHtml(a: number, b: number) {
        if (b === 0) {
            return "-";
        }
        let ratio = a / b;
        ratio = _.min([ratio, 1])!;
        ratio = _.max([ratio, 0])!;

        if (ratio === 0) {
            return bar2(50) + "&nbsp;0<b>‰</b>";
        }
        if (ratio === 1) {
            return bar1(50) + "&nbsp;1000<b>‰</b>";
        }
        const w1 = Math.min(49, Math.ceil(50 * ratio));
        const w2 = 50 - w1;
        return bar1(w1) + bar2(w2) + "&nbsp;" + (ratio * 1000).toFixed(3) + "<b>‰</b>";
    }

    static generatePermyriadHtml(a: number, b: number) {
        if (b === 0) {
            return "-";
        }
        let ratio = a / b;
        ratio = _.min([ratio, 1])!;
        ratio = _.max([ratio, 0])!;

        if (ratio === 0) {
            return bar2(50) + "&nbsp;0<b>‱</b>";
        }
        if (ratio === 1) {
            return bar1(50) + "&nbsp;10000<b>‱</b>";
        }
        const w1 = Math.min(49, Math.ceil(50 * ratio));
        const w2 = 50 - w1;
        return bar1(w1) + bar2(w2) + "&nbsp;" + (ratio * 10000).toFixed(4) + "<b>‱</b>";
    }


}

function bar1(width: number) {
    return "<img src='" + Constants.POCKET_DOMAIN + "/image/bg/bar1.gif'  height='10' width='" + width + "' alt=''>";
}

function bar2(width: number) {
    return "<img src='" + Constants.POCKET_DOMAIN + "/image/bg/bar2.gif'  height='10' width='" + width + "' alt=''>";
}

export = ReportUtils;