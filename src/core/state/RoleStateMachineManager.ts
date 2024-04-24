import Coordinate from "../../util/Coordinate";
import RoleStateMachine from "./RoleStateMachine";
import StringUtils from "../../util/StringUtils";
import _ from "lodash";
import {RoleState, RoleStateStorage} from "./RoleState";

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

                const roleText = $("#c_001")
                    .find("> table:first > tbody:first > tr:first > td:first")
                    .find("> table:first > tbody:first > tr:first > td:first")
                    .find("> table:first > tbody:first > tr:first > td:first")
                    .text();
                let s = StringUtils.substringBetween(roleText, "Lv：", " ／属性：");
                const roleLevel = _.parseInt(s);
                s = StringUtils.substringAfter(roleText, "／职业 ");
                const roleCareer = StringUtils.substringBefore(s, " ");

                const state = new RoleState();
                state.id = this.#id;
                state.location = "TOWN";
                state.townId = townId;
                state.battleCount = battleCount;
                state.roleLevel = roleLevel;
                state.roleCareer = roleCareer;
                RoleStateStorage.write(state).then(() => {
                    resolve(state);
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

                RoleStateStorage.write(document).then(() => {
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

                RoleStateStorage.write(document).then(() => {
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

                RoleStateStorage.write(document).then(() => {
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

                RoleStateStorage.write(document).then(() => {
                    resolve(document);
                });
            });
        })();
    }

    async load(): Promise<RoleStateMachine> {
        return await (() => {
            return new Promise<RoleStateMachine>(resolve => {
                RoleStateStorage.load(this.#id).then(state => {
                    const machine = new RoleStateMachine(state);
                    resolve(machine);
                });
            });
        })();
    }
}

export = RoleStateMachineManager;