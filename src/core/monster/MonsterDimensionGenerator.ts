import * as echarts from "echarts";
import {ECharts, EChartsOption} from "echarts";
import MonsterProfileDict from "./MonsterProfileDict";
import Pet from "./Pet";

class MonsterDimensionGenerator {

    static async generate(pet: Pet): Promise<ECharts | null> {
        let chart: ECharts | null = null;
        const code = pet.code;
        const profile = MonsterProfileDict.load(code);
        if (profile) {
            const option: EChartsOption = {
                tooltip: {
                    show: true
                },
                radar: {
                    // shape: 'circle',
                    indicator: [
                        {name: 'ＨＰ', max: profile.perfectHealth},
                        {name: '攻击', max: profile.perfectAttack},
                        {name: '防御', max: profile.perfectDefense},
                        {name: '智力', max: profile.perfectSpecialAttack},
                        {name: '精神', max: profile.perfectSpecialDefense},
                        {name: '速度', max: profile.perfectSpeed}
                    ]
                },
                series: [
                    {
                        name: pet.name,
                        type: 'radar',
                        data: [
                            {
                                value: [pet.maxHealth!, pet.attack!, pet.defense!,
                                    pet.specialAttack!, pet.specialDefense!, pet.speed!],
                                name: pet.name
                            }
                        ]
                    }
                ]
            };
            const element = document.getElementById("monsterDimension");
            if (element) {
                chart = echarts.init(element);
                chart.setOption(option);
            }
        }

        return await (() => {
            return new Promise<ECharts | null>(resolve => resolve(chart));
        })();
    }

}

export = MonsterDimensionGenerator;