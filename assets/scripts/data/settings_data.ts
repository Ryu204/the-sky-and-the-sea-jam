import { DataStorage, DataStorageBackend } from "../utils/saved_data";
import { SoundClipMode } from "./sound_mode";

const VERSION = 1 as const;

type SettingsData = {
    version: typeof VERSION;
    musicPercent: number;
    soundPercent: number;
    soundMode: SoundClipMode;
};

function increaseDataVersion(data: SettingsData) {
    if (data.version >= VERSION) return;
    switch (data.version) {
        default:
            break;
    }
    ++data.version;
}

export class SettingsDataStorage<Key> extends DataStorage<Key, SettingsData> {
    constructor(key: Key, backend: DataStorageBackend<Key>) {
        super({
            key,
            version: VERSION,
            backend,
            increaseVersionHandler: increaseDataVersion,
        });
    }

    public override getDefaultData(): SettingsData {
        return {
            version: VERSION,
            musicPercent: 100,
            soundPercent: 100,
            soundMode: SoundClipMode.Stereo,
        };
    }

    public getMusicPercent() {
        return this.readData().musicPercent;
    }

    public setMusicPercent(val: number) {
        return this.setField("musicPercent", val);
    }

    public getSoundPercent() {
        return this.readData().soundPercent;
    }

    public setSoundPercent(val: number) {
        return this.setField("soundPercent", val);
    }

    public getSoundMode() {
        return this.readData().soundMode;
    }

    public setSoundMode(mode: SoundClipMode) {
        return this.setField("soundMode", mode);
    }
}
