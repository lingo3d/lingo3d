import { Cancellable } from "@lincode/promiselikes"
import Appendable from "../../api/core/Appendable"
import MeshAppendable from "../../api/core/MeshAppendable"
import Dummy from "../../display/Dummy"
import { defaultsOwnKeysRecordMap } from "../../interface/utils/Defaults"
import unsafeGetValue from "../../utils/unsafeGetValue"
import addInputs from "./addInputs"
import createParams from "./createParams"
import splitObject from "./splitObject"
import { Pane } from "./tweakpane"

export default (
    pane: Pane,
    selectionTarget: Appendable | MeshAppendable,
    includeKeys: Array<string> | undefined,
    noMonitor?: boolean
) => {
    const handle = new Cancellable()
    const { schema, defaults, componentName } = unsafeGetValue(
        selectionTarget,
        "constructor"
    )

    const [ownParams, ownRest] = splitObject(
        createParams(schema, defaults, selectionTarget, includeKeys),
        Object.keys(defaultsOwnKeysRecordMap.get(defaults) ?? {})
    )

    const [generalParams, generalRest] = splitObject(ownRest, [
        "name",
        "id",
        "uuid"
    ])
    if (generalParams)
        addInputs(
            handle,
            pane,
            "general",
            selectionTarget,
            defaults,
            generalParams,
            true,
            noMonitor
        )

    const [physicsParams, physicsRest] = splitObject(generalRest, [
        "physics",
        "mass",
        "gravity"
    ])
    physicsParams &&
        addInputs(
            handle,
            pane,
            "physics",
            selectionTarget,
            defaults,
            physicsParams,
            false,
            noMonitor
        )

    const [transformParams0, transformRest] = splitObject(physicsRest, [
        "x",
        "y",
        "z",
        "rotationX",
        "rotationY",
        "rotationZ",
        "scale",
        "scaleX",
        "scaleY",
        "scaleZ",
        "innerX",
        "innerY",
        "innerZ",
        "innerRotationX",
        "innerRotationY",
        "innerRotationZ",
        "width",
        "height",
        "depth"
    ])
    if (transformParams0) {
        const [innerTransformParams, transformParams] = splitObject(
            transformParams0,
            [
                "innerX",
                "innerY",
                "innerZ",
                "innerRotationX",
                "innerRotationY",
                "innerRotationZ",
                "width",
                "height",
                "depth"
            ]
        )
        addInputs(
            handle,
            pane,
            "transform",
            selectionTarget,
            defaults,
            transformParams,
            false,
            noMonitor
        )
        innerTransformParams &&
            addInputs(
                handle,
                pane,
                "inner transform",
                selectionTarget,
                defaults,
                innerTransformParams,
                false,
                noMonitor
            )
    }

    const [animationParams, animationRest] = splitObject(transformRest, [
        "animation",
        "animationPaused",
        "animationRepeat"
    ])
    animationParams &&
        addInputs(
            handle,
            pane,
            "animation",
            selectionTarget,
            defaults,
            animationParams,
            false,
            noMonitor
        )

    const [displayParams, displayRest] = splitObject(animationRest, [
        "visible",
        "innerVisible",
        "frustumCulled",
        "castShadow",
        "receiveShadow"
    ])
    displayParams &&
        addInputs(
            handle,
            pane,
            "display",
            selectionTarget,
            defaults,
            displayParams,
            false,
            noMonitor
        )

    const [effectsParams, effectsRest] = splitObject(displayRest, [
        "bloom",
        "outline"
    ])
    effectsParams &&
        addInputs(
            handle,
            pane,
            "effects",
            selectionTarget,
            defaults,
            effectsParams,
            false,
            noMonitor
        )

    const [adjustMaterialParams, adjustMaterialRest] = splitObject(
        effectsRest,
        [
            "metalnessFactor",
            "roughnessFactor",
            "opacityFactor",
            "envFactor",
            "reflection"
        ]
    )
    adjustMaterialParams &&
        addInputs(
            handle,
            pane,
            "adjust material",
            selectionTarget,
            defaults,
            adjustMaterialParams,
            false,
            noMonitor
        )

    const [materialParams, materialRest] = splitObject(adjustMaterialRest, [
        ...("textureRotation" in selectionTarget
            ? ["opacity", "color", "texture"]
            : []),
        "textureRepeat",
        "textureFlipY",
        "textureRotation",
        "wireframe",
        "emissive",
        "emissiveIntensity"
    ])
    materialParams &&
        addInputs(
            handle,
            pane,
            "material",
            selectionTarget,
            defaults,
            materialParams,
            false,
            noMonitor
        )

    const [pbrMaterialParams, pbrMaterialRest] = splitObject(materialRest, [
        "metalnessMap",
        "metalness",
        "roughnessMap",
        "roughness",
        "normalMap",
        "normalScale",
        "bumpMap",
        "bumpScale",
        "displacementMap",
        "displacementScale",
        "displacementBias",
        "aoMap",
        "aoMapIntensity",
        "lightMap",
        "lightMapIntensity",
        "envMap",
        "envMapIntensity",
        "alphaMap",
        "depthTest"
    ])
    pbrMaterialParams &&
        addInputs(
            handle,
            pane,
            "pbr material",
            selectionTarget,
            defaults,
            pbrMaterialParams,
            false,
            noMonitor
        )

    Object.assign(pbrMaterialRest, ownParams)

    if (selectionTarget instanceof Dummy) {
        pbrMaterialRest.stride = {
            x: selectionTarget.strideRight,
            y: -selectionTarget.strideForward
        }
        addInputs(
            handle,
            pane,
            componentName,
            selectionTarget,
            defaults,
            pbrMaterialRest,
            true,
            noMonitor
        ).then((inputs) =>
            inputs.stride.on("change", ({ value }: any) => {
                Object.assign(pbrMaterialRest, {
                    strideForward: -value.y,
                    strideRight: value.x
                })
                pane.refresh()
            })
        )
    } else if (Object.keys(pbrMaterialRest).length)
        addInputs(
            handle,
            pane,
            componentName,
            selectionTarget,
            defaults,
            pbrMaterialRest,
            true,
            noMonitor
        )

    return handle
}
