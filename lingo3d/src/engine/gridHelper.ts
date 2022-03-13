import { GridHelper } from "three"
import { getGridHelper } from "../states/useGridHelper"
import { scaleInverse } from "./constants"
import scene from "./scene"

export default {}

const size = 10 * scaleInverse
const gridHelper = new GridHelper(size, size)

getGridHelper(visible => visible ? scene.add(gridHelper) : scene.remove(gridHelper))