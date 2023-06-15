import Credential from "../../util/Credential";
import TownDashboardPage from "./TownDashboardPage";

class KeyboardShortcutManager {

    readonly #credential: Credential;
    readonly #page?: TownDashboardPage;

    constructor(credential: Credential, page?: TownDashboardPage) {
        this.#credential = credential;
        this.#page = page;
    }

    bind() {
        doBind(this.#credential, this.#page);
    }

}

function doBind(credential: Credential, page?: TownDashboardPage) {
    let formBattle = $("form[action='battle.cgi']");
    let selectBattle = formBattle.find('select[name="level"]');
    let optionIdx = 0;
    let buffer = "";
    $(document).off('keydown.city').on('keydown.city', event => {
        if ($("#messageInputText:focus").length > 0) {
            // 当前的焦点在消息框，禁用按键辅助
            return;
        }
        const key = event.key;
        if (!key) {
            return;
        }

        if (key === "q") {
            buffer += "q";
            if (buffer.length === 1) {
                $("#battleButton").trigger("focus");
            } else if (buffer.length === 2) {
                // 满足按键条件
                buffer = "";
                // 如果战斗选项中有“秘宝之岛”，则恒定选择
                let islandFound = false;
                $(selectBattle).find("option")
                    .each((idx, option) => {
                        if ($(option).text() === "秘宝之岛") {
                            $(option).prop("selected", true);
                            islandFound = true;
                        }
                    });
                if (islandFound) {
                    $("#battleButton").trigger("focus");
                } else {
                    // 在option中切换
                    optionIdx = optionIdx === 0 ? 1 : 0;
                    $(selectBattle).find("> option:eq(" + optionIdx + ")")
                        .prop("selected", true);
                    $("#battleButton").trigger("focus");
                }
            }
        }
    });
}

export = KeyboardShortcutManager;