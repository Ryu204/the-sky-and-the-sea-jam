export namespace MoreMath {
    export function fmod(divisor: number, mod: number) {
        return divisor - Math.floor(divisor / mod) * mod;
    }
}
