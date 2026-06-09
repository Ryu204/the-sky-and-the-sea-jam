import { _decorator, CircleCollider2D, Component, Node } from "cc";

const { property, ccclass } = _decorator;

@ccclass("DetectRange")
export class DetectRange extends Component {
    @property(Node) private visualNode!: Node;
    @property private currentNodeAsRange = 1;

    private collider: CircleCollider2D | null = null;

    public setRange(rangeInWorldUnit: number) {
        const visualScale = rangeInWorldUnit / this.currentNodeAsRange;
        this.visualNode.setScale(visualScale, visualScale, visualScale);
        this.collider ??= this.addComponent(CircleCollider2D)!;
        this.collider.radius = rangeInWorldUnit;
    }
}
