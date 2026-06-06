import { ShipControlStats, ShipStats } from "../data/ship_control_stats";

export const GameplayConst = {
    shipInitialDistFromBottomOverScreenHeight: 0.25,

    shipControls: {
        maxControlRange: 150,
        minControlRange: 45,
        maxAngularControlRange: 90,
        minAngularControlRange: 5,
    } as ShipControlStats,

    shipMovements: {
        linearDamping: 0.05,
        acceleration: 400,
        angularAcceleration: 450,
        angularDamping: 0.15,
    } as ShipStats,
} as const;
