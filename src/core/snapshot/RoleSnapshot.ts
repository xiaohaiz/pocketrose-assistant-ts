import Credential from "../../util/Credential";
import StorageUtils from "../../util/StorageUtils";
import Constants from "../../util/Constants";
import _ from "lodash";

const ROLE_SNAPSHOT_KEYS: string[] = [
    "_ts_010_",
    "_ts_011_",
    "_ts_012_",
    "_ts_013_",
    "_ts_014_",
];

class RoleSnapshot {

    name?: string;              // 快照名
    roleId?: string;
    roleName?: string;
    roleImage?: string;
    mirrorIndex?: number;
    career?: string;
    spellId?: string;
    spellName?: string;
    usingWeapon?: string;
    usingArmor?: string;
    usingAccessory?: string;
    petName?: string;
    petImage?: string;
    petLevel?: number;
    petAttack?: number;
    petDefense?: number;
    petSpecialAttack?: number;
    petSpecialDefense?: number;
    petSpeed?: number;
    petSpell1?: string;
    petSpell2?: string;
    petSpell3?: string;
    petSpell4?: string;
    petUsingSpell1?: boolean;
    petUsingSpell2?: boolean;
    petUsingSpell3?: boolean;
    petUsingSpell4?: boolean;

    asDocument() {
        const document: any = {};
        (this.name) && (document.name = this.name);
        (this.roleId) && (document.roleId = this.roleId);
        (this.roleName) && (document.roleName = this.roleName);
        (this.roleImage) && (document.roleImage = this.roleImage);
        (this.mirrorIndex !== undefined) && (document.mirrorIndex = this.mirrorIndex);
        (this.career) && (document.career = this.career);
        (this.spellId) && (document.spellId = this.spellId);
        (this.spellName) && (document.spellName = this.spellName);
        (this.usingWeapon) && (document.usingWeapon = this.usingWeapon);
        (this.usingArmor) && (document.usingArmor = this.usingArmor);
        (this.usingAccessory) && (document.usingAccessory = this.usingAccessory);
        (this.petName) && (document.petName = this.petName);
        (this.petImage) && (document.petImage = this.petImage);
        (this.petLevel !== undefined) && (document.petLevel = this.petLevel);
        (this.petAttack !== undefined) && (document.petAttack = this.petAttack);
        (this.petDefense !== undefined) && (document.petDefense = this.petDefense);
        (this.petSpecialAttack !== undefined) && (document.petSpecialAttack = this.petSpecialAttack);
        (this.petSpecialDefense !== undefined) && (document.petSpecialDefense = this.petSpecialDefense);
        (this.petSpeed !== undefined) && (document.petSpeed = this.petSpeed);
        (this.petSpell1) && (document.petSpell1 = this.petSpell1);
        (this.petSpell2) && (document.petSpell2 = this.petSpell2);
        (this.petSpell3) && (document.petSpell3 = this.petSpell3);
        (this.petSpell4) && (document.petSpell4 = this.petSpell4);
        (this.petUsingSpell1 !== undefined) && (document.petUsingSpell1 = this.petUsingSpell1);
        (this.petUsingSpell2 !== undefined) && (document.petUsingSpell2 = this.petUsingSpell2);
        (this.petUsingSpell3 !== undefined) && (document.petUsingSpell3 = this.petUsingSpell3);
        (this.petUsingSpell4 !== undefined) && (document.petUsingSpell4 = this.petUsingSpell4);
        return document;
    }

    get roleImageHTML(): string | undefined {
        if (this.roleImage === undefined) return undefined;
        const src = Constants.POCKET_DOMAIN + "/image/head/" + this.roleImage;
        return "<img src='" + src + "' alt='" + this.roleName + "' width='64' height='64'>";
    }

    get roleMirrorCategory(): string | undefined {
        if (this.mirrorIndex === undefined || this.mirrorIndex < 0) return undefined;
        if (this.mirrorIndex === 0) return "本体";
        return "第" + this.mirrorIndex + "分身";
    }

    get equipmentHTML(): string | undefined {
        const ss: string[] = [];
        (this.usingWeapon) && (ss.push(this.usingWeapon));
        (this.usingArmor) && (ss.push(this.usingArmor));
        (this.usingAccessory) && (ss.push(this.usingAccessory));
        return ss.length === 0 ? undefined : _.join(ss, "<br>");
    }

    get petImageHTML(): string | undefined {
        if (this.petImage === undefined) return undefined;
        const src = Constants.POCKET_DOMAIN + "/image/pet/" + this.petImage;
        return "<img src='" + src + "' width='64' height='64' alt='" + this.petName + "' style='border-width:0'>";
    }

