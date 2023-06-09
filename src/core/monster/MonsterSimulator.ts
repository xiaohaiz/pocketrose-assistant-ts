import _ from "lodash";
import MonsterProfile from "../../common/MonsterProfile";
import Pet from "../../common/Pet";
import PageUtils from "../../util/PageUtils";
import MonsterProfileDict from "./MonsterProfileDict";

class MonsterSimulator {

    readonly #pet: Pet;
    readonly #profile: MonsterProfile;

    a0?: number;
    a1?: number;
    a2?: number;
    a3?: number;
    a4?: number;
    a5?: number;
    a6?: number;

    constructor(pet: Pet) {
        this.#pet = pet;
        this.#profile = MonsterProfileDict.load(pet.code!)!;
    }

    doSimulate(): MonsterSimulator {
        let totalHealth = 0;
        let totalAttack = 0;
        let totalDefense = 0;
        let totalSpecialAttack = 0;
        let totalSpecialDefense = 0;
        let totalSpeed = 0;
        let totalCapacity = 0;

        if (this.#pet.level! < 100) {
            for (let i = 0; i < 10; i++) {
                let p = _.clone(this.#pet);

                const delta = 100 - p.level!;
                for (let j = 0; j < delta; j++) {
                    p.level = p.level! + 1;

                    // health
                    let max = 20 + (this.#profile.healthEffort! * 10);
                    let add = _.random(0, max);
                    p.maxHealth = p.maxHealth! + add;
                    // attack
                    max = this.#profile.attackEffort! + 1;
                    add = _.random(0, max);
                    p.attack = p.attack! + add;
                    // defense
                    max = this.#profile.defenseEffort! + 1;
                    add = _.random(0, max);
                    p.defense = p.defense! + add;
                    // special attack
                    max = this.#profile.specialAttackEffort! + 1;
                    add = _.random(0, max);
                    p.specialAttack = p.specialAttack! + add;
                    // special defense
                    max = this.#profile.specialDefenseEffort! + 1;
                    add = _.random(0, max);
                    p.specialDefense = p.specialDefense! + add;
                    // speed
                    max = this.#profile.speedEffort! + 1;
                    add = _.random(0, max);
                    p.speed = p.speed! + add;
                }

                totalHealth += p.maxHealth!;
                totalAttack += p.attack!;
                totalDefense += p.defense!;
                totalSpecialAttack += p.specialAttack!;
                totalSpecialDefense += p.specialDefense!;
                totalSpeed += p.speed!;
                totalCapacity += p.capacity;
            }
        } else {
            totalHealth = this.#pet.maxHealth! * 10;
            totalAttack = this.#pet.attack! * 10;
            totalDefense = this.#pet.defense! * 10;
            totalSpecialAttack = this.#pet.specialAttack! * 10;
            totalSpecialDefense = this.#pet.specialDefense! * 10;
            totalSpeed = this.#pet.speed! * 10;
            totalCapacity = this.#pet.capacity! * 10;
        }

        this.a0 = Math.ceil(totalHealth / 10);
        this.a1 = Math.ceil(totalAttack / 10);
        this.a2 = Math.ceil(totalDefense / 10);
        this.a3 = Math.ceil(totalSpecialAttack / 10);
        this.a4 = Math.ceil(totalSpecialDefense / 10);
        this.a5 = Math.ceil(totalSpeed / 10);
        this.a6 = Math.ceil(totalCapacity / 10);

        return this;
    }

    doGenerateHtml() {
        const d0 = (Math.min(1, this.a0! / (this.#profile.perfectHealth)) * 100);
        const d1 = (Math.min(1, this.a1! / (this.#profile.perfectAttack)) * 100);
        const d2 = (Math.min(1, this.a2! / (this.#profile.perfectDefense)) * 100);
        const d3 = (Math.min(1, this.a3! / (this.#profile.perfectSpecialAttack)) * 100);
        const d4 = (Math.min(1, this.a4! / (this.#profile.perfectSpecialDefense)) * 100);
        const d5 = (Math.min(1, this.a5! / (this.#profile.perfectSpeed)) * 100);
        const d6 = (Math.min(1, this.a6! / (this.#profile.perfectCapacity)) * 100);

        return PageUtils.generateProgressBarHTML(d6 / 100) + "&nbsp;" + d6.toFixed(2) + "%";
    }
}

export = MonsterSimulator;