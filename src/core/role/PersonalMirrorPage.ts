import Mirror from "./Mirror";

class PersonalMirrorPage {

    currentMirror?: Mirror;
    mirrorList?: Mirror[];

    findByIndex(index: number) {
        for (const mirror of this.mirrorList!) {
            if (mirror.index === index) {
                return mirror;
            }
        }
        return null;
    }

    findByCategory(category: string) {
        for (const mirror of this.mirrorList!) {
            if (mirror.category === category) {
                return mirror;
            }
        }
        return null;
    }

}

export = PersonalMirrorPage;