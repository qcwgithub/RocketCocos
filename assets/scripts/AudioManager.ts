import { _decorator, AudioClip, AudioSource, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('AudioManager')
export class AudioManager extends Component {
    @property({ type: AudioSource })
    audioSource: AudioSource;

    @property({ type: AudioClip })
    rocketLaunch: AudioClip;

    @property({ type: AudioClip })
    preview: AudioClip;

    public playRocketLaunch(): void {
        this.audioSource.playOneShot(this.rocketLaunch);
    }

    public playPreview(): void {
        this.audioSource.playOneShot(this.preview);
    }
}


