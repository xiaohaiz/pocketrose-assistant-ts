class CareerChangeLog {

    id?: string;
    roleId?: string;
    createTime?: number;

    career_1?: string;
    level_1?: number;
    health_1?: number;
    mana_1?: number;
    attack_1?: number;
    defense_1?: number;
    specialAttack_1?: number;
    specialDefense_1?: number;
    speed_1?: number;

    career_2?: string;
    level_2?: number;
    health_2?: number;
    mana_2?: number;
    attack_2?: number;
    defense_2?: number;
    specialAttack_2?: number;
    specialDefense_2?: number;
    speed_2?: number;

    asDocument() {
        const document = {};
        // @ts-ignore
        this.id && (document.id = this.id);
        // @ts-ignore
        this.roleId && (document.roleId = this.roleId);
        // @ts-ignore
        (this.createTime !== undefined) && (document.createTime = this.createTime);
        // @ts-ignore
        this.career_1 && (document.career_1 = this.career_1);
        // @ts-ignore
        (this.level_1 !== undefined) && (document.level_1 = this.level_1);
        // @ts-ignore
        (this.health_1 !== undefined) && (document.health_1 = this.health_1);
        // @ts-ignore
        (this.mana_1 !== undefined) && (document.mana_1 = this.mana_1);
        // @ts-ignore
        (this.attack_1 !== undefined) && (document.attack_1 = this.attack_1);
        // @ts-ignore
        (this.defense_1 !== undefined) && (document.defense_1 = this.defense_1);
        // @ts-ignore
        (this.specialAttack_1 !== undefined) && (document.specialAttack_1 = this.specialAttack_1);
        // @ts-ignore
        (this.specialDefense_1 !== undefined) && (document.specialDefense_1 = this.specialDefense_1);
        // @ts-ignore
        (this.speed_1 !== undefined) && (document.speed_1 = this.speed_1);
        // @ts-ignore
        this.career_2 && (document.career_2 = this.career_2);
        // @ts-ignore
        (this.level_2 !== undefined) && (document.level_2 = this.level_2);
        // @ts-ignore
        (this.health_2 !== undefined) && (document.health_2 = this.health_2);
        // @ts-ignore
        (this.mana_2 !== undefined) && (document.mana_2 = this.mana_2);
        // @ts-ignore
        (this.attack_2 !== undefined) && (document.attack_2 = this.attack_2);
        // @ts-ignore
        (this.defense_2 !== undefined) && (document.defense_2 = this.defense_2);
        // @ts-ignore
        (this.specialAttack_2 !== undefined) && (document.specialAttack_2 = this.specialAttack_2);
        // @ts-ignore
        (this.specialDefense_2 !== undefined) && (document.specialDefense_2 = this.specialDefense_2);
        // @ts-ignore
        (this.speed_2 !== undefined) && (document.speed_2 = this.speed_2);
        return document;
    }

    get healthInherit() {
        const ratio = this.health_2! / this.health_1!;
        return this.#formatRatio(ratio);
    }

    get manaInherit() {
        const ratio = this.mana_2! / this.mana_1!;
        return this.#formatRatio(ratio);
    }

    get attackInherit() {
        const ratio = this.attack_2! / this.attack_1!;
        return this.#formatRatio(ratio);
    }

    get defenseInherit() {
        const ratio = this.defense_2! / this.defense_1!;
        return this.#formatRatio(ratio);
    }

    get specialAttackInherit() {
        const ratio = this.specialAttack_2! / this.specialAttack_1!;
        return this.#formatRatio(ratio);
    }

    get specialDefenseInherit() {
        const ratio = this.specialDefense_2! / this.specialDefense_1!;
        return this.#formatRatio(ratio);
    }

    get speedInherit() {
        const ratio = this.speed_2! / this.speed_1!;
        return this.#formatRatio(ratio);
    }

    #formatRatio(ratio: number): string {
        const r = Math.max(0, Math.min(ratio, 1));
        let color;
        if (r < 0.6) {
            color = "red";
        } else if (r < 0.8) {
            color = "green";
        } else {
            color = "blue";
        }
        return "<span style='color:" + color + "'>" + r.toFixed(2) + "</span>";
    }

}

export = CareerChangeLog;