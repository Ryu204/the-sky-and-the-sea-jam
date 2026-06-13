import { _decorator, Component, PhysicsSystem2D, v3, view } from "cc";
import { Ship } from "./ship";
import { GameplayConst } from "../constants/gameplay";
import { MouseTracker } from "../utils/components/mouse_tracker";
import { addShipDebug } from "./ship_debug";
import { ShipController } from "./ship_controller";
import { StageSequence } from "./stage/stage_sequence";
import { Assertion } from "../utils/assertion";
import { StageFinal, StageMiddle, StageTutorial } from "./stage/stages";
import { OceanVisual } from "./ocean_visual";
import { GameMeta } from "../constants/game_meta";
import { configPhysicsSystem } from "./physics_system_settings";
import { EnemySpawner } from "./enemy/enemy_spawner";
const { ccclass, property } = _decorator;

type Fields = {
    shipController: ShipController;
    mouseTracker: MouseTracker;
    stageSeq: StageSequence;
    enemySpawner: EnemySpawner;
};

@ccclass("GameFlow")
export class GameFlow extends Component {
    @property(Ship) private ship!: Ship;
    @property(OceanVisual) private ocean!: OceanVisual;

    private fields: ({ isInited: true } & Fields) | { isInited: false } = {
        isInited: false,
    };

    public init(ps: PhysicsSystem2D) {
        Assertion.that(!this.fields.isInited, "Double init");
        configPhysicsSystem(ps);
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
                ship: this.ship,
            }),
            enemySpawner: new EnemySpawner(),
        };
        if (GameMeta.shownEditingTarget === "ship") {
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
