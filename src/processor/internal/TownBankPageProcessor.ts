import BankRecordManager from "../../core/bank/BankRecordManager";
import TownBank from "../../core/bank/TownBank";
import TownBankPage from "../../core/bank/TownBankPage";
import TownBankPageParser from "../../core/bank/TownBankPageParser";
import NpcLoader from "../../core/role/NpcLoader";
import Town from "../../core/town/Town";
import TownLoader from "../../core/town/TownLoader";
import Credential from "../../util/Credential";
import KeyboardShortcutBuilder from "../../util/KeyboardShortcutBuilder";
import MessageBoard from "../../util/MessageBoard";
import NetworkUtils from "../../util/NetworkUtils";
import PageUtils from "../../util/PageUtils";
import PocketUtils from "../../util/PocketUtils";
import PageProcessorContext from "../PageProcessorContext";
import PageProcessorCredentialSupport from "../PageProcessorCredentialSupport";

class TownBankPageProcessor extends PageProcessorCredentialSupport {

    readonly #townBankPageParser = new TownBankPageParser();

    async doProcess(credential: Credential, context?: PageProcessorContext): Promise<void> {
        const page = await this.#townBankPageParser.parse(PageUtils.currentPageHtml());
        const town = TownLoader.load(context?.get("townId"))!;

        this.#renderImmutablePage(credential, town);
        this.#renderMutablePage(credential, page, town);

        new KeyboardShortcutBuilder()
            .onEscapePressed(() => $("#returnButton").trigger("click"))
            .withDefaultPredicate()
            .bind();
    }

    #renderImmutablePage(credential: Credential, town: Town) {
        $("form").remove();

        $("table:eq(1)")
            .attr("id", "t1")
            .find("td:first")
            .attr("id", "pageTitle")
            .removeAttr("bgcolor")
            .removeAttr("width")
            .removeAttr("height")
            .css("text-align", "center")
            .css("font-size", "150%")
            .css("font-weight", "bold")
            .css("background-color", "navy")
            .css("color", "yellowgreen")
            .text("＜＜  口 袋 银 行 " + town.nameTitle + " 分 行  ＞＞");

        $("#pageTitle")
            .parent()
            .attr("id", "tr0")
            .next()
            .attr("id", "tr1")
            .find("td:first")
            .find("table:first")
            .find("tr:first")
            .find("td:first")
            .next()
            .next()
            .next()
            .find("table:first")
            .find("tr:first")
            .find("td:first")
            .find("table:first")
            .find("tr:first")
            .next()
            .next()
            .find("td:last")
            .attr("id", "roleCash");

        $("#tr1")
            .next()
            .attr("id", "tr2")
            .find("td:first")
            .find("table:first")
            .find("tr:first")
            .find("td:first")
            .attr("id", "messageBoard")
            .removeAttr("width")
            .removeAttr("bgcolor")
            .css("width", "100%")
            .css("background-color", "black")
            .css("color", "wheat")
            .next()
            .attr("id", "messageBoardManager");

        let html = "";
        html += "<tr id='tr3' style='display:none'>";
        html += "<td id='hiddenFormContainer'></td>";
        html += "</tr>";
        html += "<tr id='tr4'>";
        html += "<td style='background-color:#F8F0E0;text-align:center;width:100%'>";
        html += "<input type='button' id='refreshButton' value='刷新" + town.name + "银行'>";
        html += "<input type='button' id='returnButton' value='离开" + town.name + "银行'>";
        html += "<button role='button' id='updateButton'>更新银行资产</button>";
        html += "</td>";
        html += "</tr>";
        $("#tr2").after($(html));
        $("#hiddenFormContainer").html(PageUtils.generateReturnTownForm(credential));

        html = "";
        html += "<p id='p1'>";
        html += "<input type='button' id='depositAllButton' value='全部存入' class='dynamicButton'>";
        html += "</p>";
        html += "<p id='p2'>";
        html += "<input type='text' id='depositAmount' value='' size='3' style='text-align:right'>0000 Gold&nbsp;&nbsp;&nbsp;";
        html += "<input type='button' id='depositButton' value='金存入' class='dynamicButton'>";
        html += "</p>";
        html += "<p id='p3'>";
        html += "<input type='text' id='withdrawAmount' value='' size='3' style='text-align:right'>0000 Gold&nbsp;&nbsp;&nbsp;";
        html += "<input type='button' id='withdrawButton' value='金取出' class='dynamicButton'>";
        html += "</p>";
        $("#tr4")
            .next()
            .attr("id", "tr5")
            .find("td:first")
            .find("p:first")
            .attr("id", "p0")
            .after($(html));

