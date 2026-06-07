import {
    _decorator,
    Component,
    EventMouse,
    Input,
    input,
    v2,
    v3,
    Vec3,
} from "cc";

const { ccclass } = _decorator;

const tempVecs = [v2()] as const;

@ccclass("MouseTracker")
export class MouseTracker extends Component {
    private isTracking = false;
    private mouseWorldPos = v3();

    protected override onEnable(): void {
        this.isTracking = false;
        input.on(Input.EventType.MOUSE_MOVE, this.onMouseMove, this);
    }

    protected override onDisable(): void {
        this.isTracking = false;
        input.off(Input.EventType.MOUSE_MOVE, this.onMouseMove, this);
    }

    public getMousePosition(out: Vec3): boolean {
        if (!this.isTracking) return false;
        out.set(this.mouseWorldPos);
        return true;
    }

    private onMouseMove(event: EventMouse) {
        this.isTracking = true;
        const uiLoc = tempVecs[0];
        event.getUILocation(uiLoc);
        this.mouseWorldPos.set(uiLoc.x, uiLoc.y, 0);
    }
}
