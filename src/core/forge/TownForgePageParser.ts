import TownForgePage from "./TownForgePage";

class TownForgePageParser {

    static async parse(html: string): Promise<TownForgePage> {
        const page = new TownForgePage();
        return page;
    }
}

export = TownForgePageParser;