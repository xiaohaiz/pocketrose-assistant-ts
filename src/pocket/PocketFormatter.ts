import Constants from "../util/Constants";
import SetupLoader from "../setup/SetupLoader";
import PageUtils from "../util/PageUtils";

class PocketFormatter {

    static formatRoleLevelHTML(roleLevel: number | undefined) {
        if (roleLevel === undefined || roleLevel <= 0) return "<span class='C_pocket_RoleLevel'>-</span>";
        if (Constants.isMaxRoleLevel(roleLevel)) {
            return "<span class='C_pocket_RoleLevel' style='color:blue' " +
                "title='" + Constants.MAX_ROLE_LEVEL + " LV'>MAX</span>";
        }
        if (!SetupLoader.isExperienceProgressBarEnabled()) {
            return "<span class='C_pocket_RoleLevel'>" + roleLevel + " LV</span>";
        }
        const ratio = roleLevel / Constants.MAX_ROLE_LEVEL;
        const progressBar = PageUtils.generateProgressBarHTML(ratio, 32);
        const percentage = (ratio * 100).toFixed(2) + "%";
        return "<span title='" + percentage + "' class='C_pocket_RoleLevel'>" + progressBar + " " + roleLevel + " LV</span>";
    }

    static formatPetLevelHTML(petLevel: number | undefined) {
        if (petLevel === undefined || petLevel <= 0) return "<span class='C_pocket_PetLevel'>-</span>";
        if (Constants.isMaxPetLevel(petLevel)) {
            return "<span class='C_pocket_PetLevel' style='color:blue' " +
                "title='" + Constants.MAX_PET_LEVEL + " LV'>MAX</span>";
        }
        if (!SetupLoader.isExperienceProgressBarEnabled()) {
            return "<span class='C_pocket_PetLevel'>" + petLevel + " LV</span>";
        }
        const ratio = petLevel / Constants.MAX_PET_LEVEL;
        const progressBar = PageUtils.generateProgressBarHTML(ratio, 32);
        const percentage = (ratio * 100).toFixed(2) + "%";
        return "<span title='" + percentage + "' class='C_pocket_PetLevel'>" + progressBar + " " + petLevel + " LV</span>";
    }

    static formatRoleExperience(roleExperience: number | undefined) {
        if (roleExperience === undefined || roleExperience < 0) return "<span class='C_pocket_RoleExperience'>-</span>";
        if (Constants.isMaxRoleExperience(roleExperience)) {
            return "<span class='C_pocket_RoleExperience' style='color:blue' " +
                "title='" + roleExperience.toLocaleString() + " EX'>MAX</span>";
        }
        if (!SetupLoader.isExperienceProgressBarEnabled()) {
            return "<span class='C_pocket_RoleExperience'>" + roleExperience.toLocaleString() + " EX</span>";
        }
        const ratio = roleExperience / Constants.MAX_ROLE_EXPERIENCE;
        const progressBar = PageUtils.generateProgressBarHTML(ratio, 32);
        const percentage = (ratio * 100).toFixed(2) + "%";
        return "<span title='" + percentage + "' class='C_pocket_RoleExperience'>" + progressBar +
            " " + roleExperience.toLocaleString() + " EX</span>";
    }

}

export {PocketFormatter};