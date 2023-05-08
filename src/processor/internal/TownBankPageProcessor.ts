import TownLoader from "../../core/TownLoader";
import Town from "../../pocket/Town";
import TownBank from "../../pocketrose/TownBank";
import Credential from "../../util/Credential";
import PageUtils from "../../util/PageUtils";
import PageProcessorContext from "../PageProcessorContext";
import PageProcessorSupport from "../PageProcessorSupport";

class TownBankPageProcessor extends PageProcessorSupport {

    doProcess(credential: Credential, context?: PageProcessorContext): void {
        const page = TownBank.parsePage(PageUtils.currentPageHtml());
        const town = TownLoader.getTownById(context!.get("townId")!)!;

        this.#renderImmutablePage(credential, town);
        this.#bindImmutableButtons(credential);
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
    }

    #bindImmutableButtons(credential: Credential) {
    }
}

export = TownBankPageProcessor;