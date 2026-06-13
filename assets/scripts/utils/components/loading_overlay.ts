import { _decorator, Component, Label } from "cc";

const { property, ccclass } = _decorator;

const loadingTxt = "Loading";

@ccclass("LoadingOverlay")
export class LoadingOverlay extends Component {
    @property(Label) private text!: Label;
    @property animSpeed = 1;

    private currentDot = 0;
    private elapsedTime = 0;

    protected override onLoad(): void {
        this.text.string = loadingTxt;
    }

    protected override update(dt: number): void {
        this.elapsedTime += dt;
        while (this.elapsedTime > 1 / this.animSpeed) {
            this.currentDot = (this.currentDot + 1) % 4;
            this.text.string = `${loadingTxt}${".".repeat(this.currentDot)}`;
            this.elapsedTime -= 1 / this.animSpeed;
        }
    }
}
