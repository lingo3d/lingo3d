import { h } from "preact"
import register from "preact-custom-element"
import { preventTreeShake } from "@lincode/utils"
import ObjectGroup from "./ObjectGroup"
import { useEffect } from "preact/hooks"
import { useDebug, useNodeEditor } from "../states"
import useInit from "../utils/useInit"
import {
    decreaseEditorMounted,
    increaseEditorMounted
} from "../../states/useEditorMounted"

preventTreeShake(h)

const Library = () => {
    const elRef = useInit()
    const [nodeEditor] = useNodeEditor()
    const [debug] = useDebug()

    useEffect(() => {
        increaseEditorMounted()

        return () => {
            decreaseEditorMounted()
        }
    }, [])

    if (nodeEditor) return null

    return (
        <div
            ref={elRef}
            className="lingo3d-ui lingo3d-bg"
            style={{ width: 200, height: "100%", padding: 10 }}
        >
            <ObjectGroup
                names={[
                    "model",
                    "dummy",
                    ...(debug
                        ? [{ building: "cube" }, { tree: "cylinder" }]
                        : []),
                    "svgMesh",
                    { sprite: "plane" },
                    "trigger",
                    { spawnPoint: "cylinder" },
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
                    { environment: "light" },
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
