export enum SoundClipMode {
    Mono,
    Stereo,
}

export function soundClipModeStr(mode: SoundClipMode) {
    switch (mode) {
        case SoundClipMode.Mono:
            return "mono";
        case SoundClipMode.Stereo:
            return "stereo";
    }
}
