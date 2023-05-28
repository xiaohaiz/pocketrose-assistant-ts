class ConversationPage {

    static parse(html: string) {
        const tr = $(html)
            .find("tbody:first")
            .find("> tr:last");

        return new ConversationPage();
    }
}

export = ConversationPage;