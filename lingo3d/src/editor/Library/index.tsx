import ObjectGroup, { ObjectName } from "./ObjectGroup"
import { LIBRARY_WIDTH } from "../../globals"
import useInitCSS from "../hooks/useInitCSS"
import useClickable from "../hooks/useClickable"
import AppBar from "../component/bars/AppBar"
import Tab from "../component/tabs/Tab"
import useInitEditor from "../hooks/useInitEditor"
import SearchBox from "../component/SearchBox"
import { useMemo, useState } from "preact/hooks"

const objectNames = [
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
] satisfies ObjectName

const Library = () => {
    useInitCSS()
    useInitEditor()

    const elRef = useClickable()
    const [search, setSearch] = useState<string>()

    const names = useMemo(
        () =>
            search
                ? objectNames.filter((n) =>
                      (typeof n === "object" ? Object.keys(n)[0] : n)
                          .toLowerCase()
                          .includes(search)
                  )
                : objectNames,
        [search]
    )

    return (
        <div
            ref={elRef}
            className="lingo3d-ui lingo3d-bg lingo3d-library lingo3d-flexcol"
            style={{ width: LIBRARY_WIDTH, height: "100%" }}
        >
            <AppBar style={{ padding: 10 }}>
                <Tab half>components</Tab>
                <Tab half disabled>
                    materials
                </Tab>
            </AppBar>
            <SearchBox onChange={(val) => setSearch(val.toLowerCase())} />
            <div style={{ padding: 10, overflowY: "scroll", flexGrow: 1 }}>
                <ObjectGroup names={names} />
            </div>
        </div>
    )
}
export default Library
