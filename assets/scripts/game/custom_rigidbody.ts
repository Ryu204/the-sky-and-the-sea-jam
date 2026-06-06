import { _decorator, Component, v3, Vec3 } from "cc";
import { MoreMath } from "../utils/more_math";
import { smallestOrientationDiff } from "../utils/angle";

const { ccclass, property } = _decorator;

const tempVecs = [v3(), v3(), v3()] as const;

@ccclass("CustomRigidbody")
export class CustomRigidbody extends Component {
    @property public targetUpdatesPerSec = 120;
    @property public linearDamping = 0.0;
    @property public angularDamping = 0.0;

    private accumulatedTime = 0;
    private acceleration = v3();
    private prevPosition: Vec3 | null = null;
    private angularAcceleration = 0;
    private prevAngle: number | null = null;

    public manualUpdate(dt: number) {
        const updateCount = this.fixedDeltaTimeGate(dt);
        dt = 1 / this.targetUpdatesPerSec;
        for (let i = 0; i < updateCount; ++i) {
            // Verlet integration
            if (!this.prevPosition || this.prevAngle === null) {
                this.prevPosition = this.node.getPosition();
                this.prevAngle = this.node.angle;
            }
            const pos = this.node.position;
            const angle = this.node.angle;
            const prevPos = this.prevPosition;
            const prevAngle = this.prevAngle;
            const newPos = tempVecs[0]
                .set(pos)
                .add(
                    Vec3.subtract(tempVecs[1], pos, prevPos).multiplyScalar(
                        1 - this.linearDamping,
                    ),
                )
                .add(
                    tempVecs[2].set(this.acceleration).multiplyScalar(dt * dt),
                );
            const newAngle =
                angle +
                smallestOrientationDiff(prevAngle, angle) *
                    (1 - this.angularDamping) +
                this.angularAcceleration * dt * dt;
            prevPos.set(pos);
            this.prevAngle = angle;
            this.node.setPosition(newPos);
            this.node.angle = MoreMath.fmod(newAngle, 360);
        }
        this.acceleration.set(0, 0, 0);
        this.angularAcceleration = 0;
    }

    public addLinearAccelerationTilNextUpdate(amount: Vec3) {
        this.acceleration.add(amount);
    }

    public addAngularAccelerationTilNextUpdate(amount: number) {
        this.angularAcceleration += amount;
    }

    private fixedDeltaTimeGate(dt: number): number {
        this.accumulatedTime += dt;
        const frameTime = 1 / this.targetUpdatesPerSec;
        const updateCount = Math.floor(this.accumulatedTime / frameTime);
        this.accumulatedTime -= updateCount * frameTime;
        return updateCount;
    }
}
