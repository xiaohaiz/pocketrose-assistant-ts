import Role from "../role/Role";
import PersonalChampionRole from "./PersonalChampionRole";

/**
 * ----------------------------------------------------------------------------
 * 个人天真页面数据结构
 * ----------------------------------------------------------------------------
 * - role: 角色信息
 * - turnCount: 第几届比赛
 * - candidates: 报名者
 * - winners: 历届优胜者
 * - registration: 是否允许报名
 * ----------------------------------------------------------------------------
 */
class TownPersonalChampionPage {

    role?: Role;
    turnCount?: number;
    candidates?: PersonalChampionRole[];
    winners?: PersonalChampionRole[];
    registration?: boolean;

}

export = TownPersonalChampionPage;