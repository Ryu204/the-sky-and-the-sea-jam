import { _decorator, AudioClip, Component, Node } from "cc";
const { ccclass, property } = _decorator;

export enum SoundClipMode {
    Mono,
    Stereo,
}

/**
 * @description Sound clip adapter with MONO and STEREO
 */
@ccclass("AccessabilitySound")
export class AccessabilitySound extends Component {
    @property(AudioClip) public stereo: AudioClip | null = null;
    @property(AudioClip) public mono: AudioClip | null = null;

    // TODO: Each data storage needs to be exposed to client code either via
    // Singleton or Context pattern
    // Singleton is the simplest and does not have major drawbacks to me so far
    public getClipBySettings(): AudioClip | null {
        if (!this.stereo && !this.mono) {
            console.error("No mono or stereo audio clip was assigned");
            return null;
        }
        // const settings = ;
    }
}
