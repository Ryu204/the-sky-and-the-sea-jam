import { toDegree, toRadian, v3, Vec3 } from "cc";
import { MoreMath } from "./more_math";

export function angleFromUpToVec3(angleDeg: number, out?: Vec3): Vec3 {
    const angleRad = toRadian(angleDeg);
    return (out ??= v3()).set(-Math.sin(angleRad), Math.cos(angleRad));
}

export function dirToAngleDegFromUp(dir: Vec3): number {
    return toDegree(Math.atan2(-dir.x, dir.y));
}

export function smallestOrientationDiff(fromDeg: number, toDeg: number) {
    const rawDiff = toDeg - fromDeg;
    return MoreMath.fmod(rawDiff + 180, 360) - 180;
}
