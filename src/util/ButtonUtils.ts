import PageUtils from "./PageUtils";
import SetupLoader from "../core/config/SetupLoader";

class ButtonUtils {

    static loadButtonStyle(code: number) {
        const key = code.toString();
        // @ts-ignore
        if (BUTTON_STYLES[key] !== undefined) {
            let s = $("style[type='text/css']").html();
            s = s.replace("-->", "\n");
            // @ts-ignore
            s += BUTTON_STYLES[key];
            s += "-->";
            $("style[type='text/css']").html(s);
        }
    }

    static clickBlueButtons(buttons: JQuery, exclude?: string) {
        buttons
            .filter((_idx, btn) => {
                const btnId = $(btn).attr("id") as string;
                return exclude === undefined || exclude !== btnId;
            })
            .filter((_idx, btn) => {
                const btnId = $(btn).attr("id") as string;
                return PageUtils.isColorBlue(btnId);
            })
            .each((_idx, btn) => {
                const btnId = $(btn).attr("id") as string;
                PageUtils.triggerClick(btnId);
            });
    }

    static createTitle(title: string, key?: string): string {
        if (key === undefined || key === "") {
            return title;
        }
        if (SetupLoader.isShortcutPromptHidden()) {
            return title;
        }
        return title + "(" + key + ")";
    }
}

