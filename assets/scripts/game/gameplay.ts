import {
    _decorator,
    Component,
    director,
    EPhysics2DDrawFlags,
    instantiate,
    PhysicsSystem2D,
    Prefab,
} from "cc";
import { GameFlow } from "./game_flow";
import { RuntimeEnv } from "../utils/runtime_env";
import { resourcesLoad } from "../utils/async_style";
import { AssetInfo } from "../constants/asset_info";
import { GameplayDebug } from "./gameplay_debug";
import { Assertion } from "../utils/assertion";
const { ccclass, property } = _decorator;

@ccclass("Gameplay")
export class Gameplay extends Component {
    @property(GameFlow) private gameFlow!: GameFlow;

    protected override onLoad(): void {
        this.gameFlow.init(PhysicsSystem2D.instance);
        if (RuntimeEnv.isDebug) {
            this.createDebugMenu();
        }
    }

    protected override update(dt: number): void {
        this.gameFlow.manuallyUpdate(dt);
    }

    private async createDebugMenu() {
        const prefab = await resourcesLoad(
            AssetInfo.prefabs.gameplayDebug,
            Prefab,
        );
        const node = instantiate(prefab);
        node.setParent(director.getScene()!);
        const debug = node.getComponent(GameplayDebug)!;
        debug.init(this.onDebugToggleDrawCollider.bind(this));
    }

    private _physicsWorldInitialTimestep: number | null = null;
    private onDebugToggleDrawCollider() {
        const phys = PhysicsSystem2D.instance;
        const flags = EPhysics2DDrawFlags.Aabb | EPhysics2DDrawFlags.Shape;
        const isColliderDrawn = phys.debugDrawFlags === flags;
        if (isColliderDrawn) {
            phys.debugDrawFlags = EPhysics2DDrawFlags.None;
            Assertion.that(
                this._physicsWorldInitialTimestep !== null,
                "Unregistered physics timestep",
            );
            phys.fixedTimeStep = this._physicsWorldInitialTimestep;
        } else {
            phys.debugDrawFlags = flags;
            this._physicsWorldInitialTimestep = phys.fixedTimeStep;
            const reasonableTimestepToRun = 1 / 60;
            phys.fixedTimeStep = reasonableTimestepToRun;
        }
    }
}
