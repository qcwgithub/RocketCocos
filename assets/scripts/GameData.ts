import { assert, randomRangeInt } from "cc";
import { BoardData } from "./BoardData";
import { CellData } from "./CellData";
import { LevelConfig } from "./LevelConfig";
import { RocketData } from "./RocketData";
import { sc } from "./sc";
import { Shape, ShapeExt } from "./Shape";
import { Alg } from "./Alg";

export class GameData {
    public level: number;
    public levelConfig: LevelConfig;
    public startTimeS: number;
    public boardData: BoardData;
    public rocketDatas: RocketData[] = [];
    public collectedRockets: number;
    public init(level: number, startTimeS: number): void {
        this.level = level;
        this.levelConfig = sc.configManager.getLevelConfig(level);
        this.startTimeS = startTimeS;
        this.boardData = new BoardData();
        this.boardData.init(this.levelConfig.width, this.levelConfig.height);

        for (let x = 0; x < this.levelConfig.width; x++) {
            for (let y = 0; y < this.levelConfig.height; y++) {
                let cell: CellData = this.boardData.at(x, y);
                cell.forbidLink = false;
                cell.shape = this.randomShape();
            }
        }

        this.rocketDatas.length = 0;
        for (let y = 0; y < this.levelConfig.height; y++) {
            let rocketData: RocketData = new RocketData();
            rocketData.level = this.randomRocketLevel();
            this.rocketDatas.push(rocketData);
        }

        this.collectedRockets = 0;

        // Alg.RefreshLink(boardData);
        this.refreshLink();
    }

    public randomRocketLevel(): number {
        return 1;
    }

    public randomShape(): Shape {
        let index: number = randomRangeInt(0, ShapeExt.s_without1.length);
        // console.log("random shape~index: " + index);
        let shape: Shape = ShapeExt.s_without1[index];
        // console.log("random shape~shape: " + Shape[shape]);
        return shape;
    }

    public refreshLink(): void {
        Alg.refreshLink(this.boardData);
    }
}