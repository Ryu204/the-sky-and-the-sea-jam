import { OceanVisual } from "../ocean_visual";
import { HasDetectionRange } from "../ship_interfaces";

export type StageResources = {
    readonly ocean: OceanVisual;
    readonly stageCount: number;
    readonly ship: HasDetectionRange;
};
