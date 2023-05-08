import { onBeforeRender } from "../../events/onBeforeRender"
import computeOcclusionMap from "./computeOcclusionMap"

export default {}

onBeforeRender(() => computeOcclusionMap())
