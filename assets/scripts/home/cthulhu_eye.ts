import { _decorator, Component, math, v3, Vec3 } from "cc";
import { MouseTracker } from "../utils/components/mouse_tracker";
import { Assertion } from "../utils/assertion";

const { ccclass } = _decorator;

const tempVecs = [v3(), v3(), v3()] as const;

@ccclass("CthulhuEye")
export class CthulhuEye extends Component {
    private mouseTracker: MouseTracker | null = null;
    private eyeBallRadius = 0;
    private initialPosition = v3();
    private targetPosition = v3();

    public init(mouseTracker: MouseTracker, eyeBallRadius: number) {
        this.mouseTracker = mouseTracker;
        this.eyeBallRadius = eyeBallRadius;
        this.initialPosition.set(this.node.position);
    }

    public manuallyUpdate(dt: number) {
        if (!this.mouseTracker) return;
        if (this.calculateTargetPosition()) {
            this.updatePosition(dt);
        }
    }

    private calculateTargetPosition(): boolean {
        const mousePos = tempVecs[0];
        Assertion.that(this.mouseTracker !== null);
        if (!this.mouseTracker.getMousePosition(mousePos)) false;
        this.node.parent!.inverseTransformPoint(mousePos, mousePos);
        const dirToMouse = Vec3.subtract(
            tempVecs[1],
            mousePos,
            this.initialPosition,
        );
        const dirLen = dirToMouse.length();
        if (dirLen < math.EPSILON) false;
        const normalizedDir = dirToMouse.multiplyScalar(1 / dirLen);
        const fakePerspectiveFixDir = normalizedDir;
        fakePerspectiveFixDir.x *= 0.75;
        fakePerspectiveFixDir.multiplyScalar(this.eyeBallRadius);
        this.targetPosition.set(
            Vec3.add(tempVecs[2], this.initialPosition, fakePerspectiveFixDir),
        );
        return true;
    }

    private updatePosition(dt: number) {
        const alpha = 1 - Math.exp(-2 * dt);
        this.node.setPosition(
            Vec3.lerp(
                tempVecs[0],
                this.node.position,
                this.targetPosition,
                alpha,
            ),
        );
    }
}
