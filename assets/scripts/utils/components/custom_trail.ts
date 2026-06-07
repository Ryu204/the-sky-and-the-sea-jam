import { _decorator, CCInteger, Component, Line, Quat, v3, Vec3 } from "cc";

const { ccclass, property, requireComponent } = _decorator;

@ccclass("CustomTrail")
@requireComponent(Line)
// @executeInEditMode(true)
export class CustomTrail extends Component {
    @property private readonly pointCount = 1;
    @property private readonly widthScale = 1;
    @property private readonly headWidth = 0.25;
    @property private readonly tailWidth = 1;

    @property(CCInteger) private updatesPerSec = 20;

    private _line: Line | null = null;
    private pointsBuffer: Vec3[] = [];
    private currentPointCount = 0;
    private elapsedTime = 0;

    protected override __preload(): void {
        patchLineToWorkWithUIMeshRenderer(this.line);
    }

    private get line() {
        return (this._line ??= this.getComponent(Line)!);
    }

    protected override lateUpdate(dt: number): void {
        this.node.setWorldRotation(Quat.IDENTITY);
        if (!this.pointsBuffer) return;
        this.elapsedTime += dt;
        if (this.elapsedTime < 1 / this.updatesPerSec) return;
        this.elapsedTime -= 1 / this.updatesPerSec;

        let vecAlloc: Vec3;
        if (this.pointsBuffer.length === this.pointCount) {
            vecAlloc = this.shift();
        } else {
            vecAlloc = v3();
        }
        this.push(this.node!.getWorldPosition(vecAlloc));

        const line = this.line;
        line.positions = this.pointsBuffer.slice(0, this.currentPointCount);
        const widthValue = this.currentLength() * this.widthScale;
        const kf = line.width.curve.keyFrames!;
        kf[0]!.value = widthValue * this.tailWidth;
        kf[1]!.value = widthValue * this.headWidth;
        line.width.curve.keyFrames = kf;
    }

    private shift(): Vec3 {
        --this.currentPointCount;
        const first = this.pointsBuffer[0]!;
        for (let i = 1; i < this.pointsBuffer.length; ++i) {
            this.pointsBuffer[i - 1] = this.pointsBuffer[i]!;
        }
        return first;
    }

    private push(vec: Vec3) {
        ++this.currentPointCount;
        if (this.pointsBuffer.length < this.currentPointCount) {
            this.pointsBuffer.push(vec);
        } else {
            this.pointsBuffer[this.currentPointCount - 1] = vec;
        }
    }

    private currentLength() {
        let res = 0;
        for (let i = 1; i < this.currentPointCount; ++i) {
            res += Vec3.distance(
                this.pointsBuffer[i - 1]!,
                this.pointsBuffer[i]!,
            );
        }
        return res;
    }
}

function patchLineToWorkWithUIMeshRenderer(line: Line) {
    // For some fucking reason, in my current test the singular is an object but plural is undefined
    if (line.sharedMaterials === undefined) {
        Object.defineProperty(line, "sharedMaterials", {
            value: [line.sharedMaterial],
        });
    }
}
