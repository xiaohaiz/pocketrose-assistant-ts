import Credential from "../util/Credential";
import NetworkUtils from "../util/NetworkUtils";
import MessageBoard from "../util/MessageBoard";

class CastleBank {

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
                    request["mode"] = "CASTLEBANK_BUY";
                    // @ts-ignore
                    request["dasu"] = amount;
                    NetworkUtils.sendPostRequest("town.cgi", request, function (html: string) {
                        if ($(html).text().includes("您在钱庄里没那么多存款")) {
                            MessageBoard.publishWarning("真可怜，银行里面连" + amount + "万存款都没有。");
                            resolve(false);
                        } else {
                            MessageBoard.publishMessage("从城堡银行提取了" + amount + "万现金。");
                            resolve(true);
                        }
                    });
                }
            });
        };
        return await action(this.#credential, amount);
    }
}

export = CastleBank;