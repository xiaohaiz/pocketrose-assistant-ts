import PersonalProfilePageProcessor from "./PersonalProfilePageProcessor";
import Credential from "../../util/Credential";
import PageProcessorContext from "../PageProcessorContext";
import PageUtils from "../../util/PageUtils";
import TownBank from "../../core/bank/TownBank";
import BankAccount from "../../core/bank/BankAccount";
import PersonalMirrorPage from "../../core/role/PersonalMirrorPage";
import PersonalMirror from "../../core/role/PersonalMirror";
import SetupLoader from "../../core/config/SetupLoader";
import StringUtils from "../../util/StringUtils";
import _ from "lodash";
import TownInn from "../../core/inn/TownInn";
import BattleFieldTrigger from "../../core/trigger/BattleFieldTrigger";
import MouseClickEventBuilder from "../../util/MouseClickEventBuilder";
import StorageUtils from "../../util/StorageUtils";

class PersonalProfilePageProcessorTownImpl extends PersonalProfilePageProcessor {

    #mirrorPage?: PersonalMirrorPage;

    constructor(credential: Credential, context: PageProcessorContext) {
        super(credential, context);
    }

    protected async doBeforeReturn(): Promise<void> {
        await super.doBeforeReturn();
        await new BattleFieldTrigger(this.credential)
            .withRole(this.role)
            .withPetPage(this.petPage)
            .triggerUpdate();
    }

    protected async doBindReturnButton(): Promise<void> {
        $("#hiddenCell-1").html(PageUtils.generateReturnTownForm(this.credential));
        $("#returnButton").on("click", () => {
            PageUtils.disablePageInteractiveElements();
            this.doBeforeReturn().then(() => {
                PageUtils.triggerClick("returnTown");
            });
        });
    }

    protected async doBindItemHouseButton(): Promise<void> {
        if (this.townId === undefined) return;
        $("#hiddenCell-5").html(PageUtils.generateItemShopForm(this.credential, this.townId!));
        $("#itemHouseButton")
            .prop("disabled", false)
            .on("click", () => {
                PageUtils.disablePageInteractiveElements();
                this.doBeforeReturn().then(() => {
                    PageUtils.triggerClick("openItemShop");
                });
            })
            .parent().show();
    }

    protected async doLoadBankAccount(): Promise<BankAccount | undefined> {
        return await new TownBank(this.credential, this.townId).load();
    }

    protected async doCreateMirrorPage(): Promise<void> {
        let html = "";
        html += "<table style='text-align:center;border-width:0;margin:auto;width:100%'>";
        html += "<tbody id='mirrorTable'>";
        html += "<tr>";
        html += "<th style='background-color:yellowgreen;font-size:120%;font-weight:bold;color:navy' colspan='16'>分 身 状 态</th>";
        html += "</tr>";
        html += "<tr style='background-color:skyblue'>";
        html += "<th>切换</th>";
        html += "<th>类别</th>";
        html += "<th>头像</th>";
        html += "<th>姓名</th>";
        html += "<th>性别</th>";
        html += "<th>ＨＰ</th>";
        html += "<th>ＭＰ</th>";
        html += "<th>属性</th>";
        html += "<th>攻击</th>";
        html += "<th>防御</th>";
        html += "<th>智力</th>";
        html += "<th>精神</th>";
        html += "<th>速度</th>";
        html += "<th>职业</th>";
        html += "<th>技能</th>";
        html += "<th>经验</th>";
        html += "</tr>";
        html += "</tbody>";
        html += "</table>";

        $("#mirrorStatus").html(html);
    }

    protected async doReloadMirrorPage(): Promise<void> {
        if (this.role!.mirrorCount === 0) return;
        this.#mirrorPage = await new PersonalMirror(this.credential, this.townId).open();
    }

