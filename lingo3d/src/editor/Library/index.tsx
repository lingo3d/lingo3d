import ObjectGroup from "./ObjectGroup"
import { LIBRARY_WIDTH } from "../../globals"
import useInitCSS from "../hooks/useInitCSS"
import useClickable from "../hooks/useClickable"
import AppBar from "../component/bars/AppBar"
import Tab from "../component/tabs/Tab"
import useInitEditor from "../hooks/useInitEditor"

const Library = () => {
    useInitCSS()
    useInitEditor()

    const elRef = useClickable()

    return (
        <div
            ref={elRef}
            className="lingo3d-ui lingo3d-bg lingo3d-library lingo3d-flexcol"
            style={{ width: LIBRARY_WIDTH, height: "100%" }}
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
                        { gameGraph: "joystick" },

                        "cube",
                        "sphere",
                        "cone",
                        "cylinder",
                        "octahedron",
                        "tetrahedron",
                        "torus",
                        "plane",
                        "circle",

                        "group",
                        "model",
                        "dummy",
                        "svgMesh",
                        "htmlMesh",
                        "joystick",
                        // { reticle: "htmlMesh" },
                        { splashScreen: "screen" },
                        "text",
                        "spawnPoint",
                        "audio",
                        "reflector",
                        "water",
                        { sprite: "plane" },
                        { spriteSheet: "plane" },

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
