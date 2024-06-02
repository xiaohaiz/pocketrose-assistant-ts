import _ from "lodash";
import StorageUtils from "../util/StorageUtils";
import BattleFieldThreshold from "../core/battle/BattleFieldThreshold";
import EquipmentExperienceConfig from "../core/equipment/EquipmentExperienceConfig";
import EquipmentSetConfig from "../core/equipment/EquipmentSetConfig";
import ZodiacPartner from "../core/monster/ZodiacPartner";
import {SetupStorage} from "./SetupStorage";

class SetupLoader {

    static isPokemonWikiEnabled(): boolean {
        return SetupStorage.readBoolean("_pa_001");
    }

    static getLodgeHealthLostRatio(): number {
        return SetupStorage.readFloat("_pa_002", 0.6);
    }

    static getLodgeManaLostPoint(): number {
        return SetupStorage.readInt("_pa_003", 100);
    }

    static getRepairMinLimitation(): number {
        return SetupStorage.readInt("_pa_004", 100);
    }

    static getDepositBattleCount(): number {
        return SetupStorage.readInt("_pa_005", 10);
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
        return SetupStorage.readBoolean("_pa_026");
    }

    static isHiddenLeaveAndExitEnabled(): boolean {
        return SetupStorage.readBoolean("_pa_028");
    }

    static isAsciiTextButtonEnabled(): boolean {
        return SetupStorage.readBoolean("_pa_035");
    }

    static getEnlargeBattleRatio(): number {
        return StorageUtils.getFloat("_pa_036", -1);
    }

    static isEquipmentPetSortEnabled(): boolean {
        return SetupStorage.readBoolean("_pa_038");
    }

    static getTownDashboardShortcutButton(): number {
        return StorageUtils.getInt("_pa_041", -1);
    }

    static getTownDashboardMainButton(): number {
        return StorageUtils.getInt("_pa_054", 0);
    }

    static isHideCountryInformationEnabled() {
        return SetupStorage.readBoolean("_pa_043");
    }

    static isOnlyConsecrateInitialPetEnabled() {
        return SetupStorage.readBoolean("_pa_044");
    }

    static isQiHanTitleEnabled(): boolean {
        return SetupStorage.readBoolean("_pa_048");
    }

    static isQuietBattleModeEnabled(): boolean {
        return SetupStorage.readBoolean("_pa_057");
    }

    static isWinnerLeftEnabled(): boolean {
        return SetupStorage.readBoolean("_pa_058");
    }

    static isShortcutPromptHidden(): boolean {
        return SetupStorage.readBoolean("_pa_062");
    }

    static loadBattleFieldThreshold(): BattleFieldThreshold {
        const s = StorageUtils.getString("_pa_064");
        if (s === "") {
            return BattleFieldThreshold.defaultInstance();
        }
        const value = JSON.parse(s);
        const config = BattleFieldThreshold.defaultInstance();
        if (value.a) config.a = _.parseInt(value.a);
        if (value.b) config.b = _.parseInt(value.b);
        if (value.c) config.c = _.parseInt(value.c);
        if (value.forceSenior) config.forceSenior = value.forceSenior;
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

    static isRenameHistoriesHidden(): boolean {
        return SetupStorage.readBoolean("_pa_072");
    }

    static isTraditionalBattleModeEnabled() {
        return SetupStorage.readBoolean("_pa_074");
    }

    static isMobileTownDashboardEnabled() {
        return SetupStorage.readBoolean("_pa_075");
    }

    static isAvoidDigitalValidationCodeEnabled() {
        return SetupStorage.readBoolean("_pa_076");
    }

    static isWarningValidationFailureEnabled() {
        return SetupStorage.readBoolean("_pa_077");
    }

    static isDebugModeEnabled() {
        return SetupStorage.readBoolean("_pa_078");
    }

    static isBattleAdditionalNotificationEnabled() {
        return SetupStorage.readBoolean("_pa_079");
    }

    static isAutoScrollTopEnabled() {
        return SetupStorage.readBoolean("_pa_080");
    }

    static isBattleAdditionalNotificationLeftPanelEnabled() {
        return SetupStorage.readBoolean("_pa_082");
    }

    static isAutoRefreshWhenBattleSessionExpiredEnabled() {
        return SetupStorage.readBoolean("_pa_086");
    }

    static isConfirmAutoRefreshExpiredSessionRiskEnabled() {
        return SetupStorage.readBoolean("_pa_091");
    }

    static isAutoSellBattleTrashEnabled() {
        return SetupStorage.readBoolean("_pa_094");
    }

    static isAutoCollectTownRevenueEnabled() {
        return SetupStorage.readBoolean("_pa_098");
    }

    static getLowContributionJudgementStandard(): number {
        return StorageUtils.getFloat("_pa_099", 5000);
    }

    static isElegantChangeAccessoriesEnabled() {
        return SetupStorage.readBoolean("_pa_100");
    }

}

export = SetupLoader;