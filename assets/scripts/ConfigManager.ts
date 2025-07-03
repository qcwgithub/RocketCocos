import { assert } from "cc";
import { LevelConfig } from "./LevelConfig";

export class ConfigManager {
    public levelConfigs: LevelConfig[];

    public maxLevel: number;

    public load(): void {
        this.levelConfigs = [];

        var levelConfig = new LevelConfig();
        levelConfig.level = 1;
        levelConfig.width = 3;
        levelConfig.height = 3;
        levelConfig.rocket = 3;
        this.levelConfigs.push(levelConfig);

        levelConfig = new LevelConfig();
        levelConfig.level = 2;
        levelConfig.width = 4;
        levelConfig.height = 6;
        levelConfig.rocket = 5;
        this.levelConfigs.push(levelConfig);

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