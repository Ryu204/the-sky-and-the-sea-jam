import { Assertion } from "../utils/assertion";
import { DataStorageBackend } from "../utils/saved_data";
import { SettingsDataStorage } from "./settings_data";

export class AllDataStorage {
    private static _inst: AllDataStorage | null = null;
    public static init(gameName: string, backend: DataStorageBackend<string>) {
        this._inst = new AllDataStorage(gameName, backend);
        return this._inst.init();
    }
    public static get settings() {
        Assertion.that(this._inst !== null);
        return this._inst._settings;
    }

    private _settings: SettingsDataStorage<string>;

    private constructor(gameName: string, backend: DataStorageBackend<string>) {
        this._settings = new SettingsDataStorage(
            `${gameName}_settings`,
            backend,
        );
    }

    private async init() {
        const arr = await Promise.all([this._settings.init()]);
        return arr.every(Boolean);
    }
}
