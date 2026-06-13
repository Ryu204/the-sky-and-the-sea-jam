import { _decorator, Component } from "cc";
import { CthulhuEye } from "./cthulhu_eye";
import { MouseTracker } from "../utils/components/mouse_tracker";

const { property, ccclass } = _decorator;

@ccclass("MenuCthulhu")
export class MenuCthulhu extends Component {
    @property([CthulhuEye]) private eyes: CthulhuEye[] = [];
    @property eyeBallRadius = 0;

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
}
