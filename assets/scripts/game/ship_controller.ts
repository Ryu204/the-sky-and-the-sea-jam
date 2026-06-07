import { _decorator, math, v3, Vec3 } from "cc";
import { Ship } from "./ship";
import { GameplayConst } from "../constants/gameplay";
import { MouseTracker } from "../utils/components/mouse_tracker";
import { dirToAngleDegFromUp, smallestOrientationDiff } from "../utils/angle";

const tempVecs = [v3(), v3()] as const;

export class ShipController {
    constructor(
        private ship: Ship,
        private mouseTracker: MouseTracker,
    ) {}

    public manuallyUpdate(dt: number) {
        const mousePos = tempVecs[0];
        if (!this.mouseTracker!.getMousePosition(mousePos)) return;

        let shipLocalDir: Vec3 | null = tempVecs[1]
            .set(mousePos)
            .subtract(this.ship.node.worldPosition);
        let angularControlStrength = 0;
        const length = shipLocalDir.length();
        if (length > math.EPSILON) {
            shipLocalDir.normalize();
            angularControlStrength = this.getAngularControlStrength(
                dirToAngleDegFromUp(shipLocalDir),
                this.ship.node.angle,
            );
        } else {
            shipLocalDir = null;
        }
        const controlStrength = math.clamp01(
            math.inverseLerp(
                GameplayConst.shipControls.minControlRange,
                GameplayConst.shipControls.maxControlRange,
                length,
            ),
        );
        this.ship.manualUpdate(
            dt,
            controlStrength,
            shipLocalDir,
            angularControlStrength,
        );
    }

    private getAngularControlStrength(
        desiredAngleDeg: number,
        currentAngleDeg: number,
    ) {
        const diff = Math.abs(
            smallestOrientationDiff(desiredAngleDeg, currentAngleDeg),
        );
        const normalized = math.clamp01(
            math.inverseLerp(
                GameplayConst.shipControls.minAngularControlRange,
                GameplayConst.shipControls.maxAngularControlRange,
                diff,
            ),
        );
        return Math.pow(normalized, 0.4);
    }
}
