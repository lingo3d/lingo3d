import { Group } from "three"
import ObjectManager from "../core/ObjectManager"
import { planeGeometry } from "../primitives/Plane"
import { circleGeometry } from "../primitives/Circle"
import { flatGeomScaleZ } from "../../engine/constants"
import IReflector, { reflectorDefaults, ReflectorShape } from "../../interface/IReflector"

const planeGeo = planeGeometry.clone()
const circleGeo = circleGeometry.clone()

export default class Reflector extends ObjectManager<Group> implements IReflector {
    public static componentName = "reflector"
    public static defaults = reflectorDefaults

    public constructor() {
        super(new Group())
        this.object3d.scale.z = flatGeomScaleZ
    }
    
    public shape?: ReflectorShape

    public contrast = 0.5
    
    public blur = 2
}