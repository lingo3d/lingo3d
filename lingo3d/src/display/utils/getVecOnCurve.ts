import { CatmullRomCurve3, Vector3 } from "three"

const curve = new CatmullRomCurve3([], undefined, "catmullrom", 0.5)
export default (vecs: Array<Vector3>, t: number) => {
    curve.points = vecs
    return curve.getPoint(t)
}