        $("#p0")
            .prev()
            .find("font:first")
            .attr("id", "accountCash")
            .next()
            .attr("id", "accountSaving");

        html = "";
        html += "<tr id='tr6'>";
        html += "<td style='background-color:darkred;width:100%;text-align:center;font-weight:bold;color:aliceblue'>";
        html += "＜ 转 账 通 道 ＞";
        html += "</td>";
        html += "</tr>";
        html += "<tr id='tr7'>";
        html += "<td style='background-color:#F8F0E0;width:100%;text-align:center'>";
        html += "<input type='text' id='searchName' size='15' maxlength='20'>";
        html += "<input type='button' id='searchButton' value='找人'>";
        html += "<select id='peopleSelect'><option value=''>选择发送对象</select>";
        html += "<input type='text' id='transferAmount' value='' size='3' style='text-align:right'>0000 Gold&nbsp;&nbsp;&nbsp;";
        html += "<input type='button' id='transferButton' value='转账' class='dynamicButton'>";
        html += "</td>";
        html += "</tr>";
        $("#tr5").after($(html));

        html = "";
        html += "<tr id='tr8'>";
        html += "<td style='background-color:darkred;width:100%;text-align:center;font-weight:bold;color:aliceblue'>";
        html += "＜ 领 取 俸 禄 ＞";
        html += "</td>";
        html += "</tr>";
        html += "<tr id='tr9'>";
        html += "<td style='background-color:#F8F0E0;width:100%;text-align:center'>";
        html += "<input type='button' id='salaryButton' value='发薪' class='dynamicButton'>";
        html += "</td>";
        html += "</tr>";
        $("#tr7").after($(html));

