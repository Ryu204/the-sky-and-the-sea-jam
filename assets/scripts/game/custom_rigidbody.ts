import { _decorator, Component, v3, Vec3 } from "cc";

const { ccclass, property } = _decorator;

const tempVecs = [v3(), v3(), v3()] as const;

@ccclass("CustomRigidbody")
export class CustomRigidbody extends Component {
    @property public linearDamping = 0.0;

    private acceleration = v3();

    private prevPosition: Vec3 | null = null;

    public manualUpdate(dt: number) {
        // Verlet integration
        if (!this.prevPosition) {
            this.prevPosition = this.node.getPosition();
            return;
        }
        const pos = this.node.position;
        const prevPos = this.prevPosition;
        const newPos = tempVecs[0]
            .set(pos)
            .add(
                Vec3.subtract(tempVecs[1], pos, prevPos).multiplyScalar(
                    1 - this.linearDamping,
                ),
            )
            .add(tempVecs[2].set(this.acceleration).multiplyScalar(dt * dt));
        prevPos.set(pos);
        this.node.setPosition(newPos);
        this.acceleration.set(0, 0, 0);
    }

    public addAccelerationNextUpdate(amount: Vec3) {
        this.acceleration.add(amount);
    }
}
