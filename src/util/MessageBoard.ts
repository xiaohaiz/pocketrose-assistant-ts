class MessageBoard {

    static createMessageBoard(containerId: string, imageHtml: string) {
        let html = "";
        html += "<table style='background-color:#888888;border-width:0;width:100%'>";
        html += "<tbody>";
        html += "<tr>";
        html += "<td style='background-color:#F8F0E0'>" + imageHtml + "</td>"
        html += "<td style='background-color:#F8F0E0;width:100%' id='messageBoard'></td>"
        html += "</tr>";
        html += "</tbody>";
        html += "</table>";
        $("#" + containerId).html(html);
    }

    static resetMessageBoard(message: string) {
        if ($("#messageBoard").length === 0) {
            return;
        }
        $("#messageBoard").html(message);
    }

    static publishMessage(message: string) {
        if ($("#messageBoard").length > 0) {
            let html = $("#messageBoard").html();
            const now = new Date();
            const timeHtml = "<span style='color:forestgreen'>(" + now.toLocaleString() + ")</span>";
            html = html + "<li>" + timeHtml + " " + message + "</li>";
            $("#messageBoard").html(html);
        }
    }

    static publishWarning(message: string) {
        if ($("#messageBoard").length > 0) {
            let html = $("#messageBoard").html();
            const now = new Date();
            const timeHtml = "<span style='color:forestgreen'>(" + now.toLocaleString() + ")</span>";
            const messageHtml = "<span style='color:red'>" + message + "</span>";
            html = html + "<li>" + timeHtml + " " + messageHtml + "</li>";
            $("#messageBoard").html(html);
        }
    }
}

export = MessageBoard;