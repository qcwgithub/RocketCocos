import { _decorator, Component, Label, macro, Node, Sprite } from 'cc';
import { MyGame } from '../MyGame';
import { sc } from '../sc';
import { GameData } from '../GameData';
import { MySettings } from '../MySettings';
import { Panel } from './Panel';
import { RotateDir } from '../RotateDir';
const { ccclass, property } = _decorator;

@ccclass('GamePanel')
export class GamePanel extends Panel {
    @property({ type: Label })
    rocketCountLabel: Label;

    @property({ type: Label })
    remainTimeLabel: Label;

    @property({ type: Label })
    levelLabel: Label;

    @property({ type: Node })
    pauseNode: Node;

    @property({ type: Node })
    resumeNode: Node;

    game: MyGame;
    public remainTime: number;
    prevTime: number;
    public paused: boolean;
    public startGame(): void {
        this.cleanup();

        this.game = sc.game;

        let level: number = sc.profile.level;
        this.levelLabel.string = `第 ${level} 关`;

        var gameData = new GameData();
        gameData.init(level);

        this.remainTime = gameData.levelConfig.time;
        this.prevTime = sc.timeInt();

        this.game.startGame(gameData, this.onClickHandler.bind(this));

        this.refreshRocketCount();

        this.game.eventTarget.on(MyGame.Events.collectRockets, this.onCollectRockets, this);

        this.show();

        this._forceRefreshRemainTime = true;
        this.refreshRemainTime();
        this.schedule(this.refreshRemainTime, 1, macro.REPEAT_FOREVER);
    }

    onClickHandler(x: number, y: number, rotateDir: RotateDir): void {
        if (this.paused) {
            return;
        }

        this.game.clickRotate(x, y, rotateDir);
    }

    update(dt: number): void {
        if (this.paused) {
            return;
        }
        this.game.myUpdate(dt);
    }

    public cleanup(): void {
        this.paused = false;
        this.pauseNode.active = !this.paused;
        this.resumeNode.active = this.paused;
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
        this.rocketCountLabel.string = gameData.collectedRockets + "/" + gameData.levelConfig.rocket;
    }

    _forceRefreshRemainTime: boolean;
    refreshRemainTime(): void {
        let gameData: GameData = this.game.gameData;
        if (gameData.result != 0) {
            return;
        }

        let now: number = sc.timeInt();
        let elapsed: number = now - this.prevTime;
        if (elapsed == 0) {
            if (!this._forceRefreshRemainTime) {
                return;
            }
        }

        this._forceRefreshRemainTime = false;

        this.remainTime -= elapsed;
        this.prevTime = now;
        if (this.remainTime < 0) {
            this.remainTime = 0;
        }
        this.remainTimeLabel.string = sc.formatTime(this.remainTime);

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

    public override hide(): void {
        this.cleanup();
        super.hide();
    }

    public onClickHome(): void {
        this.hide();
        sc.panelManager.mainPanel.show();
    }

    public onClickPause(): void {
        this.pause();
    }

    pause(): void {
        this.paused = true;
        this.pauseNode.active = false;
        this.resumeNode.active = true;
        this.unschedule(this.refreshRemainTime);
    }

    public onClickResume(): void {
        this.resume();
    }

    resume(): void {
        this.paused = false;
        this.pauseNode.active = true;
        this.resumeNode.active = false;

        this.prevTime = sc.timeInt();
        this.schedule(this.refreshRemainTime, 1, macro.REPEAT_FOREVER);
    }
}
