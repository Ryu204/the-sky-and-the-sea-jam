import { ShipControlStats, ShipStats } from "../data/ship_control_stats";

export const GameplayConst = {
    shipInitialDistFromBottomOverScreenHeight: 0.25,

    shipControls: {
        maxControlRange: 100,
        minControlRange: 30,
        maxAngularControlRange: 90,
        minAngularControlRange: 5,
    } as ShipControlStats,

    shipMovements: {
        linearDamping: 0.05,
        acceleration: 300,
        angularAcceleration: 360,
        angularDamping: 0.2,
    } as ShipStats,
} as const;
