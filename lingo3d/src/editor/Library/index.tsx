import { h } from "preact"
import register from "preact-custom-element"
import { preventTreeShake } from "@lincode/utils"
import ObjectGroup from "./ObjectGroup"
import { useEffect } from "preact/hooks"
import { emitEditorMountChange } from "../../events/onEditorMountChange"
import { useNodeEditor } from "../states"
import useInit from "../utils/useInit"

preventTreeShake(h)

const Library = () => {
    const elRef = useInit()
    const [nodeEditor] = useNodeEditor()

    useEffect(() => {
        emitEditorMountChange()

        return () => {
            emitEditorMountChange()
        }
    }, [])

    if (nodeEditor) return null

    return (
        <div
            ref={elRef}
            className="lingo3d-ui"
            style={{
                width: 200,
                height: "100%",
                background: "rgb(40, 41, 46)",
                padding: 10
            }}
        >
            <ObjectGroup
                names={[
                    "model",
                    "dummy",
                    // { "building": "cube" },
                    "svgMesh",
                    { sprite: "plane" },
                    "trigger",
                    "audio",
                    "reflector",
                    "cube",
                    "sphere",
                    "cone",
                    "cylinder",
                    "octahedron",
                    "tetrahedron",
                    "torus",
                    "plane",
                    "circle",
                    "areaLight",
                    "ambientLight",
                    "skyLight",
                    "directionalLight",
                    "pointLight",
                    "spotLight",
                    "camera",
                    "thirdPersonCamera",
                    "firstPersonCamera",
                    "orbitCamera"
                ]}
            />
        </div>
    )
}
export default Library

register(Library, "lingo3d-library")
