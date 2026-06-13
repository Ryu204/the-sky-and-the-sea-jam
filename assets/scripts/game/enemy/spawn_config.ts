import { Vec2 } from "cc";

export enum EnemyId {
    Sloggoth,
    DeepOne,
}
export const EnemyIds = [EnemyId.Sloggoth, EnemyId.DeepOne] as const;

export type SpawnPatternEntry = {
    enemyId: EnemyId;
    normalizedCoord: Vec2;
    aggravatedPercent: number;
};

export type SpawnPattern = {
    entries: { data: SpawnPatternEntry; timeRatio: number }[];
    totalSpawnTime: number;
    delayUntilNext: number;
};

export type SpawnerConfig = {
    patterns: SpawnPattern[];
    phases: {
        maxPatternIndex: number;
    }[];
    patternSelector: (maxIndex: number) => number;
};
