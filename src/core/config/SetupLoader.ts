import _ from "lodash";
import StorageUtils from "../../util/StorageUtils";
import BattleFieldThreshold from "../battle/BattleFieldThreshold";

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

    static isQuietBattleModeEnabled(): boolean {
        return StorageUtils.getBoolean("_pa_057");
    }

    static isWinnerLeftEnabled(): boolean {
        return StorageUtils.getBoolean("_pa_058");
    }

    static isAutoSetBattleFieldEnabled(): boolean {
        return StorageUtils.getBoolean("_pa_059");
    }

    static isEnhancedPetMapEnabled(): boolean {
        return StorageUtils.getBoolean("_pa_060");
    }

    static isForceSeniorBattleEnabled(id: string): boolean {
        return StorageUtils.getBoolean("_pa_061_" + id);
    }

    static isShortcutPromptHidden(): boolean {
        return StorageUtils.getBoolean("_pa_062");
    }

    static isZodiacBattlePetLoveAutoFixEnabled(): boolean {
        return StorageUtils.getBoolean("_pa_063");
    }

    static loadBattleFieldThreshold(): BattleFieldThreshold {
        const s = StorageUtils.getString("_pa_064");
        if (s === "") {
            return BattleFieldThreshold.defaultInstance();
        }
        const value = JSON.parse(s);
        if (!value.a || !value.b || !value.c) {
            return BattleFieldThreshold.defaultInstance();
        }
        const config = new BattleFieldThreshold();
        config.a = _.parseInt(value.a);
        config.b = _.parseInt(value.b);
        config.c = _.parseInt(value.c);
        return config;
    }
}

export = SetupLoader;