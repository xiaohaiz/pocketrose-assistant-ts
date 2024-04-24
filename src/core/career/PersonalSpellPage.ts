import Spell from "./Spell";

class PersonalSpellPage {

    spellList?: Spell[];

    findBySpellId(id: string): Spell | null {
        if (this.spellList === undefined) {
            return null;
        }
        for (const spell of this.spellList!) {
            if (spell.id === id) {
                return spell;
            }
        }
        return null;
    }

    findBySpellName(name: string | undefined): Spell | null {
        if (!name || this.spellList === undefined) return null;
        for (const spell of this.spellList!) {
            if (spell.name === name) {
                return spell;
            }
        }
        return null;
    }
}

export = PersonalSpellPage;