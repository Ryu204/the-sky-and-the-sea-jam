import { _decorator, Component, math, Quat, v3, Vec3 } from "cc";
import { CustomRigidbody } from "./custom_rigidbody";
import { Assertion } from "../utils/assertion";
import { DeepReadonly } from "../utils/custom_types";
import { ShipStats } from "../data/ship_control_stats";
const { ccclass, property } = _decorator;

const tempVecs = [v3()] as const;

@ccclass("Ship")
export class Ship extends Component {
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
        controlStrength: number,
        normalizedDir: Vec3 | null,
    ) {
        if (normalizedDir) {
            this.aimAtDir(normalizedDir);
        }
        this.updatePhysics(dt, controlStrength, normalizedDir);
    }

    public readStats() {
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
        }
    }

    private updatePhysics(
        dt: number,
        controlStrength: number,
        normalizedDir: Vec3 | null,
    ) {
        Assertion.that(
            this.rigidbody !== null && this.stats !== null,
            "Uninitialized",
        );
        if (controlStrength > math.EPSILON && normalizedDir) {
            this.rigidbody.addAccelerationNextUpdate(
                Vec3.multiplyScalar<Vec3, Vec3>(
                    tempVecs[0],
                    normalizedDir,
                    this.stats.acceleration * controlStrength,
                ),
            );
        }
        this.rigidbody.manualUpdate(dt);
    }

    private aimAtDir(dir: Vec3) {
        this.node.angle = math.toDegree(Math.atan2(-dir.x, dir.y));
    }

    private setupRigidbody() {
        this.rigidbody = this.addComponent(CustomRigidbody)!;
        this.rigidbody.linearDamping = this.stats!.linearDamping;
    }
}
