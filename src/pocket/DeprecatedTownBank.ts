import Credential from "../util/Credential";
import MessageBoard from "../util/MessageBoard";
import NetworkUtils from "../util/NetworkUtils";

/**
 * @deprecated
 */
class DeprecatedTownBank {

    readonly #credential: Credential;

    constructor(credential: Credential) {
        this.#credential = credential;
    }


    async withdraw(amount: number): Promise<boolean> {
        const action = (credential: Credential, amount: number) => {
            return new Promise<boolean>(resolve => {
                if (amount === undefined || amount === null || amount <= 0) {
                    resolve(true);
                } else {
                    const request = credential.asRequest();
                    // @ts-ignore
                    request["mode"] = "BANK_BUY";
                    // @ts-ignore
                    request["dasu"] = amount;
                    NetworkUtils.sendPostRequest("town.cgi", request, function (html: string) {
                        if ($(html).text().includes("您在钱庄里没那么多存款")) {
                            MessageBoard.publishWarning("真可怜，银行里面连" + amount + "万存款都没有。");
                            resolve(false);
                        } else {
                            MessageBoard.publishMessage("从城市银行提取了" + amount + "万现金。");
                            resolve(true);
                        }
                    });
                }
            });
        };
        return await action(this.#credential, amount);
    }

}

export = DeprecatedTownBank;