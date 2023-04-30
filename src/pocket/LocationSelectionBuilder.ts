class LocationSelectionBuilder {

    static buildLocationSelectionTable(): string {
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
                html += "<td>";
                html += "<span title='坐标(" + x + "," + y + ")'>";
                html += "<input type='button' value='&nbsp;&nbsp;' " +
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

}

export = LocationSelectionBuilder;