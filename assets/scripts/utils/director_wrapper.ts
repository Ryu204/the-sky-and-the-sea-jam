import { director } from "cc";
import { LoadingSingleton } from "./components/loading_singleton";

export class DirectorWrapper {
    public static goToScene(sceneName: string) {
        LoadingSingleton.inst.show();
        director.loadScene(sceneName, () => LoadingSingleton.inst.hide());
    }
}
