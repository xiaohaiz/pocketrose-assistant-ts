import Role from "../role/Role";
import BankAccount from "./BankAccount";
import PocketUtils from "../../util/PocketUtils";

abstract class BankPage {

    role?: Role;
    account?: BankAccount;

    welcomeMessage?: string;

    get available(): boolean {
        return this.account !== undefined
            && this.account.cash !== undefined
            && this.account.saving !== undefined
            && PocketUtils.checkAmount(this.account.cash)
            && PocketUtils.checkAmount(this.account.saving);
    }
}

class TownBankPage extends BankPage {
}

class CastleBankPage extends BankPage {
}

export {BankPage, TownBankPage, CastleBankPage};