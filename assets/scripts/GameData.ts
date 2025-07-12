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
    public boardData: BoardData;
    public rocketDatas: RocketData[] = [];
    public collectedRockets: number;
    public result: number;
    public init(level: number): void {
        this.level = level;
        this.levelConfig = sc.configManager.getLevelConfig(level);
        this.boardData = new BoardData();
        this.boardData.init(this.levelConfig.width, this.levelConfig.height);

        for (let x = 0; x < this.levelConfig.width; x++) {
            for (let y = 0; y < this.levelConfig.height; y++) {
                let cell: CellData = this.boardData.at(x, y);
                cell.forbidLink = false;

                if (this.levelConfig.fixedStart != null) {
                    cell.shape = this.levelConfig.fixedStart[x][y];
                }
                else {
                    cell.shape = this.randomShape();
                }
            }
        }

        this.rocketDatas.length = 0;
        for (let y = 0; y < this.levelConfig.height; y++) {
            let rocketData: RocketData = new RocketData();
            rocketData.level = this.randomRocketLevel();
            this.rocketDatas.push(rocketData);
        }

        this.collectedRockets = 0;
        this.result = 0;

        // Alg.RefreshLink(boardData);
        this.refreshLink();
    }

    public randomRocketLevel(): number {
        return 1;
    }

    public randomShape(): Shape {
        let r: number = randomRangeInt(0, 100); // [0,99]

        let v = this.levelConfig.L_R_T_B;
        if (r < v) {
            let r2 = randomRangeInt(0, 4);
            switch (r2) {
                case 0:
                    return Shape.L;
                case 1:
                    return Shape.R;
                case 2:
                    return Shape.T;
                case 3:
                default:
                    return Shape.B;
            }
        }

        v += this.levelConfig.LR_TB;
        if (r < v) {
            let r2 = randomRangeInt(0, 2);
            switch (r2) {
                case 0:
                    return Shape.LR;
                case 1:
                default:
                    return Shape.TB;
            }
        }

        v += this.levelConfig.LB_RT_RB_LT;
        if (r < v) {
            let r2 = randomRangeInt(0, 4);
            switch (r2) {
                case 0:
                    return Shape.LB;
                case 1:
                    return Shape.RT;
                case 2:
                    return Shape.RB;
                case 3:
                default:
                    return Shape.LT;
            }
        }

        v += this.levelConfig.LRT_LRB_LTB_RTB;
        if (r < v) {
            let r2 = randomRangeInt(0, 4);
            switch (r2) {
                case 0:
                    return Shape.LRT;
                case 1:
                    return Shape.LRB;
                case 2:
                    return Shape.LTB;
                case 3:
                default:
                    return Shape.RTB;
            }
        }

        v += this.levelConfig.LRTB;
        assert(r < v);

        return Shape.LRTB;
    }

    public refreshLink(): void {
        Alg.refreshLink(this.boardData);
    }
}