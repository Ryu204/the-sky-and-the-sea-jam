import { DEBUG, PREVIEW } from "cc/env";

export class RuntimeEnv {
    private static readonly inst = new RuntimeEnv();

    private _isDebug: boolean;
    constructor() {
        this._isDebug =
            (PREVIEW && Boolean(localStorage.getItem("runtime_env_debug"))) ||
            (!PREVIEW && DEBUG);
    }

    public static get isDebug() {
        return this.inst._isDebug;
    }
}
