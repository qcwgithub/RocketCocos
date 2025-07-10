import { sc } from "./sc";

export class Profile {
    public userId: string;
    public constructor(userId: string) {
        this.userId = userId;
    }

    public load(): void {
        this.level_load();
        this.bgm_load();
        this.sound_load();
        this.vibrate_load();
    }

    K_level: string;
    _level: number;
    level_load(){
        this.K_level = this.userId + "_level";
        let str = localStorage.getItem(this.K_level);
        this._level = parseInt(str) || 1;

        if (this._level > sc.configManager.maxLevel){
            this.level = sc.configManager.maxLevel;
        }
    }
    public get level(): number {
        return this._level;
    }
    public set level(value: number) {
        if (this._level != value) {
            this._level = value;
            localStorage.setItem(this.K_level, value.toString());
        }
    }

    K_bgm: string;
    _bgm: boolean;
    bgm_load(){
        this.K_bgm = this.userId + "_bgm";
        let str = localStorage.getItem(this.K_bgm);
        this._bgm = str != "0";
    }
    public get bgm(): boolean {
        return this._bgm;
    }
    public set bgm(value: boolean) {
        if (this._bgm != value) {
            this._bgm = value;
            localStorage.setItem(this.K_bgm, value ? "1" : "0");
        }
    }

    K_sound: string;
    _sound: boolean;
    sound_load(){
        this.K_sound = this.userId + "_sound";
        let str = localStorage.getItem(this.K_sound);
        this._sound = str != "0";
    }
    public get sound() {
        return this._sound;
    }
    public set sound(value: boolean) {
        if (this._sound != value) {
            this._sound = value;
            localStorage.setItem(this.K_sound, value ? "1" : "0");
        }
    }

    K_vibrate: string;
    _vibrate: boolean;
    vibrate_load(){
        this.K_vibrate = this.userId + "_vibrate";
        let str = localStorage.getItem(this.K_vibrate);
        this._vibrate = str != "0";
    }
    public get vibrate(): boolean {
        return this._vibrate;
    }
    public set vibrate(value: boolean) {
        if (this._vibrate != value) {
            this._vibrate = value;
            localStorage.setItem(this.K_vibrate, value ? "1" : "0");
        }
    }
}