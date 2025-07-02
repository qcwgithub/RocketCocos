import { _decorator, Component, Node } from 'cc';
import { GameData } from './GameData';
import { sc } from './sc';
const { ccclass, property } = _decorator;

@ccclass('GamePanel')
export class GamePanel extends Component {
    start() {
        this.onClickStart();
    }

    onClickStart(): void {
        var gameData = new GameData();
        gameData.init();

        sc.game.init(gameData);
    }
}


