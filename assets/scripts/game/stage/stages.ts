import { GameplayConst } from "../../constants/gameplay";
import { Stage, StageEndState } from "./stage";

class BaseStage extends Stage {
    private test = {
        timeToSwitch: 5,
        elapsed: 0,
    };

    public override onStarted(): void {
        this.setOceanVisual();
        const ship = this.getResources().ship;
        const range =
            GameplayConst.detectionRangeByStage[
                Math.min(
                    this.getIndex(),
                    GameplayConst.detectionRangeByStage.length - 1,
                )
            ]!;
        ship.setDetectionRange(range);
    }

    public override update(dt: number): StageEndState | null {
        this.test.elapsed += dt;
        if (this.test.elapsed > this.test.timeToSwitch) {
            return StageEndState.pass;
        }
        return null;
    }

    protected getOceanRatio() {
        return this.getIndex() / (this.getResources().stageCount - 1);
    }

    protected setOceanVisual() {
        this.getResources().ocean.animateToNewRatio(this.getOceanRatio());
    }
}

export class StageTutorial extends BaseStage {}

export class StageMiddle extends BaseStage {}

export class StageFinal extends BaseStage {
    public override update(_dt: number): StageEndState | null {
        return null;
    }
}
