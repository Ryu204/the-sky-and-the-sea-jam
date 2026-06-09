import {
    _decorator,
    color,
    Color,
    Component,
    lerp,
    Material,
    Sprite,
    tween,
    Tween,
} from "cc";
import { GameplayConst } from "../constants/gameplay";
const { ccclass, property } = _decorator;

@ccclass("OceanVisualData")
class OceanVisualData {
    @property public seaBase = color();
    @property public seaWaterColor = color();
    @property public seaHeight = 0;
    @property public seaChoppy = 0;
    @property public seaSpeed = 0;

    public updateMaterial(mat: Material) {
        for (const key of Object.keys(this) as (keyof OceanVisualData)[]) {
            const val = this[key];
            if (typeof val === "function") continue;
            mat.setProperty(key, val);
        }
    }

    public static lerp(
        out: OceanVisualData,
        from: OceanVisualData,
        to: OceanVisualData,
        ratio: number,
    ): OceanVisualData {
        for (const key of Object.keys(out) as (keyof OceanVisualData)[]) {
            const fr = from[key];
            const t = to[key];
            switch (typeof fr) {
                case "number":
                    out[key] = lerp(fr, t as number, ratio) as any;
                    break;
                case "object":
                    switch (Object.getPrototypeOf(fr)) {
                        case Color.prototype:
                            Color.lerp(
                                out[key] as Color,
                                fr,
                                t as Color,
                                ratio,
                            );
                            break;
                    }
                    break;
            }
        }
        return out;
    }
}

const tempDatas = [new OceanVisualData()] as const;

@ccclass("OceanVisual")
export class OceanVisual extends Component {
    @property(OceanVisualData) private minData = new OceanVisualData();
    @property(OceanVisualData) private maxData = new OceanVisualData();
    @property(Sprite) private oceanSprite!: Sprite;

    private initialRatio = { value: 0 };

    private _sharedMaterial: Material | null = null;
    private get sharedMaterial(): Material {
        return (this._sharedMaterial ??=
            this.oceanSprite.getSharedMaterial(0)!);
    }

    /** @param ratio lerp ratio from min data to max data */
    public animateToNewRatio(ratio: number) {
        Tween.stopAllByTarget(this.initialRatio);
        tween(this.initialRatio)
            .to(
                GameplayConst.ocean.transitionTimeSeconds,
                { value: ratio },
                {
                    onUpdate: (target) => {
                        OceanVisualData.lerp(
                            tempDatas[0],
                            this.minData,
                            this.maxData,
                            target!.value,
                        ).updateMaterial(this.sharedMaterial);
                    },
                    easing: "sineInOut",
                },
            )
            .start();
    }
}
