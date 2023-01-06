import { applyMixins, Class, forceGet } from "@lincode/utils"
import { Mesh, BufferGeometry } from "three"
import TexturedBasicMixin from "./mixins/TexturedBasicMixin"
import TexturedStandardMixin from "./mixins/TexturedStandardMixin"
import IPrimitive, {
    primitiveDefaults,
    primitiveSchema
} from "../../interface/IPrimitive"
import { standardMaterial } from "../utils/reusables"
import VisibleObjectManager from "./VisibleObjectManager"

const classMapsMap = new WeakMap<
    Class,
    [Map<string, any>, Record<string, number>]
>()
const classDefaultParamsInstanceMap = new WeakMap<Class, [string, any]>()

export const allocateDefaultInstance = <T extends Class>(
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

abstract class Primitive<GeometryClass extends new () => BufferGeometry>
    extends VisibleObjectManager<Mesh>
    implements IPrimitive
{
    public static defaults = primitiveDefaults
    public static schema = primitiveSchema

    public constructor(
        private Geometry: GeometryClass,
        protected params: Readonly<ConstructorParameters<GeometryClass>>
    ) {
        increaseCount(Geometry, params)
        const mesh = new Mesh(new Geometry(), standardMaterial)
        mesh.castShadow = true
        mesh.receiveShadow = true
        super(mesh)
    }

    public override dispose() {
        if (this.done) return this
        super.dispose()
        decreaseCount(this.Geometry, this.params)
        return this
    }

    protected refreshParams(
        params: Readonly<ConstructorParameters<GeometryClass>>
    ) {
        this.object3d.geometry = increaseCount(
            this.Geometry,
            (this.params = params)
        )
        decreaseCount(this.Geometry, this.params)
    }
}
interface Primitive<GeometryClass extends new () => BufferGeometry>
    extends VisibleObjectManager<Mesh>,
        TexturedBasicMixin,
        TexturedStandardMixin {}
applyMixins(Primitive, [TexturedStandardMixin, TexturedBasicMixin])
export default Primitive