    protected async doRenderMirror(): Promise<void> {
        if (this.role!.mirrorCount === 0) return;
        $("#mirrorStatus").parent().show();
        $(".C_mirrorButton").off("click");
        $(".C_mirrorImage").off("click").off("dblclick");
        $(".C_mirror").remove();
        const table = $("#mirrorTable");
        for (const mirror of this.#mirrorPage!.mirrorList!) {
            let html = "<tr class='C_mirror'>";
            html += "<td style='background-color:#E8E8D0'>";
            html += "<button role='button' class='C_mirrorButton C_changeMirrorButton' id='mirror_" + mirror.index + "'>切换</button>";
            html += "</td>";
            html += "<td style='background-color:#E8E8D0'>" + mirror.category + "</td>";
            html += "<td style='background-color:#E8E8D0;width:64px;height:64px'>" + mirror.imageHtml + "</td>";
            html += "<td style='background-color:#E8E8D0'>" + mirror.name + "</td>";
            html += "<td style='background-color:#E8E8D0'>" + mirror.gender + "</td>";
            html += "<td style='background-color:#E8E8D0'>" + mirror.healthHtml + "</td>";
            html += "<td style='background-color:#E8E8D0'>" + mirror.manaHtml + "</td>";
            html += "<td style='background-color:#E8E8D0'>" + mirror.attribute + "</td>";
            html += "<td style='background-color:#E8E8D0'></td>";
            html += "<td style='background-color:#E8E8D0'></td>";
            html += "<td style='background-color:#E8E8D0'></td>";
            html += "<td style='background-color:#E8E8D0'></td>";
            html += "<td style='background-color:#E8E8D0'></td>";
            html += "<td style='background-color:#E8E8D0'>" + mirror.career + "</td>";
            html += "<td style='background-color:#E8E8D0'>" + mirror.spell + "</td>";
            html += "<td style='background-color:#E8E8D0'>" + mirror.experienceHtml + "</td>";
            html += "</tr>";
            table.append($(html));
        }
        await this.#_renderMirrorDimension();
        for (const mirror of this.#mirrorPage!.mirrorList!) {
            const index = mirror.index!;
            const tr = $("#mirror_" + index).parent().parent();
            tr.find("> td:eq(2)")
                .find("> img:first")
                .addClass("C_mirrorImage")
                .attr("id", "mirrorImageButton_" + index);
            new MouseClickEventBuilder(this.credential)
                .bind($("#mirrorImageButton_" + index), () => {
                    const key = "_m_" + index;
                    const c: any = SetupLoader.loadMirrorCareerFixedConfig(this.credential.id);
                    c[key] = !c[key];
                    StorageUtils.set("_pa_070_" + this.credential.id, JSON.stringify(c));
                    this.#_renderMirrorDimension().then();
                });
        }
        $(".C_changeMirrorButton").on("click", event => {
            $(".C_changeMirrorButton").prop("disabled", true);
            const btnId = $(event.target).attr("id") as string;
            const index = _.parseInt(StringUtils.substringAfterLast(btnId, "_"));
            this.#_changeMirror(index).then(() => {
                $(".C_changeMirrorButton").prop("disabled", false);
            });
        });
    }

    async #_renderMirrorDimension() {
        for (const mirror of this.#mirrorPage!.mirrorList!) {
            const index = mirror.index!;
            const tr = $("#mirror_" + index).parent().parent();

            let at = mirror.attackHtml;
            let df = mirror.defenseHtml;
            let sa = mirror.specialAttackHtml;
            let sd = mirror.specialDefenseHtml;
            let sp = mirror.speedHtml;
            if (SetupLoader.isCareerFixed(this.credential.id, index)) {
                at = "<span style='background-color:black;color:white'>" + at + "</span>";
                df = "<span style='background-color:black;color:white'>" + df + "</span>";
                sa = "<span style='background-color:black;color:white'>" + sa + "</span>";
                sd = "<span style='background-color:black;color:white'>" + sd + "</span>";
                sp = "<span style='background-color:black;color:white'>" + sp + "</span>";
            }

            tr.find("> td:eq(8)").html(at)
                .next().html(df)
                .next().html(sa)
                .next().html(sd)
                .next().html(sp);
        }
    }

    async #_changeMirror(index: number) {
        await new TownInn(this.credential, this.townId).recovery();
        await new PersonalMirror(this.credential, this.townId).change(index);
        await this.reloadRole();
        await this.renderRole();
        await this.spellManager.reload();
        await this.spellManager.render(this.role);
        await this.equipmentManager.reload();
        await this.equipmentManager.render(this.role);
        await this.doReloadMirrorPage();
        await this.doRenderMirror();
    }


}

export = PersonalProfilePageProcessorTownImpl;