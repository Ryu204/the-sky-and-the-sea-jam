import { OperationResultFields } from "../constants/operation_result_fields";
import { Assertion } from "./assertion";
import { DeepReadonly } from "./custom_types";

type GetDataResult<Data> =
    | { type: OperationResultFields.Ok; data: Data }
    | { type: OperationResultFields.Fail; message?: string }
    | { type: OperationResultFields.NotFound };

type SaveDataResult =
    | {
          type: OperationResultFields.Ok;
      }
    | {
          type: OperationResultFields.Fail;
          message?: string;
      };

export interface SavableData {
    version: number;
    migrateToNextVersion(): void;
}

export interface DataStorageBackend<Key> {
    getRawData(key: Key): Promise<GetDataResult<unknown>>;
    saveRawData(key: Key, data: unknown): Promise<SaveDataResult>;
}

export abstract class DataStorage<Key, Data extends SavableData> {
    abstract getDefaultData(): Data;

    private data: Data | null = null;
    private readonly key: Key;
    private readonly version: number;
    private readonly backend: DataStorageBackend<Key>;
    private isInitialized: boolean = false;

    constructor(key: Key, version: number, backend: DataStorageBackend<Key>) {
        this.key = key;
        this.version = version;
        this.backend = backend;
    }
    public async init(): Promise<boolean> {
        this.isInitialized = false;
        this.data = null;
        const rawData = await this.backend.getRawData(this.key);
        switch (rawData.type) {
            case OperationResultFields.NotFound: {
                this.data = this.getDefaultData();
                Assertion.that(
                    this.data.version <= this.version,
                    "Don't know what to do with default data, version too high",
                );
                while (this.data.version < this.version) {
                    this.data.migrateToNextVersion();
                }
                this.isInitialized = true;
                return true;
            }
            case OperationResultFields.Fail:
                console.error(
                    `Failed to load "${this.key}": ${rawData.message}`,
                );
                return false;
            case OperationResultFields.Ok:
                try {
                    const data = JSON.parse(`${rawData.data}`) as Data;
                    Assertion.that(
                        data.version <= this.version,
                        "Don't know what to do with loaded data, version too high",
                    );
                    this.data = data;
                    while (this.data.version < this.version) {
                        this.data.migrateToNextVersion();
                    }
                    this.isInitialized = true;
                    return true;
                } catch (e) {
                    console.error(`Failed to parse "${this.key}": ${e}`);
                    return false;
                }
            default:
                return false;
        }
    }

    protected setField(
        field: keyof Data,
        value: Data[typeof field],
    ): Promise<boolean> {
        Assertion.that(this.isInitialized, "Uninitialized data storage");
        Assertion.that(this.data !== null, "Uninitialized data storage");
        this.data[field] = value;
        return this.saveData();
    }

    protected readData(): DeepReadonly<Data> {
        Assertion.that(this.isInitialized);
        Assertion.that(this.data !== null);
        return this.data as DeepReadonly<Data>;
    }

    private async saveData(): Promise<boolean> {
        const saveResult = await this.backend.saveRawData(this.key, this.data);
        if (saveResult.type === OperationResultFields.Ok) {
            return true;
        }
        console.error(`Failed to save "${this.key}": ${saveResult.message}`);
        return false;
    }
}

export class DataStorageLocalStorageBackend<
    Key,
> implements DataStorageBackend<Key> {
    public getRawData(key: Key): Promise<GetDataResult<unknown>> {
        try {
            const value = localStorage.getItem(`${key}`);
            if (value === undefined) {
                return Promise.resolve({
                    type: OperationResultFields.NotFound,
                });
            }
            return Promise.resolve({
                type: OperationResultFields.Ok,
                data: value,
            });
        } catch (e) {
            return Promise.resolve({
                type: OperationResultFields.Fail,
                message: `${e}`,
            });
        }
    }

    public saveRawData(key: Key, data: unknown): Promise<SaveDataResult> {
        try {
            localStorage.setItem(`${key}`, JSON.stringify(data));
            return Promise.resolve({
                type: OperationResultFields.Ok,
            });
        } catch (e) {
            return Promise.resolve({
                type: OperationResultFields.Fail,
                message: `${e}`,
            });
        }
    }
}
