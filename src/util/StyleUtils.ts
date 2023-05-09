class StyleUtils {

    static appendCSS() {
        let s = $("style[type='text/css']").html();
        s = s.replace("-->", "\n");
        s += b8;
        s += "-->";
        $("style[type='text/css']").html(s);
    }

}

const b8 = ".button-8 {\n" +
    "  background-color: #e1ecf4;\n" +
    "  border-radius: 3px;\n" +
    "  border: 1px solid #7aa7c7;\n" +
    "  box-shadow: rgba(255, 255, 255, .7) 0 1px 0 0 inset;\n" +
    "  box-sizing: border-box;\n" +
    "  color: #39739d;\n" +
    "  cursor: pointer;\n" +
    "  display: inline-block;\n" +
    "  /*font-family: -apple-system,system-ui,\"Segoe UI\",\"Liberation Sans\",sans-serif;\n */" +
    "  font-size: 13px;\n" +
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
    "}\n";

const b33 = ".button-33 {\n" +
    "  background-color: #c2fbd7;\n" +
    "  border-radius: 100px;\n" +
    "  box-shadow: rgba(44, 187, 99, .2) 0 -25px 18px -14px inset,rgba(44, 187, 99, .15) 0 1px 2px,rgba(44, 187, 99, .15) 0 2px 4px,rgba(44, 187, 99, .15) 0 4px 8px,rgba(44, 187, 99, .15) 0 8px 16px,rgba(44, 187, 99, .15) 0 16px 32px;\n" +
    "  color: green;\n" +
    "  cursor: pointer;\n" +
    "  display: inline-block;\n" +
    "  font-family: KaiTi,STSong,FangSong,CerebriSans-Regular,-apple-system,system-ui,Roboto,sans-serif;\n" +
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
    "}\n";

const b45 = ".button-45 {\n" +
    "  align-items: center;\n" +
    "  background-color: #FFE7E7;\n" +
    "  background-position: 0 0;\n" +
    "  border: 1px solid #FEE0E0;\n" +
    "  border-radius: 11px;\n" +
    "  box-sizing: border-box;\n" +
    "  color: #D33A2C;\n" +
    "  cursor: pointer;\n" +
    "  display: flex;\n" +
    "  font-size: 1rem;\n" +
    "  font-weight: 700;\n" +
    "  line-height: 33.4929px;\n" +
    "  list-style: outside url(https://www.smashingmagazine.com/images/bullet.svg) none;\n" +
    "  padding: 2px 12px;\n" +
    "  text-align: left;\n" +
    "  text-decoration: none;\n" +
    "  text-shadow: none;\n" +
    "  text-underline-offset: 1px;\n" +
    "  transition: border .2s ease-in-out,box-shadow .2s ease-in-out;\n" +
    "  user-select: none;\n" +
    "  -webkit-user-select: none;\n" +
    "  touch-action: manipulation;\n" +
    "  white-space: nowrap;\n" +
    "  word-break: break-word;\n" +
    "}\n" +
    "\n" +
    ".button-45:active,\n" +
    ".button-45:hover,\n" +
    ".button-45:focus {\n" +
    "  outline: 0;\n" +
    "}\n" +
    "\n" +
    "\n" +
    ".button-45:active {\n" +
    "  background-color: #D33A2C;\n" +
    "  box-shadow: rgba(0, 0, 0, 0.12) 0 1px 3px 0 inset;\n" +
    "  color: #FFFFFF;\n" +
    "}\n" +
    "\n" +
    ".button-45:hover {\n" +
    "  background-color: #FFE3E3;\n" +
    "  border-color: #FAA4A4;\n" +
    "}\n" +
    "\n" +
    ".button-45:active:hover,\n" +
    ".button-45:focus:hover,\n" +
    ".button-45:focus {\n" +
    "  background-color: #D33A2C;\n" +
    "  box-shadow: rgba(0, 0, 0, 0.12) 0 1px 3px 0 inset;\n" +
    "  color: #FFFFFF;\n" +
    "}\n";

const b56 = ".button-56 {\n" +
    "  align-items: center;\n" +
    "  background-color: #fee6e3;\n" +
    "  border: 2px solid #111;\n" +
    "  border-radius: 8px;\n" +
    "  box-sizing: border-box;\n" +
    "  color: #111;\n" +
    "  cursor: pointer;\n" +
    "  display: flex;\n" +
    "  font-family: Inter,sans-serif;\n" +
    "  font-size: 16px;\n" +
    "  height: 48px;\n" +
    "  justify-content: center;\n" +
    "  line-height: 24px;\n" +
    "  max-width: 100%;\n" +
    "  padding: 0 25px;\n" +
    "  position: relative;\n" +
    "  text-align: center;\n" +
    "  text-decoration: none;\n" +
    "  user-select: none;\n" +
    "  -webkit-user-select: none;\n" +
    "  touch-action: manipulation;\n" +
    "}\n" +
    "\n" +
    ".button-56:after {\n" +
    "  background-color: #111;\n" +
    "  border-radius: 8px;\n" +
    "  content: \"\";\n" +
    "  display: block;\n" +
    "  height: 48px;\n" +
    "  left: 0;\n" +
    "  width: 100%;\n" +
    "  position: absolute;\n" +
    "  top: -2px;\n" +
    "  transform: translate(8px, 8px);\n" +
    "  transition: transform .2s ease-out;\n" +
    "  z-index: -1;\n" +
    "}\n" +
    "\n" +
    ".button-56:hover:after {\n" +
    "  transform: translate(0, 0);\n" +
    "}\n" +
    "\n" +
    ".button-56:active {\n" +
    "  background-color: #ffdeda;\n" +
    "  outline: 0;\n" +
    "}\n" +
    "\n" +
    ".button-56:hover {\n" +
    "  outline: 0;\n" +
    "}\n" +
    "\n" +
    "@media (min-width: 768px) {\n" +
    "  .button-56 {\n" +
    "    padding: 0 40px;\n" +
    "  }\n" +
    "}\n";

export = StyleUtils;