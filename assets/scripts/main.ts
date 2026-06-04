import { _decorator, assetManager, Button, Component, director } from "cc";
import { AllDataStorage } from "./data/all_data";
import { DefaultStorageBackend } from "./utils/saved_data";
import { AssetInfo } from "./constants/asset_info";
const { ccclass, property } = _decorator;

@ccclass("Main")
export class Main extends Component {
    @property(Button) private btnPlay!: Button;

    protected override async onLoad(): Promise<void> {
        const initResults = await Promise.all([
            initDataStorages(),
            loadBundles(),
        ]);
        if (!initResults.every(Boolean)) {
            console.error("Failed to init the game");
            return;
        }
        this.startGame();
    }

    public goToGameplay(): void {
        director.loadScene("home");
    }

    private startGame() {
        this.btnPlay.node.on(Button.EventType.CLICK, this.goToGameplay, this);
    }
}

function initDataStorages(): Promise<boolean> {
    return AllDataStorage.init(DefaultStorageBackend);
}

function loadBundles(): Promise<unknown> {
    return Promise.all([
        new Promise<void>((res) =>
            assetManager.loadBundle(AssetInfo.bundles.home, () => res()),
        ),
        new Promise<void>((res) =>
            assetManager.loadBundle(AssetInfo.bundles.gameplay, () => res()),
        ),
    ]);
}
