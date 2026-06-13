import { v2 } from 'cc';

/**
 * https://en.wikipedia.org/wiki/Marsaglia_polar_method
 *
 * @param {*} mean Mittel
 * @param {*} sd Spreitzung
 */
export class NormalDistribution {
    private _cache: number[];
    private mean: number;
    private sd: number;

    constructor(mean: number, sd: number) {
        this._cache = [];
        this.mean = mean;
        this.sd = sd;
    }
    private _fill() {
        let u: number, v: number, q: number, p: number;
        do {
            u = 2.0 * Math.random() - 1;
            v = 2.0 * Math.random() - 1;
            q = u * u + v * v;
        } while (q >= 1.0 || q == 0.0);

        p = Math.sqrt((-2 * Math.log(q)) / q);
        let x1 = u * p;
        let x2 = v * p;
        this._cache.push(x1, x2);
    }
    public next(): number {
        if (this._cache.length === 0) {
            this._fill();
        }
        const z = this._cache.pop()!;
        return z * this.sd + this.mean;
    }
}

export const standardNormalDistribution = new NormalDistribution(0, 1);

export function standardNormalDistribution01(halfRange: number = 2.5) {
    const res = standardNormalDistribution.next();
    if (res <= -halfRange) return 0;
    if (res >= halfRange) return 1;
    return res / halfRange + 0.5;
}

export function randomVec2(length: number) {
    const angle = Math.random() * 2 * Math.PI;
    return v2(Math.cos(angle), Math.sin(angle)).multiplyScalar(length);
}
