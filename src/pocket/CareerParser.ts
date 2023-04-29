class CareerParser {

    static parseCareerTransferCandidateList(pageHtml: string) {
        const careerCandidateList: string[] = [];
        $(pageHtml)
            .find("select[name='syoku_no']")
            .find("option")
            .each(function (_idx, option) {
                const value = $(option).val();
                if (value !== "") {
                    const career = $(option).text().trim();
                    careerCandidateList.push(career);
                }
            });
        return careerCandidateList;
    }

}

export = CareerParser;