import TownLoader from "../core/town/TownLoader";
import PageProcessorContext from "./PageProcessorContext";

class PageProcessorUtils {

    static #DEFAULT_RETURN_TOWN_BUTTON_TITLE = "返回城市";

    /**
     * 生成返回城市按钮的文本。
     */
    static generateReturnTownButtonTitle(context?: PageProcessorContext) {
        const town = TownLoader.load(context?.get("townId"));
        if (town) {
            return "返回" + town.name;
        }
        return PageProcessorUtils.#DEFAULT_RETURN_TOWN_BUTTON_TITLE;
    }

}

export = PageProcessorUtils;