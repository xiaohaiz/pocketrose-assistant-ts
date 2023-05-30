import SetupLoader from "../config/SetupLoader";
import TownDashboardPage from "../pocketrose/TownDashboardPage";
import Credential from "../util/Credential";
import TownDashboardLayout from "./TownDashboardLayout";

class TownDashboardLayout004 extends TownDashboardLayout {

    id(): number {
        return 4;
    }

    render(credential: Credential, page: TownDashboardPage): void {
        $("#leftPanel")
            .removeAttr("width")
            .css("width", "40%")
            .find("> table:first")
            .removeAttr("width")
            .css("width", "95%");
        $("#rightPanel")
            .removeAttr("width")
            .css("width", "60%")
            .find("> table:first")
            .find("> tbody:first")
            .append($("" +
                "<tr><td style='color:navy;font-weight:bold;text-align:center'>＜ 私 屏 ＞</td></tr>" +
                "<tr><td id='personalMessageContainer'></td></tr>" +
                "<tr><td style='color:navy;font-weight:bold;text-align:center'>＜ 红 包 ＞</td></tr>" +
                "<tr><td id='redPaperMessageContainer'></td></tr>" +
                "<tr style='height:100%'><td></td></tr>"));

        $("#personalMessageContainer")
            .html("<table style='width:100%;background-color:#AA0000;border-width:0'></table>");
        $("#redPaperMessageContainer")
            .html("<table style='width:100%;background-color:#AA0000;border-width:0'></table>");

        if (page.role!.country !== "在野" && page.role!.country === page.townCountry) {
            $("#rightPanel")
                .find("> table:first")
                .find("> tbody:first")
                .find("> tr:eq(1)")
                .find("> td:first")
                .find("> table:first")
                .find("> tbody:first")
                .find("> tr:eq(3)")
                .each((idx, tr) => {
                    const tax = page.townTax!;
                    $(tr).after($("<tr><td>收益</td><th id='townTax'>" + tax + "</th><td colspan='2'></td></tr>"));
                    if (tax - Math.floor(tax / 50000) * 50000 <= 10000) {
                        $("#townTax")
                            .css("color", "white")
                            .css("background-color", "green")
                            .css("font-weight", "bold")
                            .on("click", () => {
                                if (!SetupLoader.isCollectTownTaxDisabled()) {
                                    $("option[value='MAKE_TOWN']")
                                        .prop("selected", true)
                                        .closest("td")
                                        .next()
                                        .find("> input:submit:first")
                                        .trigger("click");
                                }
                            });
                    }
                });
        }

        let html = "";
        $("table:first")
            .next()
            .find("> tbody:first")
            .find("> tr:first")
            .hide()
            .next()
            .hide()
            .find("> td:first")
            .each((idx, td) => {
                html = $(td).html();
                $(td).html("");
            });

        $("#leftPanel")
            .find("> table:first")
            .find("> tbody:first")
            .find("> tr:eq(1)")
            .removeAttr("bgcolor")
            .html("<td style='text-align:center'></td>")
            .find("> td:first")
            .each((idx, td) => {
                $(td).html(html);
                $("#messageInputText").attr("size", 20);
            })
            .parent()
            .next()
            .find("> td:first")
            .removeAttr("bgcolor")
            .css("color", "navy")
            .css("font-weight", "bold")
            .css("text-align", "center")
            .html("＜ 公 屏 ＞")
            .parent()
            .each((idx, tr) => {
                let s = "<tr><td id='globalMessageContainer'></td></tr>";
                $(tr).after($(s));
            })
            .next()
            .next()
            .find("> td:first")
            .css("color", "navy")
            .css("font-weight", "bold")
            .css("text-align", "center")
            .html("＜ 国 屏 ＞")
            .parent()
            .each((idx, tr) => {
                let s = "<tr><td id='domesticMessageContainer'></td></tr>" +
                    "<tr style='height:100%'><td></td></tr>";
                $(tr).after($(s));
            });

        $("#globalMessageContainer")
            .html("<table style='width:100%;background-color:#AA0000;border-width:0'></table>");
        $("#domesticMessageContainer")
            .html("<table style='width:100%;background-color:#AA0000;border-width:0'></table>");

        $("table:first")
            .next()
            .find("> tbody:first")
            .find("> tr:eq(2)")
            .find("> td:first")
            .each((idx, td) => {
                let t1 = $(td).find("> table:first");
                let t2 = $(td).find("> table:eq(1)");
                let t3 = $(td).find("> table:eq(2)");
                let s = t1.html();
                $("#globalMessageContainer").find("> table:first").html(s);
                s = t2.html();
                $("#personalMessageContainer").find("> table:first").html(s);
                s = t3.html();
                $("#redPaperMessageContainer").find("> table:first").html(s);
            })
            .next()
            .each((idx, td) => {
                let t = $(td).find("> table:first");
                let s = t.html();
                $("#domesticMessageContainer").find("> table:first").html(s);
            });

        $("table:first")
            .next()
            .hide();

        $("#messageInputText")
            .parent()
            .next().hide()
            .next().hide()
            .parent()
            .parent()
            .prev()
            .find("> th:first")
            .find("> font:first")
            .each((idx, font) => {
                $(font).on("click", () => {
                    $("input:submit[value='阅读留言']").trigger("click");
                });
            });
    }

}

export = TownDashboardLayout004;