const BUTTON_STYLES: {} = {
    "10005": ".button-10005 {\n" +
        "  align-items: center;\n" +
        "  background-clip: padding-box;\n" +
        "  background-color: #fa6400;\n" +
        "  border: 1px solid transparent;\n" +
        "  border-radius: .25rem;\n" +
        "  box-shadow: rgba(0, 0, 0, 0.02) 0 1px 3px 0;\n" +
        "  box-sizing: border-box;\n" +
        "  color: #fff;\n" +
        "  cursor: pointer;\n" +
        "  display: inline-flex;\n" +
        "  font-size: 100%;\n" +
        "  font-weight: 600;\n" +
        "  justify-content: center;\n" +
        "  line-height: 1.25;\n" +
        "  margin: 0;\n" +
        "  min-height: 0;\n" +
        "  padding: 2px 2px;\n" +
        "  position: relative;\n" +
        "  text-decoration: none;\n" +
        "  transition: all 250ms;\n" +
        "  user-select: none;\n" +
        "  -webkit-user-select: none;\n" +
        "  touch-action: manipulation;\n" +
        "  vertical-align: baseline;\n" +
        "  /* width: 100%;\n */" +
        "}\n" +
        "\n" +
        ".button-10005:hover,\n" +
        ".button-10005:focus {\n" +
        "  background-color: #fb8332;\n" +
        "  box-shadow: rgba(0, 0, 0, 0.1) 0 4px 12px;\n" +
        "}\n" +
        "\n" +
        ".button-10005:hover {\n" +
        "  transform: translateY(-1px);\n" +
        "}\n" +
        "\n" +
        ".button-10005:active {\n" +
        "  background-color: #c85000;\n" +
        "  box-shadow: rgba(0, 0, 0, .06) 0 2px 4px;\n" +
        "  transform: translateY(0);\n" +
        "}\n",
    "10007": ".button-10007 {\n" +
        "  background-color: #0095ff;\n" +
        "  border: 1px solid transparent;\n" +
        "  border-radius: 3px;\n" +
        "  box-shadow: rgba(255, 255, 255, .4) 0 1px 0 0 inset;\n" +
        "  box-sizing: border-box;\n" +
        "  color: #fff;\n" +
        "  cursor: pointer;\n" +
        "  display: inline-block;\n" +
        "  font-size: 100%;\n" +
        "  font-weight: 400;\n" +
        "  line-height: 1.15385;\n" +
        "  margin: 0;\n" +
        "  outline: none;\n" +
        "  padding: 2px 2px;\n" +
        "  position: relative;\n" +
        "  text-align: center;\n" +
        "  text-decoration: none;\n" +
        "  user-select: none;\n" +
        "  -webkit-user-select: none;\n" +
        "  touch-action: manipulation;\n" +
        "  vertical-align: baseline;\n" +
        "  white-space: nowrap;\n" +
        "  /* width: 100%;\n */" +
        "}\n" +
        "\n" +
        ".button-10007:hover,\n" +
        ".button-10007:focus {\n" +
        "  background-color: #07c;\n" +
        "}\n" +
        "\n" +
        ".button-10007:focus {\n" +
        "  box-shadow: 0 0 0 4px rgba(0, 149, 255, .15);\n" +
        "}\n" +
        "\n" +
        ".button-10007:active {\n" +
        "  background-color: #0064bd;\n" +
        "  box-shadow: none;\n" +
        "}\n",
    "10008": ".button-10008 {\n" +
        "  background-color: #e1ecf4;\n" +
        "  border-radius: 3px;\n" +
        "  border: 1px solid #7aa7c7;\n" +
        "  box-shadow: rgba(255, 255, 255, .7) 0 1px 0 0 inset;\n" +
        "  box-sizing: border-box;\n" +
        "  color: #39739d;\n" +
        "  cursor: pointer;\n" +
        "  display: inline-block;\n" +
        "  font-size: 100%;\n" +
        "  font-weight: 400;\n" +
        "  line-height: 1.15385;\n" +
        "  margin: 0;\n" +
        "  outline: none;\n" +
        "  padding: 2px 2px;\n" +
        "  position: relative;\n" +
        "  text-align: center;\n" +
        "  text-decoration: none;\n" +
        "  user-select: none;\n" +
        "  -webkit-user-select: none;\n" +
        "  touch-action: manipulation;\n" +
        "  vertical-align: baseline;\n" +
        "  white-space: nowrap;\n" +
        "  /* width: 100%;\n */" +
        "}\n" +
        "\n" +
        ".button-10008:hover,\n" +
        ".button-10008:focus {\n" +
        "  background-color: #b3d3ea;\n" +
        "  color: #2c5777;\n" +
        "}\n" +
        "\n" +
        ".button-10008:focus {\n" +
        "  box-shadow: 0 0 0 4px rgba(0, 149, 255, .15);\n" +
        "}\n" +
        "\n" +
        ".button-10008:active {\n" +
        "  background-color: #a0c7e4;\n" +
        "  box-shadow: none;\n" +
        "  color: #2c5777;\n" +
        "}\n",
    "10016": ".button-10016 {\n" +
        "  background-color: #f8f9fa;\n" +
        "  border: 1px solid #f8f9fa;\n" +
        "  border-radius: 4px;\n" +
        "  color: #3c4043;\n" +
        "  cursor: pointer;\n" +
        "  font-size: 100%;\n" +
        "  /* height: 36px;\n */" +
        "  /* line-height: 27px;\n */" +
        "  min-width: 0px;\n" +
        "  padding: 2px 2px;\n */" +
        "  min-width: 0px;\n" +
        "  padding: 2px 2px;\n" +
        "  text-align: center;\n" +
        "  user-select: none;\n" +
        "  -webkit-user-select: none;\n" +
        "  touch-action: manipulation;\n" +
        "  white-space: pre;\n" +
        "  /* width: 100%;\n */" +
        "}\n" +
        "\n" +
        ".button-10016:hover {\n" +
        "  border-color: #dadce0;\n" +
        "  box-shadow: rgba(0, 0, 0, .1) 0 1px 1px;\n" +
        "  color: #202124;\n" +
        "}\n" +
        "\n" +
        ".button-10016:focus {\n" +
        "  border-color: #4285f4;\n" +
        "  outline: none;\n" +
        "}\n",
    "10024": ".button-10024 {\n" +
        "  background: #FF4742;\n" +
        "  border: 1px solid #FF4742;\n" +
        "  border-radius: 6px;\n" +
        "  box-shadow: rgba(0, 0, 0, 0.1) 1px 2px 4px;\n" +
        "  box-sizing: border-box;\n" +
        "  color: #FFFFFF;\n" +
        "  cursor: pointer;\n" +
        "  display: inline-block;\n" +
        "  font-size: 100%;\n" +
        "  font-weight: 800;\n" +
        "  /* line-height: 16px;\n */" +
        "  min-height: 0px;\n" +
        "  outline: 0;\n" +
        "  padding: 2px 2px;\n" +
        "  text-align: center;\n" +
        "  text-rendering: geometricprecision;\n" +
        "  text-transform: none;\n" +
        "  user-select: none;\n" +
        "  -webkit-user-select: none;\n" +
        "  touch-action: manipulation;\n" +
        "  vertical-align: middle;\n" +
        "  /* width: 100%;\n */" +
        "}\n" +
        "\n" +
        ".button-10024:hover,\n" +
        ".button-10024:active {\n" +
        "  background-color: initial;\n" +
        "  background-position: 0 0;\n" +
        "  color: #FF4742;\n" +
        "}\n" +
        "\n" +
        ".button-10024:active {\n" +
        "  opacity: .5;\n" +
        "}\n",
    "10028": ".button-10028 {\n" +
        "  appearance: none;\n" +
        "  background-color: transparent;\n" +
        "  border: 2px solid #1A1A1A;\n" +
        "  border-radius: 15px;\n" +
        "  box-sizing: border-box;\n" +
        "  color: #3B3B3B;\n" +
        "  cursor: pointer;\n" +
        "  display: inline-block;\n" +
        "  font-size: 100%;\n" +
        "  font-weight: 600;\n" +
        "  line-height: normal;\n" +
        "  margin: 0;\n" +
        "  min-height: 0;\n" +
        "  min-width: 0;\n" +
        "  outline: none;\n" +
        "  padding: 2px 2px;\n" +
        "  text-align: center;\n" +
        "  text-decoration: none;\n" +
        "  transition: all 300ms cubic-bezier(.23, 1, 0.32, 1);\n" +
        "  user-select: none;\n" +
        "  -webkit-user-select: none;\n" +
        "  touch-action: manipulation;\n" +
        "  /* width: 100%;\n */" +
        "  will-change: transform;\n" +
        "}\n" +
        "\n" +
        ".button-10028:disabled {\n" +
        "  pointer-events: none;\n" +
        "}\n" +
        "\n" +
        ".button-10028:hover {\n" +
        "  color: #fff;\n" +
        "  background-color: #1A1A1A;\n" +
        "  box-shadow: rgba(0, 0, 0, 0.25) 0 8px 15px;\n" +
        "  transform: translateY(-2px);\n" +
        "}\n" +
        "\n" +
        ".button-10028:active {\n" +
        "  box-shadow: none;\n" +
        "  transform: translateY(0);\n" +
        "}\n",
    "10032": ".button-10032 {\n" +
        "  background-color: #fff000;\n" +
        "  border-radius: 12px;\n" +
        "  color: #000;\n" +
        "  cursor: pointer;\n" +
        "  font-weight: bold;\n" +
        "  padding: 2px 2px;\n" +
        "  text-align: center;\n" +
        "  transition: 200ms;\n" +
        "  /* width: 100%;\n */" +
        "  box-sizing: border-box;\n" +
        "  border: 0;\n" +
        "  font-size: 100%;\n" +
        "  user-select: none;\n" +
        "  -webkit-user-select: none;\n" +
        "  touch-action: manipulation;\n" +
        "}\n" +
        "\n" +
        ".button-10032:not(:disabled):hover,\n" +
        ".button-10032:not(:disabled):focus {\n" +
        "  outline: 0;\n" +
        "  background: #f4e603;\n" +
        "  box-shadow: 0 0 0 2px rgba(0,0,0,.2), 0 3px 8px 0 rgba(0,0,0,.15);\n" +
        "}\n" +
        "\n" +
        ".button-10032:disabled {\n" +
        "  filter: saturate(0.2) opacity(0.5);\n" +
        "  -webkit-filter: saturate(0.2) opacity(0.5);\n" +
        "  cursor: not-allowed;\n" +
        "}\n",
    "10033": ".button-10033 {\n" +
        "  background-color: #c2fbd7;\n" +
        "  border-radius: 12px;\n" +
        "  box-shadow: rgba(44, 187, 99, .2) 0 -25px 18px -14px inset,rgba(44, 187, 99, .15) 0 1px 2px,rgba(44, 187, 99, .15) 0 2px 4px,rgba(44, 187, 99, .15) 0 4px 8px,rgba(44, 187, 99, .15) 0 8px 16px,rgba(44, 187, 99, .15) 0 16px 32px;\n" +
        "  color: green;\n" +
        "  cursor: pointer;\n" +
        "  display: inline-block;\n" +
        "  padding: 2px 2px;\n" +
        "  text-align: center;\n" +
        "  text-decoration: none;\n" +
        "  transition: all 250ms;\n" +
        "  border: 0;\n" +
        "  font-size: 16px;\n" +
        "  user-select: none;\n" +
        "  -webkit-user-select: none;\n" +
        "  touch-action: manipulation;\n" +
        "  /* width: 100%;\n */" +
        "}\n" +
        "\n" +
        ".button-10033:hover {\n" +
        "  box-shadow: rgba(44,187,99,.35) 0 -25px 18px -14px inset,rgba(44,187,99,.25) 0 1px 2px,rgba(44,187,99,.25) 0 2px 4px,rgba(44,187,99,.25) 0 4px 8px,rgba(44,187,99,.25) 0 8px 16px,rgba(44,187,99,.25) 0 16px 32px;\n" +
        "  transform: scale(1.05) rotate(-1deg);\n" +
        "}\n",
    "10035": ".button-10035 {\n" +
        "  align-items: center;\n" +
        "  background-color: #fff;\n" +
        "  border-radius: 12px;\n" +
        "  box-shadow: transparent 0 0 0 3px,rgba(18, 18, 18, .1) 0 6px 20px;\n" +
        "  box-sizing: border-box;\n" +
        "  color: #121212;\n" +
        "  cursor: pointer;\n" +
        "  display: inline-flex;\n" +
        "  flex: 1 1 auto;\n" +
        "  font-size: 100%;\n" +
        "  font-weight: 700;\n" +
        "  justify-content: center;\n" +
        "  line-height: 1;\n" +
        "  margin: 0;\n" +
        "  outline: none;\n" +
        "  padding: 2px 2px;\n" +
        "  text-align: center;\n" +
        "  text-decoration: none;\n" +
        "  transition: box-shadow .2s,-webkit-box-shadow .2s;\n" +
        "  white-space: nowrap;\n" +
        "  border: 0;\n" +
        "  user-select: none;\n" +
        "  -webkit-user-select: none;\n" +
        "  touch-action: manipulation;\n" +
        "  /* width: 100%;\n */" +
        "}\n" +
        "\n" +
        ".button-10035:hover {\n" +
        "  box-shadow: #121212 0 0 0 3px, transparent 0 0 0 0;\n" +
        "}\n",
    "10062": ".button-10062 {\n" +
        "  background: linear-gradient(to bottom right, #EF4765, #FF9A5A);\n" +
        "  border: 0;\n" +
        "  border-radius: 12px;\n" +
        "  color: #FFFFFF;\n" +
        "  cursor: pointer;\n" +
        "  display: inline-block;\n" +
        "  font-size: 100%;\n" +
        "  font-weight: 500;\n" +
        "  /* line-height: 2.5;\n */" +
        "  outline: transparent;\n" +
        "  padding: 2px 2px;\n" +
        "  text-align: center;\n" +
        "  text-decoration: none;\n" +
        "  transition: box-shadow .2s ease-in-out;\n" +
        "  user-select: none;\n" +
        "  -webkit-user-select: none;\n" +
        "  touch-action: manipulation;\n" +
        "  white-space: nowrap;\n" +
        "  /* width: 100%;\n */" +
        "}\n" +
        "\n" +
        ".button-10062:not([disabled]):focus {\n" +
        "  box-shadow: 0 0 .25rem rgba(0, 0, 0, 0.5), -.125rem -.125rem 1rem rgba(239, 71, 101, 0.5), .125rem .125rem 1rem rgba(255, 154, 90, 0.5);\n" +
        "}\n" +
        "\n" +
        ".button-10062:not([disabled]):hover {\n" +
        "  box-shadow: 0 0 .25rem rgba(0, 0, 0, 0.5), -.125rem -.125rem 1rem rgba(239, 71, 101, 0.5), .125rem .125rem 1rem rgba(255, 154, 90, 0.5);\n" +
        "}\n",
    "10132": ".button-10132 {\n" +
        "  background-color: #f8f0e0;\n" +
        "  border-radius: 4px;\n" +
        "  color: #000;\n" +
        "  cursor: pointer;\n" +
        "  font-weight: bold;\n" +
        "  padding: 2px 2px;\n" +
        "  text-align: center;\n" +
        "  transition: 200ms;\n" +
        "  /* width: 100%;\n */" +
        "  box-sizing: border-box;\n" +
        "  border: 0;\n" +
        "  font-size: 100%;\n" +
        "  user-select: none;\n" +
        "  -webkit-user-select: none;\n" +
        "  touch-action: manipulation;\n" +
        "}\n" +
        "\n" +
        ".button-10132:not(:disabled):hover,\n" +
        ".button-10132:not(:disabled):focus {\n" +
        "  outline: 0;\n" +
        "  background: #e8e8d0;\n" +
        "  box-shadow: 0 0 0 2px rgba(0,0,0,.2), 0 3px 8px 0 rgba(0,0,0,.15);\n" +
        "}\n" +
        "\n" +
        ".button-10132:disabled {\n" +
        "  filter: saturate(0.2) opacity(0.5);\n" +
        "  -webkit-filter: saturate(0.2) opacity(0.5);\n" +
        "  cursor: not-allowed;\n" +
        "}\n",
};

export = ButtonUtils;