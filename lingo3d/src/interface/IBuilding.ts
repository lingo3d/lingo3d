import IFloor, { floorDefaults, floorSchema } from "./IFloor"
import { ExtractProps } from "./utils/extractProps"

export default interface IBuilding extends IFloor {
    repeatY: number
}

export const buildingSchema: Required<ExtractProps<IBuilding>> = {
    ...floorSchema,
    repeatY: Number
}

export const buildingDefaults: IBuilding = {
    ...floorDefaults,
    repeatY: 1
}