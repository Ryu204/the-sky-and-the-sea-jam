export class RuntimeEnv {
    private static readonly inst = new RuntimeEnv();

    private _isDebug: boolean;
    constructor() {
        this._isDebug = Boolean(localStorage.getItem("runtime_env_debug"));
    }

    public static get isDebug() {
        return this.inst._isDebug;
    }
}
