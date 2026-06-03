import { _decorator, Component, math, Slider } from "cc";
import { AllDataStorage } from "../../data/all_data";
import { ButtonToggle } from "./button_toggle";
import { SoundClipMode } from "../../data/sound_mode";
const { ccclass, property } = _decorator;

@ccclass("PopupSettings")
export class PopupSettings extends Component {
    @property(Slider) private sliderMusicVolume!: Slider;
    @property(Slider) private sliderSoundVolume!: Slider;
    @property(Slider) private sliderMasterVolume!: Slider;
    @property(ButtonToggle) private toggleMonoStereo!: ButtonToggle;

    private wasHandlerSetup = false;

    public init() {
        const currentMasterVol =
            AllDataStorage.settings.getMasterVolumePercent();
        const currentMusicVol = AllDataStorage.settings.getMusicPercent();
        const currentSoundVol = AllDataStorage.settings.getSoundPercent();
        const soundMode = AllDataStorage.settings.getSoundMode();

        this.sliderMasterVolume.progress = math.clamp01(currentMasterVol / 100);
        this.sliderMusicVolume.progress = math.clamp01(currentMusicVol / 100);
        this.sliderSoundVolume.progress = math.clamp01(currentSoundVol / 100);
        this.toggleMonoStereo.selected = soundMode;
        if (!this.wasHandlerSetup) {
            const EVENT_NAME = "slide";
            this.sliderMasterVolume.node.on(
                EVENT_NAME,
                this.onSliderMasterVolumeChanged,
                this,
            );
            this.sliderMusicVolume.node.on(
                EVENT_NAME,
                this.onSliderMusicVolumeChanged,
                this,
            );
            this.sliderSoundVolume.node.on(
                EVENT_NAME,
                this.onSliderSoundVolumeChanged,
                this,
            );
            this.toggleMonoStereo.node.on(
                ButtonToggle.EventType.SELECTED,
                this.onToggleMonoStereoChanged,
                this,
            );
            this.wasHandlerSetup = true;
        }
    }

    private onSliderMusicVolumeChanged(slider: Slider) {
        const newPercent = Math.floor(100 * slider.progress);
        AllDataStorage.settings.setMusicPercent(newPercent);
    }

    private onSliderSoundVolumeChanged(slider: Slider) {
        const newPercent = Math.floor(100 * slider.progress);
        AllDataStorage.settings.setSoundPercent(newPercent);
    }

    private onToggleMonoStereoChanged(toggle: ButtonToggle) {
        const newMode: SoundClipMode = toggle.selected;
        AllDataStorage.settings.setSoundMode(newMode);
    }

    private onSliderMasterVolumeChanged(slider: Slider) {
        const newPercent = Math.floor(100 * slider.progress);
        AllDataStorage.settings.setMusicMasterVolumePercent(newPercent);
    }
}
