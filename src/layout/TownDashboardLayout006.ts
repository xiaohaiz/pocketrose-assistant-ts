import TownDashboardPage from "../pocketrose/TownDashboardPage";
import Credential from "../util/Credential";
import StorageUtils from "../util/StorageUtils";
import TownDashboardLayout from "./TownDashboardLayout";
import TownDashboardLayout003 from "./TownDashboardLayout003";

class TownDashboardLayout006 extends TownDashboardLayout {

    readonly #layout003: TownDashboardLayout = new TownDashboardLayout003();

    id(): number {
        return 6;
    }

    render(credential: Credential, page: TownDashboardPage): void {
        this.#layout003.render(credential, page);

        $("table:first")
            .next()
            .find("> tbody:first")
            .find("> tr:first")
            .before($("" +
                "<tr style='display:none'><td id='hidden-1'></td></tr>" +
                "<tr style='display:none'><td id='hidden-2'></td></tr>" +
                "<tr style='display:none'><td id='hidden-3'></td></tr>" +
                "<tr style='display:none'><td id='hidden-4'></td></tr>" +
                "<tr style='display:none'><td id='hidden-5'></td></tr>" +
                "<tr><td id='battlePanel' style='text-align:center'></td></tr>"));

        generateDepositForm(credential);
        generateRepairForm(credential);
        generateLodgeForm(credential);

        const lastBattle = StorageUtils.getString("_lb_" + credential.id);
        if (lastBattle !== "") {
            if (StorageUtils.getBoolean("_pa_055")) {
                const children: JQuery[] = [];
                $("#battlePanel")
                    .html(lastBattle)
                    .find("> *")
                    .each((idx, child) => {
                        const element = $(child);
                        if (element.is("p") || element.is("b")) {
                            element.hide();
                            children.push(element);
                        }
                    });
                _showReportElement(children, 0);
            } else {
                $("#battlePanel")
                    .html(lastBattle);
            }
        }
    }

}

function generateDepositForm(credential: Credential) {
    let form = "";
    // noinspection HtmlUnknownTarget
    form += "<form action='town.cgi' method='post'>";
    form += "<input type='hidden' name='id' value='" + credential.id + "'>";
    form += "<input type='hidden' name='pass' value='" + credential.pass + "'>"
    form += "<input type='hidden' name='azukeru' value='all'>";
    form += "<input type='hidden' name='mode' value='BANK_SELL'>";
    form += "<input type='submit' id='deposit'>";
    form += "</form>";
    $("#hidden-2").html(form);
}

function generateRepairForm(credential: Credential) {
    let form = "";
    // noinspection HtmlUnknownTarget
    form += "<form action='town.cgi' method='post'>";
    form += "<input type='hidden' name='id' value='" + credential.id + "'>";
    form += "<input type='hidden' name='pass' value='" + credential.pass + "'>"
    form += "<input type='hidden' name='arm_mode' value='all'>";
    form += "<input type='hidden' name='mode' value='MY_ARM2'>";
    form += "<input type='submit' id='repair'>";
    form += "</form>";
    $("#hidden-3").html(form);
}

function generateLodgeForm(credential: Credential) {
    let form = "";
    // noinspection HtmlUnknownTarget
    form += "<form action='town.cgi' method='post'>";
    form += "<input type='hidden' name='id' value='" + credential.id + "'>";
    form += "<input type='hidden' name='pass' value='" + credential.pass + "'>"
    form += "<input type='hidden' name='mode' value='RECOVERY'>";
    form += "<input type='submit' id='lodge'>";
    form += "</form>";
    $("#hidden-4").html(form);
}

function _showReportElement(children: JQuery[], index: number) {
    if (index === children.length) {
        return;
    }
    const child = children[index];
    child.show("fast", "linear", () => {
        _showReportElement(children, index + 1);
    });
}

export = TownDashboardLayout006;