import Constants from "../../util/Constants";

class PersonalChampionRole {

    name?: string;
    image?: string;
    townName?: string;

    get imageHtml(): string {
        const src = Constants.POCKET_DOMAIN + "/image/head/" + this.image;
        return "<img src='" + src + "' alt='" + this.name + "' width='64' height='64' title='" + this.name + "'>";
    }
}

export = PersonalChampionRole;