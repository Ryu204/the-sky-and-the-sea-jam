import { _decorator, Component, director } from "cc";

const { ccclass } = _decorator;

export function withSingleton<T extends new (...args: any[]) => Component>(
    Base: T,
    name: string,
): T & { readonly inst: InstanceType<T> } {
    @ccclass(name)
    class Derived extends Base {
        private static _inst: Derived | null = null;
        protected override onLoad(): void {
            super.onLoad?.();
            if (Derived._inst) {
                this.node.destroy();
                return;
            }
            Derived._inst = this;
            director.addPersistRootNode(this.node);
        }

        protected override onDestroy(): void {
            if (this === Derived._inst) {
                Derived._inst = null;
            }
        }

        public static get inst(): Derived {
            return this._inst!;
        }
    }

    return Derived as any;
}
