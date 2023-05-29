class ConversationPage {

    globalMessageHtml?: string;
    personalMessageHtml?: string;
    redPaperMessageHtml?: string;
    domesticMessageHtml?: string;
    unitMessageHtml?: string;
    townMessageHtml?: string;

    static parse(html: string) {
        const tr = $(html)
            .find("tbody:first")
            .find("> tr:last");

        let td = tr.find("> td:first");
        const globalMessageHtml = td.find("> table:first").html();
        const personalMessageHtml = td.find("> table:eq(1)").html();
        const redPaperMessageHtml = td.find("> table:eq(2)").html();

        td = tr.find("> td:last");
        const domesticMessageHtml = td.find("> table:first").html();
        const unitMessageHtml = td.find("> table:eq(1)").html();
        const townMessageHtml = td.find("> table:eq(2)").html();


        const page = new ConversationPage();
        page.globalMessageHtml = globalMessageHtml;
        page.personalMessageHtml = personalMessageHtml;
        page.redPaperMessageHtml = redPaperMessageHtml;
        page.domesticMessageHtml = domesticMessageHtml;
        page.unitMessageHtml = unitMessageHtml;
        page.townMessageHtml = townMessageHtml;
        return page;
    }
}

export = ConversationPage;