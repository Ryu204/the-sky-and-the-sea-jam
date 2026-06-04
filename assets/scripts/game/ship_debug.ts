import {
    _decorator,
    Button,
    Color,
    Component,
    director,
    EditBox,
    EventKeyboard,
    Graphics,
    Input,
    input,
    instantiate,
    KeyCode,
    Node,
    Prefab,
    Widget,
} from "cc";
import { GameplayConst } from "../constants/gameplay";
import { Ship } from "./ship";
import { resourcesLoad } from "../utils/async_style";
import { AssetInfo } from "../constants/asset_info";
import { Assertion } from "../utils/assertion";
import { DataStorage, DefaultStorageBackend } from "../utils/saved_data";
import { ShipControlStats, ShipStats } from "../data/ship_control_stats";
import { GameMeta } from "../constants/game_meta";

const { property, ccclass } = _decorator;

namespace Data {
    const VERSION = 1 as const;
    export type ShipDebugSavedData = Partial<ShipStats & ShipControlStats> & {
        version: typeof VERSION;
    };
    function increaseVersionHandler(data: ShipDebugSavedData) {
        switch (data.version as number) {
            default:
                break;
        }
        ++data.version;
    }

    export class ShipDebugDataStorage extends DataStorage<
        string,
        ShipDebugSavedData
    > {
        constructor() {
            super({
                key: GameMeta.saveKeys.ship_debug,
                version: VERSION,
                increaseVersionHandler,
                backend: DefaultStorageBackend,
            });
        }

        public override getDefaultData(): ShipDebugSavedData {
            return {
                version: VERSION,
            };
        }

        public getData() {
            return this.readData();
        }

        public readValue<K extends keyof ShipDebugSavedData>(
            key: K,
        ): ShipDebugSavedData[K] {
            return super.readData()[key];
        }

        public saveValue<K extends keyof ShipDebugSavedData>(
            key: K,
            value: ShipDebugSavedData[K],
        ) {
            return super.setField(key, value);
        }
    }
}

type ShipDebugSavedKey = keyof Omit<Data.ShipDebugSavedData, "version">;

export async function addShipDebug(ship: Ship) {
    const debugPrefab = await resourcesLoad(
        AssetInfo.prefabs.shipDebug,
        Prefab,
    );
    const node = instantiate(debugPrefab);
    node.setParent(director.getScene());
    for (const widget of node
        .getComponentsInChildren(Widget)
        .concat(node.getComponents(Widget))) {
        widget.updateAlignment();
    }

    const debug = node.getComponent(ShipDebug)!;
    debug.init(ship);
}
@ccclass("ShipDebug")
export class ShipDebug extends Component {
    @property(EditBox) private editAcceleration!: EditBox;
    @property(EditBox) private editLinearDamping!: EditBox;
    @property(EditBox) private editMinControlRange!: EditBox;
    @property(EditBox) private editMaxControlRange!: EditBox;
    @property(Button) private btnExport!: Button;
    @property(Button) private btnImport!: Button;
    @property(Node) private loading!: Node;
    @property(Node) private notSavedWarning!: Node;

    private ship: Ship | null = null;
    private graphics: Graphics | null = null;
    private dataStorage = new Data.ShipDebugDataStorage();
    private currentData: Omit<Data.ShipDebugSavedData, "version"> | null = null;
    private isInited = false;

    public async init(ship: Ship) {
        Assertion.that(!this.isInited, "Double init");
        this.isInited = true;
        this.ship = ship;
        await this.initData();
        this.initGraphicsNode();
        this.updateDisplayFromData();
        this.connectEvents();

        this.notSavedWarning.active = true;
        this.loading.active = false;
    }

    public override onDestroy() {
        if (this.isInited) this.disconnectEvents();
    }

    private async initData() {
        this.currentData = {
            ...this.ship!.readStats(),
            ...GameplayConst.shipControls,
        };
        if (!(await this.dataStorage.init())) {
            console.error("Could not init data storage");
        }
    }

    private updateDisplayFromData() {
        this.editLinearDamping.string =
            this.currentData!.linearDamping?.toString() ?? "";
        this.editAcceleration.string =
            this.currentData!.acceleration?.toString() ?? "";
        this.editMinControlRange.string =
            this.currentData!.minControlRange?.toString() ?? "";
        this.editMaxControlRange.string =
            this.currentData!.maxControlRange?.toString() ?? "";
        drawDebugOnGraphics(GameplayConst.shipControls, this.graphics!);
    }

    private initGraphicsNode() {
        const child = new Node("ship_debug_draw");
        this.ship!.node.addChild(child);
        child.setRTS();
        this.graphics = child.addComponent(Graphics)!;
    }

