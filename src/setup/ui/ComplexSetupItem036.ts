import {AbstractSetupItem} from "../SetupSupport";
import {PocketLogger} from "../../pocket/PocketLogger";
import SetupLoader from "../SetupLoader";
import {SetupStorage} from "../SetupStorage";

const logger = PocketLogger.getLogger("SETUP");

class ComplexSetupItem036 extends AbstractSetupItem {

    private readonly name: string = "老年版战斗辅助";

    protected getCategory(): string {
        return "界面";
    }

    protected getCode(): string {
        return "036";
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
        html += "<option class='option_class_" + this.getCode() + "' value='-1'>禁用</option>";
        html += "<option class='option_class_" + this.getCode() + "' value='1.2'>120%</option>";
        html += "<option class='option_class_" + this.getCode() + "' value='1.5'>150%</option>";
        html += "<option class='option_class_" + this.getCode() + "' value='1.8'>180%</option>";
        html += "<option class='option_class_" + this.getCode() + "' value='2'>200%</option>";
        html += "<option class='option_class_" + this.getCode() + "' value='2.5'>250%</option>";
        html += "<option class='option_class_" + this.getCode() + "' value='3'>300%</option>";
        html += "</select>";
        html += "</td>";
        html += "<td style='background-color:#F8F0E0;text-align:left'>";
        html += "问就是口袋玩家人均老花眼。";
        html += "</td>";
        html += "</tr>";
        $("#setup_item_table").append($(html));

        const value = SetupLoader.getEnlargeBattleRatio();
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

export {ComplexSetupItem036};