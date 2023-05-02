class RoleStatus {

    canConsecrate?: boolean;        // 是否可以祭奠
    country?: string;               // 角色自身所属的国家
    townCountry?: string;           // 所在城市所属的国家
    townId?: string;                // 所在城市的ID
    level?: number;
    attack?: number;
    defense?: number;
    specialAttack?: number;
    specialDefense?: number;
    speed?: number;
    battleCount?: number;

}

export = RoleStatus;