    private connectEvents() {
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        this.editAcceleration.node.on(
            EditBox.EventType.EDITING_RETURN,
            this.onEditBoxReturned,
            this,
        );
        this.editLinearDamping.node.on(
            EditBox.EventType.EDITING_RETURN,
            this.onEditBoxReturned,
            this,
        );
        this.editMaxControlRange.node.on(
            EditBox.EventType.EDITING_RETURN,
            this.onEditBoxReturned,
            this,
        );
        this.editMinControlRange.node.on(
            EditBox.EventType.EDITING_RETURN,
            this.onEditBoxReturned,
            this,
        );
        this.btnExport.node.on(Button.EventType.CLICK, this.onExport, this);
        this.btnImport.node.on(Button.EventType.CLICK, this.onImport, this);
    }

    private disconnectEvents() {
        input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        this.editAcceleration.node.off(
            EditBox.EventType.EDITING_RETURN,
            this.onEditBoxReturned,
            this,
        );
        this.editLinearDamping.node.off(
            EditBox.EventType.EDITING_RETURN,
            this.onEditBoxReturned,
            this,
        );
        this.editMaxControlRange.node.off(
            EditBox.EventType.EDITING_RETURN,
            this.onEditBoxReturned,
            this,
        );
        this.editMinControlRange.node.off(
            EditBox.EventType.EDITING_RETURN,
            this.onEditBoxReturned,
            this,
        );
        this.btnExport.node.off(Button.EventType.CLICK, this.onExport, this);
        this.btnImport.node.off(Button.EventType.CLICK, this.onImport, this);
    }

    private onKeyDown(ev: EventKeyboard) {
        const TOGGLE_KEY = KeyCode.SLASH;
        if (!this.isInited || ev.keyCode !== TOGGLE_KEY) return;
        this.node.active = !this.node.active;
    }

    private applyValueToField(key: ShipDebugSavedKey, number: number) {
        switch (key) {
            case "acceleration":
                this.ship!.setStats("acceleration", number);
                break;
            case "linearDamping":
                this.ship!.setStats("linearDamping", number);
                break;
            case "maxControlRange":
                GameplayConst.shipControls.maxControlRange = number;
                break;
            case "minControlRange":
                GameplayConst.shipControls.minControlRange = number;
                break;
            default:
                throw new Error("Unimplemented");
        }

        this.currentData![key] = number;
    }

    private onEditBoxReturned(editBox: EditBox) {
        const number = Number(editBox.string);
        if (!Number.isFinite(number)) {
            alert("Not a number");
            return;
        }

        this.notSavedWarning.active = true;
        let key: ShipDebugSavedKey | null = null;
        switch (editBox) {
            case this.editAcceleration:
                key = "acceleration";
                break;
            case this.editLinearDamping:
                key = "linearDamping";
                break;
            case this.editMaxControlRange:
                key = "maxControlRange";
                break;
            case this.editMinControlRange:
                key = "minControlRange";
                break;
            default:
                throw new Error("Unimplemented");
        }

        this.applyValueToField(key, number);
        this.updateDisplayFromData();
    }

    private async onExport() {
        if (!this.isInited) return;
        Assertion.that(this.currentData !== null);
        const promises: Promise<boolean>[] = [];
        this.loading.active = true;
        for (const key of Object.keys(
            this.currentData,
        ) as (keyof typeof this.currentData)[]) {
            const value = this.currentData![key];
            if (value !== undefined) {
                promises.push(this.dataStorage.saveValue(key, value));
            }
        }
        this.loading.active = false;
        const results = await Promise.all(promises);
        if (results.every(Boolean)) {
            this.notSavedWarning.active = false;
            alert("Saved successfully");
        } else {
            alert("An error happened");
        }
    }

    private async onImport() {
        if (!this.isInited) return;
        Assertion.that(this.currentData !== null);

        this.loading.active = true;
        const loadedData = this.dataStorage.getData();

        for (const key of Object.keys(
            this.currentData,
        ) as ShipDebugSavedKey[]) {
            const value = loadedData[key];
            if (value !== undefined) {
                this.applyValueToField(key, value);
            }
        }

        this.updateDisplayFromData();
        this.notSavedWarning.active = false;
        this.loading.active = false;
    }
}

function drawDebugOnGraphics(stats: ShipControlStats, graphics: Graphics) {
    graphics.clear();
    graphics.strokeColor = Color.RED;
    graphics.lineWidth = 2;
    graphics.circle(0, 0, stats.minControlRange);
    graphics.stroke();
    graphics.strokeColor = Color.GREEN;
    graphics.circle(0, 0, stats.maxControlRange);
    graphics.stroke();
}
