import { Point3d } from "@lincode/math"
import { PI2 } from "../globals"
import { PI } from "../globals"

export const findClosestEulerAngle = (euler1: Point3d, euler2: Point3d) => {
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
