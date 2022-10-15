import { last } from "@lincode/utils"
import { FolderApi, Pane } from "./tweakpane"
import { setOrbitControls } from "../../states/useOrbitControls"
import { useEffect, useLayoutEffect, useState } from "preact/hooks"
import register from "preact-custom-element"
import {
    useSelectionTarget,
    useMultipleSelectionTargets,
    useNodeEditor,
    useSetupStack
} from "../states"
import { Cancellable } from "@lincode/promiselikes"
import mainOrbitCamera from "../../engine/mainOrbitCamera"
import getComponentName from "../utils/getComponentName"
import addInputs, { setProgrammatic } from "./addInputs"
import getParams from "./getParams"
import splitObject from "./splitObject"
import { onTransformControls } from "../../events/onTransformControls"
import assignIn from "./assignIn"
import { emitSceneGraphNameChange } from "../../events/onSceneGraphNameChange"
import { dummyDefaults } from "../../interface/IDummy"
import useInit from "../utils/useInit"
import {
    decreaseEditorMounted,
    increaseEditorMounted
} from "../../states/useEditorMounted"
import useHotkeys from "./useHotkeys"
import settings from "../../api/settings"
import Setup, { dataSetupMap } from "../../display/Setup"
import addSetupInputs from "./addSetupInputs"
import Tab from "../component/Tab"
import AppBar from "../component/AppBar"
import { emitSelectionTarget } from "../../events/onSelectionTarget"
import useCameraPanel from "./useCameraPanel"

Object.assign(dummyDefaults, {
    stride: { x: 0, y: 0 }
})

const Editor = () => {
    const elRef = useInit()
    useHotkeys()

    useLayoutEffect(() => {
        window.onbeforeunload = confirmExit
        function confirmExit() {
            return "Are you sure you want to close the current page?"
        }

        mainOrbitCamera.active = true
        setOrbitControls(true)
        settings.gridHelper = true
        increaseEditorMounted()

        return () => {
            setOrbitControls(false)
            settings.gridHelper = false
            decreaseEditorMounted()
        }
    }, [])

    const [pane, setPane] = useState<Pane>()
    const [cameraFolder, setCameraFolder] = useState<FolderApi>()

    const [setupStack] = useSetupStack()
    const lastSetup = last(setupStack)
    const targetSetup = (lastSetup && dataSetupMap.get(lastSetup)) ?? settings

    const [selectionTarget] = useSelectionTarget()
    const [multipleSelectionTargets] = useMultipleSelectionTargets()

    const [tab, setTab] = useState<string | undefined>(undefined)

    useCameraPanel(pane, cameraFolder)

    useEffect(() => {
        const el = elRef.current
        if (!el) return

        const pane = new Pane({ container: el })
        setPane(pane)

        if (
            tab === "World" ||
            !selectionTarget ||
            selectionTarget instanceof Setup
        ) {
            setCameraFolder(pane.addFolder({ title: "camera" }))
            addSetupInputs(
                pane,
                selectionTarget instanceof Setup ? selectionTarget : targetSetup
            )
            return () => {
                setCameraFolder(undefined)
                pane.dispose()
            }
        }

        const target = selectionTarget as any
        const handle = new Cancellable()

        if (!multipleSelectionTargets.length) {
            const { schema, defaults, componentName } = target.constructor

            const [generalParams, generalRest] = splitObject(
                getParams(schema, defaults, target),
                ["name", "id", "physics", "gravity"]
            )
            if (generalParams)
                addInputs(
                    pane,
                    "general",
                    target,
                    defaults,
                    generalParams,
                    true
                ).then((inputs) =>
                    inputs.name?.on("change", () => emitSceneGraphNameChange())
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
                addInputs(pane, "transform", target, defaults, transformParams)
                innerTransformParams &&
                    addInputs(
                        pane,
                        "inner transform",
                        target,
                        defaults,
                        innerTransformParams
                    )

                handle.watch(
                    onTransformControls(() => {
                        setProgrammatic()
                        assignIn(transformParams, target, [
                            "x",
                            "y",
                            "z",
                            "rotationX",
                            "rotationY",
                            "rotationZ",
                            "scaleX",
                            "scaleY",
                            "scaleZ"
                        ])
                        pane.refresh()
                    })
                )
            }

            const [animationParams, animationRest] = splitObject(
                transformRest,
                ["animation", "animationPaused", "animationRepeat"]
            )
            animationParams &&
                addInputs(pane, "animation", target, defaults, animationParams)

            const [displayParams, displayRest] = splitObject(animationRest, [
                "visible",
                "innerVisible",
                "frustumCulled",
                "castShadow",
                "receiveShadow"
            ])
            displayParams &&
                addInputs(pane, "display", target, defaults, displayParams)

            const [effectsParams, effectsRest] = splitObject(displayRest, [
                "bloom",
                "outline"
            ])
            effectsParams &&
                addInputs(pane, "effects", target, defaults, effectsParams)

            const [adjustMaterialParams, adjustMaterialRest] = splitObject(
                effectsRest,
                [
                    "metalnessFactor",
                    "roughnessFactor",
                    "opacityFactor",
                    "envFactor",
                    "adjustColor",
                    "reflection"
                ]
            )
            adjustMaterialParams &&
                addInputs(
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
                addInputs(pane, "material", target, defaults, materialParams)

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
                    pane,
                    "pbr material",
                    target,
                    defaults,
                    pbrMaterialParams
                )

            if (componentName === "dummy") {
                pbrMaterialRest.stride = {
                    x: target.strideRight,
                    y: -target.strideForward
                }
                addInputs(
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
            className="lingo3d-ui lingo3d-bg"
            style={{
                width: 300,
                height: "100%",
                display: "flex",
                flexDirection: "column"
            }}
        >
            <AppBar onSelectTab={setTab}>
                <Tab>World</Tab>
                {selectionTarget && (
                    <Tab
                        key={selectionTarget.uuid}
                        selected
                        onClose={() => emitSelectionTarget(undefined)}
                    >
                        {getComponentName(selectionTarget)}
                    </Tab>
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

const EditorParent = () => {
    const [nodeEditor] = useNodeEditor()

    if (nodeEditor) return null

    return <Editor />
}
export default EditorParent

register(EditorParent, "lingo3d-editor")
