import {AbstractSetupItem} from "../SetupSupport";
import {PocketLogger} from "../../pocket/PocketLogger";
import SetupLoader from "../SetupLoader";
import {SetupStorage} from "../SetupStorage";
import _ from "lodash";

const logger = PocketLogger.getLogger("SETUP");

class ComplexSetupItem041 extends AbstractSetupItem {

    private readonly name: string = "快捷按钮的样式";

    protected getCategory(): string {
        return "界面";
    }

    protected getCode(): string {
        return "041";
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
        html += "<table style='border-width:0;background-color:transparent;margin:auto'>";
        html += "</tbody>";
        html += "<tr>";
        html += "<td style='text-align: left'>";
        html += "<select id='select_" + this.getCode() + "' class='C_select_" + this.getCode() + "'>";
        html += "<option class='option_class_" + this.getCode() + "' value='-1'>禁用</option>";
        html += "<option class='option_class_" + this.getCode() + "' value='0'>默认按钮</option>";
        html += "<option class='option_class_" + this.getCode() + "' value='10005'>样式一</option>";
        html += "<option class='option_class_" + this.getCode() + "' value='10007'>样式二</option>";
        html += "<option class='option_class_" + this.getCode() + "' value='10008'>样式三</option>";
        html += "<option class='option_class_" + this.getCode() + "' value='10016'>样式四</option>";
        html += "<option class='option_class_" + this.getCode() + "' value='10024'>样式五</option>";
        html += "<option class='option_class_" + this.getCode() + "' value='10028'>样式六</option>";
        html += "<option class='option_class_" + this.getCode() + "' value='10032'>样式七</option>";
        html += "<option class='option_class_" + this.getCode() + "' value='10033'>样式八</option>";
        html += "<option class='option_class_" + this.getCode() + "' value='10035'>样式九</option>";
        html += "<option class='option_class_" + this.getCode() + "' value='10062'>样式十</option>";
        html += "<option class='option_class_" + this.getCode() + "' value='10132'>样式十一</option>";
        html += "</select>";
        html += "<td style='width:64px;background-color:#888888' id='buttonSample'></td>";
        html += "<td style='width:100%'></td>"
        html += "</tr>";
        html += "</tbody>";
        html += "</table>";
        html += "</td>";
        html += "<td style='background-color:#F8F0E0;text-align:left'>";
        html += "为主界面快捷按钮挑选最合自己心意的按钮样式。";
        html += "</td>";
        html += "</tr>";
        $("#setup_item_table").append($(html));

        const value = SetupLoader.getTownDashboardShortcutButton();
        $(".option_class_" + this.getCode() + "[value='" + Number(value) + "']")
            .prop("selected", true);
        this.generateButtonSample(value);

        $("#select_" + this.getCode()).on("change", () => {
            const s = $("#select_" + this.getCode()).val() as string;
            SetupStorage.store("_pa_" + this.code(), s);
            this.generateButtonSample(_.parseInt(s));
            logger.info("<b style='color:red'>" + this.name + "</b>已经设置。");
        });

        $("#reset_button_" + this.getCode()).on("click", () => {
            SetupStorage.remove("_pa_" + this.code());
            $("#refreshSetupButton").trigger("click");
        });
    }

    private generateButtonSample(index: number) {
        const td = $("#buttonSample");
        if (index < 0) {
            td.html("");
            return;
        }
        if (index === 0) {
            const button: string = "<button role='button'>SAMPLE</button>";
            td.html(button);
            return;
        }

        const button: string = "<button role='button' class='button-" + index + "'>SAMPLE</button>";
        td.html(button);
    }

}

export {ComplexSetupItem041};