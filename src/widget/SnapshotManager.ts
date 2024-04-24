import {CommonWidget, CommonWidgetFeature} from "./support/CommonWidget";
import Credential from "../util/Credential";
import LocationModeTown from "../core/location/LocationModeTown";
import {ROLE_SNAPSHOT_KEYS, RoleSnapshot, RoleSnapshotLocalStorage} from "../core/snapshot/RoleSnapshot";
import NpcLoader from "../core/role/NpcLoader";
import StringUtils from "../util/StringUtils";
import OperationMessage from "../util/OperationMessage";
import {PersonalStatus} from "../core/role/PersonalStatus";
import PersonalSpell from "../core/career/PersonalSpell";
import PersonalEquipmentManagement from "../core/equipment/PersonalEquipmentManagement";
import PersonalPetManagement from "../core/monster/PersonalPetManagement";
import PersonalMirror from "../core/role/PersonalMirror";
import EquipmentSet from "../core/equipment/EquipmentSet";
import EquipmentSetLoader from "../core/equipment/EquipmentSetLoader";
import Pet from "../core/monster/Pet";
import _ from "lodash";
import PersonalEquipmentManagementPage from "../core/equipment/PersonalEquipmentManagementPage";
import GoldenCage from "../core/monster/GoldenCage";
import {PocketPage} from "../pocket/PocketPage";
import SetupLoader from "../core/config/SetupLoader";

class SnapshotManager extends CommonWidget {

    readonly feature = new SnapshotManagerFeature();

    private readonly snapshotStorage: RoleSnapshotLocalStorage;

    constructor(credential: Credential, locationMode: LocationModeTown) {
        super(credential, locationMode);
        this.snapshotStorage = new RoleSnapshotLocalStorage(credential);
    }

    generateHTML() {
        const html = "" +
            "<table style='background-color:#888888;margin:auto;width:100%;border-width:0'>" +
            "<thead style='background-color:wheat;text-align:center'>" +
            "<th>快照</th>" +
            "<th>名字</th>" +
            "<th>分身</th>" +
            "<th>定型</th>" +
            "<th>职业</th>" +
            "<th>技能</th>" +
            "<th>装备</th>" +
            "<th>宠物</th>" +
            "<th>名字</th>" +
            "<th>技能</th>" +
            "<th colspan='2'>拍照</th>" +
            "<th>删除</th>" +
            "<th>恢复</th>" +
            "</thead>" +
            "<tbody style='background-color:#E8E8D0;text-align:center' id='_pocket_SnapshotListTable'>" +
            "</tbody>" +
            "</table>" +
            "";
        return "" +
            "<table style='background-color:#888888;margin:auto;width:100%;border-width:0'>" +
            "<tbody>" +
            "<tr>" +
            "<th style='writing-mode:vertical-rl;text-orientation:mixed;" +
            "background-color:navy;color:white;font-size:120%;text-align:left'>" +
            "快 照" +
            "</th>" +
            "<td style='border-spacing:0;width:100%'>" +
            html +
            "</td>" +
            "</tr>" +
            "</tbody>" +
            "</table>" +
            "";
    }

    bindButtons() {
    }

    async reload() {
    }

