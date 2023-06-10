import StorageUtils from "../util/StorageUtils";

class SetupLoader {

    static isPokemonWikiEnabled(): boolean {
        return StorageUtils.getBoolean("_pa_001");
    }

    static getLodgeHealthLostRatio(): number {
        return StorageUtils.getFloat("_pa_002", 0.6);
    }

    static getLodgeManaLostPoint(): number {
        return StorageUtils.getInt("_pa_003", 100);
    }

    static getRepairMinLimitation(): number {
        return StorageUtils.getInt("_pa_004", 100);
    }

    static getDepositBattleCount(): number {
        return StorageUtils.getInt("_pa_005", 10);
    }

    static isBattleResultAutoScrollEnabled(): boolean {
        return StorageUtils.getBoolean("_pa_006");
    }

    static isBattleForceRecommendationEnabled(): boolean {
        return StorageUtils.getBoolean("_pa_007");
    }

    static isZodiacFlashBattleEnabled(): boolean {
        return StorageUtils.getBoolean("_pa_008");
    }

    static isNormalFlashBattleEnabled(): boolean {
        return StorageUtils.getBoolean("_pa_029");
    }

    static isPetManagementUIEnabled(): boolean {
        return StorageUtils.getBoolean("_pa_009");
    }

    static isCareerTransferEntranceDisabled(id: string): boolean {
        return StorageUtils.getBoolean("_pa_014_" + id);
    }

    static loadEquipmentSet_A(id: string) {
        const s = StorageUtils.getString("_pa_019_" + id);
        if (s === "") {
            const value = {};
            // @ts-ignore
            value["weaponName"] = "NONE";
            // @ts-ignore
            value["armorName"] = "NONE";
            // @ts-ignore
            value["accessoryName"] = "NONE";
            return value;
        } else {
            return JSON.parse(s);
        }
    }

    static loadEquipmentSet_B(id: string) {
        const s = StorageUtils.getString("_pa_020_" + id);
        if (s === "") {
            const value = {};
            // @ts-ignore
            value["weaponName"] = "NONE";
            // @ts-ignore
            value["armorName"] = "NONE";
            // @ts-ignore
            value["accessoryName"] = "NONE";
            return value;
        } else {
            return JSON.parse(s);
        }
    }

    static loadEquipmentSet_C(id: string) {
        const s = StorageUtils.getString("_pa_021_" + id);
        if (s === "") {
            const value = {};
            // @ts-ignore
            value["weaponName"] = "NONE";
            // @ts-ignore
            value["armorName"] = "NONE";
            // @ts-ignore
            value["accessoryName"] = "NONE";
            return value;
        } else {
            return JSON.parse(s);
        }
    }

    static loadEquipmentSet_D(id: string) {
        const s = StorageUtils.getString("_pa_022_" + id);
        if (s === "") {
            const value = {};
            // @ts-ignore
            value["weaponName"] = "NONE";
            // @ts-ignore
            value["armorName"] = "NONE";
            // @ts-ignore
            value["accessoryName"] = "NONE";
            return value;
        } else {
            return JSON.parse(s);
        }
    }

    static loadEquipmentSet_E(id: string) {
        const s = StorageUtils.getString("_pa_023_" + id);
        if (s === "") {
            const value = {};
            // @ts-ignore
            value["weaponName"] = "NONE";
            // @ts-ignore
            value["armorName"] = "NONE";
            // @ts-ignore
            value["accessoryName"] = "NONE";
            return value;
        } else {
            return JSON.parse(s);
        }
    }

    static getBattleHarvestPrompt() {
        const s = StorageUtils.getString("_pa_024");
        if (s === "") {
            const value = {};
            // @ts-ignore
            value["person"] = "NONE";
            // @ts-ignore
            value["text"] = "";
            return value;
        } else {
            return JSON.parse(s);
        }
    }

    static getNormalBattlePrompt() {
        const s = StorageUtils.getString("_pa_025");
        if (s === "") {
            const value = {};
            // @ts-ignore
            value["person"] = "NONE";
            // @ts-ignore
            value["text"] = "";
            return value;
        } else {
            return JSON.parse(s);
        }
    }

    static isExperienceProgressBarEnabled(): boolean {
        return StorageUtils.getBoolean("_pa_026");
    }

    static isHiddenLeaveAndExitEnabled(): boolean {
        return StorageUtils.getBoolean("_pa_028");
    }

    static isCollectTownTaxDisabled(): boolean {
        return StorageUtils.getBoolean("_pa_030");
    }

    static isAsciiTextButtonEnabled(): boolean {
        return StorageUtils.getBoolean("_pa_035");
    }

    static getEnlargeBattleRatio(): number {
        return StorageUtils.getFloat("_pa_036", -1);
    }

    static isConsecrateStateRecognizeEnabled(id: string): boolean {
        return StorageUtils.getBoolean("_pa_037_" + id);
    }

    static isEquipmentPetSortEnabled(): boolean {
        return StorageUtils.getBoolean("_pa_038");
    }

    static isAutoPetMapStorageEnabled() {
        return StorageUtils.getBoolean("_pa_039");
    }

    static isAutoPetStatusStorageEnabled() {
        return StorageUtils.getBoolean("_pa_046");
    }

    static isAutoEquipmentStatusStorageEnabled() {
        return StorageUtils.getBoolean("_pa_047");
    }

    static getTownDashboardShortcutButton(): number {
        return StorageUtils.getInt("_pa_041", -1);
    }

    static getTownDashboardMainButton(): number {
        return StorageUtils.getInt("_pa_054", 0);
    }

    static getTownDashboardExtensionShortcutButton(): number {
        return StorageUtils.getInt("_pa_050", 1);
    }

    static getLoginPageLayout(): number {
        return StorageUtils.getInt("_pa_042", 0);
    }

    static isHideCountryInformationEnabled() {
        return StorageUtils.getBoolean("_pa_043");
    }

    static isOnlyConsecrateInitialPetEnabled() {
        return StorageUtils.getBoolean("_pa_044");
    }

    static isQiHanTitleEnabled(): boolean {
        return StorageUtils.getBoolean("_pa_048");
    }

    static isNewPalaceTaskEnabled(): boolean {
        return StorageUtils.getBoolean("_pa_049");
    }

}

export = SetupLoader;