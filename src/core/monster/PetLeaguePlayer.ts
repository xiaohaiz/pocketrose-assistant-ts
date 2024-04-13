class PetLeaguePlayer {

    index?: number;
    online?: boolean;       // 参加
    mainForce?: boolean;    // 主力
    name?: string;
    maxHealth?: number;
    attack?: number;
    defense?: number;
    specialAttack?: number;
    specialDefense?: number;
    speed?: number;

    get healthHtml() {
        return this.maxHealth + "/" + this.maxHealth;
    }

    get attackHtml() {
        if (this.attack! >= 375) {
            return "<span title='倚天' style='color:red;font-weight:bold'>" + this.attack + "</span>"
        } else {
            return this.attack!.toString();
        }
    }

    get defenseHtml() {
        if (this.defense! >= 375) {
            return "<span title='磐石' style='color:red;font-weight:bold'>" + this.defense + "</span>"
        } else {
            return this.defense!.toString();
        }
    }

    get specialAttackHtml() {
        if (this.specialAttack! >= 375) {
            return "<span title='仙人' style='color:red;font-weight:bold'>" + this.specialAttack + "</span>"
        } else {
            return this.specialAttack!.toString();
        }
    }

    get specialDefenseHtml() {
        if (this.specialDefense! >= 375) {
            return "<span title='军神' style='color:red;font-weight:bold'>" + this.specialDefense + "</span>"
        } else {
            return this.specialDefense!.toString();
        }
    }

    get speedHtml() {
        if (this.speed! >= 375) {
            return "<span title='疾风' style='color:red;font-weight:bold'>" + this.speed + "</span>"
        } else {
            return this.speed!.toString();
        }
    }
}

export = PetLeaguePlayer;