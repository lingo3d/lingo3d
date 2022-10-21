import register from "preact-custom-element"
import ObjectGroup from "./ObjectGroup"
import { DEBUG } from "../../globals"
import useInitCSS from "../utils/useInitCSS"
import useClickable from "../utils/useClickable"

const Library = () => {
    useInitCSS(true)
    const elRef = useClickable()

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
