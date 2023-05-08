import PageProcessorSupport from "../PageProcessorSupport";
import PageProcessorContext from "../PageProcessorContext";
import Credential from "../../util/Credential";
import PageUtils from "../../util/PageUtils";
import CastleBank from "../../pocketrose/CastleBank";
import StringUtils from "../../util/StringUtils";
import MessageBoard from "../../util/MessageBoard";
import NpcLoader from "../../pocket/NpcLoader";
import BankAccount from "../../common/BankAccount";
import CastleBankPage from "../../pocketrose/CastleBankPage";

class CastleBankPageProcessor extends PageProcessorSupport {

    doProcess(credential: Credential, context?: PageProcessorContext): void {
        const page = CastleBank.parsePage(PageUtils.currentPageHtml());
        const castleName = context!.get("castleName")!;

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

        this.#generateHiddenForm(credential);
        this.#bindRefreshButton(credential);
        this.#bindReturnButton();

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
        html += "<p id='p4'>";
        html += "&nbsp;&nbsp;&nbsp;";
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

        this.#load(credential, page);
    }

    #load(credential: Credential, page: CastleBankPage) {
        this.#bindDepositAllButton(credential, page.account!);
        this.#bindDepositButton(credential, page.account!);
        this.#bindWithdrawButton(credential, page.account!);
    }

    #refresh(credential: Credential) {
        PageUtils.scrollIntoView("pageTitle");
        new CastleBank(credential).open().then(page => {
            $("#roleCash").text(page.role!.cash + " GOLD");
            $("#accountCash").text(page.account!.cash!.toString());
            $("#accountSaving").text(page.account!.saving!.toString());
            $("#depositAmount").val("");
            $("#withdrawAmount").val("");
            $(".dynamicButton").off("click");
            this.#load(credential, page);
        });
    }

    #generateHiddenForm(credential: Credential) {
        const html = PageUtils.generateReturnCastleForm(credential);
        $("#hiddenFormContainer").html(html);
    }

    #bindRefreshButton(credential: Credential) {
        $("#refreshButton").on("click", () => {
            MessageBoard.resetMessageBoard("请管理您的账户吧！");
            $("#messageBoardManager").html(NpcLoader.randomNpcImageHtml);
            this.#refresh(credential);
        });
    }

    #bindReturnButton() {
        $("#returnButton").on("click", () => {
            $("#returnCastle").trigger("click");
        });
    }

    #bindDepositAllButton(credential: Credential, account: BankAccount) {
        $("#depositAllButton").on("click", () => {
            if (account.cash! < 10000) {
                PageUtils.scrollIntoView("pageTitle");
                MessageBoard.publishWarning("没觉得你身上有啥值得存入的现金！");
                return;
            }
            new CastleBank(credential).depositAll().then(() => {
                this.#refresh(credential);
            });
        });
    }

    #bindDepositButton(credential: Credential, account: BankAccount) {
        $("#depositButton").on("click", () => {
            const text = $("#depositAmount").val();
            if (text === undefined || text === "") {
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
            if (text === undefined || text === "") {
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
}

export = CastleBankPageProcessor;