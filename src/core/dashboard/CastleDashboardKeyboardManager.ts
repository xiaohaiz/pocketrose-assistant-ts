import KeyboardShortcutBuilder from "../../util/KeyboardShortcutBuilder";

class CastleDashboardKeyboardManager {


    doBind() {
        KeyboardShortcutBuilder.newInstance()
            .onKeyPressed("b", () => this.#processKeyPressed_b())
            .onKeyPressed("e", () => this.#processKeyPressed_e())
            .onKeyPressed("i", () => this.#processKeyPressed_i())
            .onKeyPressed("j", () => this.#processKeyPressed_j())
            .onKeyPressed("r", () => this.#processKeyPressed_r())
            .onKeyPressed("t", () => this.#processKeyPressed_t())
            .onKeyPressed("u", () => this.#processKeyPressed_u())
            .onKeyPressed("x", () => this.#processKeyPressed_x())
            .onKeyPressed("z", () => this.#processKeyPressed_z())
            .onEscapePressed(() => this.#processKeyPressed_Escape())
            .withDefaultPredicate()
            .doBind();
    }

    #processKeyPressed_b() {
        $("option[value='CASTLE_BANK']").prop("selected", true);
        $("#castleButton").trigger("click");
    }

    #processKeyPressed_e() {
        $("option[value='USE_ITEM']").prop("selected", true);
        $("#personalButton").trigger("click");
    }

    #processKeyPressed_i() {
        $("option[value='RANK_REMAKE']").prop("selected", true);
        $("#personalButton").trigger("click");
    }

    #processKeyPressed_j() {
        $("option[value='DIANMING']").prop("selected", true);
        $("#personalButton").trigger("click");
    }

    #processKeyPressed_r() {
        $("#reloadButton").trigger("click");
    }

    #processKeyPressed_t() {
        $("option[value='BATTLE_MES']").prop("selected", true);
        $("#personalButton").trigger("click");
    }

    #processKeyPressed_u() {
        $("option[value='PETSTATUS']").prop("selected", true);
        $("#personalButton").trigger("click");
    }

    #processKeyPressed_x() {
        $("option[value='LETTER']").prop("selected", true);
        $("#personalButton").trigger("click");
    }

    #processKeyPressed_z() {
        $("option[value='CHANGE_OCCUPATION']").prop("selected", true);
        $("#personalButton").trigger("click");
    }

    #processKeyPressed_Escape() {
        $("option[value='CASTLE_INN']").prop("selected", true);
        $("#castleButton").trigger("click");
    }
}

export {CastleDashboardKeyboardManager};