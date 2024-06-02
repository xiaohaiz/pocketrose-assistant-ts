class CountryDenotePage {

    centerHTML?: string;

}

class CountryDenotePageParser {

    static parse(pageHTML: string) {
        const dom = $(pageHTML);
        const center = dom.find("input:submit[value='资金援助']")
            .closest("form")
            .closest("center");
        const page = new CountryDenotePage();
        page.centerHTML = center.html();
        return page;
    }
}

export {CountryDenotePage, CountryDenotePageParser};