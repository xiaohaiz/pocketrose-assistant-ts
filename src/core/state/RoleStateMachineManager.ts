import _ from "lodash";
import Coordinate from "../../util/Coordinate";
import StringUtils from "../../util/StringUtils";
import RoleState from "./RoleState";
import RoleStateMachine from "./RoleStateMachine";
import RoleStateStorage from "./RoleStateStorage";

class RoleStateMachineManager {

    readonly #id: string;

    constructor(id: string) {
        this.#id = id;
    }

    static create(): RoleStateMachineManager {
        const id = $("input:hidden[name='id']:last").val() as string;
        return new RoleStateMachineManager(id);
    }

    async inTown(): Promise<RoleState> {
        return await (() => {
            return new Promise<RoleState>(resolve => {
                const townId = $("input:hidden[name='townid']:last").val() as string;
                const battleCount = _.parseInt($("input:hidden[name='ktotal']").val() as string);

                const document = new RoleState();
                document.id = this.#id;
                document.location = "TOWN";
                document.townId = townId;
                document.battleCount = battleCount;

                RoleStateStorage.getInstance()
                    .write(document)
                    .then(() => {
                        resolve(document);
                    });
            });
        })();
    }

    async inCastle(): Promise<RoleState> {
        return await (() => {
            return new Promise<RoleState>(resolve => {
                const castleName = $("table:first")
                    .find("tr:first")
                    .next()
                    .find("td:first")
                    .find("table:first")
                    .find("tr:eq(2)")
                    .find("td:first")
                    .find("table:first")
                    .find("th:first")
                    .text().trim();

                const document = new RoleState();
                document.id = this.#id;
                document.location = "CASTLE";
                document.castleName = castleName;

                RoleStateStorage.getInstance()
                    .write(document)
                    .then(() => {
                        resolve(document);
                    });
            });
        })();
    }

    async inMap(): Promise<RoleState> {
        return await (() => {
            return new Promise<RoleState>(resolve => {
                let s = $("td:contains('现在位置')")
                    .filter(function () {
                        return $(this).text().startsWith("\n      现在位置");
                    })
                    .text();
                s = StringUtils.substringBetween(s, "现在位置(", ")");

                const document = new RoleState();
                document.id = this.#id;
                document.location = "WILD";
                document.coordinate = Coordinate.parse(s).asText();

                RoleStateStorage.getInstance()
                    .write(document)
                    .then(() => {
                        resolve(document);
                    });
            });
        })();
    }

    async inMetro(): Promise<RoleState> {
        return await (() => {
            return new Promise<RoleState>(resolve => {
                let s = $("td:contains('现在位置')")
                    .filter(function () {
                        return $(this).text().startsWith("\n      现在位置");
                    })
                    .text();
                s = StringUtils.substringBetween(s, "现在位置(", ")");

                const document = new RoleState();
                document.id = this.#id;
                document.location = "METRO";
                document.coordinate = Coordinate.parse(s).asText();

                RoleStateStorage.getInstance()
                    .write(document)
                    .then(() => {
                        resolve(document);
                    });
            });
        })();
    }

    async inTang(): Promise<RoleState> {
        return await (() => {
            return new Promise<RoleState>(resolve => {
                let s = $("td:contains('现在位置')")
                    .filter(function () {
                        return $(this).text().startsWith("\n      现在位置");
                    })
                    .text();
                s = StringUtils.substringBetween(s, "现在位置(", ")");

                const document = new RoleState();
                document.id = this.#id;
                document.location = "TANG";
                document.coordinate = Coordinate.parse(s).asText();

                RoleStateStorage.getInstance()
                    .write(document)
                    .then(() => {
                        resolve(document);
                    });
            });
        })();
    }

    async load(): Promise<RoleStateMachine> {
        return await (() => {
            return new Promise<RoleStateMachine>(resolve => {
                RoleStateStorage.getInstance()
                    .load(this.#id)
                    .then(state => {
                        const machine = new RoleStateMachine(state);
                        resolve(machine);
                    });
            });
        })();
    }
}

export = RoleStateMachineManager;