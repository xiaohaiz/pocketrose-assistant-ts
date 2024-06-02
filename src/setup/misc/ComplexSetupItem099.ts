import {AbstractSetupItem} from "../SetupSupport";
import {PocketLogger} from "../../pocket/PocketLogger";
import SetupLoader from "../SetupLoader";
import {SetupStorage} from "../SetupStorage";

const logger = PocketLogger.getLogger("SETUP");

class ComplexSetupItem099 extends AbstractSetupItem {

    private readonly name: string = "低贡献评判标准";

    protected getCategory(): string {
        return "其他";
    }

    protected getCode(): string {
        return "099";
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
        html += "<option class='option_class_" + this.getCode() + "' value='1000'>1000贡献</option>";
        html += "<option class='option_class_" + this.getCode() + "' value='2000'>2000贡献</option>";
        html += "<option class='option_class_" + this.getCode() + "' value='3000'>3000贡献</option>";
        html += "<option class='option_class_" + this.getCode() + "' value='4000'>4000贡献</option>";
        html += "<option class='option_class_" + this.getCode() + "' value='5000'>5000贡献</option>";
        html += "<option class='option_class_" + this.getCode() + "' value='6000'>6000贡献</option>";
        html += "<option class='option_class_" + this.getCode() + "' value='7000'>7000贡献</option>";
        html += "<option class='option_class_" + this.getCode() + "' value='8000'>8000贡献</option>";
        html += "<option class='option_class_" + this.getCode() + "' value='9000'>9000贡献</option>";
        html += "</select>";
        html += "</td>";
        html += "<td style='background-color:#F8F0E0;text-align:left'>";
        html += "我们同意每个人对于弱势群体的定义都有各自的见解。";
        html += "</td>";
        html += "</tr>";
        $("#setup_item_table").append($(html));

        const value = SetupLoader.getLowContributionJudgementStandard();
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

export {ComplexSetupItem099};