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
            .append($("<tr style='height:100%'><td></td></tr>"))

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
                let s = "<tr><td id='domesticMessageContainer'></td></tr>";
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
                let t = $(td).find("> table:first");
                let s = t.html();
                t.remove();
                $("#globalMessageContainer").find("> table:first").html(s);
            })
            .next()
            .each((idx, td) => {
                let t = $(td).find("> table:first");
                let s = t.html();
                t.remove();
                $("#domesticMessageContainer").find("> table:first").html(s);
            });

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