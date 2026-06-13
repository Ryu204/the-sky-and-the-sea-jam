import { _decorator, Button, Component, instantiate, Node, Prefab } from "cc";
import { resourcesLoad } from "../utils/async_style";
import { PopupSettings } from "../popups/settings/popup_settings";
import { AssetInfo } from "../constants/asset_info";
import { MenuCthulhu } from "./menu_cthulhu";
import { MouseTracker } from "../utils/components/mouse_tracker";
import { DirectorWrapper } from "../utils/director_wrapper";
import { LoadingSingleton } from "../utils/components/loading_singleton";
const { ccclass, property } = _decorator;

@ccclass("Home")
export class Home extends Component {
    @property(Node) private btnParent!: Node;
    @property(Button) private btnPlay!: Button;
    @property(Button) private btnSettings!: Button;
    @property(MenuCthulhu) private menuCthulhu!: MenuCthulhu;
    @property(Node) private popupCanvas!: Node;

    private mouseTracker!: MouseTracker;

    protected override onLoad(): void {
        this.btnPlay.node.on(Button.EventType.CLICK, this.goToGame, this);
        this.btnSettings.node.on(
            Button.EventType.CLICK,
            this.openSettings,
            this,
        );
        this.init();
    }

    protected override update(dt: number): void {
        this.menuCthulhu.manuallyUpdate(dt);
    }

    private init() {
        this.mouseTracker =
            this.getComponent(MouseTracker) || this.addComponent(MouseTracker)!;
        this.menuCthulhu.init(this.mouseTracker);
    }

    private goToGame() {
        DirectorWrapper.goToScene(AssetInfo.scenes.gameplay);
    }

    private async openSettings() {
        LoadingSingleton.inst.show();
        const prefab = await resourcesLoad(
            AssetInfo.prefabs.popups.settings,
            Prefab,
        );
        LoadingSingleton.inst.hide();
        const node = instantiate(prefab);
        node.setParent(this.popupCanvas);
        node.active = false;
        this.menuCthulhu.zoomToSettingsBackground();
        this.btnParent.active = false;
        const settings = node.getComponent(PopupSettings)!;
        settings.init();
    }
}
