import { CircleGeometry } from "three"
import Primitive from "../core/Primitive"
import ICircle, { circleDefaults, circleSchema } from "../../interface/ICircle"
import { Class, forceGet } from "@lincode/utils"
import { deg2Rad } from "@lincode/math"

const classMapsMap = new WeakMap<
    Class,
    [Map<string, any>, Record<string, number>]
>()
const classDefaultParamsInstanceMap = new WeakMap<Class, [string, any]>()

const allocateDefaultInstance = <T extends Class>(
    ClassVal: T,
    params: Readonly<ConstructorParameters<T>>
) => {
    const instance = new ClassVal(...params) as InstanceType<T>
    classDefaultParamsInstanceMap.set(ClassVal, [
        JSON.stringify(params),
        instance
    ])
    return instance
}

const increaseCount = <T extends Class>(
    ClassVal: T,
    params: Readonly<ConstructorParameters<T>>
): InstanceType<T> => {
    const paramString = JSON.stringify(params)

    const defaultTuple = classDefaultParamsInstanceMap.get(ClassVal)
    if (defaultTuple) {
        const [defaultParams, defaultInstance] = defaultTuple
        if (paramString === defaultParams) return defaultInstance
    }
    const [paramsInstanceMap, paramCountRecord] = forceGet(
        classMapsMap,
        ClassVal,
        () => [new Map<string, any>(), {} as Record<string, number>]
    )
    if (
        (paramCountRecord[paramString] =
            (paramCountRecord[paramString] ?? 0) + 1) === 1
    ) {
        const result = new ClassVal(...params)
        paramsInstanceMap.set(paramString, result)
        return result as InstanceType<T>
    }
    return paramsInstanceMap.get(paramString)
}

const decreaseCount = <T extends Class>(
    ClassVal: T,
    params: Readonly<ConstructorParameters<T>>
) => {
    const [paramsInstanceMap, paramCountRecord] = forceGet(
        classMapsMap,
        ClassVal,
        () => [new Map<string, any>(), {} as Record<string, number>]
    )
    const paramString = JSON.stringify(params)
    const count = (paramCountRecord[paramString] ?? 0) - 1
    if (count === -1) return
    if (count === 0) {
        paramsInstanceMap.get(paramString).dispose()
        paramsInstanceMap.delete(paramString)
        delete paramCountRecord[paramString]
        return
    }
    paramCountRecord[paramString] = count
}

allocateDefaultInstance(CircleGeometry, [0.5, 32, 0, 360 * deg2Rad])

export default class Circle extends Primitive implements ICircle {
    public static componentName = "circle"
    public static override defaults = circleDefaults
    public static override schema = circleSchema

    private params: Readonly<ConstructorParameters<typeof CircleGeometry>>

    public constructor() {
        const params = <const>[0.5, 32, 0, 360 * deg2Rad]
        super(increaseCount(CircleGeometry, params))
        this.params = params
        this.object3d.scale.z = Number.EPSILON
        this.then(() => decreaseCount(CircleGeometry, this.params))
    }

    public override get depth() {
        return 0
    }
    public override set depth(_) {}
    public override get scaleZ() {
        return 0
    }
    public override set scaleZ(_) {}

    private _theta?: number
    public get theta() {
        return this._theta ?? 360
    }
    public set theta(val) {
        this._theta = val
        decreaseCount(CircleGeometry, this.params)
        this.object3d.geometry = increaseCount(
            CircleGeometry,
            (this.params = [0.5, 32, 0, val * deg2Rad])
        )
    }
}
