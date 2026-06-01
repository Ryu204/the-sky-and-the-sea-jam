import { _decorator, Button, Component, director, Node } from "cc";
const { ccclass, property } = _decorator;

@ccclass("Main")
export class Main extends Component {
    @property(Button) private btnPlay!: Button;

    protected override onLoad(): void {
        this.btnPlay.node.on(Button.EventType.CLICK, this.goToGameplay, this);
    }

    public goToGameplay(): void {
        director.loadScene("gameplay");
    }
}
