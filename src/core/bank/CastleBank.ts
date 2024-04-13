import BankAccount from "./BankAccount";
import Credential from "../../util/Credential";
import MessageBoard from "../../util/MessageBoard";
import NetworkUtils from "../../util/NetworkUtils";
import PocketUtils from "../../util/PocketUtils";
import {CastleBankPageParser} from "./BankPageParser";
import {CastleBankPage} from "./BankPage";

class CastleBank {

    readonly #credential: Credential;

    constructor(credential: Credential) {
        this.#credential = credential;
    }

    async open(): Promise<CastleBankPage> {
        return await this._open();
    }

    private async _open(count: number = 0): Promise<CastleBankPage> {
        const request = this.#credential.asRequestMap();
        request.set("mode", "CASTLE_BANK");
        const response = await NetworkUtils.post("castle.cgi", request);
        const page = CastleBankPageParser.parsePage(response);
        if (page.available) return page;
        if (count >= 2) return page;
        return await this._open(count + 1);
    }

    async load(): Promise<BankAccount> {
        return (await this.open()).account!;
    }

    async deposit(amount?: number): Promise<void> {
        return await (() => {
            return new Promise<void>((resolve, reject) => {
                const request = this.#credential.asRequestMap();
                if (amount === undefined) {
                    // deposit all
                    request.set("azukeru", "all");
                    request.set("mode", "CASTLEBANK_SELL");
                    NetworkUtils.post("castle.cgi", request)
                        .then(() => {
                            MessageBoard.publishMessage("在城堡支行存入全部现金。");
                            resolve();
                        });
                } else {
                    // deposit specified amount
                    if (!PocketUtils.checkAmount(amount)) {
                        MessageBoard.publishWarning("非法的金额" + amount + "！");
                        reject();
                    } else if (amount === 0) {
                        // 真逗，没钱凑什么热闹。
                        resolve();
                    } else {
                        request.set("azukeru", amount.toString());
                        request.set("mode", "CASTLEBANK_SELL");
                        NetworkUtils.post("castle.cgi", request)
                            .then(() => {
                                MessageBoard.publishMessage("在城堡支行存入了" + amount + "万现金。");
                                resolve();
                            });
                    }
                }
            });
        })();
    }

    async withdraw(amount: number): Promise<void> {
        const action = () => {
            return new Promise<void>((resolve, reject) => {
                if (isNaN(amount) || !Number.isInteger(amount) || amount < 0) {
                    reject();
                    return;
                }
                if (amount === 0) {
                    resolve();
                    return;
                }
                const request = this.#credential.asRequestMap();
                request.set("dasu", amount.toString());
                request.set("mode", "CASTLEBANK_BUY");
                NetworkUtils.post("castle.cgi", request)
                    .then(html => {
                        if ($(html).text().includes("您在钱庄里没那么多存款")) {
                            MessageBoard.publishWarning("真可怜，银行里面连" + amount + "万存款都没有！");
                            reject();
                        } else {
                            MessageBoard.publishMessage("从城堡支行里提取了" + amount + "万现金。");
                            resolve();
                        }
                    });
            });
        };
        return await action();
    }

    async transfer(target: string, amount: number) {
        const request = this.#credential.asRequestMap();
        request.set("gold", (amount * 10).toString());  // 送钱的接口单位是K
        request.set("eid", target);
        request.set("mode", "CASTLE_SENDMONEY2");
        const response = await NetworkUtils.post("castle.cgi", request);
        MessageBoard.processResponseMessage(response);
    }
}

export = CastleBank;