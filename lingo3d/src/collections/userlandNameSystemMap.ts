import type { System } from "../systems/utils/createInternalSystem"
import createMap from "../utils/createMap"

export const userlandNameSystemMap = createMap<string, System<any, any>>()
