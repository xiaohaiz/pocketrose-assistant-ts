import _ from "lodash";
import PageUtils from "../../../util/PageUtils";
import StorageUtils from "../../../util/StorageUtils";
import StringUtils from "../../../util/StringUtils";
import Mirror from "../../role/Mirror";
import SetupItem from "../SetupItem";
import SetupLoader from "../SetupLoader";

class SetupItem070 implements SetupItem {

    readonly #code: string = "070";
    readonly #name: string = "定型分身請確認";
    readonly #key: string = "_pa_" + this.#code;

    category(): string {
        return "其他";
    }

    code(): string {
        return this.#code;
    }

    render(id?: string, extension?: {}): void {
        if (extension === undefined) {
            return;
        }
        // @ts-ignore
        const mirrorList: Mirror[] | undefined = extension.mirrorList;
        if (mirrorList === undefined) {
            return;
        }
        this.#doRender(id!, mirrorList.length);
    }

    #doRender(id: string, mirrorCount: number) {
        $("._070_button").off("click");
        let html = "";
        html += "<tr>";
        html += "<th style='background-color:#E8E8D0' class='C_setupItemName' id='_s_" + this.#code + "'>" + this.#name + "</th>";
        html += "<td style='background-color:#E8E8D0'>★</td>";
        html += "<td style='background-color:#EFE0C0'></td>";
        html += "<td style='background-color:#E0D0B0;text-align:left' colspan='2'>";
        html += "<button role='button' class='dynamic_button _070_button' id='_070_button_0' style='color:grey'>本体</button>";
        for (let i = 0; i < mirrorCount; i++) {
            const buttonTitle = "第" + (i + 1) + "分身";
            html += "<button role='button' class='dynamic_button _070_button' id='_070_button_" + (i + 1) + "' style='color:grey'>" + buttonTitle + "</button>";
        }
        html += "</td>";
        html += "</tr>";
        $("#setup_item_table").append($(html));

        const config: any = SetupLoader.loadMirrorCareerFixedConfig(id);
        if (config["_m_0"]) $("#_070_button_0").css("color", "blue");
        for (let i = 0; i < mirrorCount; i++) {
            const field = "_m_" + (i + 1);
            if (config[field]) $("#_070_button_" + (i + 1)).css("color", "blue");
        }

        $("._070_button").on("click", event => {
            const buttonId = $(event.target).attr("id") as string;
            $("._070_button").prop("disabled", true);
            const index = _.parseInt(StringUtils.substringAfter(buttonId, "_070_button_"));
            const c: any = SetupLoader.loadMirrorCareerFixedConfig(id);
            if (PageUtils.isColorGrey(buttonId)) {
                c["_m_" + index] = true;
                StorageUtils.set("_pa_070_" + id, JSON.stringify(c));
                PageUtils.triggerClick("refreshButton");
            } else if (PageUtils.isColorBlue(buttonId)) {
                c["_m_" + index] = false;
                StorageUtils.set("_pa_070_" + id, JSON.stringify(c));
                PageUtils.triggerClick("refreshButton");
            }
        });
    }


}

export = SetupItem070;