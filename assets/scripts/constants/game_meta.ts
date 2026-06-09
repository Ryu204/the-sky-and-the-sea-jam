const name = "the_sky_and_the_sea" as const;

export const GameMeta = {
    name,
    saveKeys: {
        settings: `${name}_settings`,
        ship_debug: `${name}_ship_debug`,
    },
    frameRate: 60,
    shownEditingTarget: null as "ship" | null,
} as const;
