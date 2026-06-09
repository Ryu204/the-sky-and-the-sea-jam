import { ShipControlStats, ShipStats } from "../data/ship_control_stats";

export const GameplayConst = {
    shipInitialDistFromBottomOverScreenHeight: 0.25,

    shipControls: {
        maxControlRange: 100,
        minControlRange: 20,
        maxAngularControlRange: 90,
        minAngularControlRange: 5,
    } as ShipControlStats,

    shipMovements: {
        linearDamping: 0.025,
        acceleration: 300,
        angularAcceleration: 540,
        angularDamping: 0.05,
    } as ShipStats,

    ocean: {
        transitionTimeSeconds: 15,
    },

    detectionRangeByStage: [50, 80, 120],
} as const;
