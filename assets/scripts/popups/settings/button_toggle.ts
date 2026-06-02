import { _decorator, Button, Component, UIOpacity } from "cc";
import { Assertion } from "../../utils/assertion";

const { ccclass, property } = _decorator;

const EventType = {
    SELECTED: "button_toggle_selected",
} as const;

@ccclass("ButtonToggle")
export class ButtonToggle extends Component {
    @property([Button]) private buttons: Button[] = [];

    public static readonly EventType = EventType;

    private selectedIndex = 0;
    private addedHandlers = new WeakMap<Button, Function>();

    protected override onLoad(): void {
        this.setButtons(this.buttons);
    }

    public get selected() {
        return this.selectedIndex;
    }

    public set selected(index: number) {
        Assertion.that(
            index >= 0 && index < this.buttons.length,
            "Invalid index",
        );
        this.selectedIndex = index;
        this.node.emit(
            ButtonToggle.EventType.SELECTED,
            this,
            this.selectedIndex,
        );
        this.updateVisuals();
    }

    public setButtons(buttons: Button[]) {
        this.removeHandlers();
        this.buttons = buttons;
        this.setupHandlers();
        this.updateVisuals();
    }

    private updateVisuals() {
        for (let i = 0; i < this.buttons.length; ++i) {
            const opacity =
                this.buttons[i]!.getComponent(UIOpacity) ||
                this.buttons[i]!.addComponent(UIOpacity)!;
            opacity.opacity = i === this.selectedIndex ? 255 : 150;
        }
    }

    private setupHandlers() {
        for (let i = 0; i < this.buttons.length; ++i) {
            const handler = () => {
                this.selected = i;
            };
            this.buttons[i]!.node.on(Button.EventType.CLICK, handler);
            this.addedHandlers.set(this.buttons[i]!, handler);
        }
    }

    private removeHandlers() {
        for (const btn of this.buttons) {
            if (!btn.isValid) continue;
            const handler = this.addedHandlers.get(btn)!;
            if (handler) {
                btn.node.off(EventType.SELECTED, handler);
            }
        }
        this.addedHandlers = new WeakMap();
    }
}
