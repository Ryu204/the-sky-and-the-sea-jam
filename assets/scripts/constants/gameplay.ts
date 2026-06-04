import { ShipControlStats, ShipStats } from "../data/ship_control_stats";

export const GameplayConst = {
    shipInitialDistFromBottomOverScreenHeight: 0.25,

    shipControls: {
        maxControlRange: 100,
        minControlRange: 30,
    } as ShipControlStats,

    shipMovements: {
        linearDamping: 0.05,
        acceleration: 300,
    } as ShipStats,
} as const;
