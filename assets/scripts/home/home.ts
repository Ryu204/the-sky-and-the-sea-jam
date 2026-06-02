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
const { ccclass, property } = _decorator;

@ccclass("Home")
export class Home extends Component {
    @property(Button) private btnPlay!: Button;
    @property(Button) private btnSettings!: Button;
    @property(Node) private tempCanvas!: Node;

    protected override onLoad(): void {
        this.btnPlay.node.on(Button.EventType.CLICK, this.goToGame, this);
        this.btnSettings.node.on(
            Button.EventType.CLICK,
            this.openSettings,
            this,
        );
    }

    private goToGame() {
        director.loadScene("gameplay");
    }

    private async openSettings() {
        const prefab = await resourcesLoad("prefabs/popup_settings", Prefab);
        const node = instantiate(prefab);
        node.setParent(this.tempCanvas);
        const settings = node.getComponent(PopupSettings)!;
        settings.init();
    }
}
