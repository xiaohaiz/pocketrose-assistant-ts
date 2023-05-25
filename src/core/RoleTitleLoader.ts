const ROLE_TITLES: string[] = [
    "流民",
    "公士",
    "上造",
    "簪袅",
    "不更",
    "大夫",
    "官大夫",
    "公大夫",
    "公乘",
    "五大夫",
    "左庶长",
    "右庶长",
    "左更",
    "中更",
    "右更",
    "少上造",
    "大上造",
    "驷车庶长",
    "大庶长",
    "关内侯",
    "彻侯"
];

class RoleTitleLoader {

    static loadTitle(contribution: number) {
        let idx = Math.ceil(contribution / 500);
        idx = Math.max(idx, 0);
        idx = Math.min(idx, 20);
        return ROLE_TITLES[idx];
    }

}

export = RoleTitleLoader;