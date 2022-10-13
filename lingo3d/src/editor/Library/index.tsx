import register from "preact-custom-element"
import ObjectGroup from "./ObjectGroup"
import { useEffect } from "preact/hooks"
import { useNodeEditor } from "../states"
import useInit from "../utils/useInit"
import {
    decreaseEditorMounted,
    increaseEditorMounted
} from "../../states/useEditorMounted"
import { DEBUG } from "../../globals"

const Library = () => {
    const elRef = useInit()
    const [nodeEditor] = useNodeEditor()

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
            style={{
                width: 200,
                height: "100%",
                padding: 10,
                overflowY: "scroll"
            }}
        >
            <ObjectGroup
                names={[
                    "model",
                    "dummy",
                    ...(DEBUG
                        ? [{ building: "cube" }, { tree: "cylinder" }]
                        : []),
                    "svgMesh",
                    "htmlMesh",
                    "trigger",
                    "spawnPoint",
                    "audio",
                    "group",
                    "reflector",
                    "water",
                    { sprite: "plane" },
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
