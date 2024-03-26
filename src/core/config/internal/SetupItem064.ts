import _ from "lodash";
import MessageBoard from "../../../util/MessageBoard";
import PageUtils from "../../../util/PageUtils";
import StorageUtils from "../../../util/StorageUtils";
import BattleFieldThreshold from "../../battle/BattleFieldThreshold";
import SetupItem from "../SetupItem";
import SetupLoader from "../SetupLoader";

class SetupItem064 implements SetupItem {

    readonly #code: string = "064";
    readonly #name: string = "智能战斗切换点";
    readonly #key: string = "_pa_" + this.#code;

    category(): string {
        return "战斗";
    }

    code(): string {
        return this.#code;
    }

    render(id?: string): void {
        $("#_064_setup").off("click");
        let html = "";
        html += "<tr>";
        html += "<th style='background-color:#E8E8D0' class='C_setupItemName' id='_s_" + this.#code + "'>" + this.#name + "</th>";
        html += "<td style='background-color:#E8E8D0'></td>";
        html += "<td style='background-color:#EFE0C0'>";
        html += "<input type='button' class='dynamic_button' id='_064_setup' value='设置'>";
        html += "</td>";
        html += "<td style='background-color:#E0D0B0;text-align:left' colspan='2'>";
        html += "<button role='button' style='background-color:red;color:white'>上洞</button>";
        html += "<input type='text' id='_064_a' size='5' maxlength='5' spellcheck='false' style='text-align:center'>";
        html += "<button role='button' style='background-color:green;color:white'>初森</button>";
        html += "<input type='text' id='_064_b' size='5' maxlength='5' spellcheck='false' style='text-align:center'>";
        html += "<button role='button' style='background-color:blue;color:white'>中塔</button>";
        html += "<input type='text' id='_064_c' size='5' maxlength='5' spellcheck='false' style='text-align:center'>";
        html += "<button role='button' style='background-color:red;color:white'>上洞</button>";
        html += "</td>";
        html += "</tr>";
        $("#setup_item_table").append($(html));

        const config = SetupLoader.loadBattleFieldThreshold();
        $("#_064_a").val(config.a!);
        $("#_064_b").val(config.b!);
        $("#_064_c").val(config.c!);

        $("#_064_setup").on("click", () => {
            const a = this.#parse("_064_a");
            const b = this.#parse("_064_b");
            const c = this.#parse("_064_c");
            if (!a || !b || !c) {
                PageUtils.scrollIntoView("messageBoard");
                return;
            }
            if (!(a < b && b < c)) {
                MessageBoard.publishMessage("<b style='color:red'>智能战斗切换点错误的输入，大小顺序错误！</b>");
                PageUtils.scrollIntoView("messageBoard");
                return;
            }
            const config = new BattleFieldThreshold();
            config.a = a;
            config.b = b;
            config.c = c;
            const document = config.asDocument();
            StorageUtils.set(this.#key, JSON.stringify(document));
            MessageBoard.publishMessage("<b style='color:red'>" + this.#name + "</b>已经设置。");
            PageUtils.triggerClick("refreshButton");
        });
    }

    #parse(elementId: string): number | undefined {
        const s = $("#" + elementId).val() as string;
        if (s === "" || s.trim() === "") {
            MessageBoard.publishMessage("<b style='color:red'>智能战斗切换点错误的输入，没有内容！</b>");
            return undefined;
        }
        const i = _.parseInt(s);
        if (!_.isInteger(i)) {
            MessageBoard.publishMessage("<b style='color:red'>智能战斗切换点错误的输入，不是整数！</b>");
            return undefined;
        }
        if (i < 1 || i > 3999) {
            MessageBoard.publishMessage("<b style='color:red'>智能战斗切换点错误的输入，范围[1,3999]！</b>");
            return undefined;
        }
        return i;
    }
}


export = SetupItem064;