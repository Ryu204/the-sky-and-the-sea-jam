import { Assertion } from "../../utils/assertion";
import { StageResources } from "./resources";

export enum StageEndState {
    pass = "pass",
    fail = "fail",
}
export class Stage<Resource extends object = StageResources> {
    private resources: Resource | null = null;
    private index: number | null = null;

    public onStarted(): void {}
    public update(_dt: number): StageEndState | null {
        return null;
    }
    public onEnded(): void {}
    public setFields(res: Resource, index: number) {
        this.resources = res;
        this.index = index;
    }

    protected getResources(): Resource {
        Assertion.that(this.resources !== null, "Resources not set yet");
        return this.resources;
    }
    protected getIndex(): number {
        Assertion.that(this.index !== null, "Index not set yet");
        return this.index;
    }
}
