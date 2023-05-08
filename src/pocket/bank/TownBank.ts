import Credential from "../../util/Credential";
import MessageBoard from "../../util/MessageBoard";
import NetworkUtils from "../../util/NetworkUtils";

/**
 * @deprecated
 */
class TownBank {

    readonly #credential: Credential;

    constructor(credential: Credential) {
        this.#credential = credential;
    }

    async withdraw(amount: number): Promise<void> {
        const action = (credential: Credential, amount: number) => {
            return new Promise<void>((resolve, reject) => {
                if (amount <= 0) {
                    // Nothing to do, redirect to resolve
                    resolve();
                } else {
                    const request = credential.asRequest();
                    // @ts-ignore
                    request.mode = "BANK_BUY";
                    // @ts-ignore
                    request.dasu = amount;
                    NetworkUtils.sendPostRequest("town.cgi", request, function (pageHtml: string) {
                        if ($(pageHtml).text().includes("您在钱庄里没那么多存款")) {
                            MessageBoard.publishWarning("真可怜，银行里面连" + amount + "万存款都没有。");
                            reject();
                        } else {
                            MessageBoard.publishMessage("从银行里提取了" + amount + "万现金。");
                            resolve();
                        }
                    });
                }
            });
        };
        return await action(this.#credential, amount);
    }

    async depositAll() {
        const action = (credential: Credential) => {
            return new Promise<void>(resolve => {
                const request = credential.asRequest();
                // @ts-ignore
                request.mode = "BANK_SELL";
                // @ts-ignore
                request.azukeru = "all";
                NetworkUtils.sendPostRequest("town.cgi", request, function () {
                    MessageBoard.publishMessage("在银行存入了全部现金。");
                    resolve();
                });
            });
        };
        return await action(this.#credential);
    }
}

export = TownBank;