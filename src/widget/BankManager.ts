import CommonWidget from "./support/CommonWidget";
import Credential from "../util/Credential";
import LocationModeCastle from "../core/location/LocationModeCastle";
import LocationModeTown from "../core/location/LocationModeTown";
import PeopleFinder from "./PeopleFinder";
import OperationMessage from "../util/OperationMessage";
import {TownBankPage} from "../core/bank/BankPage";
import TownBank from "../core/bank/TownBank";
import CastleBank from "../core/bank/CastleBank";
import PocketPageRenderer from "../util/PocketPageRenderer";
import PocketUtils from "../util/PocketUtils";
import TeamMemberLoader from "../core/team/TeamMemberLoader";
import BankRecord from "../core/bank/BankRecord";
import DayRange from "../util/DayRange";
import BankRecordStorage from "../core/bank/BankRecordStorage";
import NpcLoader from "../core/role/NpcLoader";
import {PersonalSalary} from "../core/bank/PersonalSalary";
import {PersonalSalaryRecordStorage} from "../core/bank/PersonalSalaryRecordStorage";
import PersonalStatus from "../core/role/PersonalStatus";
import {CommonWidgetFeature} from "./support/CommonWidgetFeature";

class BankManager extends CommonWidget {

    readonly feature = new BankManagerFeature();

    private readonly peopleFinder;

    constructor(credential: Credential, locationMode: LocationModeCastle | LocationModeTown) {
        super(credential, locationMode);
        this.peopleFinder = new PeopleFinder(credential, locationMode);
    }

    bankPage?: TownBankPage;
    battleCount?: number;

    generateHTML(): string {
        return "" +
            "<table style='background-color:#888888;margin:auto;width:100%;border-width:0'>" +
            "<thead style='text-align:center'>" +
            "<tr style='background-color:skyblue'>" +
            "<td>＜ 银 行 账 号 ＞</td>" +
            "</tr>" +
            "</thead>" +
            "<tbody style='text-align:center'>" +
            "<tr style='background-color:#F8F0E0'>" +
            "<td>" +
            "现金：<span style='color:red;font-weight:bold;font-size:150%' id='_pocket_BankAccountCash'></span> GOLD" +
            "<span>   </span>" +
            "存款：<span style='color:blue;font-weight:bold;font-size:150%' id='_pocket_BankAccountSaving'></span> GOLD" +
            "</td>" +
            "</tr>" +
            "<tr style='background-color:#F8F0E0'>" +
            "<td>" +
            "<button role='button' class='C_pocket_StatelessElement C_pocket_BKM_Button' " +
            "id='_pocket_BKM_DepositAll'>全部存入</button>" +
            PocketPageRenderer.OR() +
            "<input type='text' id='_pocket_BKM_Amount' class='C_pocket_StatelessElement' " +
            "value='' size='3' style='text-align:right' spellcheck='false'>0000 Gold" +
            PocketPageRenderer.GO() +
            "<button role='button' class='C_pocket_StatelessElement C_pocket_BKM_Button' " +
            "id='_pocket_BKM_Deposit'>存款</button>" +
            PocketPageRenderer.OR() +
            "<button role='button' class='C_pocket_StatelessElement C_pocket_BKM_Button' " +
            "id='_pocket_BKM_Withdraw'>取款</button>" +
            "</td>" +
            "</tr>" +
            "<tr style='background-color:#F8F0E0'>" +
            "<td>" +
            this.peopleFinder.generateHTML() +
            PocketPageRenderer.GO() +
            "<button role='button' class='C_pocket_StatelessElement C_pocket_BKM_Button' " +
            "id='_pocket_BKM_Transfer'>转账</button>" +
            "</td>" +
            "</tr>" +
            "<tr style='background-color:#F8F0E0;display:none'>" +
            "<td style='border-spacing:0' id='_pocket_BKM_SalaryPanel'>" +
            "<table style='background-color:#888888;margin:auto;width:100%;border-width:0'>" +
            "<tr>" +
            "<td style='width:64px;white-space:nowrap;background-color:wheat'>" +
            NpcLoader.getNpcImageHtml("剑心") +
            "</td>" +
            "<td style='width:100%;background-color:wheat;text-align:left;vertical-align center'>" +
            "<span id='_pocket_BKM_SalaryMessage'></span><span>   </span>" +
            "<button role='button' class='C_pocket_BKM_Button' disabled " +
            "id='_pocket_BKM_Salary'>领取俸禄</button>" +
            "</td>" +
            "</tr>" +
            "</table>" +
            "</td>" +
            "</tr>" +
            "</tbody>" +
            "</table>" +
            "";
    }

