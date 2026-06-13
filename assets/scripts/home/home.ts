import {
    _decorator,
    Button,
    Component,
    director,
    instantiate,
    Node,
    Prefab,
} from "cc";
import { resourcesLoad } from "../utils/async_style";
import { PopupSettings } from "../popups/settings/popup_settings";
import { AssetInfo } from "../constants/asset_info";
import { MenuCthulhu } from "./menu_cthulhu";
import { MouseTracker } from "../utils/components/mouse_tracker";
const { ccclass, property } = _decorator;

@ccclass("Home")
export class Home extends Component {
    @property(Button) private btnPlay!: Button;
    @property(Button) private btnSettings!: Button;
    @property(Node) private tempCanvas!: Node;
    @property(MenuCthulhu) private menuCthulhu!: MenuCthulhu;

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
        director.loadScene("gameplay");
    }

    private async openSettings() {
        const prefab = await resourcesLoad(
            AssetInfo.prefabs.popups.settings,
            Prefab,
        );
        const node = instantiate(prefab);
        node.setParent(this.tempCanvas);
        const settings = node.getComponent(PopupSettings)!;
        settings.init();
    }
}
