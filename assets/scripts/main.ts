import { _decorator, assetManager, Component, game, Input, input } from "cc";
import { AllDataStorage } from "./data/all_data";
import { DefaultStorageBackend } from "./utils/saved_data";
import { AssetInfo } from "./constants/asset_info";
import { GameMeta } from "./constants/game_meta";
import { DirectorWrapper } from "./utils/director_wrapper";
const { ccclass } = _decorator;

@ccclass("Main")
export class Main extends Component {
    protected override async onLoad(): Promise<void> {
        if (!configFps()) {
            console.warn(
                `Failed to set expected FPS of the game: ${GameMeta.frameRate}`,
            );
        }
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

    protected override onDestroy(): void {
        input.off(Input.EventType.TOUCH_END, this.goToHome, this);
    }

    private goToHome(): void {
        DirectorWrapper.goToScene(AssetInfo.scenes.home);
    }

    private startGame() {
        input.on(Input.EventType.TOUCH_END, this.goToHome, this);
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

function configFps() {
    game.frameRate = GameMeta.frameRate;
    return game.frameRate === GameMeta.frameRate;
}
