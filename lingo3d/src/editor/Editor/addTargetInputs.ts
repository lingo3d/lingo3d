import { Cancellable } from "@lincode/promiselikes"
import Appendable from "../../api/core/Appendable"
import MeshAppendable from "../../api/core/MeshAppendable"
import { defaultsOwnKeysRecordMap } from "../../interface/utils/Defaults"
import unsafeGetValue from "../../utils/unsafeGetValue"
import addInputs, { Connection } from "./addInputs"
import createParams from "./createParams"
import splitObject from "./splitObject"
import { Pane } from "./tweakpane"

export default (
    pane: Pane,
    selectionTarget: Appendable | MeshAppendable,
    includeKeys: Array<string> | undefined,
    connection?: Connection
) => {
    const handle = new Cancellable()
    const { defaults, componentName } = unsafeGetValue(
        selectionTarget,
        "constructor"
    )
    const [params, manager] = createParams(
        selectionTarget,
        includeKeys,
        !connection
    )
    const [ownParams, ownRest] = splitObject(
        params,
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
            manager,
            generalParams,
            true,
            connection
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
            manager,
            physicsParams,
            false,
            connection
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
            manager,
            transformParams,
            false,
            connection
        )
        innerTransformParams &&
            addInputs(
                handle,
                pane,
                "inner transform",
                manager,
                innerTransformParams,
                false,
                connection
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
            manager,
            animationParams,
            false,
            connection
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
            manager,
            displayParams,
            false,
            connection
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
            manager,
            effectsParams,
            false,
            connection
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
            manager,
            adjustMaterialParams,
            false,
            connection
        )

    const [materialParams, materialRest] = splitObject(adjustMaterialRest, [
        ...("textureRotation" in manager
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
            manager,
            materialParams,
            false,
            connection
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
            manager,
            pbrMaterialParams,
            false,
            connection
        )

    Object.assign(pbrMaterialRest, ownParams)

    if (Object.keys(pbrMaterialRest).length)
        addInputs(
            handle,
            pane,
            componentName,
            manager,
            pbrMaterialRest,
            true,
            connection
        )

    return handle
}
