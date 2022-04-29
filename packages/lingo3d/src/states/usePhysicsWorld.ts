import store from "@lincode/reactivity"
import type { World } from "cannon-es"

export const [setPhysicsWorld, getPhysicsWorld] = store<World | undefined>(undefined)