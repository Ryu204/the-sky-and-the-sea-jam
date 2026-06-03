import { _decorator, Component, v3, view } from "cc";
import { Ship } from "./ship";
import { GameplayConst } from "../constants/gameplay";
import { MouseTracker } from "../utils/mouse_tracker";
const { ccclass, property } = _decorator;

const tempVecs = [v3(), v3()] as const;

@ccclass("GameFlow")
export class GameFlow extends Component {
    @property(Ship) private ship!: Ship;

    private mouseTracker!: MouseTracker;

    public init() {
        this.ship.init(this.getShipStartingPosition());
        this.mouseTracker =
            this.getComponent(MouseTracker) || this.addComponent(MouseTracker)!;
    }

    public manuallyUpdate(dt: number) {
        const mousePos = tempVecs[0];
        if (!this.mouseTracker!.getMousePosition(mousePos)) return;

        const shipLocalDir = tempVecs[1]
            .set(mousePos)
            .subtract(this.ship.node.worldPosition);
        const length = shipLocalDir.length();
        shipLocalDir
            .normalize()
            .multiplyScalar(
                Math.min(length / GameplayConst.maxControlRange, 1),
            );
        this.ship.manualUpdate(dt, shipLocalDir);
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
}
