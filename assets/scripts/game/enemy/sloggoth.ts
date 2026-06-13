import { _decorator, Component } from "cc";
import { Enemy } from "./enemy";

const { property, ccclass } = _decorator;

@ccclass("Sloggoth")
export class Sloggoth extends Enemy {
    public override init(): void {}
}
