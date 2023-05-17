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

}

const BUTTON_STYLES: {} = {
    "5": ".button-5 {\n" +
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
        "  min-height: 3rem;\n" +
        "  padding: calc(.875rem - 1px) calc(1.5rem - 1px);\n" +
        "  position: relative;\n" +
        "  text-decoration: none;\n" +
        "  transition: all 250ms;\n" +
        "  user-select: none;\n" +
        "  -webkit-user-select: none;\n" +
        "  touch-action: manipulation;\n" +
        "  vertical-align: baseline;\n" +
        "  width: auto;\n" +
        "}\n" +
        "\n" +
        ".button-5:hover,\n" +
        ".button-5:focus {\n" +
        "  background-color: #fb8332;\n" +
        "  box-shadow: rgba(0, 0, 0, 0.1) 0 4px 12px;\n" +
        "}\n" +
        "\n" +
        ".button-5:hover {\n" +
        "  transform: translateY(-1px);\n" +
        "}\n" +
        "\n" +
        ".button-5:active {\n" +
        "  background-color: #c85000;\n" +
        "  box-shadow: rgba(0, 0, 0, .06) 0 2px 4px;\n" +
        "  transform: translateY(0);\n" +
        "}\n",
    "7": ".button-7 {\n" +
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
        "  padding: 8px .8em;\n" +
        "  position: relative;\n" +
        "  text-align: center;\n" +
        "  text-decoration: none;\n" +
        "  user-select: none;\n" +
        "  -webkit-user-select: none;\n" +
        "  touch-action: manipulation;\n" +
        "  vertical-align: baseline;\n" +
        "  white-space: nowrap;\n" +
        "}\n" +
        "\n" +
        ".button-7:hover,\n" +
        ".button-7:focus {\n" +
        "  background-color: #07c;\n" +
        "}\n" +
        "\n" +
        ".button-7:focus {\n" +
        "  box-shadow: 0 0 0 4px rgba(0, 149, 255, .15);\n" +
        "}\n" +
        "\n" +
        ".button-7:active {\n" +
        "  background-color: #0064bd;\n" +
        "  box-shadow: none;\n" +
        "}\n",
    "8": ".button-8 {\n" +
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
        "  padding: 8px .8em;\n" +
        "  position: relative;\n" +
        "  text-align: center;\n" +
        "  text-decoration: none;\n" +
        "  user-select: none;\n" +
        "  -webkit-user-select: none;\n" +
        "  touch-action: manipulation;\n" +
        "  vertical-align: baseline;\n" +
        "  white-space: nowrap;\n" +
        "}\n" +
        "\n" +
        ".button-8:hover,\n" +
        ".button-8:focus {\n" +
        "  background-color: #b3d3ea;\n" +
        "  color: #2c5777;\n" +
        "}\n" +
        "\n" +
        ".button-8:focus {\n" +
        "  box-shadow: 0 0 0 4px rgba(0, 149, 255, .15);\n" +
        "}\n" +
        "\n" +
        ".button-8:active {\n" +
        "  background-color: #a0c7e4;\n" +
        "  box-shadow: none;\n" +
        "  color: #2c5777;\n" +
        "}\n",
    "16": ".button-16 {\n" +
        "  background-color: #f8f9fa;\n" +
        "  border: 1px solid #f8f9fa;\n" +
        "  border-radius: 4px;\n" +
        "  color: #3c4043;\n" +
        "  cursor: pointer;\n" +
        "  font-size: 100%;\n" +
        "  height: 36px;\n" +
        "  line-height: 27px;\n" +
        "  /* min-width: 54px;\n */" +
        "  /* padding: 0 16px;\n */" +
        "  min-width: 36px;\n" +
        "  padding: 0 8px;\n" +
        "  text-align: center;\n" +
        "  user-select: none;\n" +
        "  -webkit-user-select: none;\n" +
        "  touch-action: manipulation;\n" +
        "  white-space: pre;\n" +
        "}\n" +
        "\n" +
        ".button-16:hover {\n" +
        "  border-color: #dadce0;\n" +
        "  box-shadow: rgba(0, 0, 0, .1) 0 1px 1px;\n" +
        "  color: #202124;\n" +
        "}\n" +
        "\n" +
        ".button-16:focus {\n" +
        "  border-color: #4285f4;\n" +
        "  outline: none;\n" +
        "}\n",
    "24": ".button-24 {\n" +
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
        "  line-height: 16px;\n" +
        "  /* min-height: 40px;\n */" +
        "  outline: 0;\n" +
        "  /* padding: 12px 14px;\n */" +
        "  text-align: center;\n" +
        "  text-rendering: geometricprecision;\n" +
        "  text-transform: none;\n" +
        "  user-select: none;\n" +
        "  -webkit-user-select: none;\n" +
        "  touch-action: manipulation;\n" +
        "  vertical-align: middle;\n" +
        "}\n" +
        "\n" +
        ".button-24:hover,\n" +
        ".button-24:active {\n" +
        "  background-color: initial;\n" +
        "  background-position: 0 0;\n" +
        "  color: #FF4742;\n" +
        "}\n" +
        "\n" +
        ".button-24:active {\n" +
        "  opacity: .5;\n" +
        "}\n",
    "28": ".button-28 {\n" +
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
        "  min-height: 30px;\n" +
        "  min-width: 0;\n" +
        "  outline: none;\n" +
        "  padding: 8px 12px;\n" +
        "  text-align: center;\n" +
        "  text-decoration: none;\n" +
        "  transition: all 300ms cubic-bezier(.23, 1, 0.32, 1);\n" +
        "  user-select: none;\n" +
        "  -webkit-user-select: none;\n" +
        "  touch-action: manipulation;\n" +
        "  width: 100%;\n" +
        "  will-change: transform;\n" +
        "}\n" +
        "\n" +
        ".button-28:disabled {\n" +
        "  pointer-events: none;\n" +
        "}\n" +
        "\n" +
        ".button-28:hover {\n" +
        "  color: #fff;\n" +
        "  background-color: #1A1A1A;\n" +
        "  box-shadow: rgba(0, 0, 0, 0.25) 0 8px 15px;\n" +
        "  transform: translateY(-2px);\n" +
        "}\n" +
        "\n" +
        ".button-28:active {\n" +
        "  box-shadow: none;\n" +
        "  transform: translateY(0);\n" +
        "}\n",
    "32": ".button-32 {\n" +
        "  background-color: #fff000;\n" +
        "  border-radius: 12px;\n" +
        "  color: #000;\n" +
        "  cursor: pointer;\n" +
        "  font-weight: bold;\n" +
        "  padding: 10px 15px;\n" +
        "  text-align: center;\n" +
        "  transition: 200ms;\n" +
        "  width: 100%;\n" +
        "  box-sizing: border-box;\n" +
        "  border: 0;\n" +
        "  font-size: 16px;\n" +
        "  user-select: none;\n" +
        "  -webkit-user-select: none;\n" +
        "  touch-action: manipulation;\n" +
        "}\n" +
        "\n" +
        ".button-32:not(:disabled):hover,\n" +
        ".button-32:not(:disabled):focus {\n" +
        "  outline: 0;\n" +
        "  background: #f4e603;\n" +
        "  box-shadow: 0 0 0 2px rgba(0,0,0,.2), 0 3px 8px 0 rgba(0,0,0,.15);\n" +
        "}\n" +
        "\n" +
        ".button-32:disabled {\n" +
        "  filter: saturate(0.2) opacity(0.5);\n" +
        "  -webkit-filter: saturate(0.2) opacity(0.5);\n" +
        "  cursor: not-allowed;\n" +
        "}\n",
    "33": ".button-33 {\n" +
        "  background-color: #c2fbd7;\n" +
        "  border-radius: 100px;\n" +
        "  box-shadow: rgba(44, 187, 99, .2) 0 -25px 18px -14px inset,rgba(44, 187, 99, .15) 0 1px 2px,rgba(44, 187, 99, .15) 0 2px 4px,rgba(44, 187, 99, .15) 0 4px 8px,rgba(44, 187, 99, .15) 0 8px 16px,rgba(44, 187, 99, .15) 0 16px 32px;\n" +
        "  color: green;\n" +
        "  cursor: pointer;\n" +
        "  display: inline-block;\n" +
        "  padding: 7px 20px;\n" +
        "  text-align: center;\n" +
        "  text-decoration: none;\n" +
        "  transition: all 250ms;\n" +
        "  border: 0;\n" +
        "  font-size: 16px;\n" +
        "  user-select: none;\n" +
        "  -webkit-user-select: none;\n" +
        "  touch-action: manipulation;\n" +
        "}\n" +
        "\n" +
        ".button-33:hover {\n" +
        "  box-shadow: rgba(44,187,99,.35) 0 -25px 18px -14px inset,rgba(44,187,99,.25) 0 1px 2px,rgba(44,187,99,.25) 0 2px 4px,rgba(44,187,99,.25) 0 4px 8px,rgba(44,187,99,.25) 0 8px 16px,rgba(44,187,99,.25) 0 16px 32px;\n" +
        "  transform: scale(1.05) rotate(-1deg);\n" +
        "}\n",
    "35": ".button-35 {\n" +
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
        "  padding: 1rem 1.2rem;\n" +
        "  text-align: center;\n" +
        "  text-decoration: none;\n" +
        "  transition: box-shadow .2s,-webkit-box-shadow .2s;\n" +
        "  white-space: nowrap;\n" +
        "  border: 0;\n" +
        "  user-select: none;\n" +
        "  -webkit-user-select: none;\n" +
        "  touch-action: manipulation;\n" +
        "}\n" +
        "\n" +
        ".button-35:hover {\n" +
        "  box-shadow: #121212 0 0 0 3px, transparent 0 0 0 0;\n" +
        "}\n",
    "62": ".button-62 {\n" +
        "  background: linear-gradient(to bottom right, #EF4765, #FF9A5A);\n" +
        "  border: 0;\n" +
        "  border-radius: 12px;\n" +
        "  color: #FFFFFF;\n" +
        "  cursor: pointer;\n" +
        "  display: inline-block;\n" +
        "  font-size: 16px;\n" +
        "  font-weight: 500;\n" +
        "  line-height: 2.5;\n" +
        "  outline: transparent;\n" +
        "  padding: 0 1rem;\n" +
        "  text-align: center;\n" +
        "  text-decoration: none;\n" +
        "  transition: box-shadow .2s ease-in-out;\n" +
        "  user-select: none;\n" +
        "  -webkit-user-select: none;\n" +
        "  touch-action: manipulation;\n" +
        "  white-space: nowrap;\n" +
        "}\n" +
        "\n" +
        ".button-62:not([disabled]):focus {\n" +
        "  box-shadow: 0 0 .25rem rgba(0, 0, 0, 0.5), -.125rem -.125rem 1rem rgba(239, 71, 101, 0.5), .125rem .125rem 1rem rgba(255, 154, 90, 0.5);\n" +
        "}\n" +
        "\n" +
        ".button-62:not([disabled]):hover {\n" +
        "  box-shadow: 0 0 .25rem rgba(0, 0, 0, 0.5), -.125rem -.125rem 1rem rgba(239, 71, 101, 0.5), .125rem .125rem 1rem rgba(255, 154, 90, 0.5);\n" +
        "}\n",
    "89": ".button-89 {\n" +
        "  --b: 3px;   /* border thickness */\n" +
        "  --s: .45em; /* size of the corner */\n" +
        "  --color: #373B44;\n" +
        "  \n" +
        "  padding: calc(.5em + var(--s)) calc(.9em + var(--s));\n" +
        "  color: var(--color);\n" +
        "  --_p: var(--s);\n" +
        "  background:\n" +
        "    conic-gradient(from 90deg at var(--b) var(--b),#0000 90deg,var(--color) 0)\n" +
        "    var(--_p) var(--_p)/calc(100% - var(--b) - 2*var(--_p)) calc(100% - var(--b) - 2*var(--_p));\n" +
        "  transition: .3s linear, color 0s, background-color 0s;\n" +
        "  outline: var(--b) solid #0000;\n" +
        "  outline-offset: .6em;\n" +
        "  font-size: 50%;\n" +
        "\n" +
        "  border: 0;\n" +
        "\n" +
        "  user-select: none;\n" +
        "  -webkit-user-select: none;\n" +
        "  touch-action: manipulation;\n" +
        "}\n" +
        "\n" +
        ".button-89:hover,\n" +
        ".button-89:focus-visible{\n" +
        "  --_p: 0px;\n" +
        "  outline-color: var(--color);\n" +
        "  outline-offset: .05em;\n" +
        "}\n" +
        "\n" +
        ".button-89:active {\n" +
        "  background: var(--color);\n" +
        "  color: #fff;\n" +
        "}\n",
    "90": ".button-90 {\n" +
        "  color: #fff;\n" +
        "  padding: 15px 25px;\n" +
        "  border-radius: 100px;\n" +
        "  background-color: #4C43CD;\n" +
        "  background-image: radial-gradient(93% 87% at 87% 89%, rgba(0, 0, 0, 0.23) 0%, transparent 86.18%), radial-gradient(66% 87% at 26% 20%, rgba(255, 255, 255, 0.41) 0%, rgba(255, 255, 255, 0) 69.79%, rgba(255, 255, 255, 0) 100%);\n" +
        "  box-shadow: 2px 19px 31px rgba(0, 0, 0, 0.2);\n" +
        "  font-weight: bold;\n" +
        "  font-size: 16px;\n" +
        "\n" +
        "  border: 0;\n" +
        "\n" +
        "  user-select: none;\n" +
        "  -webkit-user-select: none;\n" +
        "  touch-action: manipulation;\n" +
        "\n" +
        "  cursor: pointer;\n" +
        "}\n",
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
        "  width: auto;\n" +
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
        "  line-height: 16px;\n" +
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
        "  width: 100%;\n" +
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
        "  width: 100%;\n" +
        "  box-sizing: border-box;\n" +
        "  border: 0;\n" +
        "  font-size: 16px;\n" +
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
        "  border-radius: 100px;\n" +
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
        "}\n" +
        "\n" +
        ".button-10062:not([disabled]):focus {\n" +
        "  box-shadow: 0 0 .25rem rgba(0, 0, 0, 0.5), -.125rem -.125rem 1rem rgba(239, 71, 101, 0.5), .125rem .125rem 1rem rgba(255, 154, 90, 0.5);\n" +
        "}\n" +
        "\n" +
        ".button-10062:not([disabled]):hover {\n" +
        "  box-shadow: 0 0 .25rem rgba(0, 0, 0, 0.5), -.125rem -.125rem 1rem rgba(239, 71, 101, 0.5), .125rem .125rem 1rem rgba(255, 154, 90, 0.5);\n" +
        "}\n",
};

export = ButtonUtils;