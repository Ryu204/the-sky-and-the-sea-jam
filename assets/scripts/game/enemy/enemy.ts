import { _decorator, Component } from "cc";

const { property, ccclass } = _decorator;

@ccclass("Enemy")
export abstract class Enemy extends Component {
    public abstract init(): void;
}
