import {CommonWidget} from "./support/CommonWidget";
import Credential from "../util/Credential";
import LocationModeCastle from "../core/location/LocationModeCastle";
import LocationModeTown from "../core/location/LocationModeTown";
import PocketPageRenderer from "../util/PocketPageRenderer";
import _ from "lodash";
import TeamMemberLoader from "../core/team/TeamMemberLoader";
import MessageBoard from "../util/MessageBoard";
import TownEquipmentExpressHouse from "../core/equipment/TownEquipmentExpressHouse";
import CastleEquipmentExpressHouse from "../core/equipment/CastleEquipmentExpressHouse";
import ObjectID from "bson-objectid";

class PeopleFinder extends CommonWidget {

    private readonly buttonId_reset = "_pocket_" + ObjectID().toHexString();
    private readonly selectId_teammate = "_pocket_" + ObjectID().toHexString();
    private readonly textId_target = "_pocket_" + ObjectID().toHexString();
    private readonly buttonId_search = "_pocket_" + ObjectID().toHexString();
    private readonly selectId_target = "_pocket_" + ObjectID().toHexString();

    constructor(credential: Credential, locationMode: LocationModeCastle | LocationModeTown) {
        super(credential, locationMode);
    }

    generateHTML(): string {
        let html = "";
        html += "<button role='button' id='" + this.buttonId_reset + "'>重置</button>";
        html += PocketPageRenderer.GO();
        html += "<select id='" + this.selectId_teammate + "'>";
        html += "<option value=''>选择队员</option>";
        _.forEach(TeamMemberLoader.loadTeamMembers())
            .forEach(it => {
                const memberId = it.id;
                const memberName = it.name;
                if (it.id === this.credential.id) {
                    html += "<option value='" + memberId + "' style='background-color:red'>" + memberName + "</option>"
                } else if (it.external) {
                    html += "<option value='" + memberId + "' style='background-color:yellow'>" + memberName + "</option>"
                } else {
                    html += "<option value='" + memberId + "'>" + memberName + "</option>";
                }
            });
        html += "</select>";
        html += PocketPageRenderer.OR();

        html += "<input type='text' id='" + this.textId_target + "' size='15' maxlength='20' spellcheck='false'>";
        html += "<button role='button' id='" + this.buttonId_search + "'>找人</button>";
        html += "<select id='" + this.selectId_target + "'><option value=''>选择发送对象</select>";

        return html;
    }

    bindButtons() {
        $("#" + this.buttonId_reset)
            .off("click")
            .on("click", () => {
                $("#" + this.selectId_teammate)
                    .find("> option:first")
                    .prop("selected", true);
                $("#" + this.textId_target).val("");
                $("#" + this.selectId_target)
                    .find("> option:first")
                    .prop("selected", true);
            });
        $("#" + this.selectId_teammate)
            .off("change")
            .on("change", () => {
                const s = $("#" + this.selectId_teammate).val() as string;
                if (s === "") return;
                $("#" + this.textId_target).val("");
                $("#" + this.selectId_target)
                    .find("> option:first")
                    .prop("selected", true);
            });
        $("#" + this.buttonId_search)
            .off("click")
            .on("click", () => {
                const s = $("#" + this.textId_target).val();
                if (s === undefined || (s as string).trim() === "") {
                    MessageBoard.publishWarning("没有正确输入人名！");
                    return;
                }
                const searchName = (s as string).trim();
                if (this.isTownMode) {
                    new TownEquipmentExpressHouse(this.credential)
                        .search(searchName)
                        .then(html => this._processSearchResult(searchName, html));
                } else if (this.isCastleMode) {
                    new CastleEquipmentExpressHouse(this.credential)
                        .search(searchName)
                        .then(html => this._processSearchResult(searchName, html));
                }
            });
    }

    get targetPeople(): string | undefined {
        let target = $("#" + this.selectId_teammate).val() as string
        if (target === "") {
            const s = $("#" + this.selectId_target).val();
            if (s !== undefined) target = s as string
            if (_.startsWith(target, "====")) target = ""
        }
        return target === "" ? undefined : target;
    }

    dispose() {
        $("#" + this.buttonId_reset).off("click");
        $("#" + this.selectId_teammate).off("change");
        $("#" + this.buttonId_search).off("click");
    }

    private _processSearchResult(s: string, html: string) {
        const candidate: JQuery[] = []
        const select = $("#" + this.selectId_target);
        select.html(html)
        select.find("> option")
            .each((_idx, opt) => {
                const text = $(opt).text()
                if (text !== "选择发送对象"
                    && !_.startsWith(text, "====")
                    && _.includes(text, s)) {
                    candidate.push($(opt))
                }
            })
        if (candidate.length === 1) {
            candidate[0].prop("selected", true)
        }
        if (candidate.length > 0) {
            $("#" + this.selectId_teammate)
                .find("> option:first")
                .prop("selected", true);
        }
    }
}

export = PeopleFinder;