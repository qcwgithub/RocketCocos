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

    @property({ type: AudioClip })
    pipeRotate: AudioClip;

    @property({ type: AudioSource })
    fuseBurn: AudioSource;

    public playRocketLaunch(): void {
        this.audioSource.playOneShot(this.rocketLaunch, 0.2);
    }

    public playPreview(): void {
        // this.audioSource.playOneShot(this.preview, 0.5);
    }

    public playPipeRotate(): void {
        // this.audioSource.playOneShot(this.pipeRotate, 0.3);
    }

    public playFuseBurn(): void {
        this.fuseBurn.play();
    }

    public stopFuseBurn(): void {
        this.fuseBurn.pause();
    }
}


