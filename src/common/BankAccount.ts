class BankAccount {

    name?: string;
    cash?: number;
    saving?: number;

    get total(): number {
        return this.cash! + this.saving!;
    }

}

export = BankAccount;