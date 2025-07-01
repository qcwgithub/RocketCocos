import { randomRange } from "cc";
import { BoardData } from "./BoardData";
import { CellData } from "./CellData";
import { LevelConfig } from "./LevelConfig";
import { RocketData } from "./RocketData";
import { sc } from "./sc";
import { Shape, ShapeExt } from "./Shape";
import { Alg } from "./Alg";

export class GameData {
    public boardData: BoardData;
    public rocketDatas: RocketData[] = [];
    public Init(): void {

        let levelConfig: LevelConfig = sc.configManager.GetLevelConfig(1);
        this.boardData = new BoardData();
        this.boardData.Init(levelConfig.width, levelConfig.height);

        for (let x = 0; x < levelConfig.width; x++) {
            for (let y = 0; y < levelConfig.height; y++) {
                let cell: CellData = this.boardData.At(x, y);
                cell.forbidLink = false;
                cell.shape = this.RandomShape();
            }
        }

        this.rocketDatas.length = 0;
        for (let y = 0; y < levelConfig.height; y++) {
            let rocketData: RocketData = new RocketData();
            rocketData.level = this.RandomRocketLevel();
            this.rocketDatas.push(rocketData);
        }

        // Alg.RefreshLink(boardData);
        this.RefreshLink();
    }

    public RandomRocketLevel(): number {
        return 1;
    }

    public RandomShape(): Shape {
        return ShapeExt.Without1()[randomRange(0, ShapeExt.Without1().length)];
        // return Shape.LRTB;
    }

    public RefreshLink(): void {
        Alg.RefreshLink(this.boardData);
    }
}