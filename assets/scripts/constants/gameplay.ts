import { ShipControlStats, ShipStats } from "../data/ship_control_stats";

export const GameplayConst = {
    shipInitialDistFromBottomOverScreenHeight: 0.25,

    shipControls: {
        maxControlRange: 80,
        minControlRange: 50,
    } as ShipControlStats,

    shipMovements: {
        linearDamping: 0.05,
        acceleration: 500,
    } as ShipStats,
} as const;
