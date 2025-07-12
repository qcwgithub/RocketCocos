import { _decorator, assert, Component, TextAsset, widgetManager } from 'cc';
const { ccclass, property } = _decorator;
import { LevelConfig } from "./LevelConfig";
import { CsvLoader } from './CsvLoader';
import { Shape } from './Shape';

@ccclass('ConfigManager')
export class ConfigManager extends Component {
    @property({ type: TextAsset })
    levelCsv: TextAsset;

    @property({ type: TextAsset })
    fixedStartCsv: TextAsset;

    levelConfigs: LevelConfig[];
    public maxLevel: number;

    public load(): void {
        this.loadLevelConfig();
        this.loadFixedStarts();
    }

    loadLevelConfig(): void {
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
            config.LB_RT_RB_LT = loader.readInt("LB_RT_RB_LT");
            config.LRT_LRB_LTB_RTB = loader.readInt("LRT_LRB_LTB_RTB");
            config.LRTB = loader.readInt("LRTB");

            let total = config.L_R_T_B + config.LR_TB + config.LB_RT_RB_LT + config.LRT_LRB_LTB_RTB + config.LRTB;
            assert(total == 100, `level ${level} total is not 100, it is ${total}`);

            this.levelConfigs.push(config);
        }

        this.maxLevel = this.levelConfigs[this.levelConfigs.length - 1].level;
    }

    loadFixedStarts(): void {
        let text: string = this.fixedStartCsv.text;
        let loader = new CsvLoader();
        loader.load(text);
        while (loader.readRow()) {
            let s = loader.readString("0");
            let level = parseInt(s);

            let levelConfig = this.getLevelConfig(level);
            assert(levelConfig != null, `levelConfig is null, level ${level}`);

            let shapes: Shape[][] = new Array(levelConfig.width);
            for (let x = 0; x < levelConfig.width; x++) {
                shapes[x] = new Array(levelConfig.height);
            }

            for (let y = levelConfig.height - 1; y >= 0; y--) {
                let ok = loader.readRow();
                assert(ok, "ok is false");

                for (let x = 0; x < levelConfig.width; x++) {
                    s = loader.readString(x.toString())
                    let shape: Shape = Shape[s];
                    assert(shape >= 0 && shape < Shape.Count, `invalid shape ${shape} x ${x} s ${s}`);

                    shapes[x][y] = shape;
                }
            }

            levelConfig.fixedStart = shapes;
        }
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