        this.#bindImmutableButtons(credential, town);
    }

    #bindImmutableButtons(credential: Credential, town?: Town) {
        $("#refreshButton").on("click", () => {
            PageUtils.scrollIntoView("pageTitle");
            MessageBoard.resetMessageBoard("请管理您的账户吧！");
            $("#messageBoardManager").html(NpcLoader.randomNpcImageHtml());
            this.#refreshMutablePage(credential, town);
        });
        $("#returnButton").on("click", () => {
            $("#returnTown").trigger("click");
        });
        $("#updateButton").on("click", () => {
            $("#updateButton").prop("disabled", true);
            new BankRecordManager(credential)
                .updateBankRecord()
                .then(() => {
                    MessageBoard.publishMessage("银行资产已经更新。");
                    $("#updateButton").prop("disabled", false);
                    this.#refreshMutablePage(credential, town);
                });
        });
        $("#searchButton").on("click", () => {
            const s = $("#searchName").val();
            if (s === undefined || (s as string).trim() === "") {
                PageUtils.scrollIntoView("pageTitle");
                MessageBoard.publishWarning("请正确输入人名！");
                return;
            }
            const searchName = (s as string).trim();
            const request = credential.asRequestMap();
            request.set("mode", "MONEY_SEND");
            // noinspection JSDeprecatedSymbols
            request.set("serch", escape(searchName));
            NetworkUtils.post("town.cgi", request).then(html => {
                const options = $(html).find("select[name='eid']").html();
                $("#peopleSelect").html(options);
            });
        });
    }

    #renderMutablePage(credential: Credential, page: TownBankPage, town?: Town) {
        this.#bindMutableButtons(credential, page, town);
    }

    #bindMutableButtons(credential: Credential, page: TownBankPage, town?: Town) {
        $("#depositAllButton").on("click", () => {
            if (page.account!.cash! < 10000) {
                PageUtils.scrollIntoView("pageTitle");
                MessageBoard.publishWarning("没觉得你身上有啥值得存入的现金！");
                return;
            }
            new TownBank(credential, town?.id).deposit()
                .then(() => this.#refreshMutablePage(credential, town))
                .catch(() => PageUtils.scrollIntoView("pageTitle"));
        });
        $("#depositButton").on("click", () => {
            const text = $("#depositAmount").val();
            if (text === undefined || (text as string).trim() === "") {
                PageUtils.scrollIntoView("pageTitle");
                MessageBoard.publishWarning("没有输入存入的金额！");
                return;
            }
            const amount = parseInt((text as string).trim());
            if (isNaN(amount) || !Number.isInteger(amount) || amount <= 0) {
                PageUtils.scrollIntoView("pageTitle");
                MessageBoard.publishWarning("非法输入金额！");
                return;
            }
            if (amount * 10000 > page.account!.cash!) {
                PageUtils.scrollIntoView("pageTitle");
                MessageBoard.publishWarning(amount + "万！真逗，搞得你好像有这么多现金似得！");
                return;
            }
            new TownBank(credential, town?.id).deposit(amount)
                .then(() => this.#refreshMutablePage(credential, town));
        });
        $("#withdrawButton").on("click", () => {
            const text = $("#withdrawAmount").val();
            if (text === undefined || (text as string).trim() === "") {
                PageUtils.scrollIntoView("pageTitle");
                MessageBoard.publishWarning("没有输入取出的金额！");
                return;
            }
            const amount = parseInt((text as string).trim());
            if (isNaN(amount) || !Number.isInteger(amount) || amount <= 0) {
                PageUtils.scrollIntoView("pageTitle");
                MessageBoard.publishWarning("非法输入金额！");
                return;
            }
            if (amount * 10000 > page.account!.saving!) {
                PageUtils.scrollIntoView("pageTitle");
                MessageBoard.publishWarning(amount + "万！真逗，搞得你好像有这么多存款似得！");
                return;
            }
            new TownBank(credential, town?.id).withdraw(amount)
                .then(() => this.#refreshMutablePage(credential, town));
        });
        $("#transferButton").on("click", () => {
            const s = $("#peopleSelect").val();
            if (s === undefined || (s as string).trim() === "") {
                PageUtils.scrollIntoView("pageTitle");
                MessageBoard.publishWarning("没有选择转账对象！");
                return;
            }
            const text = $("#transferAmount").val();
            if (text === undefined || (text as string).trim() === "") {
                PageUtils.scrollIntoView("pageTitle");
                MessageBoard.publishWarning("没有输入取出的金额！");
                return;
            }
            const amount = parseInt((text as string).trim());
            if (isNaN(amount) || !Number.isInteger(amount) || amount <= 0) {
                PageUtils.scrollIntoView("pageTitle");
                MessageBoard.publishWarning("非法输入金额！");
                return;
            }
            if ((amount + 10) * 10000 > page.account!.total) {
                PageUtils.scrollIntoView("pageTitle");
                MessageBoard.publishWarning("很遗憾，你压根就没有这么多钱！");
                return;
            }

            const target = $("#peopleSelect").find("option:selected").text();
            if (!confirm("请您确认向" + target + "转账" + amount + "万GOLD？")) {
                return;
            }

            const delta = PocketUtils.calculateCashDifferenceAmount(page.account!.cash!, (amount + 10) * 10000);
            const bank = new TownBank(credential, town?.id);
            bank.withdraw(delta).then(() => {
                const request = credential.asRequestMap();
                request.set("gold", (amount * 10).toString());  // 送钱的接口单位是K
                request.set("eid", (s as string).trim());
                request.set("mode", "MONEY_SEND2");
                NetworkUtils.post("town.cgi", request).then(html => {
                    MessageBoard.processResponseMessage(html);
                    bank.deposit()
                        .then(() => this.#refreshMutablePage(credential, town));
                });
            });
        });
        $("#salaryButton").on("click", () => {
            const request = credential.asRequestMap();
            request.set("mode", "SALARY");
            if (town !== undefined) {
                request.set("town", town.id);
            }
            NetworkUtils.post("mydata.cgi", request).then(html => {
                MessageBoard.processResponseMessage(html);
                if (html.includes("下次领取俸禄还需要等待")) {
                    PageUtils.scrollIntoView("pageTitle");
                    return;
                }
                new TownBank(credential, town?.id).deposit().then(() => {
                    this.#refreshMutablePage(credential, town);
                });
            });
        });
    }

    #refreshMutablePage(credential: Credential, town?: Town) {
        new TownBank(credential, town?.id).open().then(page => {
            $("#roleCash").text(page.role!.cash + " GOLD");
            $("#accountCash").text(page.account!.cash!.toString());
            $("#accountSaving").text(page.account!.saving!.toString());
            $("#depositAmount").val("");
            $("#withdrawAmount").val("");
            $("#transferAmount").val("");
            $(".dynamicButton").off("click");
            $("#tr10").hide();
            this.#renderMutablePage(credential, page, town);
        });
    }
}

export = TownBankPageProcessor;