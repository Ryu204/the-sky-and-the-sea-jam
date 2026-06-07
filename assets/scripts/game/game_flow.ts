import { _decorator, Component, v3, view } from "cc";
import { Ship } from "./ship";
import { GameplayConst } from "../constants/gameplay";
import { MouseTracker } from "../utils/components/mouse_tracker";
import { RuntimeEnv } from "../utils/runtime_env";
import { addShipDebug } from "./ship_debug";
import { ShipController } from "./ship_controller";
import { StageSequence } from "./stage/stage_sequence";
import { Assertion } from "../utils/assertion";
import { StageFinal, StageMiddle, StageTutorial } from "./stage/stages";
import { OceanVisual } from "./ocean_visual";
const { ccclass, property } = _decorator;

type Fields = {
    shipController: ShipController;
    mouseTracker: MouseTracker;
    stageSeq: StageSequence;
};

@ccclass("GameFlow")
export class GameFlow extends Component {
    @property(Ship) private ship!: Ship;
    @property(OceanVisual) private ocean!: OceanVisual;

    private fields: ({ isInited: true } & Fields) | { isInited: false } = {
        isInited: false,
    };

    public init() {
        Assertion.that(!this.fields.isInited, "Double init");
        this.ship.init(
            this.getShipStartingPosition(),
            structuredClone(GameplayConst.shipMovements),
        );
        const mouseTracker =
            this.getComponent(MouseTracker) || this.addComponent(MouseTracker)!;
        const stages = [
            new StageTutorial(),
            new StageMiddle(),
            new StageFinal(),
        ];
        this.fields = {
            isInited: true,
            mouseTracker,
            shipController: new ShipController(this.ship, mouseTracker),
            stageSeq: new StageSequence(stages, {
                ocean: this.ocean,
                stageCount: stages.length,
            }),
        };
        if (RuntimeEnv.isDebug) {
            addShipDebug(this.ship);
        }

        this.fields.stageSeq.start();
    }

    public manuallyUpdate(dt: number) {
        Assertion.that(this.fields.isInited);
        this.fields.shipController.manuallyUpdate(dt);
        this.fields.stageSeq.update(dt);
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
