import { _decorator, Component, Node } from 'cc';
import { MyGame } from './MyGame';
import { sc } from './sc';
import { ConfigManager } from './ConfigManager';
import { MyAssets } from './MyAssets';
import { Profile } from './Profile';
import { PanelManager } from './PanelManager';
import { AudioManager } from './AudioManager';
import { Pool } from './Pool';
const { ccclass, property } = _decorator;

@ccclass('Bootstrap')
export class Bootstrap extends Component {
    @property({ type: PanelManager })
    public panelManager: PanelManager;
    @property({ type: MyAssets })
    myAssets: MyAssets;
    @property({ type: AudioManager })
    audioManager: AudioManager;
    @property({ type: ConfigManager })
    configManager: ConfigManager;

    onLoad() {
        sc.bootstrap = this;
        sc.panelManager = this.panelManager;
        sc.myAssets = this.myAssets;
        sc.audioManager = this.audioManager;
        sc.pool = new Pool();

        sc.configManager = this.configManager;
        sc.configManager.load();

        sc.profile = new Profile("qiucw");
        sc.profile.load();


        sc.panelManager.mainPanel.show();
    }
}


