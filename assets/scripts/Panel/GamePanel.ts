import { _decorator, Component, Label, macro, Node } from 'cc';
import { MyGame } from '../MyGame';
import { sc } from '../sc';
import { GameData } from '../GameData';
import { MySettings } from '../MySettings';
const { ccclass, property } = _decorator;

@ccclass('GamePanel')
export class GamePanel extends Component {
    @property({ type: MyGame })
    public game: MyGame;

    @property({ type: Label })
    rocketCountLabel: Label;

    @property({ type: Label })
    remainTimeLabel: Label;

    public remainTime: number;
    prevTime: number;
    public startGame(): void {
        this.cleanup();

        let level: number = sc.profile.level;

        var gameData = new GameData();
        gameData.init(level);

        this.remainTime = gameData.levelConfig.time;
        this.prevTime = sc.timeInt();

        this.game.startGame(gameData);

        this.refreshRocketCount();

        this.game.eventTarget.on(MyGame.Events.collectRockets, this.onCollectRockets, this);

        this.node.active = true;

        this.refreshRemainTime();
        this.schedule(this.refreshRemainTime, 1, macro.REPEAT_FOREVER);
    }

    public cleanup(): void {
        this.node.active = false;

        this.game.eventTarget.off(MyGame.Events.collectRockets, this.onCollectRockets, this);
        this.game.cleanup();

        this.unschedule(this.refreshRemainTime);
    }

    onCollectRockets(): void {
        this.refreshRocketCount();

        let gameData: GameData = this.game.gameData;
        if (gameData.result != 0) {
            return;
        }

        if (gameData.collectedRockets >= gameData.levelConfig.rocket) {
            if (sc.profile.level < sc.configManager.maxLevel) {
                sc.profile.level++;
            }

            gameData.result = 1;

            sc.panelManager.successPanel.show();
        }
    }

    refreshRocketCount(): void {
        let gameData: GameData = this.game.gameData;
        this.rocketCountLabel.string = "collected " + gameData.collectedRockets + "/" + gameData.levelConfig.rocket;
    }

    refreshRemainTime(): void {
        let gameData: GameData = this.game.gameData;
        if (gameData.result != 0) {
            return;
        }

        let now: number = sc.timeInt();
        let elapsed: number = now - this.prevTime;
        if (elapsed == 0) {
            return;
        }

        this.remainTime -= elapsed;
        this.prevTime = now;
        if (this.remainTime < 0) {
            this.remainTime = 0;
        }
        this.remainTimeLabel.string = this.remainTime.toString();

        if (this.remainTime == 0) {
            gameData.result = -1;
            sc.panelManager.failPanel.show();
        }
    }

    public extendTime(): void {
        let gameData: GameData = this.game.gameData;

        this.remainTime = MySettings.extendTime;

        let now: number = sc.timeInt();
        this.prevTime = now;
        gameData.result = 0;

        this.refreshRocketCount();
        this.refreshRemainTime();
    }
}
