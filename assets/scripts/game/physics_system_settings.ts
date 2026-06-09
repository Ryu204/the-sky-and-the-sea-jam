import { PhysicsSystem2D, v2 } from "cc";

export function configPhysicsSystem(ps: PhysicsSystem2D) {
    ps.enable = true;
    ps.gravity = v2();
    ps.fixedTimeStep = 1e9;
    ps.velocityIterations = 0;
    ps.positionIterations = 0;
}
