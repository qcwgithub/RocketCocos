import { _decorator, assert, Component, TextAsset } from 'cc';
const { ccclass, property } = _decorator;
import { LevelConfig } from "./LevelConfig";
import { CsvLoader } from './CsvLoader';

@ccclass('ConfigManager')
export class ConfigManager extends Component {
    @property({ type: TextAsset })
    levelCsv: TextAsset;
    public levelConfigs: LevelConfig[];

    public maxLevel: number;

    public load(): void {
        let loader = new CsvLoader();
        loader.load(this.levelCsv.text);

        this.levelConfigs = [];
        let level = 0;
        while (loader.readRow()) {
            let config = new LevelConfig();

            level++;
            config.level = loader.readInt("level");
            assert(level == config.level);

            config.width = loader.readInt("width");
            config.height = loader.readInt("height");
            config.rocket = loader.readInt("rocket");
            config.time = loader.readInt("time");

            config.L_R_T_B = loader.readInt("L_R_T_B");
            config.LR_TB = loader.readInt("LR_TB");
            config.LB_RT_RB_TB = loader.readInt("LB_RT_RB_TB");
            config.LRT_LRB_LTB_RTB = loader.readInt("LRT_LRB_LTB_RTB");
            config.LRTB = loader.readInt("LRTB");

            let total = config.L_R_T_B + config.LR_TB + config.LB_RT_RB_TB + config.LRT_LRB_LTB_RTB + config.LRTB;
            assert(total == 100, `level ${level} total is not 100, it is ${total}`);

            this.levelConfigs.push(config);
        }

        this.maxLevel = this.levelConfigs[this.levelConfigs.length - 1].level;
    }

    public getLevelConfig(level: number): LevelConfig {
        let index: number = level - 1;
        if (index >= 0 && index < this.levelConfigs.length) {
            let levelConfig: LevelConfig = this.levelConfigs[index];
            assert(levelConfig.level == level);
            return levelConfig;
        }
        return null;
    }
}