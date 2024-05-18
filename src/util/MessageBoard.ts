import {WelcomeMessage} from "./WelcomeMessage";
import NpcLoader from "../core/role/NpcLoader";

class MessageBoard {

    static createMessageBoard(containerId: string, imageHtml: string) {
        let html = "";
        html += "<table style='background-color:#888888;border-width:0;width:100%'>";
        html += "<tbody>";
        html += "<tr>";
        html += "<td style='background-color:#F8F0E0' id='messageBoardManager'>" + imageHtml + "</td>"
        html += "<td style='background-color:#F8F0E0;width:100%' id='messageBoard'></td>"
        html += "</tr>";
        html += "</tbody>";
        html += "</table>";
        $("#" + containerId).html(html);
    }

    static createMessageBoardStyleB(containerId: string, imageHtml: string) {
        let html = "";
        html += "<table style='background-color:#888888;border-width:0;width:100%'>";
        html += "<tbody>";
        html += "<tr>";
        html += "<td style='background-color:#F8F0E0;width:100%' id='messageBoard'></td>"
        html += "<td style='background-color:#F8F0E0' id='messageBoardManager'>" + imageHtml + "</td>"
        html += "</tr>";
        html += "</tbody>";
        html += "</table>";
        $("#" + containerId).html(html);
    }

    static createMessageBoardStyleC(containerId: string) {
        let html = "";
        html += "<table style='background-color:#888888;border-width:0;width:100%'>";
        html += "<tbody>";
        html += "<tr>";
        html += "<td style='background-color:black;width:100%;color:white' id='messageBoard'></td>"
        html += "</tr>";
        html += "</tbody>";
        html += "</table>";
        $("#" + containerId).html(html);
    }

    static initializeWelcomeMessage() {
        const message = "<span style='font-weight:bold;font-size:120%;color:wheat'>" +
            WelcomeMessage.randomWelcomeMessage() +
            "</span>";
        MessageBoard.resetMessageBoard(message);
    }

    static initializeManager() {
        const manager = $("#messageBoardManager");
        if (manager.length > 0) manager.html(NpcLoader.randomNpcImageHtml());
    }

    static resetMessageBoard(message: string, elementId?: string) {
        let id = "messageBoard"
        if (elementId !== undefined) id = elementId
        const element = $("#" + id)
        if (element.length > 0) {
            element.html(message)
        }
    }

    static publishMessage(message: string, elementId?: string) {
        let id = "messageBoard"
        if (elementId !== undefined) id = elementId
        const element = $("#" + id)
        if (element.length > 0) {
            let html = element.html();
            const now = new Date();
            const timeHtml = "<span style='color:lightgreen'>(" + now.toLocaleString() + ")</span>";
            html = html + "<li>" + timeHtml + " " + message + "</li>";
            element.html(html);
        }
    }

    static publishWarning(message: string) {
        let id = "messageBoard"
        const element = $("#" + id)
        if (element.length > 0) {
            let html = element.html();
            const now = new Date();
            const timeHtml = "<span style='color:lightgreen'>(" + now.toLocaleString() + ")</span>";
            const messageHtml = "<span style='color:red'>" + message + "</span>";
            html = html + "<li>" + timeHtml + " " + messageHtml + "</li>";
            element.html(html);
        }
    }

    static processResponseMessage(html: string) {
        if ($(html).text().includes("ERROR !")) {
            const errorMessage = $(html).find("font b").text();
            MessageBoard.publishMessage("<b style='color:red'>" + errorMessage + "</b>");
            return false;
        } else {
            $(html).find("h2").each(function (_idx, h2) {
                let successMessage = $(h2).html();
                successMessage = successMessage.replace("<br>", "");
                successMessage = "<td>" + successMessage + "</td>";
                MessageBoard.publishMessage($(successMessage).text());
            });
            return true;
        }
    }
}

export = MessageBoard;