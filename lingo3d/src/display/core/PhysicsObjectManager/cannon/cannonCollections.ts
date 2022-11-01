import PhysicsObjectManager from ".."
import type { Body } from "cannon-es"

export const cannonSet = new Set<PhysicsObjectManager>()
export const cannonContactMap = new Map<Body, WeakSet<Body>>()
export const cannonContactBodies = new WeakSet<Body>()
