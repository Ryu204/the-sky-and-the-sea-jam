import { _decorator, Component, math, Quat, Vec3 } from "cc";
import { GameplayConst } from "../constants/gameplay";
const { ccclass, property } = _decorator;

const DISABLE_CONTROL_RATIO =
    GameplayConst.minControlRange / GameplayConst.maxControlRange;

@ccclass("Ship")
export class Ship extends Component {
    public init(startPos: Vec3) {
        this.node.setPosition(startPos);
        this.node.setRotation(Quat.IDENTITY);
    }

    public manualUpdate(dt: number, normalizedDir: Vec3 | null) {
        if (normalizedDir) {
            const len = normalizedDir.length();
            if (len > DISABLE_CONTROL_RATIO) {
                this.aimAtDir(normalizedDir);
            }
        }
        this.updatePhysics(normalizedDir);
    }

    private updatePhysics(normalizedDir: Vec3 | null) {}

    private aimAtDir(dir: Vec3) {
        this.node.angle = math.toDegree(Math.atan2(-dir.x, dir.y));
    }
}
