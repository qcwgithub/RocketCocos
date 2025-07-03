import { _decorator, Component, Node } from 'cc';
import { GamePanel } from './GamePanel';
import { MainPanel } from './MainPanel';
import { SuccessPanel } from './SuccessPanel';
import { FailPanel } from './FailPanel';
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
}


