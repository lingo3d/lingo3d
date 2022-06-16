import IFloor, { floorDefaults, floorSchema } from "./IFloor"
import Defaults from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"

export default interface IBuilding extends IFloor {
    repeatY: number
}

export const buildingSchema: Required<ExtractProps<IBuilding>> = {
    ...floorSchema,
    repeatY: Number
}

export const buildingDefaults: Defaults<IBuilding> = {
    ...floorDefaults,
    repeatY: 1
}