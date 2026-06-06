import { _decorator, Component, math, v3, Vec3, view } from "cc";
import { Ship } from "./ship";
import { GameplayConst } from "../constants/gameplay";
import { MouseTracker } from "../utils/mouse_tracker";
import { RuntimeEnv } from "../utils/runtime_env";
import { addShipDebug } from "./ship_debug";
import { dirToAngleDegFromUp, smallestOrientationDiff } from "../utils/angle";
const { ccclass, property } = _decorator;

const tempVecs = [v3(), v3()] as const;

@ccclass("GameFlow")
export class GameFlow extends Component {
    @property(Ship) private ship!: Ship;

    private mouseTracker!: MouseTracker;

    public init() {
        this.ship.init(
            this.getShipStartingPosition(),
            structuredClone(GameplayConst.shipMovements),
        );
        this.mouseTracker =
            this.getComponent(MouseTracker) || this.addComponent(MouseTracker)!;
        if (RuntimeEnv.isDebug) {
            addShipDebug(this.ship);
        }
    }

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

    private getShipStartingPosition() {
        const screenHeight = view.getVisibleSize().y;
        return v3(
            0,
            (-0.5 + GameplayConst.shipInitialDistFromBottomOverScreenHeight) *
                screenHeight,
            0,
        );
    }

    private getAngularControlStrength(
        desiredAngleDeg: number,
        currentAngleDeg: number,
    ) {
        const diff = Math.abs(
            smallestOrientationDiff(desiredAngleDeg, currentAngleDeg),
        );
        return math.clamp01(
            math.inverseLerp(
                GameplayConst.shipControls.minAngularControlRange,
                GameplayConst.shipControls.maxAngularControlRange,
                diff,
            ),
        );
    }
}
