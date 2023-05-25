const POCKET_RANK_TITLES = {
    "流浪者": 0,
    "平民": 1,
    "公民": 2,
    "侍": 3,
    "骑士": 4,
    "保民官": 5,
    "市政官": 6,
    "执政官": 7,
    "行省总督": 8,
    "领主": 9,
    "勋爵": 10,
    "从男爵": 11,
    "男爵": 12,
    "子爵": 13,
    "伯爵": 14,
    "侯爵": 15,
    "公爵": 16,
    "大公": 17,
    "选帝候": 18,
    "亲王": 19,
    "皇族": 20,
};

const RANK_TITLES: string[] = [
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

class RankTitleLoader {

    static getAllRankTitles() {
        return Object.keys(POCKET_RANK_TITLES);
    }

    static transformTitle(title: string): string {
        // @ts-ignore
        const index = POCKET_RANK_TITLES[title];
        return RANK_TITLES[index];
    }

    static calculateTitle(contribution: number) {
        let idx = Math.ceil(contribution / 500);
        idx = Math.max(idx, 0);
        idx = Math.min(idx, 20);
        return RANK_TITLES[idx];
    }

}

export = RankTitleLoader;