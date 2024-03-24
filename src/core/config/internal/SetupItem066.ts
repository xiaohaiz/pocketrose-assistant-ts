import MessageBoard from "../../../util/MessageBoard";
import PageUtils from "../../../util/PageUtils";
import StorageUtils from "../../../util/StorageUtils";
import SetupItem from "../SetupItem";
import SetupLoader from "../SetupLoader";

class SetupItem066 implements SetupItem {

    readonly #code: string = "066";
    readonly #name: string = "十二宫战斗伴侣";
    readonly #key: string = "_pa_" + this.#code;

    code(): string {
        return this.#code;
    }

    render(id?: string): void {
        $("._066_button").off("click");
        let html = "";
        html += "<tr>";
        html += "<th style='background-color:#E8E8D0'>" + this.#name + "</th>";
        html += "<td style='background-color:#E8E8D0'>★</td>";
        html += "<td style='background-color:#EFE0C0'>";
        html += "<button role='button' class='_066_button' id='_066_cancel'>取消</button>";
        html += "</td>";
        html += "<td style='background-color:#E0D0B0;text-align:left' colspan='2' id='_066_partner'>";
        html += "</td>";
        html += "</tr>";
        $("#setup_item_table").append($(html));

        const partner = SetupLoader.loadZodiacPartner(id!);
        if (partner) {
            let s = "";
            s += partner.name;
            s += " Lv";
            s += partner.level;
            s += " "
            s += partner.maxHealth;
            s += " ";
            s += partner.attack;
            s += "/";
            s += partner.defense;
            s += "/";
            s += partner.specialAttack;
            s += "/";
            s += partner.specialDefense;
            s += "/";
            s += partner.speed;
            $("#_066_partner").html(s);
            $("#_066_cancel").on("click", () => {
                StorageUtils.remove("_pa_066_" + id);
                MessageBoard.publishMessage("<b style='color:red'>" + this.#name + "</b>已经取消。");
                PageUtils.triggerClick("refreshButton");
            });
        } else {
            $("#_066_partner").html("当前没有十二宫战斗伴侣的设置。");
            $("#_066_cancel").prop("disabled", true);
        }
    }

}


export = SetupItem066;