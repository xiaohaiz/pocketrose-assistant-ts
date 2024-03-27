import _ from "lodash";
import StorageUtils from "../../util/StorageUtils";
import BattleFieldThreshold from "../battle/BattleFieldThreshold";
import EquipmentExperienceConfig from "../equipment/EquipmentExperienceConfig";
import EquipmentSetConfig from "../equipment/EquipmentSetConfig";
import ZodiacPartner from "../monster/ZodiacPartner";

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

    static loadEquipmentSetConfig(id: string, index: string): EquipmentSetConfig {
        const mapping = {
            "A": "_pa_019_",
            "B": "_pa_020_",
            "C": "_pa_021_",
            "D": "_pa_022_",
            "E": "_pa_023_"
        };
        // @ts-ignore
        const keyPrefix = mapping[index] as string;
        const s = StorageUtils.getString(keyPrefix + id);
        if (s === "") {
            return EquipmentSetConfig.defaultInstance(index);
        }
        const value = JSON.parse(s);
        const config = new EquipmentSetConfig();
        config.index = index;
        (value.alias !== undefined) && (config.alias = value.alias);
        (value.weaponName !== undefined) && (config.weaponName = value.weaponName);
        (value.armorName !== undefined) && (config.armorName = value.armorName);
        (value.accessoryName !== undefined) && (config.accessoryName = value.accessoryName);
        (value.weaponStar !== undefined) && (config.weaponStar = value.weaponStar);
        (value.armorStar !== undefined) && (config.armorStar = value.armorStar);
        (value.accessoryStar !== undefined) && (config.accessoryStar = value.accessoryStar);
        return config;
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

    static loadEquipmentExperienceConfig(id: string): EquipmentExperienceConfig {
        const s = StorageUtils.getString("_pa_065_" + id);
        if (s === "") {
            return EquipmentExperienceConfig.defaultInstance();
        }
        const value = JSON.parse(s);
        const config = new EquipmentExperienceConfig();
        config.weapon = (value.weapon !== undefined && value.weapon);
        config.armor = (value.armor !== undefined && value.armor);
        config.accessory = (value.accessory !== undefined && value.accessory);
        return config;
    }

    static loadZodiacPartner(id: string): ZodiacPartner | undefined {
        const s = StorageUtils.getString("_pa_066_" + id);
        if (s === "") {
            return undefined;
        }
        const value = JSON.parse(s);
        const partner = new ZodiacPartner();
        partner.name = value.name;
        partner.level = value.level;
        partner.maxHealth = value.maxHealth;
        partner.attack = value.attack;
        partner.defense = value.defense;
        partner.specialAttack = value.specialAttack;
        partner.specialDefense = value.specialDefense;
        partner.speed = value.speed;
        return partner;
    }

    static isGemCountVisible(id: string) {
        return StorageUtils.getBoolean("_pa_068_" + id);
    }

    static isAutoChangePointToTown() {
        return StorageUtils.getBoolean("_pa_069");
    }

    static loadMirrorCareerFixedConfig(id: string): {} {
        const s = StorageUtils.getString("_pa_070_" + id);
        if (s === "") {
            return {};
        }
        return JSON.parse(s);
    }

    static isCareerFixed(id: string, mirrorIndex: number): boolean {
        const c: any = SetupLoader.loadMirrorCareerFixedConfig(id);
        return c["_m_" + mirrorIndex];
    }
}

export = SetupLoader;