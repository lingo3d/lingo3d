import ObjectGroup from "./ObjectGroup"
import { DEBUG } from "../../globals"
import useInitCSS from "../hooks/useInitCSS"
import useClickable from "../hooks/useClickable"
import AppBar from "../component/bars/AppBar"
import Tab from "../component/tabs/Tab"

const Library = () => {
    useInitCSS()
    const elRef = useClickable()

    return (
        <div
            ref={elRef}
            className="lingo3d-ui lingo3d-bg lingo3d-library"
            style={{
                width: 200,
                height: "100%",
                display: "flex",
                flexDirection: "column"
            }}
        >
            <AppBar>
                <Tab half>components</Tab>
                <Tab half disabled>
                    materials
                </Tab>
            </AppBar>
            <div style={{ padding: 10, overflowY: "scroll", flexGrow: 1 }}>
                <ObjectGroup
                    names={[
                        "model",
                        "dummy",
                        ...(DEBUG
                            ? [{ building: "cube" }, { tree: "cylinder" }]
                            : []),
                        "svgMesh",
                        "htmlMesh",
                        { joystick: "htmlMesh" },
                        // { reticle: "htmlMesh" },
                        { splashScreen: "htmlMesh" },
                        { text: "htmlMesh" },
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
        </div>
    )
}
export default Library
