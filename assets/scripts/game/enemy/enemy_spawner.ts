import { SpawnerConfig, SpawnPattern, SpawnPatternEntry } from "./spawn_config";
import { DeepReadonly } from "../../utils/custom_types";
import { Assertion } from "../../utils/assertion";
import { EnemyPool } from "./enemy_pool";
import { Node } from "cc";
import { Enemy } from "./enemy";

export class EnemySpawner {
    private config: DeepReadonly<SpawnerConfig>;
    private timeUntilNextSpawn = 0;
    private elapsedTimeSinceLastSpawn = 0;
    private currentPhase = 0;
    private isSpawning = false;
    private currentSpawnPattern: DeepReadonly<SpawnPattern> | null = null;
    private nextSpawnEntryIndex: number | null = null;

    constructor(
        config: SpawnerConfig,
        private enemyPool: EnemyPool,
        private enemyNodeParent: Node,
    ) {
        this.config = config;
        this.setPhase(0);
    }

    public manuallyUpdate(dt: number) {
        this.elapsedTimeSinceLastSpawn += dt;

        if (this.isSpawning) {
            Assertion.that(
                this.currentSpawnPattern !== null &&
                    this.nextSpawnEntryIndex !== null,
            );
            const spawnEntries = this.currentSpawnPattern.entries;
            const entrySpawnTimestamp = (index: number) => {
                return (
                    (index / (spawnEntries.length - 1)) *
                    this.currentSpawnPattern!.totalSpawnTime
                );
            };
            while (
                this.nextSpawnEntryIndex < spawnEntries.length &&
                entrySpawnTimestamp(this.nextSpawnEntryIndex) <
                    this.elapsedTimeSinceLastSpawn
            ) {
                this.spawnEnemy(spawnEntries[this.nextSpawnEntryIndex++]!.data);
            }
        }

        if (this.timeUntilNextSpawn < this.elapsedTimeSinceLastSpawn) {
            Assertion.that(!this.isSpawning, "Should be sequential");
            this.startSpawningNewPattern();
        }
    }

    public setPhase(phaseOrder: number) {
        Assertion.that(
            phaseOrder >= 0 && phaseOrder < this.config.phases.length,
            "Invalid phase order",
        );
        this.currentPhase = phaseOrder;
    }

    private startSpawningNewPattern(): void {
        const maxIndex = this.config.phases[this.currentPhase]!.maxPatternIndex;
        const patternIndex = this.config.patternSelector(maxIndex);
        const pattern = this.config.patterns[patternIndex]!;

        this.elapsedTimeSinceLastSpawn = 0;
        this.timeUntilNextSpawn =
            pattern.totalSpawnTime + pattern.delayUntilNext;

        this.isSpawning = true;
        this.currentSpawnPattern = pattern;
        this.nextSpawnEntryIndex = 0;
    }

    private spawnEnemy(enemyInfo: DeepReadonly<SpawnPatternEntry>) {
        const node = this.enemyPool.getFromPool(enemyInfo.enemyId);
        node.setParent(this.enemyNodeParent, false);
        const enemy = node.getComponent(Enemy)!;
        enemy.init();
        return enemy;
    }
}
