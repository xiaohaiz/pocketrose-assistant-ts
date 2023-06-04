import _ from "lodash";
import RoleState from "./RoleState";
import StateStorageManager from "./StateStorageManager";

class RoleStateMachine {

    readonly #id: string;

    constructor(id: string) {
        this.#id = id;
    }

    static create(): RoleStateMachine {
        const id = $("input:hidden[name='id']:last").val() as string;
        return new RoleStateMachine(id);
    }

    async inTown(): Promise<void> {
        return await (() => {
            return new Promise<void>(resolve => {
                const townId = $("input:hidden[name='townid']:last").val() as string;
                const battleCount = _.parseInt($("input:hidden[name='ktotal']").val() as string);

                const document = new RoleState();
                document.id = this.#id;
                document.location = "TOWN";
                document.townId = townId;
                document.battleCount = battleCount;

                StateStorageManager.getRoleStateStorage()
                    .write(document)
                    .then(() => {
                        resolve();
                    });
            });
        })();
    }
}

export = RoleStateMachine;