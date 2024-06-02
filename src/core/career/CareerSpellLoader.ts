class CareerSpellLoader {

    static getSpell(career: string): string | undefined {
        return CAREER_SPELL_MAPPING[career];
    }

}

const CAREER_SPELL_MAPPING: any = {
    "魔法剑士": "大地之劍",
    "奥法剑士": "無敵帝王之劍",
    "圣殿武士": "極速斬",
    "剑圣": "烽火神剑",
    "龙战士": "烈阳焚月",
    "拳王": "烈空破",
    "咒灵师": "召喚術",
    "大魔导士": "火龍一擊",
    "吟游诗人": "双重禁咒",
    "小天位": "深蓝的判决",
    "强天位": "深蓝的判决",
    "斋天位": "深蓝的判决",
    "太天位": "深蓝的判决",
    "终极": "深蓝的判决",
}

export {CareerSpellLoader};