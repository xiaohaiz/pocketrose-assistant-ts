import Castle from "../core/castle/Castle";

class CastleInformationPage {

    castleList?: Castle[];

    findByRoleName(roleName: string) {
        for (const castle of this.castleList!) {
            if (castle.owner === roleName) {
                return castle;
            }
        }
        return null;
    }
}

export = CastleInformationPage;