    bindButtons() {
        this.peopleFinder.bindButtons();

        $("#_pocket_BKM_DepositAll")
            .off("click")
            .on("click", () => {
                if (this.bankPage!.account!.cash! < 10000) {
                    (this.feature.onWarning) && (this.feature.onWarning("身上没有足够的现金存入银行，忽略！"));
                    return;
                }
                this._deposit().then(() => {
                    this._triggerRefresh(OperationMessage.success()).then();
                });
            });
        $("#_pocket_BKM_Deposit")
            .off("click")
            .on("click", () => {
                const amount = this._extractAmount();
                if (amount === undefined) return;
                if (amount * 10000 > this.bankPage!.account!.cash!) {
                    (this.feature.onWarning) && (this.feature.onWarning(amount + "万！真逗，搞得你好像有这么多现金似得！"));
                    return;
                }
                this._deposit(amount).then(() => {
                    this._triggerRefresh(OperationMessage.success()).then();
                });
            });
        $("#_pocket_BKM_Withdraw")
            .off("click")
            .on("click", () => {
                const amount = this._extractAmount();
                if (amount === undefined) return;
                if (amount * 10000 > this.bankPage!.account!.saving!) {
                    (this.feature.onWarning) && (this.feature.onWarning(amount + "万！真逗，搞得你好像有这么多存款似得！"));
                    return;
                }
                this._withdraw(amount).then(() => {
                    this._triggerRefresh(OperationMessage.success()).then();
                });
            });
        $("#_pocket_BKM_Transfer")
            .off("click")
            .on("click", () => {
                const amount = this._extractAmount();
                if (amount === undefined) return;
                const target = this.peopleFinder.targetPeople;
                if (target === undefined) {
                    (this.feature.onWarning) && (this.feature.onWarning("没有选择转账的对象，忽略！"));
                    return;
                }
                if ((amount + 10) * 10000 > this.bankPage!.account!.total) {
                    (this.feature.onWarning) && (this.feature.onWarning("很遗憾，你压根就没有这么多钱！"));
                    return;
                }
                if (!TeamMemberLoader.loadTeamMembersAsMap(true).has(target)) {
                    if (!confirm("请您确认转账" + amount + "万GOLD？")) return;
                }
                this._transfer(target, amount).then(() => {
                    this._triggerRefresh(OperationMessage.success()).then();
                });
            });
        $("#_pocket_BKM_Salary")
            .off("click")
            .on("click", () => {
                const ps = new PersonalSalary(this.credential, this.townId);
                ps.battleCount = this.battleCount;
                ps.receiveSalary().then(success => {
                    if (success) {
                        this._deposit().then(() => {
                            this._triggerRefresh(OperationMessage.success()).then();
                        })
                    } else {
                        this._triggerRefresh(OperationMessage.success()).then();
                    }
                });
            });
    }

    async reload() {
        this.bankPage = await new TownBank(this.credential, this.townId).open();
        (this.feature.onMessage) && (this.feature.onMessage("银行账户数据重新加载完成。"));
    }

