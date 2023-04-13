import { Object3D, Vector3 } from "three"
import { box3 } from "../display/utils/reusables"
import computeOnceWithData from "./utils/computeOnceWithData"

export const measure = computeOnceWithData(
    (_: string, data: { target: Object3D }) => {
        const measuredSize = new Vector3()
        box3.setFromObject(data.target).getSize(measuredSize)
        return measuredSize
    }
)
