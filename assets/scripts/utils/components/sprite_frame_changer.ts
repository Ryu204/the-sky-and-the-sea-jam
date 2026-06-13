import { _decorator, Component, Enum, Sprite, SpriteFrame } from "cc";

const { property, ccclass } = _decorator;

enum SpriteId {
    btnDefault = "btnDefault",
    btnSmallLeft = "btnSmallLeft",
    btnSmallRight = "btnSmallRight",
}
Enum(SpriteId);

@ccclass("SpriteFrameList")
class SpriteFrameList implements Record<SpriteId, SpriteFrame | null> {
    @property(SpriteFrame) public btnDefault: SpriteFrame | null = null;
    @property(SpriteFrame) public btnSmallLeft: SpriteFrame | null = null;
    @property(SpriteFrame) public btnSmallRight: SpriteFrame | null = null;
}

@ccclass("SpriteFrameChanger")
export class SpriteFrameChanger extends Component {
    @property(SpriteFrameList) private data = new SpriteFrameList();
    @property({ type: Enum(SpriteId) }) private spriteId = SpriteId.btnDefault;
    protected override onLoad(): void {
        this.getComponent(Sprite)!.spriteFrame = this.data[this.spriteId];
    }
}
