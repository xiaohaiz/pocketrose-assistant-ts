import SetupItem from "../SetupItem";

class SetupItem064 implements SetupItem {

    readonly #code: string = "064";
    readonly #name: string = "智能战斗切换点";
    readonly #key: string = "_pa_" + this.#code;

    code(): string {
        return this.#code;
    }

    render(id?: string): void {
        let html = "";
        html += "<tr>";
        html += "<th style='background-color:#E8E8D0'>" + this.#name + "</th>";
        html += "<td style='background-color:#E8E8D0'></td>";
        html += "<td style='background-color:#EFE0C0'>";
        html += "<input type='button' class='dynamic_button' id='setup_" + this.#code + "' value='设置'>";
        html += "</td>";
        html += "<td style='background-color:#E0D0B0;text-align:left' colspan='2'>";
        html += "<span style='background-color:red;color:white;font-weight:bold'>上洞</span>";
        html += "<input type='text' id='_064_a' size='5' maxlength='5' spellcheck='false' style='text-align:right'>";
        html += "<span style='background-color:green;color:white;font-weight:bold'>初森</span>";
        html += "<input type='text' id='_064_b' size='5' maxlength='5' spellcheck='false' style='text-align:right'>";
        html += "<span style='background-color:blue;color:white;font-weight:bold'>中塔</span>";
        html += "<input type='text' id='_064_c' size='5' maxlength='5' spellcheck='false' style='text-align:right'>";
        html += "<span style='background-color:red;color:white;font-weight:bold'>上洞</span>";
        html += "</td>";
        html += "</tr>";
        $("#setup_item_table").append($(html));
    }

}


export = SetupItem064;