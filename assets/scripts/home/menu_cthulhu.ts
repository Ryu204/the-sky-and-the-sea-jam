import { _decorator, Animation, AnimationClip, Component, Node } from "cc";
import { CthulhuEye } from "./cthulhu_eye";
import { MouseTracker } from "../utils/components/mouse_tracker";

const { property, ccclass } = _decorator;

@ccclass("MenuCthulhu")
export class MenuCthulhu extends Component {
    @property([CthulhuEye]) private eyes: CthulhuEye[] = [];
    @property private eyeBallRadius = 0;
    @property({
        type: Animation,
        group: { style: "section", name: "settings" },
    })
    private settingsAnimation!: Animation;
    @property({
        type: AnimationClip,
        group: { style: "section", name: "settings" },
    })
    private settingsAnimationClip!: AnimationClip;

    public init(mouseTracker: MouseTracker) {
        for (const eye of this.eyes) {
            eye.init(mouseTracker, this.eyeBallRadius);
        }
    }

    public manuallyUpdate(dt: number) {
        for (const eye of this.eyes) {
            eye.manuallyUpdate(dt);
        }
    }

    public zoomToSettingsBackground(): Promise<void> {
        let resolve: () => void;
        const promise = new Promise<void>((res) => (resolve = res));
        this.settingsAnimation.once(Animation.EventType.FINISHED, resolve);
        this.settingsAnimation.crossFade(this.settingsAnimationClip.name, 0.05);
    }
}
