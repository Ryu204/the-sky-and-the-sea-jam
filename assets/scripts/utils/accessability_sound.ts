import { _decorator, AudioClip, Component } from "cc";
import { AllDataStorage } from "../data/all_data";
import { SoundClipMode, soundClipModeStr } from "../data/sound_mode";
const { ccclass, property } = _decorator;

/**
 * @description Sound clip adapter with MONO and STEREO
 */
@ccclass("AccessabilitySound")
export class AccessabilitySound extends Component {
    @property(AudioClip) public stereo: AudioClip | null = null;
    @property(AudioClip) public mono: AudioClip | null = null;

    public getClipBySettings(): AudioClip | null {
        if (!this.stereo && !this.mono) {
            console.error("No mono or stereo audio clip was assigned");
            return null;
        }
        const soundMode = AllDataStorage.settings.getSoundMode();
        const preferredClip =
            soundMode === SoundClipMode.Mono ? this.mono : this.stereo;
        const otherClip =
            soundMode === SoundClipMode.Mono ? this.stereo : this.mono;
        if (!preferredClip) {
            console.warn(
                `Cannot find sound of mode ${soundClipModeStr(soundMode)} in ${this.node.name}`,
            );
            return otherClip;
        }
        return preferredClip;
    }
}
