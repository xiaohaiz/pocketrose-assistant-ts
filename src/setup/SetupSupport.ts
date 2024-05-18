import SetupItem from "./SetupItem";
import {PocketLogger} from "../pocket/PocketLogger";
import {SetupStorage} from "./SetupStorage";

const logger = PocketLogger.getLogger("SETUP");

abstract class AbstractSetupItem implements SetupItem {

    accept(id?: string): boolean {
        return true;
    }

    category(): string {
        return this.getCategory();
    }

    code(): string {
        return this.getCode();
    }

    render(id?: string): void {
        this.doRender();
    }

    protected abstract getCategory(): string;

    protected abstract getCode(): string;

    protected abstract doRender(): void;
}

abstract class AbstractBooleanValueSetupItem extends AbstractSetupItem {

    protected abstract getName(): string;

    protected abstract getCurrentSetupValue(): boolean;

    protected doSetSetupValue(value: boolean) {
        SetupStorage.storeBoolean("_pa_" + this.getCode(), value);
    }

    protected doRender() {
        const buttonClass = "C_" + this.getCode() + "_Button";
        const enableButtonId = "_" + this.getCode() + "_Button_Enable";
        const disableButtonId = "_" + this.getCode() + "_Button_Disable";
        $("." + buttonClass).off("click");

        let html = "<tr>";
        html += "<th style='background-color:#E8E8D0' class='C_setupItemName' id='_s_" + this.getCode() + "'>" + this.getName() + "</th>";
        html += "<td style='background-color:#E8E8D0'></td>";
        html += "<td style='background-color:#EFE0C0'></td>";
        html += "<td style='background-color:#F8F0E0;text-align:left' colspan='2'>";
        html += "<button role='button' class='dynamic_button " + buttonClass + "' " +
            "id='" + enableButtonId + "'>启用</button>";
        html += "<span> </span>";
        html += "<button role='button' class='dynamic_button " + buttonClass + "' " +
            "id='" + disableButtonId + "'>禁用</button>";
        html += "</td>";
        html += "</tr>";
        $("#setup_item_table").append($(html));
        this.bindButtons(buttonClass, enableButtonId, disableButtonId);
    }

    private bindButtons(buttonClass: string,
                        enableButtonId: string,
                        disableButtonId: string) {
        const enableButton = $("#" + enableButtonId);
        const disableButton = $("#" + disableButtonId);
        if (this.getCurrentSetupValue()) {
            enableButton.css("color", "blue");
            enableButton.prop("disabled", true);
        } else {
            disableButton.css("color", "blue");
            disableButton.prop("disabled", true);
        }

        $("." + buttonClass).on("click", async (event) => {
            const btnId = $(event.target).attr("id") as string;
            if (btnId === enableButtonId) {
                this.doSetSetupValue(true);
            } else if (btnId === disableButtonId) {
                this.doSetSetupValue(false);
            } else {
                return;
            }
            logger.info("<b style='color:red'>" + this.getName() + "</b>已经设置。");
            $("#refreshSetupButton").trigger("click");
        });
    }

}

export {AbstractSetupItem, AbstractBooleanValueSetupItem};