    get petSpellHTML(): string | undefined {
        if (this.petSpell1 === undefined) return undefined;
        if (this.petSpell2 === undefined) return undefined;
        if (this.petSpell3 === undefined) return undefined;
        if (this.petSpell4 === undefined) return undefined;
        if (this.petUsingSpell1 === undefined) return undefined;
        if (this.petUsingSpell2 === undefined) return undefined;
        if (this.petUsingSpell3 === undefined) return undefined;
        if (this.petUsingSpell4 === undefined) return undefined;
        const c1: string = this.petUsingSpell1 ? "darkblue" : "darkcyan";
        const c2: string = this.petUsingSpell2 ? "darkblue" : "darkcyan";
        const c3: string = this.petUsingSpell3 ? "darkblue" : "darkcyan";
        const c4: string = this.petUsingSpell4 ? "darkblue" : "darkcyan";
        return "" +
            "<table style='background-color:transparent;margin:auto;width:100%;border-spacing:0;border-width:0'>" +
            "<tbody style='text-align:left'>" +
            "<tr>" +
            "<td style='white-space:nowrap;color:" + c1 + "'>" + this.petSpell1 + "<span> </span></td>" +
            "<td style='white-space:nowrap;color:" + c2 + "'>" + this.petSpell2 + "</td>" +
            "</tr>" +
            "<tr>" +
            "<td style='white-space:nowrap;color:" + c3 + "'>" + this.petSpell3 + "<span> </span></td>" +
            "<td style='white-space:nowrap;color:" + c4 + "'>" + this.petSpell4 + "</td>" +
            "</tr>" +
            "</tbody>" +
            "</table>" +
            "";
    }
}

class RoleSnapshotLocalStorage {

    private readonly roleId: string;

    constructor(value: Credential | string) {
        if (value instanceof Credential) {
            this.roleId = value.id;
        } else {
            this.roleId = value as string;
        }
    }

    load(key: string): RoleSnapshot | null {
        const pk = key + this.roleId;
        const s = StorageUtils.getString(pk);
        if (s === "") return null;
        const document = JSON.parse(s);
        const snapshot = new RoleSnapshot();
        (document.name) && (snapshot.name = document.name);
        (document.roleId) && (snapshot.roleId = document.roleId);
        (document.roleName) && (snapshot.roleName = document.roleName);
        (document.roleImage) && (snapshot.roleImage = document.roleImage);
        (document.mirrorIndex !== undefined) && (snapshot.mirrorIndex = document.mirrorIndex);
        (document.career) && (snapshot.career = document.career);
        (document.spellId) && (snapshot.spellId = document.spellId);
        (document.spellName) && (snapshot.spellName = document.spellName);
        (document.usingWeapon) && (snapshot.usingWeapon = document.usingWeapon);
        (document.usingArmor) && (snapshot.usingArmor = document.usingArmor);
        (document.usingAccessory) && (snapshot.usingAccessory = document.usingAccessory);
        (document.petName) && (snapshot.petName = document.petName);
        (document.petImage) && (snapshot.petImage = document.petImage);
        (document.petLevel !== undefined) && (snapshot.petLevel = document.petLevel);
        (document.petAttack !== undefined) && (snapshot.petAttack = document.petAttack);
        (document.petDefense !== undefined) && (snapshot.petDefense = document.petDefense);
        (document.petSpecialAttack !== undefined) && (snapshot.petSpecialAttack = document.petSpecialAttack);
        (document.petSpecialDefense !== undefined) && (snapshot.petSpecialDefense = document.petSpecialDefense);
        (document.petSpeed !== undefined) && (snapshot.petSpeed = document.petSpeed);
        (document.petSpell1) && (snapshot.petSpell1 = document.petSpell1);
        (document.petSpell2) && (snapshot.petSpell2 = document.petSpell2);
        (document.petSpell3) && (snapshot.petSpell3 = document.petSpell3);
        (document.petSpell4) && (snapshot.petSpell4 = document.petSpell4);
        (document.petUsingSpell1 !== undefined) && (snapshot.petUsingSpell1 = document.petUsingSpell1);
        (document.petUsingSpell2 !== undefined) && (snapshot.petUsingSpell2 = document.petUsingSpell2);
        (document.petUsingSpell3 !== undefined) && (snapshot.petUsingSpell3 = document.petUsingSpell3);
        (document.petUsingSpell4 !== undefined) && (snapshot.petUsingSpell4 = document.petUsingSpell4);
        return snapshot;
    }

    write(key: string, snapshot: RoleSnapshot) {
        const pk = key + this.roleId;
        const document = snapshot.asDocument();
        StorageUtils.set(pk, JSON.stringify(document));
    }

    remove(key: string) {
        const pk = key + this.roleId;
        StorageUtils.remove(pk);
    }
}

export {ROLE_SNAPSHOT_KEYS, RoleSnapshot, RoleSnapshotLocalStorage};