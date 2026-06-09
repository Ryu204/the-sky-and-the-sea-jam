import {
    _decorator,
    clamp,
    Component,
    IVec2Like,
    math,
    Quat,
    v3,
    Vec3,
    view,
} from "cc";
import { CustomRigidbody } from "./custom_rigidbody";
import { Assertion } from "../utils/assertion";
import { ShipStats } from "../data/ship_control_stats";
import {
    angleFromUpToVec3,
    dirToAngleDegFromUp,
    smallestOrientationDiff,
} from "../utils/angle";
import { DeepReadonly } from "../utils/custom_types";
import { DetectRange } from "./detect_range";
import { HasDetectionRange } from "./ship_interfaces";
const { ccclass, property } = _decorator;

const tempVecs = [v3()] as const;

@ccclass("Ship")
export class Ship extends Component implements HasDetectionRange {
    @property(DetectRange) private detectionRange!: DetectRange;
    private rigidbody: CustomRigidbody | null = null;
    private stats: ShipStats | null = null;

    public init(startPos: Vec3, stats: ShipStats) {
        this.stats = stats;
        this.setupRigidbody();
        this.node.setPosition(startPos);
        this.node.setRotation(Quat.IDENTITY);
    }

    public manualUpdate(
        dt: number,
        linearControlStrength: number,
        normalizedDir: Vec3 | null,
        angularControlStrength: number,
    ) {
        if (normalizedDir && linearControlStrength > math.EPSILON) {
            this.updateAngularAcceleration(
                normalizedDir,
                angularControlStrength,
            );
        }
        this.updateLinearAcceleration(linearControlStrength);
        this.node.setPosition(
            clampPositionToView(this.node.getPosition(tempVecs[0])),
        );
        this.rigidbody!.manualUpdate(dt);
    }

    public setDetectionRange(rangeInWorldUnit: number) {
        this.detectionRange.setRange(rangeInWorldUnit);
    }

    private updateLinearAcceleration(controlStrength: number) {
        if (controlStrength < math.EPSILON) return;
        Assertion.that(
            this.rigidbody !== null && this.stats !== null,
            "Uninitialized",
        );
        const angle = this.node.angle;
        const movingDir = angleFromUpToVec3(angle, tempVecs[0]);
        this.rigidbody.addLinearAccelerationTilNextUpdate(
            Vec3.multiplyScalar<Vec3, Vec3>(
                tempVecs[0],
                movingDir,
                this.stats.acceleration * controlStrength,
            ),
        );
    }

    private updateAngularAcceleration(
        dir: Vec3,
        angularControlStrength: number,
    ): void {
        if (angularControlStrength < math.EPSILON) return;
        Assertion.that(this.rigidbody !== null && this.stats !== null);
        const desiredAngle = dirToAngleDegFromUp(dir);
        const currentAngle = this.node.angle;
        const diffAngle = smallestOrientationDiff(currentAngle, desiredAngle);
        if (Math.abs(diffAngle) < math.EPSILON) return;
        this.rigidbody.addAngularAccelerationTilNextUpdate(
            this.stats.angularAcceleration *
                (diffAngle < 0 ? -1 : 1) *
                angularControlStrength,
        );
    }

    private setupRigidbody() {
        this.rigidbody = this.addComponent(CustomRigidbody)!;
        this.rigidbody.linearDamping = this.stats!.linearDamping;
        this.rigidbody.angularDamping = this.stats!.angularDamping;
    }

    public readStats(): DeepReadonly<ShipStats> {
        Assertion.that(this.stats !== null, "Uninitialized");
        return this.stats;
    }

    public setStats<K extends keyof ShipStats>(
        key: K,
        value: ShipStats[K],
    ): void {
        Assertion.that(
            this.stats !== null && this.rigidbody !== null,
            "Uninitialized",
        );
        this.stats[key] = value;
        switch (key) {
            case "linearDamping":
                this.rigidbody.linearDamping = value;
                break;
            case "angularDamping":
                this.rigidbody.angularDamping = value;
                break;
        }
    }
}

function clampPositionToView<T extends IVec2Like>(pos: T): T {
    const origin = view.getVisibleOrigin();
    const size = view.getVisibleSize();
    pos.x = clamp(pos.x, origin.x - size.x / 2, origin.x + size.x / 2);
    pos.y = clamp(pos.y, origin.y - size.y / 2, origin.y + size.y / 2);
    return pos;
}
