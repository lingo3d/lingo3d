import { PI2 } from "../globals"
import { PI } from "../globals"
import Point3d from "../math/Point3d"
import { Point3dType } from "../typeGuards/isPoint"

export const findClosestEulerAngle = (
    euler1: Point3dType,
    euler2: Point3dType
) => {
    // Compute the difference between the two Euler angles
    let diff = [euler2.x - euler1.x, euler2.y - euler1.y, euler2.z - euler1.z]

    // Convert the difference to the range of -180 to 180 degrees for each angle
    for (let i = 0; i < 3; i++)
        while (true)
            if (diff[i] > PI) diff[i] -= PI2
            else if (diff[i] < -PI) diff[i] += PI2
            else break

    // Compute the closest equivalent Euler angle
    return new Point3d(
        euler1.x + diff[0],
        euler1.y + diff[1],
        euler1.z + diff[2]
    )
}
