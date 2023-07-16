import {
    Box3,
    Quaternion,
    Vector3,
    Ray,
    Euler,
    Line3,
    Matrix4,
    MeshStandardMaterial,
    Vector2,
    DoubleSide,
    Color,
    Object3D
} from "three"
import { OBB } from "three/examples/jsm/math/OBB"
import Point3d from "../../math/Point3d"

export const vector2 = new Vector2()

export const vector3 = new Vector3()
export const vector3_ = new Vector3()
export const vector3__ = new Vector3()

export const quaternion = new Quaternion()
export const quaternion_ = new Quaternion()
export const quaternion__ = new Quaternion()

export const obb = new OBB()
export const obb_ = new OBB()

export const testObject = new Object3D()

export const vector3_0 = Object.freeze(new Vector3(0, 0, 0))
export const vector3_1 = Object.freeze(new Vector3(1, 1, 1))
export const vector3_half = Object.freeze(new Vector3(0.5, 0.5, 0.5))

export const box3 = new Box3()
export const ray = new Ray()
export const euler = new Euler(0, 0, 0, "YXZ")

export const line3 = new Line3()

export const matrix4 = new Matrix4()

export const color = new Color()

export const wireframeMaterial = new MeshStandardMaterial({ wireframe: true })
export const standardMaterial = new MeshStandardMaterial({ side: DoubleSide })

export const pt3d0 = Object.freeze(new Point3d(0, 0, 0))

export const whiteColor = Object.freeze(new Color("white"))
export const blackColor = Object.freeze(new Color("black"))

export const returnTrue = () => true
