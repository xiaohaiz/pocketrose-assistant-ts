import Role from "../role/Role";
import BankAccount from "./BankAccount";

class TownBankPage {

    role: Role;
    account: BankAccount;

    constructor(role: Role, account: BankAccount) {
        this.role = role;
        this.account = account;
    }
}

export = TownBankPage;