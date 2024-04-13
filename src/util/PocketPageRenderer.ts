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

    /**
     * @deprecated
     */
    static createGemCategorySelection(id?: string) {
        let idForUse = "_pocket_gemCategory";
        if (id !== undefined) idForUse = id;
        let html = "";
        html += "<select id='" + idForUse + "'>";
        html += "<option value='ALL'>所有宝石</option>";
        html += "<option value='POWER' style='color:blue'>威力宝石</option>";
        html += "<option value='LUCK' style='color:red'>幸运宝石</option>";
        html += "<option value='WEIGHT' style='color:green'>重量宝石</option>";
        html += "<option value='DRAGON'>龙珠</option>";
        html += "</select>";
        return html;
    }

    static createScanIntervalSelection(id?: string) {
        let idForUse = "_pocket_scanInterval";
        if (id !== undefined) idForUse = id;
        let html = "";
        html += "<select id='" + idForUse + "'>";
        html += "<option value='1000' style='color:red'>扫描间隔1秒</option>";
        html += "<option value='2000' style='color:blue' selected>扫描间隔2秒</option>";
        html += "<option value='3000' style='color:blue'>扫描间隔3秒</option>";
        html += "<option value='4000' style='color:green'>扫描间隔4秒</option>";
        html += "<option value='5000' style='color:green'>扫描间隔5秒</option>";
        html += "</select>";
        return html;
    }
}

export = PocketPageRenderer;