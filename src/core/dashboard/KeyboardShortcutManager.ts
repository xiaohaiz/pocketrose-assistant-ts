import Credential from "../../util/Credential";
import BattleFieldManager from "./BattleFieldManager";
import TownDashboardPage from "./TownDashboardPage";

class KeyboardShortcutManager {

    readonly #credential: Credential;
    readonly #bindBattle?: boolean;
    readonly #page?: TownDashboardPage;

    constructor(credential: Credential, bindBattle?: boolean, page?: TownDashboardPage) {
        this.#credential = credential;
        this.#bindBattle = bindBattle;
        this.#page = page;
    }

    bind() {
        doBind(this.#credential, this.#bindBattle, this.#page);
    }

}

function doBind(credential: Credential, bindBattle?: boolean, page?: TownDashboardPage) {
    let formBattle = $("form[action='battle.cgi']");
    let selectBattle = formBattle.find('select[name="level"]');
    let optionIdx = 0;
    $(document).off('keydown.city').on('keydown.city', event => {
        if ($("#messageInputText:focus").length > 0) {
            // 当前的焦点在消息框，禁用按键辅助
            return;
        }
        const key = event.key;
        if (!key) {
            return;
        }

        if (bindBattle) {
            if (key === "q") {
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
                        optionIdx = optionIdx === 0 ? 1 : 0;
                        $(selectBattle).find("> option:eq(" + optionIdx + ")")
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
                            optionIdx = optionIdx === 0 ? 1 : 0;
                            $(selectBattle).find("> option:eq(" + optionIdx + ")")
                                .prop("selected", true);
                            $("#battleButton").trigger("focus");
                        }
                    }
                }
                return;
            }
        }

        if (key === "r") {
            new BattleFieldManager(credential)
                .autoSetBattleField()
                .then(() => $("#refreshButton").trigger("click"));
            return;
        }

        if (key === "s") {
            $("option[value='ITEM_SHOP']").prop("selected", true);
            $("#townButton").trigger("click");
            return;
        }

        if (key === "p") {
            $("option[value='PET_TZ']").prop("selected", true);
            $("#townButton").trigger("click");
            return;
        }

        if (key === "m") {
            $("option[value='CHANGEMAP']").prop("selected", true);
            $("#townButton").trigger("click");
            return;
        }

        if (key === "k") {
            $("option[value='SINGLE_BATTLE']").prop("selected", true);
            $("#townButton").trigger("click");
            return;
        }


        if (key === "g") {
            $("option[value='PETMAP']").prop("selected", true);
            $("#townButton").trigger("click");
            return;
        }

        if (key === "e") {
            $("option[value='USE_ITEM']").prop("selected", true);
            $("#personalButton").trigger("click");
            return;
        }

        if (key === "u") {
            $("option[value='PETSTATUS']").prop("selected", true);
            $("#personalButton").trigger("click");
            return;
        }

        if (key === "z") {
            $("option[value='CHANGE_OCCUPATION']").prop("selected", true);
            $("#personalButton").trigger("click");
            return;
        }

        if (key === "i") {
            $("option[value='RANK_REMAKE']").prop("selected", true);
            $("#personalButton").trigger("click");
            return;
        }

        if (key === "t") {
            $("option[value='BATTLE_MES']").prop("selected", true);
            $("#personalButton").trigger("click");
            return;
        }

        if (key === "b") {
            $("option[value='BANK']").prop("selected", true);
            $("#townButton").trigger("click");
            return;
        }

        if (key === "x") {
            $("option[value='LETTER']").prop("selected", true);
            $("#personalButton").trigger("click");
            return;
        }

        if (key === "Escape") {
            $("option[value='INN']").prop("selected", true);
            $("#townButton").trigger("click");
            return;
        }
    });
}

export = KeyboardShortcutManager;