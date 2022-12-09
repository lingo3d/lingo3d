import { FolderApi, Pane } from "../TweakPane/tweakpane"
import { setOrbitControls } from "../../states/useOrbitControls"
import { useLayoutEffect, useState } from "preact/hooks"
import { Cancellable } from "@lincode/promiselikes"
import getComponentName from "../utils/getComponentName"
import addInputs from "./addInputs"
import getParams from "./getParams"
import splitObject from "./splitObject"
import { dummyDefaults } from "../../interface/IDummy"
import useHotkeys from "./useHotkeys"
import settings from "../../api/settings"
import Setup, { dataSetupMap } from "../../display/Setup"
import addSetupInputs from "./addSetupInputs"
import CloseableTab from "../component/tabs/CloseableTab"
import AppBar from "../component/bars/AppBar"
import { emitSelectionTarget } from "../../events/onSelectionTarget"
import useCameraPanel from "./useCameraPanel"
import { defaultsOwnKeysRecordMap } from "../../interface/utils/Defaults"
import useInitCSS from "../hooks/useInitCSS"
import useClickable from "../hooks/useClickable"
import { setEditorMounted } from "../../states/useEditorMounted"
import { useSignal } from "@preact/signals"
import unsafeGetValue from "../../utils/unsafeGetValue"
import useSyncState from "../hooks/useSyncState"
import { getSelectionTarget } from "../../states/useSelectionTarget"
import { getMultipleSelectionTargets } from "../../states/useMultipleSelectionTargets"
import { getSetupStack } from "../../states/useSetupStack"
import { setEditorCamera } from "../../states/useEditorCamera"
import mainCamera from "../../engine/mainCamera"
import { onLoadFile } from "../../events/onLoadFile"

Object.assign(dummyDefaults, {
    stride: { x: 0, y: 0 }
})

const Editor = () => {
    useInitCSS()
    useHotkeys()
    const elRef = useClickable()

    useLayoutEffect(() => {
        window.onbeforeunload = confirmExit
        function confirmExit() {
            return "Are you sure you want to close the current page?"
        }

        setEditorCamera(mainCamera)
        setOrbitControls(true)
        setEditorMounted(true)

        settings.gridHelper = true
        const handle = onLoadFile(() => (settings.gridHelper = false))

        return () => {
            setEditorCamera(undefined)
            setOrbitControls(false)
            settings.gridHelper = false
            setEditorMounted(false)

            handle.cancel()
        }
    }, [])

    const [pane, setPane] = useState<Pane>()
    const [cameraFolder, setCameraFolder] = useState<FolderApi>()

    const setupStack = useSyncState(getSetupStack)
    const lastSetup = setupStack.at(-1)
    const targetSetup = (lastSetup && dataSetupMap.get(lastSetup)) ?? settings

    const selectionTarget = useSyncState(getSelectionTarget)
    const multipleSelectionTargets = useSyncState(getMultipleSelectionTargets)

    const selectedSignal = useSignal<string | undefined>(undefined)

    useCameraPanel(pane, cameraFolder)

    useLayoutEffect(() => {
        const el = elRef.current
        if (!el) return

        const pane = new Pane({ container: el })
        setPane(pane)
        setCameraFolder(pane.addFolder({ title: "camera" }))

        const handle = new Cancellable()
        if (
            selectedSignal.value === "World" ||
            !selectionTarget ||
            selectionTarget instanceof Setup
        ) {
            addSetupInputs(
                handle,
                pane,
                selectionTarget instanceof Setup ? selectionTarget : targetSetup
            )
            return () => {
                setCameraFolder(undefined)
                handle.cancel()
                pane.dispose()
            }
        }

        if (!multipleSelectionTargets.length) {
            const { schema, defaults, componentName } = unsafeGetValue(
                selectionTarget,
                "constructor"
            )
            const [ownParams, ownRest] = splitObject(
                getParams(schema, defaults, selectionTarget),
                Object.keys(defaultsOwnKeysRecordMap.get(defaults) ?? {})
            )

            const [generalParams, generalRest] = splitObject(ownRest, [
                "name",
                "id",
                "physics",
                "gravity"
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

            const [transformParams0, transformRest] = splitObject(generalRest, [
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
                    adjustMaterialParams
                )

            const [materialParams, materialRest] = splitObject(
                adjustMaterialRest,
                [
                    "opacity",
                    "color",
                    "texture",
                    "textureRepeat",
                    "textureFlipY",
                    "textureRotation",
                    "videoTexture",
                    "wireframe"
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
                    "emissive",
                    "emissiveIntensity",
                    "envMap",
                    "envMapIntensity",
                    "alphaMap"
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
            setCameraFolder(undefined)
            handle.cancel()
            pane.dispose()
        }
    }, [
        selectionTarget,
        multipleSelectionTargets,
        targetSetup,
        selectedSignal.value
    ])

    return (
        <div
            className="lingo3d-ui lingo3d-bg lingo3d-editor"
            style={{
                width: 300,
                height: "100%",
                display: "flex",
                flexDirection: "column"
            }}
        >
            <AppBar selectedSignal={selectedSignal}>
                <CloseableTab>World</CloseableTab>
                {selectionTarget && (
                    <CloseableTab
                        key={selectionTarget.uuid}
                        selected
                        onClose={() => emitSelectionTarget(undefined)}
                    >
                        {getComponentName(selectionTarget)}
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
