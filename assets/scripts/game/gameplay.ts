import { _decorator, Component } from "cc";
import { GameFlow } from "./game_flow";
const { ccclass, property } = _decorator;

@ccclass("Gameplay")
export class Gameplay extends Component {
    @property(GameFlow) private gameFlow!: GameFlow;

    protected override onLoad(): void {
        this.gameFlow.init();
    }

    protected override update(dt: number): void {
        this.gameFlow.manuallyUpdate(dt);
    }
}
