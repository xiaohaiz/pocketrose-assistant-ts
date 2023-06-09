import TownInformation from "../pocketrose/TownInformation";
import Coordinate from "../util/Coordinate";
import TownLoader from "./town/TownLoader";

class MapBuilder {

    static buildBlankMapTable(): string {
        let html = "";
        html += "<table style='background-color:#888888;margin:auto;border-width:0'>";
        html += "<tbody style='background-color:#F8F0E0'>";
        html += "<tr>";
        html += "<td></td>";
        html += "<td>0</td>";
        html += "<td>1</td>";
        html += "<td>2</td>";
        html += "<td>3</td>";
        html += "<td>4</td>";
        html += "<td>5</td>";
        html += "<td>6</td>";
        html += "<td>7</td>";
        html += "<td>8</td>";
        html += "<td>9</td>";
        html += "<td>10</td>";
        html += "<td>11</td>";
        html += "<td>12</td>";
        html += "<td>13</td>";
        html += "<td>14</td>";
        html += "<td>15</td>";
        html += "</tr>";

        for (let y = 15; y >= 0; y--) {
            html += "<tr>";
            html += "<td>" + y + "</td>";
            for (let x = 0; x <= 15; x++) {
                const coordinate = new Coordinate(x, y);
                let buttonValue = "　";
                let buttonTitle = "坐标" + coordinate.asText();
                html += "<td>";
                html += "<span title='" + buttonTitle + "' class='color_none'>";
                html += "<input type='button' value='" + buttonValue + "' " +
                    "class='location_button_class' " +
                    "id='location_" + x + "_" + y + "'>";
                html += "</span>";
                html += "</td>";
            }
            html += "</tr>";
        }

        html += "</tbody>";
        html += "</table>"
        return html;
    }

    static buildMapTable(): string {
        let html = "";
        html += "<table style='background-color:#888888;margin:auto;border-width:0'>";
        html += "<tbody style='background-color:#F8F0E0'>";
        html += "<tr>";
        html += "<td></td>";
        html += "<td>0</td>";
        html += "<td>1</td>";
        html += "<td>2</td>";
        html += "<td>3</td>";
        html += "<td>4</td>";
        html += "<td>5</td>";
        html += "<td>6</td>";
        html += "<td>7</td>";
        html += "<td>8</td>";
        html += "<td>9</td>";
        html += "<td>10</td>";
        html += "<td>11</td>";
        html += "<td>12</td>";
        html += "<td>13</td>";
        html += "<td>14</td>";
        html += "<td>15</td>";
        html += "</tr>";

        for (let y = 15; y >= 0; y--) {
            html += "<tr>";
            html += "<td>" + y + "</td>";
            for (let x = 0; x <= 15; x++) {
                const coordinate = new Coordinate(x, y);
                let buttonValue = "　";
                let buttonTitle = "坐标" + coordinate.asText();
                const town = TownLoader.getTownByCoordinate(coordinate);
                if (town !== null) {
                    buttonValue = town.name.substring(0, 1);
                    buttonTitle = "城市" + coordinate.asText() + " " + town.name;
                }

                html += "<td>";
                if (buttonValue === "　") {
                    html += "<span title='" + buttonTitle + "' class='color_none'>";
                    html += "<input type='button' value='" + buttonValue + "' " +
                        "class='location_button_class' " +
                        "id='location_" + x + "_" + y + "'>";
                    html += "</span>";
                } else {
                    html += "<span title='" + buttonTitle + "' class='color_yellow'>";
                    html += "<input type='button' value='" + buttonValue + "' " +
                        "class='location_button_class' " +
                        "id='location_" + x + "_" + y + "' " +
                        "style='background-color:yellow'>";
                    html += "</span>";
                }
                html += "</td>";
            }
            html += "</tr>";
        }

        html += "</tbody>";
        html += "</table>"
        return html;
    }

    static updateTownBackgroundColor() {
        new TownInformation().open().then(page => {
            for (const status of page.statusList!) {
                const town = TownLoader.getTownByName(status.name!)!;
                const x = town.coordinate!.x;
                const y = town.coordinate!.y;
                const buttonId = "location_" + x + "_" + y;
                $("#" + buttonId)
                    .css("background-color", status.color!)
                    .css("color", "white")
                    .parent()
                    .attr("class", "color_" + status.color);
            }
        });
    }
}

export = MapBuilder;