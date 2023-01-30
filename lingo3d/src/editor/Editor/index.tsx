import { Pane } from "./tweakpane"
import { useLayoutEffect } from "preact/hooks"
import { Cancellable } from "@lincode/promiselikes"
import getDisplayName from "../utils/getDisplayName"
import addInputs from "./addInputs"
import createParams from "./createParams"
import splitObject from "./splitObject"
import { dummyDefaults } from "../../interface/IDummy"
import Setup from "../../display/Setup"
import addSetupInputs from "./addSetupInputs"
import CloseableTab from "../component/tabs/CloseableTab"
import AppBar from "../component/bars/AppBar"
import { emitSelectionTarget } from "../../events/onSelectionTarget"
import { defaultsOwnKeysRecordMap } from "../../interface/utils/Defaults"
import useInitCSS from "../hooks/useInitCSS"
import useClickable from "../hooks/useClickable"
import { useSignal } from "@preact/signals"
import unsafeGetValue from "../../utils/unsafeGetValue"
import useSyncState from "../hooks/useSyncState"
import { getSelectionTarget } from "../../states/useSelectionTarget"
import { getMultipleSelectionTargets } from "../../states/useMultipleSelectionTargets"
import { DEBUG, EDITOR_WIDTH } from "../../globals"
import useInitEditor from "../hooks/useInitEditor"
import setupStruct from "../../engine/setupStruct"
import { getEditorPresets } from "../../states/useEditorPresets"

Object.assign(dummyDefaults, {
    stride: { x: 0, y: 0 }
})

const Editor = () => {
    useInitCSS()
    useInitEditor()

    useLayoutEffect(() => {
        if (!DEBUG) {
            window.onbeforeunload = confirmExit
            function confirmExit() {
                return "Are you sure you want to close the current page?"
            }
        }
    }, [])

    const elRef = useClickable()

    const selectionTarget = useSyncState(getSelectionTarget)
    const selectedSignal = useSignal<string | undefined>(undefined)

    const presets = useSyncState(getEditorPresets)

    useLayoutEffect(() => {
        const el = elRef.current
        if (!el) return

        const pane = new Pane({ container: el })

        const handle = new Cancellable()
        if (
            selectedSignal.value === "Settings" ||
            !selectionTarget ||
            selectionTarget instanceof Setup
        ) {
            addSetupInputs(handle, pane, setupStruct)
            return () => {
                handle.cancel()
                pane.dispose()
            }
        }

        if (!getMultipleSelectionTargets()[0].size) {
            const { schema, defaults, componentName } = unsafeGetValue(
                selectionTarget,
                "constructor"
            )
            const [ownParams, ownRest] = splitObject(
                createParams(schema, defaults, selectionTarget),
                Object.keys(defaultsOwnKeysRecordMap.get(defaults) ?? {})
            )

            const [generalParams, generalRest] = splitObject(ownRest, [
                "name",
                "id",
                "uuid",
            ])
            if (generalParams)
                addInputs(
                    handle,
                    pane,
                    "general",
                    selectionTarget,
                    defaults,
                    generalParams,
                    true
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
                    physicsParams
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
                    transformParams
                )
                innerTransformParams &&
                    addInputs(
                        handle,
                        pane,
                        "inner transform",
                        selectionTarget,
                        defaults,
                        innerTransformParams
                    )
            }

            const [animationParams, animationRest] = splitObject(
                transformRest,
                ["animation", "animationPaused", "animationRepeat"]
            )
            animationParams &&
                addInputs(
                    handle,
                    pane,
                    "animation",
                    selectionTarget,
                    defaults,
                    animationParams
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
                    displayParams
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
                    effectsParams
                )

            const [adjustMaterialParams, adjustMaterialRest] = splitObject(
                effectsRest,
                [
                    "metalnessFactor",
                    "roughnessFactor",
                    "opacityFactor",
                    "envFactor",
                    "reflection",
                    "illumination"
                ]
            )
            adjustMaterialParams &&
                addInputs(
                    handle,
                    pane,
                    "adjust material",
                    selectionTarget,
                    defaults,
                    adjustMaterialParams
                )

            const [materialParams, materialRest] = splitObject(
                adjustMaterialRest,
                [
                    ...("textureRotation" in selectionTarget
                        ? ["opacity", "color", "texture"]
                        : []),
                    "textureRepeat",
                    "textureFlipY",
                    "textureRotation",
                    "wireframe",
                    "emissive",
                    "emissiveIntensity"
                ]
            )
            materialParams &&
                addInputs(
                    handle,
                    pane,
                    "material",
                    selectionTarget,
                    defaults,
                    materialParams
                )

            const [pbrMaterialParams, pbrMaterialRest] = splitObject(
                materialRest,
                [
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
                ]
            )
            pbrMaterialParams &&
                addInputs(
                    handle,
                    pane,
                    "pbr material",
                    selectionTarget,
                    defaults,
                    pbrMaterialParams
                )

            Object.assign(pbrMaterialRest, ownParams)

            if (componentName === "dummy") {
                pbrMaterialRest.stride = {
                    x: unsafeGetValue(selectionTarget, "strideRight"),
                    y: -unsafeGetValue(selectionTarget, "strideForward")
                }
                addInputs(
                    handle,
                    pane,
                    componentName,
                    selectionTarget,
                    defaults,
                    pbrMaterialRest,
                    true
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
                    true
                )
        }

        return () => {
            handle.cancel()
            pane.dispose()
        }
    }, [selectionTarget, selectedSignal.value, presets])

    return (
        <div
            className="lingo3d-ui lingo3d-bg lingo3d-editor"
            style={{
                width: EDITOR_WIDTH,
                height: "100%",
                display: "flex",
                flexDirection: "column"
            }}
        >
            <AppBar selectedSignal={selectedSignal}>
                <CloseableTab>Settings</CloseableTab>
                {selectionTarget && (
                    <CloseableTab
                        key={selectionTarget.uuid}
                        selected
                        onClose={() => emitSelectionTarget(undefined)}
                    >
                        {getDisplayName(selectionTarget)}
                    </CloseableTab>
                )}
            </AppBar>
            <div
                style={{
                    flexGrow: 1,
                    overflowY: "scroll",
                    overflowX: "hidden",
                    paddingLeft: 8,
                    paddingRight: 8
                }}
                ref={elRef}
            />
        </div>
    )
}
export default Editor
