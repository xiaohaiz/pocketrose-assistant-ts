class DashboardPageUtils {

    static generateAdditionalRPHtml(value: number | null | undefined) {
        if (!value) return "-";
        if (value >= 1500) {
            return "<span style='color:white'>" + value + "</span>";
        } else if (value >= 1000) {
            return "<span style='color:darkred'>" + value + "</span>";
        } else if (value >= 800) {
            return "<span style='color:red'>" + value + "</span>";
        } else if (value >= 500) {
            return "<span style='color:orange'>" + value + "</span>";
        } else {
            return "<span>" + value + "</span>";
        }
    }

}

export = DashboardPageUtils;