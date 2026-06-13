import { _decorator } from "cc";
import { LoadingOverlay } from "./loading_overlay";
import { withSingleton } from "../with_singleton";

class BaseLoadingSingleton extends LoadingOverlay {
    protected override onLoad(): void {
        super.onLoad?.();
        this.hide();
    }
    public show() {
        this.node.active = true;
    }

    public hide() {
        this.node.active = false;
    }
}

export const LoadingSingleton = withSingleton(
    BaseLoadingSingleton,
    "LoadingSingleton",
);
