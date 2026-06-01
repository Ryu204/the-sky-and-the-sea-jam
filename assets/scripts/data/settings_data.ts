import {
    DataStorage,
    DataStorageBackend,
    SavableData,
} from "../utils/saved_data";

class SettingsData implements SavableData {
    public static readonly VERSION = 1;
    public version = SettingsData.VERSION;
    public musicPercent!: number;
    public soundPercent!: number;

    constructor(data: Pick<SettingsData, "musicPercent" | "soundPercent">) {
        for (const key of Object.keys(data) as (keyof typeof data)[]) {
            this[key] = data[key];
        }
    }

    public migrateToNextVersion(): void {
        switch (this.version) {
            default:
                return;
        }
    }
}

export class SettingsDataStorage<Key> extends DataStorage<Key, SettingsData> {
    constructor(key: Key, backend: DataStorageBackend<Key>) {
        super(key, SettingsData.VERSION, backend);
    }

    public override getDefaultData(): SettingsData {
        return new SettingsData({ musicPercent: 100, soundPercent: 100 });
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
}
