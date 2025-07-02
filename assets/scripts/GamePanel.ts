import { _decorator, Component, Node } from 'cc';
import { GameData } from './GameData';
import { sc } from './sc';
const { ccclass, property } = _decorator;

@ccclass('GamePanel')
export class GamePanel extends Component {
    public show(gameData: GameData): void {
        // sc.game.startGame(gameData);
    }
}


