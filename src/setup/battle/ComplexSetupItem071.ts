import {AbstractSetupItem} from "../SetupSupport";
import {PocketLogger} from "../../pocket/PocketLogger";
import {SetupStorage} from "../SetupStorage";
import {BattleFailureRecordManager} from "../../core/battle/BattleFailureRecordManager";

const logger = PocketLogger.getLogger("SETUP");

class ComplexSetupItem071 extends AbstractSetupItem {

    private readonly name: string = "验证错自我休战";

    protected getCategory(): string {
        return "战斗";
    }

    protected getCode(): string {
        return "071";
    }

    protected doRender(): void {
        $(".C_button_" + this.getCode()).off("click");
        $(".C_select_" + this.getCode()).off("change");

        let html = "";
        html += "<tr>";
        html += "<th style='background-color:#E8E8D0' class='C_setupItemName' id='_s_" + this.getCode() + "'>" + this.name + "</th>";
        html += "<td style='background-color:#E8E8D0'></td>";
        html += "<td style='background-color:#EFE0C0'>";
        html += "<button role='button' id='reset_button_" + this.getCode() + "' " +
            "class='C_button_" + this.getCode() + "'>重置</button>";
        html += "</td>";
        html += "<td style='background-color:#F8F0E0;text-align:left'>";
        html += "<select id='select_" + this.getCode() + "' class='C_select_" + this.getCode() + "'>";
        html += "<option class='option_class_" + this.getCode() + "' value='0'>我心大我不在乎</option>";
        html += "<option class='option_class_" + this.getCode() + "' value='1'>谨小慎微1次就好</option>";
        html += "<option class='option_class_" + this.getCode() + "' value='2'>中庸之道2次可乎</option>";
        html += "<option class='option_class_" + this.getCode() + "' value='3'>正常人都会选3次</option>";
        html += "<option class='option_class_" + this.getCode() + "' value='4'>安全底线4次了</option>";
        html += "</select>";
        html += "</td>";
        html += "<td style='background-color:#F8F0E0;text-align:left'>";
        html += "显而易见的是手潮的玩家永远不会缺少。";
        html += "</td>";
        html += "</tr>";
        $("#setup_item_table").append($(html));

        const value = BattleFailureRecordManager.loadConfiguredThreshold();
        $(".option_class_" + this.getCode() + "[value='" + Number(value) + "']")
            .prop("selected", true);

        $("#select_" + this.getCode()).on("change", () => {
            const s = $("#select_" + this.getCode()).val() as string;
            SetupStorage.store("_pa_" + this.code(), s);
            logger.info("<b style='color:red'>" + this.name + "</b>已经设置。");
        });

        $("#reset_button_" + this.getCode()).on("click", () => {
            SetupStorage.remove("_pa_" + this.code());
            $("#refreshSetupButton").trigger("click");
        });
    }

}

export {ComplexSetupItem071};