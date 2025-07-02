import { _decorator, Component, Node } from 'cc';
import { GamePanel } from './GamePanel';
import { MyGame } from './MyGame';
import { sc } from './sc';
import { ConfigManager } from './ConfigManager';
const { ccclass, property } = _decorator;

@ccclass('Bootstrap')
export class Bootstrap extends Component {
    @property({ type: GamePanel })
    gamePanel: GamePanel;
    @property({ type: MyGame })
    game: MyGame;

    onLoad() {
        sc.bootstrap = this;
        sc.game = this.game;

        sc.configManager = new ConfigManager();
        sc.configManager.load();
    }
}


