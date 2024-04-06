import CredentialLocationModeSupport from "../core/location/CredentialLocationModeSupport";
import Credential from "../util/Credential";
import LocationModeCastle from "../core/location/LocationModeCastle";
import LocationModeTown from "../core/location/LocationModeTown";
import PersonalSpellPage from "../core/career/PersonalSpellPage";
import PersonalSpell from "../core/career/PersonalSpell";
import Role from "../core/role/Role";
import StringUtils from "../util/StringUtils";
import MessageBoard from "../util/MessageBoard";

class SpellManagerComponent extends CredentialLocationModeSupport {

    constructor(credential: Credential, locationMode: LocationModeCastle | LocationModeTown) {
        super(credential, locationMode);
    }

    onRefresh?: () => void;
    spellPage?: PersonalSpellPage;

    generateHTML(): string {
        let html = "";
        html += "<table style='width:100%;text-align:center;margin:auto;border-width:0'>";
        html += "<tbody id='_pocket_spellTable'>";
        html += "<tr style='background-color:skyblue'>";
        html += "<th>设置</th>";
        html += "<th>使用</th>";
        html += "<th>技能</th>";
        html += "<th>威力</th>";
        html += "<th>确率</th>";
        html += "<th>ＰＰ</th>";
        html += "<th>评分</th>";
        html += "</tr>";
        html += "</toby>";
        html += "</table>";
        return html;
    }

    bindButtons() {
    }

    async reload() {
        this.spellPage = await new PersonalSpell(this.credential, this.townId).open();
    }

    async render(external?: Role) {
        const role = await this.reInitializeRole(
            external,
            role => role.spell !== undefined
        );
        $(".C_pocket_spellButton").off("click");
        $(".C_pocket_spell").remove();

        for (const spell of this.spellPage!.spellList!) {
            const usingSpell = spell.name === role.spell;
            let html = "";
            html += "<tr class='C_pocket_spell' id='_pocket_spell_" + spell.id + "'>";
            html += "<td style='background-color:#E8E8D0'>";
            if (usingSpell) {
                html += "<button role='button' disabled>设置</button>";
            } else {
                html += "<button role='button' class='C_pocket_spellButton C_pocket_setSpellButton' " +
                    "id='_pocket_setSpell_" + spell.id + "'>设置</button>";
            }
            html += "</td>";
            html += "<td style='background-color:#E8E8D0'>" + (usingSpell ? "★" : "") + "</td>";
            if (usingSpell) {
                html += "<td style='background-color:#E8E8D0;color:blue;font-weight:bold'>" + spell.name + "</td>";
            } else {
                html += "<td style='background-color:#E8E8D0'>" + spell.name + "</td>";
            }
            html += "<td style='background-color:#E8E8D0'>" + spell.power + "</td>";
            html += "<td style='background-color:#E8E8D0'>" + spell.accuracy + "</td>";
            html += "<td style='background-color:#E8E8D0'>" + spell.pp + "</td>";
            html += "<td style='background-color:#E8E8D0'>" + spell.score + "</td>";
            html += "</tr>";
            $("#_pocket_spellTable").append($(html));
        }

        $(".C_pocket_setSpellButton")
            .on("click", event => {
                const btnId = $(event.target).attr("id") as string;
                const spellId = StringUtils.substringAfterLast(btnId, "_");
                const spell = this.spellPage!.findBySpellId(spellId);
                if (spell === null) return;
                new PersonalSpell(this.credential).set(spellId).then(() => {
                    MessageBoard.publishMessage("技能设置为：" + spell.name);
                    (this.onRefresh) && (this.onRefresh());
                });
            });
    }

}

export = SpellManagerComponent;