import { _decorator, assetManager, Button, Component, director } from "cc";
import { AllDataStorage } from "./data/all_data";
import {
    DataStorageBackend,
    DataStorageLocalStorageBackend,
} from "./utils/saved_data";
import { GameMeta } from "./constants/game_meta";
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
    const storageBackend: DataStorageBackend<string> =
        new DataStorageLocalStorageBackend();
    const name = GameMeta.name;
    return AllDataStorage.init(name, storageBackend);
}

function loadBundles(): Promise<unknown> {
    return Promise.all([
        new Promise<void>((res) =>
            assetManager.loadBundle("gameplay", {}, () => res()),
        ),
        new Promise<void>((res) =>
            assetManager.loadBundle("home", {}, () => res()),
        ),
    ]);
}
