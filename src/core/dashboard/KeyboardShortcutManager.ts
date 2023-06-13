class KeyboardShortcutManager {

    bind() {
        _mode2();
    }

}

function _mode1() {
    let formBattle = $("form[action='battle.cgi']");
    let selectBattle = formBattle.find('select[name="level"]');
    let inputDigits = '';
    $(document).off('keydown.city').on('keydown.city', function (e) {
        if ($("#messageInputText:focus").length > 0) {
            // 当前的焦点在消息框，禁用按键辅助
            return;
        }
        const key = e.key;
        if (key !== undefined && !isNaN(parseInt(key))) {
            inputDigits += key;
        }
        if (inputDigits.length === 2) {
            switch (inputDigits) {
                case '11':
                    selectBattle.find('option').eq(0).prop('selected', true);
                    break;
                case '22':
                    selectBattle.find('option').eq(1).prop('selected', true);
                    break;
                default:
                    inputDigits = '';
                    break;
            }
            $("#battleButton").trigger("focus");
            // 重置 inputDigits
            inputDigits = '';
        }
    });
}

function _mode2() {
    let formBattle = $("form[action='battle.cgi']");
    let selectBattle = formBattle.find('select[name="level"]');
    let buffer = "";
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

        if (key !== "q") {
            buffer = "";
            return;
        }

        buffer += "q";
        if (buffer.length < 2) {
            $("#battleButton").trigger("blur");
            return;
        }
        if (buffer.length === 2) {
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
                return;
            }

            // 在option中切换
            optionIdx = optionIdx === 0 ? 1 : 0;
            $(selectBattle).find("> option:eq(" + optionIdx + ")")
                .prop("selected", true);
            $("#battleButton").trigger("focus");

            // $(selectBattle).find("option")
            //     .each((idx, option) => {
            //         if (!$(option).prop("selected")) {
            //             $(option).prop("selected", true);
            //             $("#battleButton").trigger("focus");
            //         }
            //     });
        }
    });
}

export = KeyboardShortcutManager;