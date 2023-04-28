import TownLoader from "./TownLoader";

class TownSelectionBuilder {

    static buildTownSelectionTable(): string {
        let html = "";
        html += "<table style='background-color:#888888;width:100%'><tbody style='background-color:#F8F0E0'>";
        html += "<tr>" +
            "<th style='background-color:#E8E8D0'>选择</th>" +
            "<th style='background-color:#EFE0C0'>目的地</th>" +
            "<th colspan='2' style='background-color:#E0D0B0'>坐标</th>" +
            "<th style='background-color:#E8E8D0'>选择</th>" +
            "<th style='background-color:#EFE0C0'>目的地</th>" +
            "<th colspan='2' style='background-color:#E0D0B0'>坐标</th>" +
            "<th style='background-color:#E8E8D0'>选择</th>" +
            "<th style='background-color:#EFE0C0'>目的地</th>" +
            "<th colspan='2' style='background-color:#E0D0B0'>坐标</th>" +
            "<th style='background-color:#E8E8D0'>选择</th>" +
            "<th style='background-color:#EFE0C0'>目的地</th>" +
            "<th colspan='2' style='background-color:#E0D0B0'>坐标</th>" +
            "</tr>";

        const townList = TownLoader.getTownList();
        for (let i = 0; i < 7; i++) {
            const row = [];
            row.push(townList[i * 4]);
            row.push(townList[i * 4 + 1]);
            row.push(townList[i * 4 + 2]);
            row.push(townList[i * 4 + 3]);

            html += "<tr>";
            for (let j = 0; j < row.length; j++) {
                const town = row[j];
                html += "<td style='background-color:#E8E8D0'><input type='radio' class='townClass' name='townId' value='" + town.id + "'></td>";
                html += "<td style='background-color:#EFE0C0'>" + town.name + "</td>";
                html += "<td style='background-color:#E0D0B0'>" + town.coordinate.x + "</td>";
                html += "<td style='background-color:#E0D0B0'>" + town.coordinate.y + "</td>";
            }
            html += "</tr>";
        }

        html += "</tbody></table>";
        html += "<br>";

        return html;
    }

}

export = TownSelectionBuilder;