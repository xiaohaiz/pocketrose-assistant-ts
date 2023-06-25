import _ from "lodash";
import BattleLog from "./BattleLog";
import BattleLogStorage from "./BattleLogStorage";
import BattleResultStorage from "./BattleResultStorage";

class BattleLogService {

    static importBattleLog(json: string) {
        const documentList = JSON.parse(json);
        $("#battleLogCount").html(documentList.length);
        if (documentList.length === 0) {
            return;
        }
        doImportBattleLog(0, documentList);
    }

}

function doImportBattleLog(index: number, documentList: {}[]) {
    const document = documentList[index];
    if (!document) {
        return;
    }
    BattleLogStorage.getInstance()
        .importDocument(document)
        .then(() => {

            const log = new BattleLog();
            // @ts-ignore
            log.id = document.id;
            // @ts-ignore
            log.createTime = document.createTime;
            // @ts-ignore
            log.roleId = document.roleId;
            // @ts-ignore
            log.monster = document.monster;
            // @ts-ignore
            log.result = document.result;
            // @ts-ignore
            log.catch = document.catch;
            // @ts-ignore
            log.photo = document.photo;
            // @ts-ignore
            if (document.treasures) {
                log.treasures = new Map<string, number>();
                // @ts-ignore
                Object.keys(document.treasures)
                    .forEach(code => {
                        // @ts-ignore
                        const count = document.treasures[code];
                        log.treasures!.set(code, count);
                    });
            }

            BattleResultStorage.getInstance()
                .replay(log)
                .then(() => {
                    let c = _.parseInt($("#importedBattleLogCount").text());
                    c++;
                    $("#importedBattleLogCount").text(c);
                    doImportBattleLog(index + 1, documentList);
                })
                .catch(() => {
                    doImportBattleLog(index + 1, documentList);
                });
        })
        .catch(() => {
            let c = _.parseInt($("#duplicatedBattleLogCount").text());
            c++;
            $("#duplicatedBattleLogCount").text(c);
            doImportBattleLog(index + 1, documentList);
        });
}

export = BattleLogService;