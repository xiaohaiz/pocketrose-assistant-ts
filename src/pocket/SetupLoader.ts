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

    static isPetManagementUIEnabled(): boolean {
        return StorageUtils.getBoolean("_pa_009");
    }

    static isEquipmentManagementUIEnabled(): boolean {
        return StorageUtils.getBoolean("_pa_010");
    }
}

export = SetupLoader;