import TeamMemberLoader from "../team/TeamMemberLoader";
import BankRecord from "./BankRecord";
import BankStorages from "./BankStorages";

class BankRecordReportGenerator {

    generate() {
        _loadBankRecords().then(reports => _doGenerate(reports));
    }

}

function _doGenerate(reports: Map<string, Report>) {

}

async function _loadBankRecords(): Promise<Map<string, Report>> {

    const names = new Map<string, string>();
    TeamMemberLoader.loadTeamMembers()
        .filter(it => !it.external)
        .forEach(it => names.set(it.id!, it.name!));

    const storage = BankStorages.bankRecordStorage;
    const promises: Promise<BankRecord | null>[] = [];
    TeamMemberLoader.loadTeamMembers()
        .filter(it => !it.external)
        .map(it => it.id!)
        .forEach(it => promises.push(storage.load(it)));

    const reports = new Map<string, Report>();
    (await Promise.all(promises))
        .forEach(it => {
            if (it) {
                const roleId = it.roleId!;
                const roleName = names.get(roleId)!;
                const report = new Report(roleName, it);
                reports.set(roleId, report);
            }
        });
    return await (() => {
        return new Promise<Map<string, Report>>(resolve => resolve(reports));
    })();
}

class Report {

    readonly roleName: string;
    readonly record: BankRecord;

    constructor(roleName: string, record: BankRecord) {
        this.roleName = roleName;
        this.record = record;
    }
}

export = BankRecordReportGenerator;