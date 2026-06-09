import { _decorator, Button, Component, Node } from "cc";

const { property, ccclass } = _decorator;

@ccclass("GameplayDebug")
export class GameplayDebug extends Component {
    @property(Button) private toggleVisible!: Button;
    @property(Node) private menu!: Node;
    @property(Button) private toggleCollider!: Button;

    public init(onToggleCollider: () => void) {
        this.toggleVisible.node.on(
            Button.EventType.CLICK,
            this.onVisibleButtonClicked,
            this,
        );
        this.toggleCollider.node.on(Button.EventType.CLICK, onToggleCollider);

        this.menu.active = false;
    }

    private onVisibleButtonClicked() {
        this.menu.active = !this.menu.active;
    }
}
