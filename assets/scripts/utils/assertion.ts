import { RuntimeEnv } from "./runtime_env";

export class Assertion {
    public static that(cond: boolean, message?: string): asserts cond {
        if (RuntimeEnv.isDebug && !cond) {
            throw new Error(`Assertion failed: ${message}`);
        }
    }
}
