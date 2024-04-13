import RandomUtils from "../../util/RandomUtils";

class BattleFailureRecord {

    id?: string;                        // UNIQUE (ObjectID)
    roleId?: string;                    // INDEX FIELD
    createTime?: number;                // INDEX FIELD
    validationCodeFailure?: boolean;    // 验证码选择错误

    asDocument() {
        const document: any = {};
        (this.id) && (document.id = this.id);
        (this.roleId) && (document.roleId = this.roleId);
        (this.createTime !== undefined) && (document.createTime = this.createTime);
        (this.validationCodeFailure !== undefined) && (document.validationCodeFailure = this.validationCodeFailure);
        return document;
    }

    static newInstance() {
        const record = new BattleFailureRecord();
        record.id = RandomUtils.nextObjectID();
        record.createTime = new Date().getTime();
        return record;
    }
}

export {BattleFailureRecord};