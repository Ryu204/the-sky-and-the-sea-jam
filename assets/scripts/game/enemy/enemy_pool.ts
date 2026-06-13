import { _decorator, Component, instantiate, Node, NodePool, Prefab } from "cc";
import { EnemyId, EnemyIds } from "./spawn_config";
import { Assertion } from "../../utils/assertion";

const { property, ccclass } = _decorator;

@ccclass("EnemyPool")
export class EnemyPool extends Component {
    @property(Prefab) private sloggoth!: Prefab;
    @property(Prefab) private deepOne!: Prefab;
    @property private batchSize = 0;

    private nodePools = new Map<EnemyId, NodePool>();

    private getPrefab(id: EnemyId): Prefab {
        switch (id) {
            case EnemyId.DeepOne:
                return this.deepOne;
            case EnemyId.Sloggoth:
                return this.sloggoth;
            default:
                throw new Error("Unimplemented");
        }
    }

    public fillPool(size = this.batchSize) {
        for (const id of EnemyIds) {
            let pool = this.nodePools.get(id);
            if (!pool) {
                pool = new NodePool();
                this.nodePools.set(id, pool);
            }
            this.fillInBatch(pool, id, size);
        }
    }

    public getFromPool(id: EnemyId): Node {
        const pool = this.nodePools.get(id);
        Assertion.that(pool !== undefined, "Maybe pool not filled yet?");
        if (pool.size() <= 0) {
            this.fillInBatch(pool, id, this.batchSize);
        }
        return pool.get()!;
    }

    private fillInBatch(pool: NodePool, id: EnemyId, batchSize: number) {
        const prefab = this.getPrefab(id);
        while (pool.size() < batchSize) {
            pool.put(instantiate(prefab));
        }
    }
}