    async render() {
        $(".C_pocket_SnapshotButton").off("click").off("dblclick");
        $(".C_pocket_Snapshot").remove();
        const table = $("#_pocket_SnapshotListTable");
        for (const key of ROLE_SNAPSHOT_KEYS) {
            let html = "<tr class='C_pocket_Snapshot' id='" + key + "'>";

            const snapshot = this.snapshotStorage.load(key);

            html += "<td style='width:64px;height:64px'>";
            html += snapshot?.roleImageHTML ?? NpcLoader.getNpcImageHtml("U_041")!;
            html += "</td>";

            html += "<td>";
            html += snapshot?.roleName ?? "";
            html += "</td>";

            html += "<td>";
            html += snapshot?.roleMirrorCategory ?? "";
            html += "</td>";

            html += "<td>";
            if (snapshot?.mirrorIndex !== undefined && SetupLoader.isCareerFixed(this.credential.id, snapshot.mirrorIndex)) {
                html += "★";
            }
            html += "</td>";

            html += "<td>";
            html += snapshot?.career ?? "";
            html += "</td>";

            html += "<td>";
            html += snapshot?.spellName ?? "";
            html += "</td>";

            html += "<td>";
            html += snapshot?.equipmentHTML ?? "";
            html += "</td>";

            html += "<td style='width:64px;height:64px'>";
            html += snapshot?.petImageHTML ?? "";
            html += "</td>";

            html += "<td>";
            html += snapshot?.petName ?? "";
            html += "</td>";

            html += "<td>";
            html += snapshot?.petSpellHTML ?? "";
            html += "</td>";

            html += "<td>";
            html += "<button role='button' " +
                "class='C_pocket_SnapshotButton C_pocket_CreateSnapshotButton C_StatelessElement' " +
                "id='_pocket_CreateSnapshot_" + key + "'>拍合影</button>";
            html += "</td>";

            html += "<td>";
            html += "<button role='button' " +
                "class='C_pocket_SnapshotButton C_pocket_CreateSnapshotButton2 C_StatelessElement' " +
                "id='_pocket_CreateSnapshot2_" + key + "'>单人照</button>";
            html += "</td>";

            html += "<td>";
            if (snapshot) {
                html += "<button role='button' " +
                    "class='C_pocket_SnapshotButton C_pocket_DeleteSnapshotButton C_StatelessElement' " +
                    "id='_pocket_DeleteSnapshot_" + key + "'>删除</button>";
            } else {
                html += "<button role='button' disabled>删除</button>"
            }
            html += "</td>";

            html += "<td>";
            if (snapshot) {
                html += "<button role='button' " +
                    "class='C_pocket_SnapshotButton C_pocket_RestoreSnapshotButton C_StatelessElement' " +
                    "id='_pocket_RestoreSnapshot_" + key + "'>恢复</button>";
            } else {
                html += "<button role='button' disabled>恢复</button>"
            }
            html += "</td>";

            html += "</tr>";
            table.append($(html));
        }

        $(".C_pocket_CreateSnapshotButton").on("click", event => {
            const btnId = $(event.target).attr("id") as string;
            const key = StringUtils.substringAfter(btnId, "_pocket_CreateSnapshot_");
            if (this.snapshotStorage.load(key)) {
                if (!confirm("请确认拍新快照并覆盖原有的快照？")) {
                    return;
                }
            }
            PocketPage.disableStatelessElements();
            this.createSnapshot(key).then(() => {
                PocketPage.enableStatelessElements();
            });
        });
        $(".C_pocket_CreateSnapshotButton2").on("click", event => {
            const btnId = $(event.target).attr("id") as string;
            const key = StringUtils.substringAfter(btnId, "_pocket_CreateSnapshot2_");
            if (this.snapshotStorage.load(key)) {
                if (!confirm("请确认拍新快照并覆盖原有的快照？")) {
                    return;
                }
            }
            PocketPage.disableStatelessElements();
            this.createSnapshot2(key).then(() => {
                PocketPage.enableStatelessElements();
            });
        });
        $(".C_pocket_DeleteSnapshotButton").on("click", event => {
            const btnId = $(event.target).attr("id") as string;
            const key = StringUtils.substringAfter(btnId, "_pocket_DeleteSnapshot_");
            if (this.snapshotStorage.load(key)) {
                if (!confirm("请确认要删除当前的快照？")) {
                    return;
                }
            }
            PocketPage.disableStatelessElements();
            this.deleteSnapshot(key).then(() => {
                PocketPage.enableStatelessElements();
            });
        });
        $(".C_pocket_RestoreSnapshotButton").on("click", event => {
            const btnId = $(event.target).attr("id") as string;
            const key = StringUtils.substringAfter(btnId, "_pocket_RestoreSnapshot_");
            const snapshot = this.snapshotStorage.load(key);
            if (!snapshot) return;
            if (!confirm("请确认要尝试恢复到指定的快照？")) {
                return;
            }
            PocketPage.disableStatelessElements();
            (this.feature.scrollToPageTitle) && (this.feature.scrollToPageTitle());
            this.restoreSnapshot(snapshot).then(() => {
                PocketPage.enableStatelessElements();
            });
        });
    }

    async dispose() {
    }

    private async refresh(message: OperationMessage) {
        await this.reload();
        await this.render();
        this.feature.publishRefresh(message);
    }

