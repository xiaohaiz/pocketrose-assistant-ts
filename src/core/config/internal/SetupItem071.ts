import SetupItem from "../../../setup/SetupItem";
import {BattleFailureRecordManager} from "../../battle/BattleFailureRecordManager";
import PageUtils from "../../../util/PageUtils";
import StorageUtils from "../../../util/StorageUtils";
import StringUtils from "../../../util/StringUtils";

class SetupItem071 implements SetupItem {

    readonly #code: string = "071";
    readonly #name: string = "验证错自我休战";
    readonly #key: string = "_pa_" + this.#code;

    category(): string {
        return "战斗";
    }

    code(): string {
        return this.#code;
    }

    accept(id?: string): boolean {
        return true;
    }

    render(): void {
        this.doRender();
    }

    private doRender() {
        $("._071_button").off("click");
        let html = "";
        html += "<tr>";
        html += "<th style='background-color:#E8E8D0' class='C_setupItemName' id='_s_" + this.#code + "'>" + this.#name + "</th>";
        html += "<td style='background-color:#E8E8D0'></td>";
        html += "<td style='background-color:#EFE0C0'></td>";
        html += "<td style='background-color:#E0D0B0;text-align:left' colspan='2'>";
        html += "<button role='button' style='color:grey' " +
            "class='_071_button' id='_071_button_0'>我心大我不在乎</button>";
        html += "<span> </span>";
        html += "<button role='button' style='color:grey' " +
            "class='_071_button' id='_071_button_1'>谨小慎微1次就好</button>";
        html += "<span> </span>";
        html += "<button role='button' style='color:grey' " +
            "class='_071_button' id='_071_button_2'>中庸之道2次可乎</button>";
        html += "<span> </span>";
        html += "<button role='button' style='color:grey' " +
            "class='_071_button' id='_071_button_3'>正常人都会选3次</button>";
        html += "<span> </span>";
        html += "<button role='button' style='color:grey' " +
            "class='_071_button' id='_071_button_4'>安全底线4次了</button>";
        html += "</td>";
        html += "</tr>";
        $("#setup_item_table").append($(html));

        this.bindButtons();
    }

    private bindButtons() {
        const value = BattleFailureRecordManager.loadConfiguredThreshold();
        const currentId = "_071_button_" + value;
        PageUtils.changeColorBlue(currentId);
        PageUtils.disableElement(currentId);

        $("._071_button").on("click", event => {
            const btnId = $(event.target).attr("id") as string;
            const newValue = StringUtils.substringAfterLast(btnId, "_");
            PageUtils.toggleColor(
                btnId,
                () => {
                    StorageUtils.set(this.#key, newValue);
                    $("._071_button")
                        .css("color", "grey")
                        .prop("disabled", false);

                    PageUtils.changeColorBlue(btnId);
                    PageUtils.disableElement(btnId);
                },
                undefined
            );
        });
    }
}

export {SetupItem071};