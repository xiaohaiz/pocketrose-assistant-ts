class CommentBoard {

    static createCommentBoard(imageHtml: string) {
        if ($("#commentBoard").length > 0) {
            return;
        }
        let html = "";
        html += "<table style='background-color:#888888;border-width:0;width:100%'>";
        html += "<tbody>";
        html += "<tr>";
        html += "<td style='background-color:#F8F0E0' id='commentBoardManager'>" + imageHtml + "</td>"
        html += "<td style='background-color:#F8F0E0;width:100%' id='commentBoard'></td>"
        html += "</tr>";
        html += "</tbody>";
        html += "</table>";
        $("body:first").find("div:last").before($("<div id='commentBoardContainer'></div>"));
        $("#commentBoardContainer").html(html);
    }

    static writeMessage(message: string) {
        if ($("#commentBoard").length > 0) {
            let html = $("#commentBoard").html();
            html += message;
            $("#commentBoard").html(html);
        }
    }
}

export = CommentBoard;