    private async createSnapshot(key: string) {
        const snapshot = new RoleSnapshot();

        const role = await new PersonalStatus(this.credential).load();
        snapshot.roleId = this.credential.id;
        snapshot.roleName = role.name;
        snapshot.roleImage = role.image;
        snapshot.mirrorIndex = role.mirrorIndex;
        snapshot.career = role.career;
        snapshot.spellName = role.spell;

        const spellPage = await new PersonalSpell(this.credential, this.townId).open();
        const spell = spellPage.findBySpellName(snapshot.spellName);
        snapshot.spellId = spell?.id;

        const equipmentPage = await new PersonalEquipmentManagement(this.credential, this.townId).open();
        snapshot.usingWeapon = equipmentPage.usingWeapon?.fullName;
        snapshot.usingArmor = equipmentPage.usingArmor?.fullName;
        snapshot.usingAccessory = equipmentPage.usingAccessory?.fullName;

        const petPage = await new PersonalPetManagement(this.credential, this.townId).open();
        const usingPet = petPage.usingPet;
        snapshot.petName = usingPet?.name;
        snapshot.petImage = usingPet?.picture;
        snapshot.petLevel = usingPet?.level;
        snapshot.petSpell1 = usingPet?.spell1;
        snapshot.petSpell2 = usingPet?.spell2;
        snapshot.petSpell3 = usingPet?.spell3;
        snapshot.petSpell4 = usingPet?.spell4;
        snapshot.petUsingSpell1 = usingPet?.usingSpell1;
        snapshot.petUsingSpell2 = usingPet?.usingSpell2;
        snapshot.petUsingSpell3 = usingPet?.usingSpell3;
        snapshot.petUsingSpell4 = usingPet?.usingSpell4;

        this.snapshotStorage.write(key, snapshot);

        const message = OperationMessage.success();
        message.extensions.set("role", role);
        message.extensions.set("spellPage", spellPage);
        message.extensions.set("equipmentPage", equipmentPage);
        message.extensions.set("petPage", petPage);
        await this.refresh(message);
    }

    private async createSnapshot2(key: string) {
        const snapshot = new RoleSnapshot();

        const role = await new PersonalStatus(this.credential).load();
        snapshot.roleId = this.credential.id;
        snapshot.roleName = role.name;
        snapshot.roleImage = role.image;
        snapshot.mirrorIndex = role.mirrorIndex;
        snapshot.career = role.career;
        snapshot.spellName = role.spell;

        const spellPage = await new PersonalSpell(this.credential, this.townId).open();
        const spell = spellPage.findBySpellName(snapshot.spellName);
        snapshot.spellId = spell?.id;

        const equipmentPage = await new PersonalEquipmentManagement(this.credential, this.townId).open();
        snapshot.usingWeapon = equipmentPage.usingWeapon?.fullName;
        snapshot.usingArmor = equipmentPage.usingArmor?.fullName;
        snapshot.usingAccessory = equipmentPage.usingAccessory?.fullName;

        this.snapshotStorage.write(key, snapshot);

        const message = OperationMessage.success();
        message.extensions.set("role", role);
        message.extensions.set("spellPage", spellPage);
        message.extensions.set("equipmentPage", equipmentPage);
        await this.refresh(message);
    }

    private async deleteSnapshot(key: string) {
        this.snapshotStorage.remove(key);
        await this.refresh(OperationMessage.success());
    }

