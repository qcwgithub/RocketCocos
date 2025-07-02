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
    public init(): void {

        let levelConfig: LevelConfig = sc.configManager.getLevelConfig(1);
        this.boardData = new BoardData();
        this.boardData.init(levelConfig.width, levelConfig.height);

        for (let x = 0; x < levelConfig.width; x++) {
            for (let y = 0; y < levelConfig.height; y++) {
                let cell: CellData = this.boardData.at(x, y);
                cell.forbidLink = false;
                cell.shape = this.randomShape();
            }
        }

        this.rocketDatas.length = 0;
        for (let y = 0; y < levelConfig.height; y++) {
            let rocketData: RocketData = new RocketData();
            rocketData.level = this.randomRocketLevel();
            this.rocketDatas.push(rocketData);
        }

        // Alg.RefreshLink(boardData);
        this.refreshLink();
    }

    public randomRocketLevel(): number {
        return 1;
    }

    public randomShape(): Shape {
        return ShapeExt.without1()[randomRange(0, ShapeExt.without1().length)];
        // return Shape.LRTB;
    }

    public refreshLink(): void {
        Alg.refreshLink(this.boardData);
    }
}