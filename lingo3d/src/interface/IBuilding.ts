import IFloor, { floorDefaults, floorSchema } from "./IFloor"
import { ExtractProps } from "./utils/extractProps"

export default interface IBuilding extends IFloor {
}

export const buildingSchema: Required<ExtractProps<IBuilding>> = {
    ...floorSchema
}

export const buildingDefaults: IBuilding = {
    ...floorDefaults
}