    private async restoreSnapshot(snapshot: RoleSnapshot) {
        const message = new OperationMessage();

        let role = await new PersonalStatus(this.credential, this.townId).load();
        message.extensions.set("role", role);
        if (role.mirrorIndex! !== snapshot.mirrorIndex!) {
            // 切换到快照的分身
            await new PersonalMirror(this.credential, this.townId).changeMirror(snapshot.mirrorIndex!);
            role = await new PersonalStatus(this.credential, this.townId).load();
            message.extensions.set("role", role);
        }

        if (role.spell! !== snapshot.spellName) {
            // 技能和快照不一样了，尝试恢复快照的技能。
            const spellPage = await new PersonalSpell(this.credential, this.townId).open();
            message.extensions.set("spellPage", spellPage);
            if (spellPage.findBySpellId(snapshot.spellId!)) {
                // 当前分身技能列表中找到了快照技能，切换
                await new PersonalSpell(this.credential, this.townId).set(snapshot.spellId!);
            }
        }

        if (snapshot.usingWeapon || snapshot.usingArmor || snapshot.usingAccessory) {
            let equipmentPage = await new PersonalEquipmentManagement(this.credential, this.townId).open();
            message.extensions.set("equipmentPage", equipmentPage);
            // 尝试恢复快照装备
            const set = new EquipmentSet();
            set.initialize();
            set.weaponName = snapshot.usingWeapon;
            set.armorName = snapshot.usingArmor;
            set.accessoryName = snapshot.usingAccessory;
            await new EquipmentSetLoader(this.credential, equipmentPage.equipmentList!).load(set);
            // 换装有可能成功，有可能不成功
            equipmentPage = await new PersonalEquipmentManagement(this.credential, this.townId).open();
            message.extensions.set("equipmentPage", equipmentPage);
        }

        if (snapshot.petName) {
            let petPage = await new PersonalPetManagement(this.credential, this.townId).open();
            message.extensions.set("petPage", petPage);
            let candidate = this.lookupPet(snapshot, petPage.petList!);
            if (candidate) {
                // 如果快照宠物正在使用则忽略
                if (!candidate.using) {
                    // 切换宠物
                    await new PersonalPetManagement(this.credential, this.townId).set(candidate.index!);
                    petPage = await new PersonalPetManagement(this.credential, this.townId).open();
                    message.extensions.set("petPage", petPage);
                }
            } else {
                // 身上还有空间时尝试从笼子中取出
                if (petPage.petList!.length < 3) {
                    let equipmentPage: PersonalEquipmentManagementPage;
                    if (message.extensions.has("equipmentPage")) {
                        equipmentPage = message.extensions.get("equipmentPage") as PersonalEquipmentManagementPage;
                    } else {
                        equipmentPage = await new PersonalEquipmentManagement(this.credential, this.townId).open();
                        message.extensions.set("equipmentPage", equipmentPage);
                    }
                    const cage = equipmentPage.findGoldenCage();
                    if (cage) {
                        const cagePage = await new GoldenCage(this.credential).open(cage.index!);
                        candidate = this.lookupPet(snapshot, cagePage.petList!);
                        if (candidate) {
                            // 从笼子里面取出来
                            await new GoldenCage(this.credential).takeOut(candidate.index!);
                            petPage = await new PersonalPetManagement(this.credential, this.townId).open();
                            message.extensions.set("petPage", petPage);
                            candidate = this.lookupPet(snapshot, petPage.petList!);
                            if (candidate) {
                                // 切换宠物
                                await new PersonalPetManagement(this.credential, this.townId).set(candidate.index!);
                                petPage = await new PersonalPetManagement(this.credential, this.townId).open();
                                message.extensions.set("petPage", petPage);
                            }
                        }
                    }
                }
            }
        }

        message.extensions.set("mode", "RESTORE");
        message.success = true;
        await this.refresh(message);
    }

    private lookupPet(snapshot: RoleSnapshot, petList: Pet[]) {
        const c1 = _.forEach(petList)
            .filter(it => it.name! === snapshot.petName!);
        if (c1.length === 0) {
            // 宠物名字无法匹配上，最基本的条件无法满足，直接返回null
            return null;
        }

        let c2 = _.forEach(c1)
            .filter(it => it.level! === snapshot.petLevel!);
        if (c2.length === 0) {
            // 宠物的等级无法匹配上，忽略此条件（如果是满级宠物则不会出现此问题）
            c2 = c1;
        }

        let c3 = _.forEach(c2)
            .filter(it => it.attack! === snapshot.petAttack! &&
                it.defense! === snapshot.petDefense! &&
                it.specialAttack! === snapshot.petSpecialAttack! &&
                it.specialDefense! === snapshot.petSpecialDefense! &&
                it.speed! === snapshot.petSpeed!);
        if (c3.length === 0) {
            // 宠物的五维无法匹配上，忽略此条件（如果是满级宠物则不会出现此问题）
            c3 = c2;
        }

        // 返回找到的第一个宠物
        return c3[0];
    }
}

class SnapshotManagerFeature extends CommonWidgetFeature {

    scrollToPageTitle?: () => void;

}

export {SnapshotManager, SnapshotManagerFeature};