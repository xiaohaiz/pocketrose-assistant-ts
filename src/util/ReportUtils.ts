import _ from "lodash";
import Constants from "./Constants";

class ReportUtils {

    // percentage
    // permillage
    // permyriad

    static percentage(a: number, b: number) {
        if (a === 0 || b === 0) {
            return "-";
        }
        let ratio = a / b;
        ratio = _.min([ratio, 1])!;
        ratio = _.max([ratio, 0])!;
        let left: string;
        if (ratio === 0) {
            left = bar2(50);
        } else if (ratio === 1) {
            left = bar1(50);
        } else {
            const w1 = Math.min(49, Math.ceil(50 * ratio));
            const w2 = 50 - w1;
            left = bar1(w1) + bar2(w2);
        }
        const right = (ratio * 100).toFixed(2);
        return generateTableHtml(left, right);
    }

    static permyriad(a: number, b: number) {
        if (a === 0 || b === 0) {
            return "-";
        }
        let ratio = a / b;
        ratio = _.min([ratio, 1])!;
        ratio = _.max([ratio, 0])!;
        let left: string;
        if (ratio === 0) {
            left = bar2(50);
        } else if (ratio === 1) {
            left = bar1(50);
        } else {
            const w1 = Math.min(49, Math.ceil(50 * ratio));
            const w2 = 50 - w1;
            left = bar1(w1) + bar2(w2);
        }
        const right = (ratio * 10000).toFixed(2);
        return generateTableHtml(left, right);
    }

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

    static generateVerticalBar(a: number, b: number) {
        if (a === 0 || b === 0) {
            return "<img src='" + Constants.POCKET_DOMAIN + "/image/bg/bar1.gif'  height='1' width='32' alt=''>";
        }
        const ratio = a / b;
        if (ratio === 1) {
            return "<img src='" + Constants.POCKET_DOMAIN + "/image/bg/bar1.gif'  height='128' width='32' alt=''>";
        }
        const height = _.ceil(128 * ratio);
        return "<img src='" + Constants.POCKET_DOMAIN + "/image/bg/bar1.gif'  height='" + height + "' width='32' alt=''>";
    }

    static percentage2(a: number, b: number) {
        if (a === 0 || b === 0) {
            return "-";
        }
        let ratio = a / b;
        return (ratio * 100).toFixed(2) + "%";
    }

}

function bar1(width: number) {
    return "<img src='" + Constants.POCKET_DOMAIN + "/image/bg/bar1.gif'  height='10' width='" + width + "' alt=''>";
}

function bar2(width: number) {
    return "<img src='" + Constants.POCKET_DOMAIN + "/image/bg/bar2.gif'  height='10' width='" + width + "' alt=''>";
}

function generateTableHtml(left: string, right: string) {
    let html = "";
    html += "<table style='background-color:transparent;border-width:0;border-spacing:0;width:100%;margin:auto'>";
    html += "<tbody>";
    html += "<tr>";
    html += "<td style='text-align:center'>";
    html += left;
    html += "</td>";
    html += "<td style='width:100%;text-align:right'>";
    html += right;
    html += "</td>";
    html += "</tr>";
    html += "</tbody>";
    html += "</table>";
    return html;
}

export = ReportUtils;