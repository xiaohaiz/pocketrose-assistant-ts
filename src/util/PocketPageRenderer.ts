class PocketPageRenderer {

    static OR(invisible?: boolean) {
        let html = "";
        if (invisible) {
            html += "<span style='display:none'>";
        } else {
            html += "<span>";
        }
        html += " <span style='background-color:blue;color:white;font-weight:bold'>OR</span> ";
        html += "</span>";
        return html;
    }

    static AND(invisible?: boolean) {
        let html = "";
        if (invisible) {
            html += "<span style='display:none'>";
        } else {
            html += "<span>";
        }
        html += " <span style='background-color:green;color:white;font-weight:bold'>AND</span> ";
        html += "</span>";
        return html;
    }

    static GO(invisible?: boolean) {
        let html = "";
        if (invisible) {
            html += "<span style='display:none'>";
        } else {
            html += "<span>";
        }
        html += " <span style='background-color:red;color:white;font-weight:bold'>GO</span> ";
        html += "</span>";
        return html;
    }

}

export = PocketPageRenderer;