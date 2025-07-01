import { assert } from "cc";
import { LevelConfig } from "./LevelConfig";

export class ConfigManager {
    public levelConfigs: LevelConfig[];

    public maxLevel: number;

    public Load(): void {
        this.levelConfigs = [];

        var levelConfig = new LevelConfig();
        levelConfig.level = 1;
        levelConfig.width = 5;
        levelConfig.height = 5;
        this.levelConfigs.push(levelConfig);

        this.maxLevel = this.levelConfigs[this.levelConfigs.length - 1].level;
    }

    public GetLevelConfig(level: number): LevelConfig {
        let index: number = level - 1;
        if (index >= 0 && index < this.levelConfigs.length) {
            let levelConfig: LevelConfig = this.levelConfigs[index];
            assert(levelConfig.level == level);
            return levelConfig;
        }
        return null;
    }
}