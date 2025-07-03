import { _decorator, Component, Node } from 'cc';
import { GamePanel } from './GamePanel';
import { MyGame } from './MyGame';
import { sc } from './sc';
import { ConfigManager } from './ConfigManager';
import { MyAssets } from './MyAssets';
import { Profile } from './Profile';
import { PanelManager } from './PanelManager';
const { ccclass, property } = _decorator;

@ccclass('Bootstrap')
export class Bootstrap extends Component {
    @property({ type: PanelManager })
    public panelManager: PanelManager;
    @property({ type: MyGame })
    game: MyGame;
    @property({ type: MyAssets })
    myAssets: MyAssets;

    onLoad() {
        sc.bootstrap = this;
        sc.panelManager = this.panelManager;
        sc.game = this.game;
        sc.myAssets = this.myAssets;

        sc.profile = new Profile("qiucw");
        sc.profile.load();

        sc.configManager = new ConfigManager();
        sc.configManager.load();

        sc.panelManager.mainPanel.show();
    }
}


