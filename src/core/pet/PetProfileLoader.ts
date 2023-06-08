import PetProfile from "../../common/PetProfile";
import PocketUtils from "../../util/PocketUtils";
import StringUtils from "../../util/StringUtils";
import MonsterProfileDict from "../monster/MonsterProfileDict";
import PetSpellLoader from "../PetSpellLoader";
import PetRelationLoader from "./PetRelationLoader";

class PetProfileLoader {

    static findByName(name: string): PetProfile | null {
        if (!name.includes("(") || !name.includes(")")) {
            return null;
        }
        const code = StringUtils.substringBetween(name, "(", ")");
        return PetProfileLoader.load(code);
    }

    static load(code: string): PetProfile | null {
        return MonsterProfileDict.load(code);
    }

    static loadAll(): PetProfile[] {
        return MonsterProfileDict.loadAll();
    }

    static searchBySpellName(spellName: string): PetProfile[] {
        const codeList: string[] = PetSpellLoader.searchBySpellName(spellName);
        const profileList: PetProfile[] = [];
        for (const code of codeList) {
            profileList.push(PetProfileLoader.load(code)!);
        }
        return profileList;
    }

    static generatePetProfileHtml(code: string) {
        const profile = PetProfileLoader.load(code)!;
        let html = "";
        html += "<table style='width:100%;border-width:1px;background-color:transparent;margin:auto' id='petProfile-" + profile.code + "'>";
        html += "<tbody>";
        html += "<tr>";
        html += "<th>名字</th>";
        html += "<th>总族</th>";
        html += "<th>命族</th>";
        html += "<th>攻族</th>";
        html += "<th>防族</th>";
        html += "<th>智族</th>";
        html += "<th>精族</th>";
        html += "<th>速族</th>";
        html += "<th>命努</th>";
        html += "<th>攻努</th>";
        html += "<th>防努</th>";
        html += "<th>智努</th>";
        html += "<th>精努</th>";
        html += "<th>速努</th>";
        html += "<th>捕获</th>";
        html += "<th>成长</th>";
        html += "<td rowspan='5' style='text-align:center'>" + profile.imageHtml + "</td>";
        html += "</tr>";
        html += "<tr style='font-weight:bold;text-align:center'>";
        html += "<td rowspan='2'>" + profile.nameHtml + "</td>";
        html += "<td rowspan='2'>" + profile.totalBaseStats + "</td>";
        html += "<td>" + profile.healthBaseStats + "</td>";
        html += "<td>" + profile.attackBaseStats + "</td>";
        html += "<td>" + profile.defenseBaseStats + "</td>";
        html += "<td>" + profile.specialAttackBaseStats + "</td>";
        html += "<td>" + profile.specialDefenseBaseStats + "</td>";
        html += "<td>" + profile.speedBaseStats + "</td>";
        html += "<td rowspan='2'>" + profile.healthEffort + "</td>";
        html += "<td rowspan='2'>" + profile.attackEffort + "</td>";
        html += "<td rowspan='2'>" + profile.defenseEffort + "</td>";
        html += "<td rowspan='2'>" + profile.specialAttackEffort + "</td>";
        html += "<td rowspan='2'>" + profile.specialDefenseEffort + "</td>";
        html += "<td rowspan='2'>" + profile.speedEffort + "</td>";
        html += "<td rowspan='2'>" + profile.catchRatio + "</td>";
        html += "<td rowspan='2'>" + profile.growExperience + "</td>";
        html += "</tr>";
        html += "<tr style='font-weight:bold;text-align:center'>";
        html += "<td>" + profile.perfectHealth + "</td>";
        html += "<td>" + profile.perfectAttack + "</td>";
        html += "<td>" + profile.perfectDefense + "</td>";
        html += "<td>" + profile.perfectSpecialAttack + "</td>";
        html += "<td>" + profile.perfectSpecialDefense + "</td>";
        html += "<td>" + profile.perfectSpeed + "</td>";
        html += "</tr>";
        html += "<tr style='font-weight:bold;text-align:left'>";
        html += "<td colspan='16'>";
        html += PetSpellLoader.loadSpells(profile.code!);
        html += "</td>";
        html += "</tr>";
        html += "<tr style='font-weight:bold;text-align:left'>";
        html += "<td colspan='16' style='height:64px'>";
        for (const it of PetRelationLoader.getPetRelations(parseInt(profile.code!))) {
            const petCode = PocketUtils.asPetCode(it);
            html += PetProfileLoader.load(petCode)!.imageHtml;
        }
        html += "</td>";
        html += "</tr>";
        html += "</tbody>";
        html += "</table>";
        return html;
    }
}


export = PetProfileLoader;