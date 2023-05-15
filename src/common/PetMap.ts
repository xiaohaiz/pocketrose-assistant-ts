import Constants from "../util/Constants";

class PetMap {

    code?: string;
    picture?: string;
    count?: number;

    get imageHtml() {
        const src = Constants.POCKET_DOMAIN + "/image/386/" + this.picture!;
        return "<img src='" + src + "' alt='" + this.code! + "'>";
    }
}

export = PetMap;