    async render() {
        if (this.feature.enableSalaryDistribution) {
            $("#_pocket_BKM_SalaryPanel").parent().show();
            $("#_pocket_BKM_SalaryMessage").html("");
            $("#_pocket_BKM_Salary").prop("disabled", true);
        } else {
            $("#_pocket_BKM_SalaryPanel").parent().hide();
        }
        $("#_pocket_BankAccountCash").html(() => {
            const cash = this.bankPage!.account!.cash!;
            return cash.toLocaleString();
        });
        $("#_pocket_BankAccountSaving").html(() => {
            const saving = this.bankPage!.account!.saving!;
            return saving.toLocaleString();
        });
        $("#_pocket_BKM_Amount").val("");

        // Render salary distribution panel
        if (this.feature.enableSalaryDistribution) {
            const msg = $("#_pocket_BKM_SalaryMessage");
            const btn = $("#_pocket_BKM_Salary");
            const record = await PersonalSalaryRecordStorage.load(this.credential.id);
            if (record === null || record.code! < 0) {
                const s: string = "没有查询到您之前的领取记录呢，不然您现在试试？至于给不给钱，那就是白猫说了算了。";
                msg.html(s);
                btn.prop("disabled", false);
            } else {
                if (this.battleCount === undefined) {
                    const role = await new PersonalStatus(this.credential).load();
                    this.battleCount = role.battleCount!;
                }

                const currentTime = new Date().getTime();
                switch (record.code!) {
                    case 0:
                        if (this.battleCount >= record.estimatedBattleCount! &&
                            currentTime >= record.estimatedTime!) {
                            msg.html("根据记录显示，您现在已经可以领取俸禄了。");
                            btn.prop("disabled", false);
                        } else {
                            msg.html("根据记录显示，您下次领取俸禄的条件是战数到达" +
                                "<span style='font-weight:bold;color:blue'>" + record.estimatedBattleCount! + "</span>，时间是在" +
                                "<span style='font-weight:bold;color:red'>" + new Date(record.estimatedTime!).toLocaleString() + "</span>之后。");
                        }
                        break;
                    case 1:
                        if (currentTime >= record.estimatedTime!) {
                            msg.html("根据记录显示，您现在已经可以领取俸禄了。");
                            btn.prop("disabled", false);
                        } else {
                            msg.html("时间不到啊，根据记录显示，您下次领取俸禄的时间是在" +
                                "<span style='font-weight:bold;color:red'>" + new Date(record.estimatedTime!).toLocaleString() + "</span>之后。");
                        }
                        break;
                    case 2:
                        if (this.battleCount >= record.estimatedBattleCount!) {
                            msg.html("根据记录显示，您现在已经可以领取俸禄了。");
                            btn.prop("disabled", false);
                        } else {
                            msg.html("战数不够啊，根据记录显示，您下次领取俸禄需要的战数是" +
                                "<span style='font-weight:bold;color:blue'>" + record.estimatedBattleCount! + "</span>。努努力吧，少年。");
                        }
                        break;
                }
            }
        }
    }

    async dispose() {
        $("#_pocket_BKM_DepositAll")
            .off("click")
            .prop("disabled", true);
        $("#_pocket_BKM_Amount")
            .val("")
            .prop("disabled", true);
        $("#_pocket_BKM_Deposit")
            .off("click")
            .prop("disabled", true);
        $("#_pocket_BKM_Withdraw")
            .off("click")
            .prop("disabled", true);
        $("#_pocket_BKM_Transfer")
            .off("click")
            .prop("disabled", true);
        $("#_pocket_BKM_Salary")
            .off("click")
            .prop("disabled", true);

        if (this.feature.enableWriteRecordOnDispose) {
            const record = new BankRecord();
            record.roleId = this.credential.id;
            record.recordDate = DayRange.current().asText();
            record.cash = this.bankPage!.account!.cash!;
            record.saving = this.bankPage!.account!.saving!;
            await BankRecordStorage.getInstance().upsert(record);
        }
    }

    private async _triggerRefresh(message: OperationMessage) {
        await this.reload();
        await this.render();
        (this.feature.onRefresh) && (this.feature.onRefresh(message));
    }

    private async _deposit(amount?: number) {
        if (this.isTownMode) {
            await new TownBank(this.credential, this.townId).deposit(amount);
        }
        if (this.isCastleMode) {
            await new CastleBank(this.credential).deposit();
        }
    }

    private async _withdraw(amount: number) {
        if (this.isTownMode) {
            await new TownBank(this.credential, this.townId).withdraw(amount);
        }
        if (this.isCastleMode) {
            await new CastleBank(this.credential).withdraw(amount);
        }
    }

    private async _transfer(target: string, amount: number) {
        const delta = PocketUtils.calculateCashDifferenceAmount(this.bankPage!.account!.cash!, (amount + 10) * 10000);
        if (this.isTownMode) {
            const bank = new TownBank(this.credential, this.townId);
            await bank.withdraw(delta);
            await bank.transfer(target, amount);
            await bank.deposit();
        }
        if (this.isCastleMode) {
            const bank = new CastleBank(this.credential);
            await bank.withdraw(delta);
            await bank.transfer(target, amount);
            await bank.deposit();
        }
    }

    private _extractAmount(): number | undefined {
        const text = $("#_pocket_BKM_Amount").val();
        if (text === undefined || (text as string).trim() === "") {
            (this.feature.onWarning) && (this.feature.onWarning("没有输入存取款的金额！"));
            return undefined;
        }
        const amount = parseInt((text as string).trim());
        if (isNaN(amount) || !Number.isInteger(amount) || amount <= 0) {
            (this.feature.onWarning) && (this.feature.onWarning("存取款的金额必须是正整数！"));
            return undefined;
        }
        return amount;
    }
}

class BankManagerFeature extends CommonWidgetFeature {

    enableWriteRecordOnDispose: boolean = false;
    enableSalaryDistribution: boolean = false;

}

export {BankManager, BankManagerFeature};