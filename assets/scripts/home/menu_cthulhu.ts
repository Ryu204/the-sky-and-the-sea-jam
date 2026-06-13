import { _decorator, Component, math } from "cc";
import { CthulhuEye } from "./cthulhu_eye";
import { MouseTracker } from "../utils/components/mouse_tracker";
import { standardNormalDistribution01 } from "../utils/random";

const { property, ccclass } = _decorator;

@ccclass("MenuCthulhu")
export class MenuCthulhu extends Component {
    @property([CthulhuEye]) private eyes: CthulhuEye[] = [];
    @property private desiredActiveEyeCount = 1;
    @property private eyeBallRadius = 0;

    public init(mouseTracker: MouseTracker) {
        for (let i = 0; i < this.eyes.length; ++i) {
            const eye = this.eyes[i]!;
            eye.init(mouseTracker, this.eyeBallRadius);
            this.setupEyeActiveCycle(i);
        }
    }

    public manuallyUpdate(dt: number) {
        for (let i = 0; i < this.eyes.length; ++i) {
            if (!this.eyes[i]!.node.active) {
                continue;
            }
            this.eyes[i]!.manuallyUpdate(dt);
        }
    }

    private setupEyeActiveCycle(index: number) {
        const eye = this.eyes[index]!;
        const targetActiveProbability =
            this.desiredActiveEyeCount / this.eyes.length;
        const recheckActiveState = () => {
            eye.node.active = Math.random() < targetActiveProbability;
            const delay = math.EPSILON + 15 * standardNormalDistribution01();
            this.scheduleOnce(() =>
                this.scheduleOnce(recheckActiveState, delay),
            );
        };
        recheckActiveState();
    }
}
