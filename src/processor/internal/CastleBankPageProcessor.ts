import BankAccount from "../../core/bank/BankAccount";
import CastleBank from "../../core/bank/CastleBank";
import CastleBankPage from "../../core/bank/CastleBankPage";
import NpcLoader from "../../core/role/NpcLoader";
import Credential from "../../util/Credential";
import MessageBoard from "../../util/MessageBoard";
import NetworkUtils from "../../util/NetworkUtils";
import PageUtils from "../../util/PageUtils";
import PocketUtils from "../../util/PocketUtils";
import StringUtils from "../../util/StringUtils";
import PageProcessorContext from "../PageProcessorContext";
import PageProcessorCredentialSupport from "../PageProcessorCredentialSupport";

class CastleBankPageProcessor extends PageProcessorCredentialSupport {

    async doProcess(credential: Credential, context?: PageProcessorContext): Promise<void> {
        const page = CastleBank.parsePage(PageUtils.currentPageHtml());
        const castleName = context!.get("castleName")!;
        this.#createImmutablePage(credential, castleName);
        this.#renderMutablePage(credential, page);
        PageUtils.onEscapePressed(() => $("#returnButton").trigger("click"));
    }

    #createImmutablePage(credential: Credential, castleName: string) {
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
            .text("＜＜  城 堡 银 行 " + StringUtils.toTitleString(castleName) + " 支 行  ＞＞");

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
        html += "<input type='button' id='refreshButton' value='刷新" + castleName + "银行'>";
        html += "<input type='button' id='returnButton' value='离开" + castleName + "银行'>";
        html += "</td>";
        html += "</tr>";
        $("#tr2").after($(html));
        $("#hiddenFormContainer").html(PageUtils.generateReturnCastleForm(credential));

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

        // Bind immutable buttons
        $("#refreshButton").on("click", () => {
            MessageBoard.resetMessageBoard("请管理您的账户吧！");
            $("#messageBoardManager").html(NpcLoader.randomNpcImageHtml);
            this.#refresh(credential);
        });
        $("#returnButton").on("click", () => {
            $("#returnCastle").trigger("click");
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
            request.set("mode", "CASTLE_SENDMONEY");
            // noinspection JSDeprecatedSymbols
            request.set("serch", escape(searchName));
            NetworkUtils.post("castle.cgi", request).then(html => {
                const options = $(html).find("select[name='eid']").html();
                $("#peopleSelect").html(options);
            });
        });
    }

    #renderMutablePage(credential: Credential, page: CastleBankPage) {
        this.#bindDepositAllButton(credential, page.account!);
        this.#bindDepositButton(credential, page.account!);
        this.#bindWithdrawButton(credential, page.account!);
        this.#bindTransferButton(credential, page.account!);

        $("#salaryButton").on("click", () => {
            const request = credential.asRequestMap();
            request.set("mode", "SALARY");
            NetworkUtils.post("mydata.cgi", request).then(html => {
                MessageBoard.processResponseMessage(html);
                if (html.includes("下次领取俸禄还需要等待")) {
                    PageUtils.scrollIntoView("pageTitle");
                    return;
                }
                new CastleBank(credential).deposit().then(() => {
                    this.#refresh(credential);
                });
            });
        });
    }

    #refresh(credential: Credential) {
        PageUtils.scrollIntoView("pageTitle");
        new CastleBank(credential).open().then(page => {
            $("#roleCash").text(page.role!.cash + " GOLD");
            $("#accountCash").text(page.account!.cash!.toString());
            $("#accountSaving").text(page.account!.saving!.toString());
            $("#depositAmount").val("");
            $("#withdrawAmount").val("");
            $("#transferAmount").val("");
            $(".dynamicButton").off("click");
            this.#renderMutablePage(credential, page);
        });
    }

    #bindDepositAllButton(credential: Credential, account: BankAccount) {
        $("#depositAllButton").on("click", () => {
            if (account.cash! < 10000) {
                PageUtils.scrollIntoView("pageTitle");
                MessageBoard.publishWarning("没觉得你身上有啥值得存入的现金！");
                return;
            }
            new CastleBank(credential).deposit().then(() => {
                this.#refresh(credential);
            });
        });
    }

    #bindDepositButton(credential: Credential, account: BankAccount) {
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
            if (amount * 10000 > account.cash!) {
                PageUtils.scrollIntoView("pageTitle");
                MessageBoard.publishWarning(amount + "万！真逗，搞得你好像有这么多现金似得！");
                return;
            }
            new CastleBank(credential).deposit(amount).then(() => {
                this.#refresh(credential);
            });
        });
    }

    #bindWithdrawButton(credential: Credential, account: BankAccount) {
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
            if (amount * 10000 > account.saving!) {
                PageUtils.scrollIntoView("pageTitle");
                MessageBoard.publishWarning(amount + "万！真逗，搞得你好像有这么多存款似得！");
                return;
            }
            new CastleBank(credential).withdraw(amount).then(() => {
                this.#refresh(credential);
            });
        });
    }

    #bindTransferButton(credential: Credential, account: BankAccount) {
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
            if ((amount + 10) * 10000 > account.total) {
                PageUtils.scrollIntoView("pageTitle");
                MessageBoard.publishWarning("很遗憾，你压根就没有这么多钱！");
                return;
            }

            const target = $("#peopleSelect").find("option:selected").text();
            if (!confirm("请您确认向" + target + "转账" + amount + "万GOLD？")) {
                return;
            }

            const delta = PocketUtils.calculateCashDifferenceAmount(account.cash!, (amount + 10) * 10000);
            const bank = new CastleBank(credential);
            bank.withdraw(delta).then(() => {
                const request = credential.asRequestMap();
                request.set("gold", (amount * 10).toString());  // 送钱的接口单位是K
                request.set("eid", (s as string).trim());
                request.set("mode", "CASTLE_SENDMONEY2");
                NetworkUtils.post("castle.cgi", request).then(html => {
                    MessageBoard.processResponseMessage(html);
                    bank.deposit().then(() => {
                        this.#refresh(credential);
                    });
                });
            });
        });
    }
}

export = CastleBankPageProcessor;