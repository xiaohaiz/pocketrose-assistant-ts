import Credential from "../../util/Credential";
import KeyboardShortcutBuilder from "../../util/KeyboardShortcutBuilder";
import BattleFieldManager from "./BattleFieldManager";
import TownDashboardPage from "./TownDashboardPage";

class TownDashboardKeyboardManager {

    readonly #credential: Credential;
    readonly #bindBattle?: boolean;
    readonly #page?: TownDashboardPage;

    #optionIndex = 0;

    constructor(credential: Credential, bindBattle?: boolean, page?: TownDashboardPage) {
        this.#credential = credential;
        this.#bindBattle = bindBattle;
        this.#page = page;
    }

    bind() {
        new KeyboardShortcutBuilder()
            .onKeyPressed("k", () => this.#processKeyPressed_k())
            .onKeyPressed("m", () => this.#processKeyPressed_m())
            .onKeyPressed("p", () => this.#processKeyPressed_p())
            .onKeyPressed("q", () => this.#processKeyPressed_q())
            .onKeyPressed("r", () => this.#processKeyPressed_r())
            .onKeyPressed("s", () => this.#processKeyPressed_s())
            .onEscapePressed(() => this.#processKeyPressed_Escape())
            .withDefaultPredicate()
            .bind();
    }

    #processKeyPressed_k() {
        $("option[value='SINGLE_BATTLE']").prop("selected", true);
        $("#townButton").trigger("click");
    }

    #processKeyPressed_m() {
        $("option[value='CHANGEMAP']").prop("selected", true);
        $("#townButton").trigger("click");
    }

    #processKeyPressed_p() {
        $("option[value='PET_TZ']").prop("selected", true);
        $("#townButton").trigger("click");
    }

    #processKeyPressed_q() {
        if (!this.#bindBattle) {
            return;
        }
        let formBattle = $("form[action='battle.cgi']");
        let selectBattle = formBattle.find('select[name="level"]');
        if ($("#battleButton:hidden").length > 0) {
            // 安全战斗按钮功能开启，此时可能不显示战斗按钮
            // 直接进入切换战斗选项的流程
            let islandFound = false;
            $(selectBattle).find("option")
                .each((idx, option) => {
                    if ($(option).text() === "秘宝之岛") {
                        $(option).prop("selected", true);
                        islandFound = true;
                    }
                });
            if (!islandFound) {
                this.#optionIndex = this.#optionIndex === 0 ? 1 : 0;
                $(selectBattle).find("> option:eq(" + this.#optionIndex + ")")
                    .prop("selected", true);
            }
        } else {
            if ($("#battleButton:focus").length === 0) {
                $("#battleButton").trigger("focus");
            } else {
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
                    this.#optionIndex = this.#optionIndex === 0 ? 1 : 0;
                    $(selectBattle).find("> option:eq(" + this.#optionIndex + ")")
                        .prop("selected", true);
                    $("#battleButton").trigger("focus");
                }
            }
        }
    }

    #processKeyPressed_r() {
        new BattleFieldManager(this.#credential)
            .autoSetBattleField()
            .then(() => $("#refreshButton").trigger("click"));
    }

    #processKeyPressed_s() {
        $("option[value='ITEM_SHOP']").prop("selected", true);
        $("#townButton").trigger("click");
    }

    #processKeyPressed_Escape() {
        $("option[value='INN']").prop("selected", true);
        $("#townButton").trigger("click");
    }
}

export = TownDashboardKeyboardManager;