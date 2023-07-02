import { Cancellable } from "@lincode/promiselikes"
import Appendable from "../../display/core/Appendable"
import MeshAppendable from "../../display/core/MeshAppendable"
import getStaticProperties from "../../display/utils/getStaticProperties"
import addInputs, { Connection } from "./addInputs"
import createParams from "./createParams"
import splitObject from "./splitObject"
import { Pane } from "./tweakpane"
import { defaultsOwnKeysRecordMap } from "../../collections/defaultsCollections"

export default (
    pane: Pane,
    selectionTarget: Appendable | MeshAppendable,
    includeKeys: Array<string> | undefined,
    connection?: Connection,
    toggle?: boolean
) => {
    const handle = new Cancellable()
    const { defaults, componentName } = getStaticProperties(selectionTarget)
    const [params, manager] = createParams(
        selectionTarget,
        includeKeys,
        !connection && !toggle
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
            connection,
            toggle
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
            connection,
            toggle
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
            connection,
            toggle
        )
        innerTransformParams &&
            addInputs(
                handle,
                pane,
                "inner transform",
                manager,
                innerTransformParams,
                false,
                connection,
                toggle
            )
    }

    const [interactionParams, interactionRest] = splitObject(transformRest, [
        "hitTarget"
    ])
    interactionParams &&
        addInputs(
            handle,
            pane,
            "interaction",
            manager,
            interactionParams,
            false,
            connection,
            toggle
        )

    const [animationParams, animationRest] = splitObject(interactionRest, [
        "animation",
        "animationPaused"
    ])
    animationParams &&
        addInputs(
            handle,
            pane,
            "animation",
            manager,
            animationParams,
            false,
            connection,
            toggle
        )

    const [displayParams, displayRest] = splitObject(animationRest, [
        "visible",
        "innerVisible",
        "reflectionVisible",
        "castShadow"
    ])
    displayParams &&
        addInputs(
            handle,
            pane,
            "display",
            manager,
            displayParams,
            false,
            connection,
            toggle
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
            connection,
            toggle
        )

    const [adjustMaterialParams, adjustMaterialRest] = splitObject(
        effectsRest,
        [
            "metalnessFactor",
            "roughnessFactor",
            "normalFactor",
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
            connection,
            toggle
        )

    const [materialParams, materialRest] = splitObject(adjustMaterialRest, [
        ...("textureRotation" in manager
            ? ["opacity", "color", "texture"]
            : []),
        "textureRepeat",
        "textureFlipY",
        "textureRotation",
        "wireframe",
        "depthTest",
        "blending",
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
            connection,
            toggle
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
        "alphaMap"
    ])
    pbrMaterialParams &&
        addInputs(
            handle,
            pane,
            "pbr material",
            manager,
            pbrMaterialParams,
            false,
            connection,
            toggle
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
            connection,
            toggle
        )

    return handle
}
