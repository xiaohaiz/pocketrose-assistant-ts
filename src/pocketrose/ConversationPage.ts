class ConversationPage {

    static parse(html: string) {
        const tr = $(html)
            .find("body:first")
            .find("> table:first")
            .find("> tbody:first")
            .find("> tr:last");

        return new ConversationPage();
    }
}

export = ConversationPage;