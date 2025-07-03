import { _decorator, Component, Node } from 'cc';
import { MainPanel } from './Panel/MainPanel';
import { GamePanel } from './Panel/GamePanel';
import { SuccessPanel } from './Panel/SuccessPanel';
import { FailPanel } from './Panel/FailPanel';
import { SettingsPanel } from './Panel/SettingsPanel';
const { ccclass, property } = _decorator;

@ccclass('PanelManager')
export class PanelManager extends Component {
    @property({ type: MainPanel })
    public mainPanel: MainPanel;

    @property({ type: GamePanel })
    public gamePanel: GamePanel;

    @property({ type: SuccessPanel })
    public successPanel: SuccessPanel;

    @property({ type: FailPanel })
    public failPanel: FailPanel;

    @property({ type: SettingsPanel })
    public settingsPanel: SettingsPanel;
}


