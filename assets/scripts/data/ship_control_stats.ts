export type ShipStats = {
    acceleration: number;
    linearDamping: number;
    angularAcceleration: number;
    angularDamping: number;
};

export type ShipControlStats = {
    minControlRange: number;
    maxControlRange: number;
    minAngularControlRange: number;
    maxAngularControlRange: number;
};
