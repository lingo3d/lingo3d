import Point3d from "./Point3d"

export default (...points: Array<Point3d>) => {
    const res = new Point3d(0, 0, 0)
    for (const pt of points) {
        res.x += pt.x
        res.y += pt.y
        res.z += pt.z
    }
    res.x /= points.length
    res.y /= points.length
    res.z /= points.length
    return res
}
