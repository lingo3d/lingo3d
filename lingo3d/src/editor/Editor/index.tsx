import { last } from "@lincode/utils"
import { FolderApi, Pane } from "./tweakpane"
import { setOrbitControls } from "../../states/useOrbitControls"
import { useLayoutEffect, useState } from "preact/hooks"
import {
    useSelectionTarget,
    useMultipleSelectionTargets,
    useSetupStack
} from "../states"
import { Cancellable } from "@lincode/promiselikes"
import mainOrbitCamera from "../../engine/mainOrbitCamera"
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
import useInitCSS from "../utils/useInitCSS"
import useClickable from "../utils/useClickable"
import { setEditorMounted } from "../../states/useEditorMounted"

Object.assign(dummyDefaults, {
    stride: { x: 0, y: 0 }
})

const Editor = () => {
    useInitCSS(true)
    useHotkeys()
    const elRef = useClickable()

    useLayoutEffect(() => {
        window.onbeforeunload = confirmExit
        function confirmExit() {
            return "Are you sure you want to close the current page?"
        }

        mainOrbitCamera.active = true
        setOrbitControls(true)
        settings.gridHelper = true
        setEditorMounted(true)

        return () => {
            setOrbitControls(false)
            settings.gridHelper = false
            setEditorMounted(false)
        }
    }, [])

    const [pane, setPane] = useState<Pane>()
    const [cameraFolder, setCameraFolder] = useState<FolderApi>()

    const [setupStack] = useSetupStack()
    const lastSetup = last(setupStack)
    const targetSetup = (lastSetup && dataSetupMap.get(lastSetup)) ?? settings

    const [selectionTarget] = useSelectionTarget()
    const [multipleSelectionTargets] = useMultipleSelectionTargets()

    const [tab, setTab] = useState<string>()

    useCameraPanel(pane, cameraFolder)

    useLayoutEffect(() => {
        const el = elRef.current
        if (!el) return

        const pane = new Pane({ container: el })
        setPane(pane)
        const handle = new Cancellable()

        if (
            tab === "World" ||
            !selectionTarget ||
            selectionTarget instanceof Setup
        ) {
            setCameraFolder(pane.addFolder({ title: "camera" }))
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

        const target = selectionTarget as any

        if (!multipleSelectionTargets.length) {
            const { schema, defaults, componentName } = target.constructor

            const [ownParams, ownRest] = splitObject(
                getParams(schema, defaults, target),
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
                    target,
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
                    target,
                    defaults,
                    transformParams
                )
                innerTransformParams &&
                    addInputs(
                        handle,
                        pane,
                        "inner transform",
                        target,
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
                    target,
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
                    target,
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
                    target,
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
                    target,
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
                    target,
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
                    target,
                    defaults,
                    pbrMaterialParams
                )

            Object.assign(pbrMaterialRest, ownParams)

            if (componentName === "dummy") {
                pbrMaterialRest.stride = {
                    x: target.strideRight,
                    y: -target.strideForward
                }
                addInputs(
                    handle,
                    pane,
                    componentName,
                    target,
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
                    target,
                    defaults,
                    pbrMaterialRest,
                    true
                )
        }

        return () => {
            handle.cancel()
            pane.dispose()
        }
    }, [selectionTarget, multipleSelectionTargets, targetSetup, tab])

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
            <AppBar onSelectTab={setTab}>
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
