import { Stage, StageEndState } from "./stage";
import { Assertion } from "../../utils/assertion";
import { StageResources } from "./resources";

export enum StageSequenceEndState {
    fail = "fail",
    pass = "pass",
}

export type StageSequenceEventPayload = {
    index: number;
};

export type StageSequenceUpdateResult = {
    state: StageSequenceEndState;
    payload: StageSequenceEventPayload;
};

export class StageSequence<Resources extends object = StageResources> {
    private activeStageIndex = 0;

    constructor(
        private stages: Stage<Resources>[],
        resources: Resources,
    ) {
        Assertion.that(stages.length > 0, "Empty sequence");
        for (let i = 0; i < stages.length; ++i) {
            stages[i]!.setFields(resources, i);
        }
    }

    public start(): void {
        this.startNewStage();
    }

    public update(dt: number): StageSequenceUpdateResult | null {
        Assertion.that(
            this.activeStageIndex < this.stages.length,
            "Sequence already ended",
        );
        const stage = this.stages[this.activeStageIndex]!;
        const updateResult = stage.update(dt);
        if (updateResult === null) return null;
        if (updateResult === StageEndState.fail) {
            return {
                state: StageSequenceEndState.fail,
                payload: this.getPayload(),
            };
        }
        if (updateResult !== StageEndState.pass) return null;
        const isLastStage = this.activeStageIndex >= this.stages.length - 1;
        if (!isLastStage) {
            ++this.activeStageIndex;
            this.startNewStage();
            return null;
        }
        const result: StageSequenceUpdateResult = {
            payload: this.getPayload(),
            state: StageSequenceEndState.pass,
        };
        ++this.activeStageIndex;
        return result;
    }

    private startNewStage() {
        if (this.activeStageIndex > 0) {
            const oldStage = this.stages[this.activeStageIndex - 1]!;
            oldStage.onEnded();
        }
        this.stages[this.activeStageIndex]!.onStarted();
    }

    private getPayload(): StageSequenceEventPayload {
        return { index: this.activeStageIndex };
    }
}
