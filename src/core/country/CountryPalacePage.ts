class CountryPalacePage {

    readonly flowerHTMLs: string[] = [];

}

class CountryPalacePageParser {

    static parse(pageHTML: string) {
        const dom = $(pageHTML);
        const table = dom.find("td:contains('内阁成员')")
            .filter((_idx, e) => {
                const t = $(e).text();
                return t === "内阁成员";
            })
            .closest("table");

        const page = new CountryPalacePage();
        table.find("input:radio")
            .each((_idx, e) => {
                const radio = $(e);
                const flowerHTML = radio.closest("tr")
                    .find("> td:last")
                    .html();
                page.flowerHTMLs.push(flowerHTML);
            });
        return page;
    }
}

export {CountryPalacePage, CountryPalacePageParser};