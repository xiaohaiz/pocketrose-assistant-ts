class Constants {

    static POCKET_DOMAIN: string = "https://pocketrose.itsns.net.cn/pocketrose";

    static DATABASE_NAME: string = "pocketrose";

    static DATABASE_VERSION: number = 25;

    static MAX_TEAM_MEMBER_COUNT: number = 50;

    static MAX_NETWORK_FAILURE_RETRIES: number = 5;

    static MAX_ROLE_LEVEL: number = 150;

    static MAX_PET_LEVEL: number = 100;

    static MAX_ROLE_EXPERIENCE: number = 14900;

    static isMaxRoleLevel(roleLevel: number | undefined) {
        return roleLevel !== undefined && roleLevel >= Constants.MAX_ROLE_LEVEL;
    }

    static isMaxPetLevel(petLevel: number | undefined) {
        return petLevel !== undefined && petLevel >= Constants.MAX_PET_LEVEL;
    }

    static isMaxRoleExperience(roleExperience: number | undefined) {
        return roleExperience !== undefined && roleExperience >= Constants.MAX_ROLE_EXPERIENCE;
    }

}

export = Constants;