import { Asset, resources } from "cc";

export async function resourcesLoad<T extends Asset>(
    path: string,
    ctor: new (...args: any[]) => T,
) {
    return new Promise<T>((res, rej) =>
        resources.load(path, ctor, (err, data) => {
            if (err) rej(err);
            else res(data!);
        }),
    );
}
