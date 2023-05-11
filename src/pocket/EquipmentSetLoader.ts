import Equipment from "../common/Equipment";
import EquipmentSet from "../common/EquipmentSet";
import Credential from "../util/Credential";
import MessageBoard from "../util/MessageBoard";
import NetworkUtils from "../util/NetworkUtils";
import DeprecatedTreasureBag from "./DeprecatedTreasureBag";
import EquipmentParser from "./EquipmentParser";

class EquipmentSetLoader {

    readonly #credential: Credential;
    readonly #equipmentList: Equipment[];

    constructor(credential: Credential, equipmentList: Equipment[]) {
        this.#credential = credential;
        this.#equipmentList = equipmentList;
    }

    async load(set: EquipmentSet): Promise<void> {
        const action = (credential: Credential, equipmentList: Equipment[], set: EquipmentSet) => {
            return new Promise<void>(resolve => {
                set = doScanEquipmentSet(equipmentList, set);
                // 在自身完成了检索
                if (!set.isAllFound && set.treasureBagIndex !== undefined) {
                    // 没有找全，有百宝袋，进继续找。
                    const treasureBag = new DeprecatedTreasureBag(credential, set.treasureBagIndex);
                    treasureBag.open()
                        .then(bagEquipmentList => {
                            const candidateIndexList: number[] = [];
                            if (set.weaponName !== undefined && set.weaponIndex === undefined) {
                                for (const bit of bagEquipmentList) {
                                    if (bit.isWeapon && bit.fullName === set.weaponName) {
                                        MessageBoard.publishMessage("在百宝袋中找到了武器：" + bit.nameHTML);
                                        candidateIndexList.push(bit.index!);
                                        break;
                                    }
                                }
                            }
                            if (set.armorName !== undefined && set.armorIndex === undefined) {
                                for (const bit of bagEquipmentList) {
                                    if (bit.isArmor && bit.fullName === set.armorName) {
                                        MessageBoard.publishMessage("在百宝袋中找到了防具：" + bit.nameHTML);
                                        candidateIndexList.push(bit.index!);
                                        break;
                                    }
                                }
                            }
                            if (set.accessoryName !== undefined && set.accessoryIndex === undefined) {
                                for (const bit of bagEquipmentList) {
                                    if (bit.isAccessory && bit.fullName === set.accessoryName) {
                                        MessageBoard.publishMessage("在百宝袋中找到了饰品：" + bit.nameHTML);
                                        candidateIndexList.push(bit.index!);
                                        break;
                                    }
                                }
                            }
                            if (candidateIndexList.length > 0) {
                                // 在百宝袋中找到了需要的装备，准备拿出来
                                treasureBag.takeOut(candidateIndexList)
                                    .then(() => {
                                        const request = credential.asRequest();
                                        // @ts-ignore
                                        request["mode"] = "USE_ITEM";
                                        NetworkUtils.sendPostRequest("mydata.cgi", request, function (html) {
                                            const newEquipmentList = EquipmentParser.parsePersonalItemList(html);
                                            set = doScanEquipmentSet(newEquipmentList, set);
                                            doLoadEquipmentSet(credential, set, resolve);
                                        });
                                    });
                            } else {
                                // 在百宝袋中没有找到需要的装备
                                doLoadEquipmentSet(credential, set, resolve);
                            }
                        });
                } else {
                    doLoadEquipmentSet(credential, set, resolve);
                }
            });
        };
        return await action(this.#credential, this.#equipmentList, set);
    }
}

function doScanEquipmentSet(equipmentList: Equipment[], set: EquipmentSet) {
    for (const it of equipmentList) {
        if (it.isTreasureBag) {
            set.treasureBagIndex = it.index;
        }
        if (set.weaponName !== undefined) {
            if (it.isWeapon && it.fullName === set.weaponName) {
                MessageBoard.publishMessage("在身上找到了武器：" + it.nameHTML);
                set.weaponIndex = it.index;
                set.weaponUsing = it.using;
            }
        }
        if (set.armorName !== undefined) {
            if (it.isArmor && it.fullName === set.armorName) {
                MessageBoard.publishMessage("在身上找到了防具：" + it.nameHTML);
                set.armorIndex = it.index;
                set.armorUsing = it.using;
            }
        }
        if (set.accessoryName !== undefined) {
            if (it.isAccessory && it.fullName === set.accessoryName) {
                MessageBoard.publishMessage("在身上找到了饰品：" + it.nameHTML);
                set.accessoryIndex = it.index;
                set.accessoryUsing = it.using;
            }
        }
    }
    return set;
}

function doLoadEquipmentSet(credential: Credential, set: EquipmentSet, resolve: () => void) {
    const request = credential.asRequest();
    // @ts-ignore
    request["chara"] = "1";
    // @ts-ignore
    request["mode"] = "USE";
    let count = 0;
    if (set.weaponIndex !== undefined && set.weaponUsing !== undefined && !set.weaponUsing) {
        count++;
        // @ts-ignore
        request["item" + set.weaponIndex] = set.weaponIndex;
    }
    if (set.armorIndex !== undefined && set.armorUsing !== undefined && !set.armorUsing) {
        count++;
        // @ts-ignore
        request["item" + set.armorIndex] = set.armorIndex;
    }
    if (set.accessoryIndex !== undefined && set.accessoryUsing !== undefined && !set.accessoryUsing) {
        count++;
        // @ts-ignore
        request["item" + set.accessoryIndex] = set.accessoryIndex;
    }
    if (count === 0) {
        MessageBoard.publishMessage("没有找到对应的装备或者正在装备中，忽略。");
        resolve();
    } else {
        NetworkUtils.sendPostRequest("mydata.cgi", request, function (html) {
            MessageBoard.processResponseMessage(html);
            resolve();
        });
    }
}

export = EquipmentSetLoader;